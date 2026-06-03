/**
 * Standard response envelope wrapping every API call.
 * The library unwraps this for you and returns the `data` payload directly.
 */
export interface SolisEnvelope<T> {
  /** `true` on success, `false` on failure. */
  success: boolean;
  /** `"0"` on success; see {@link ERROR_CODES} otherwise. */
  code: string;
  /** Human-readable description of `code`. */
  msg: string;
  /** Business payload — shape depends on the endpoint. */
  data: T;
}

/**
 * MyBatis-Plus style paginated result returned (usually under a `page` key) by
 * the list endpoints.
 */
export interface SolisPage<T> {
  /** The page of records. */
  records: T[];
  /** Total number of matching records across all pages. */
  total?: number;
  /** Page size used. */
  size?: number;
  /** Current page number. */
  current?: number;
  /** Total number of pages. */
  pages?: number;
  /** Sort orders applied (rarely populated). */
  orders?: unknown[];
  optimizeCountSql?: boolean;
  searchCount?: boolean;
  /** Forward-compatible: the API frequently returns extra fields. */
  [key: string]: unknown;
}

/** Common pagination request fields. `pageSize` max is 100. */
export interface PaginationParams {
  /** Page number to return. Default `1`. */
  pageNo?: number | string;
  /** Records per page. Default `20`, max `100`. */
  pageSize?: number | string;
}

/**
 * Convenience alias: any decimal/integer numeric value the API may return as a
 * JSON number.
 */
export type Numeric = number;

/**
 * Most data objects carry an open-ended set of fields (many undocumented or
 * dynamically indexed, e.g. `pow1`..`pow32`). This base lets typed interfaces
 * stay forward-compatible.
 */
export interface OpenRecord {
  [key: string]: unknown;
}
