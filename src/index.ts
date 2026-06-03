// Main entry points
export { SolisClient, type SolisClientOptions } from "./client.js";
export {
  SolisHttpClient,
  type SolisHttpClientOptions,
  type RequestOptions,
  type FetchLike,
} from "./http.js";

// Errors
export {
  SolisError,
  SolisApiError,
  SolisHttpError,
} from "./errors.js";

// Constants & enums
export {
  DEFAULT_BASE_URL,
  ENDPOINTS,
  ERROR_CODES,
  type EndpointName,
  InverterState,
  CollectorState,
  InverterProductModel,
  InverterOfflineFlag,
  PowerStationType,
  InverterMeterModel,
  GridConnectionType,
  AlarmState,
} from "./constants.js";

// Low-level signing helpers (for advanced use / custom transports)
export {
  buildSignedHeaders,
  contentMd5,
  gmtDate,
  DEFAULT_CONTENT_TYPE,
  type SignedHeaders,
  type SignOptions,
} from "./crypto/sign.js";

// Resource classes (exported for typing / advanced composition)
export { InvertersResource } from "./resources/inverters.js";
export { CollectorsResource } from "./resources/collectors.js";
export { EpmResource } from "./resources/epm.js";
export { WeatherResource } from "./resources/weather.js";
export { MetersResource } from "./resources/meters.js";
export { StationsResource } from "./resources/stations.js";

// All request/response types
export * from "./types/index.js";
