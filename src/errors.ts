import { ERROR_CODES } from "./constants.js";

/**
 * Base class for all errors thrown by this library. Allows callers to
 * `catch (e) { if (e instanceof SolisError) ... }`.
 */
export class SolisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SolisError";
  }
}

/**
 * Thrown when the API responds with `success: false` or a non-zero `code`.
 * Carries the raw envelope fields for inspection.
 */
export class SolisApiError extends SolisError {
  /** The `code` field from the response (e.g. `"R0000"`). */
  readonly code: string;
  /** The `msg` field from the response. */
  readonly apiMessage: string;
  /** The resource path that was called. */
  readonly resource: string;
  /** The full parsed response body, when available. */
  readonly response: unknown;

  constructor(params: {
    code: string;
    apiMessage: string;
    resource: string;
    response?: unknown;
  }) {
    const known = ERROR_CODES[params.code];
    const detail = known && known !== params.apiMessage ? ` (${known})` : "";
    super(
      `SolisCloud API error on ${params.resource}: [${params.code}] ${params.apiMessage}${detail}`,
    );
    this.name = "SolisApiError";
    this.code = params.code;
    this.apiMessage = params.apiMessage;
    this.resource = params.resource;
    this.response = params.response;
  }
}

/**
 * Thrown when the HTTP request itself fails (non-2xx status, network error,
 * or unparseable body) before a structured API envelope is available.
 */
export class SolisHttpError extends SolisError {
  /** HTTP status code, if a response was received. */
  readonly status?: number;
  /** The resource path that was called. */
  readonly resource: string;
  /** Raw response text, when available. */
  readonly body?: string;

  constructor(params: {
    message: string;
    resource: string;
    status?: number;
    body?: string;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = "SolisHttpError";
    this.resource = params.resource;
    if (params.status !== undefined) this.status = params.status;
    if (params.body !== undefined) this.body = params.body;
    if (params.cause !== undefined) this.cause = params.cause;
  }
}
