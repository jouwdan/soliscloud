import { DEFAULT_BASE_URL } from "./constants.js";
import {
  buildSignedHeaders,
  DEFAULT_CONTENT_TYPE,
  gmtDate,
} from "./crypto/sign.js";
import { SolisApiError, SolisHttpError } from "./errors.js";
import type { SolisEnvelope } from "./types/common.js";

/** Minimal `fetch` shape the client depends on (for custom injection). */
export type FetchLike = (
  input: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body: string;
    signal?: AbortSignal;
  },
) => Promise<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

export interface SolisHttpClientOptions {
  /** API ID from SolisCloud → Account → Basic Settings → API Management. */
  apiId: string;
  /** API secret (key) from the same screen. Keep this confidential. */
  apiSecret: string;
  /** Override the base URL (default {@link DEFAULT_BASE_URL}). */
  baseUrl?: string;
  /**
   * Custom fetch implementation. Defaults to the global `fetch`. Useful for
   * Node < 18, testing, proxies, or custom agents.
   */
  fetch?: FetchLike;
  /**
   * Content-Type used in both the header and the signature. Defaults to
   * `application/json`, which is what the live server signs over (the
   * `;charset=UTF-8` variant is rejected with `403 "wrong sign"`). Override
   * only if a particular deployment expects something else.
   */
  contentType?: string;
  /** Per-request timeout in milliseconds. Default `30000`. `0` disables it. */
  timeoutMs?: number;
  /** Default headers merged into every request (e.g. a custom User-Agent). */
  defaultHeaders?: Record<string, string>;
}

/** Per-call overrides. */
export interface RequestOptions {
  /** Abort signal to cancel the request. */
  signal?: AbortSignal;
  /** Override the timeout for this call only. */
  timeoutMs?: number;
}

/**
 * Low-level signed transport for the SolisCloud API. Handles request signing,
 * JSON encoding, envelope unwrapping and error mapping. Most users should use
 * {@link SolisClient} instead, which exposes typed resource methods.
 */
export class SolisHttpClient {
  private readonly apiId: string;
  private readonly apiSecret: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly contentType: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: SolisHttpClientOptions) {
    if (!options.apiId) throw new TypeError("SolisHttpClient: apiId is required");
    if (!options.apiSecret) {
      throw new TypeError("SolisHttpClient: apiSecret is required");
    }

    const resolvedFetch = options.fetch ?? globalThisFetch();
    if (!resolvedFetch) {
      throw new TypeError(
        "SolisHttpClient: no global fetch found. Pass a `fetch` implementation in the options.",
      );
    }

    this.apiId = options.apiId;
    this.apiSecret = options.apiSecret;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchImpl = resolvedFetch;
    this.contentType = options.contentType ?? DEFAULT_CONTENT_TYPE;
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  /**
   * Sign and POST `body` to `resource`, returning the unwrapped `data` payload.
   * Throws {@link SolisApiError} on a failed envelope and {@link SolisHttpError}
   * on transport-level problems.
   */
  async post<TData>(
    resource: string,
    body: Record<string, unknown> = {},
    options: RequestOptions = {},
  ): Promise<TData> {
    const payload = JSON.stringify(body);
    const date = gmtDate();
    const signed = buildSignedHeaders({
      apiId: this.apiId,
      apiSecret: this.apiSecret,
      method: "POST",
      resource,
      body: payload,
      date,
      contentType: this.contentType,
    });

    const url = `${this.baseUrl}${resource}`;
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...signed,
    };

    const { signal, cleanup } = this.resolveSignal(options);

    let raw: string;
    let status: number;
    try {
      const init: Parameters<FetchLike>[1] = { method: "POST", headers, body: payload };
      if (signal) init.signal = signal;
      const response = await this.fetchImpl(url, init);
      status = response.status;
      raw = await response.text();
      if (!response.ok) {
        throw new SolisHttpError({
          message: `SolisCloud request to ${resource} failed with HTTP ${status}`,
          resource,
          status,
          body: raw,
        });
      }
    } catch (error) {
      if (error instanceof SolisHttpError) throw error;
      throw new SolisHttpError({
        message: `SolisCloud request to ${resource} failed: ${stringifyError(error)}`,
        resource,
        cause: error,
      });
    } finally {
      cleanup();
    }

    let envelope: SolisEnvelope<TData>;
    try {
      envelope = JSON.parse(raw) as SolisEnvelope<TData>;
    } catch (error) {
      throw new SolisHttpError({
        message: `SolisCloud response from ${resource} was not valid JSON`,
        resource,
        status,
        body: raw,
        cause: error,
      });
    }

    const code = String(envelope.code ?? "");
    if (envelope.success !== true || (code !== "0" && code !== "")) {
      throw new SolisApiError({
        code: code || "UNKNOWN",
        apiMessage: envelope.msg ?? "Unknown error",
        resource,
        response: envelope,
      });
    }

    return envelope.data;
  }

  private resolveSignal(options: RequestOptions): {
    signal?: AbortSignal;
    cleanup: () => void;
  } {
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;

    if (options.signal && timeoutMs > 0) {
      const controller = new AbortController();
      const onAbort = () => controller.abort();
      options.signal.addEventListener("abort", onAbort);
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      return {
        signal: controller.signal,
        cleanup: () => {
          clearTimeout(timer);
          options.signal?.removeEventListener("abort", onAbort);
        },
      };
    }

    if (options.signal) {
      return { signal: options.signal, cleanup: () => {} };
    }

    if (timeoutMs > 0) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      return { signal: controller.signal, cleanup: () => clearTimeout(timer) };
    }

    return { cleanup: () => {} };
  }
}

function globalThisFetch(): FetchLike | undefined {
  const f = (globalThis as { fetch?: unknown }).fetch;
  return typeof f === "function" ? (f as unknown as FetchLike) : undefined;
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
