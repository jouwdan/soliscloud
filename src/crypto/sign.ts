import { bytesToBase64, utf8Bytes } from "./base64.js";
import { hmacSha1 } from "./hmac-sha1.js";
import { md5 } from "./md5.js";

/**
 * Content-Type used for signing and the request header.
 *
 * The spec's "Request Standard Format" lists `application/json;charset=UTF-8`,
 * but the live server computes its signature over plain `application/json`
 * (as in the spec's concrete call example) and rejects the charset variant with
 * `403 "wrong sign"`. Verified against the production API.
 */
export const DEFAULT_CONTENT_TYPE = "application/json";

/** Headers required to authenticate a SolisCloud API request. */
export interface SignedHeaders {
  "Content-MD5": string;
  "Content-Type": string;
  Date: string;
  Authorization: string;
}

export interface SignOptions {
  /** API ID (visitor identity), e.g. `1300386381676644416`. */
  apiId: string;
  /** API secret used as the HMAC-SHA1 key. */
  apiSecret: string;
  /** HTTP verb, always `POST` for this API. */
  method: string;
  /** Canonicalized resource path, e.g. `/v1/api/inverterList`. */
  resource: string;
  /** Raw request body string (exactly as sent on the wire). */
  body: string;
  /** GMT date string for the `Date` header. Defaults to now. */
  date?: string;
  /** Content type used in both the header and the signature. */
  contentType?: string;
}

/**
 * Compute the Base64 `Content-MD5` value for a request body.
 *
 * Steps (per the SolisCloud spec): MD5-hash the UTF-8 body to a 128-bit
 * digest, then Base64-encode the raw digest bytes.
 */
export function contentMd5(body: string): string {
  return bytesToBase64(md5(utf8Bytes(body)));
}

/**
 * Format a date as an RFC 1123 / HTTP GMT string, e.g.
 * `Fri, 26 Jul 2019 06:00:46 GMT`.
 *
 * The signature and the `Date` header always use the exact same string, so the
 * server's recomputed signature matches regardless of formatting details. Note:
 * the API rejects dates more than ±15 minutes from server time.
 */
export function gmtDate(date: Date = new Date()): string {
  return date.toUTCString();
}

/**
 * Build the four signed headers for a request.
 *
 * The signature is:
 * `base64(HmacSHA1(apiSecret, VERB + "\n" + Content-MD5 + "\n" +
 *   Content-Type + "\n" + Date + "\n" + CanonicalizedResource))`.
 */
export function buildSignedHeaders(options: SignOptions): SignedHeaders {
  const contentType = options.contentType ?? DEFAULT_CONTENT_TYPE;
  const date = options.date ?? gmtDate();
  const contentMd5Value = contentMd5(options.body);

  const stringToSign = [
    options.method,
    contentMd5Value,
    contentType,
    date,
    options.resource,
  ].join("\n");

  const signature = bytesToBase64(
    hmacSha1(utf8Bytes(options.apiSecret), utf8Bytes(stringToSign)),
  );

  return {
    "Content-MD5": contentMd5Value,
    "Content-Type": contentType,
    Date: date,
    Authorization: `API ${options.apiId}:${signature}`,
  };
}
