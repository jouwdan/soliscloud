import type { OpenRecord, PaginationParams, SolisPage } from "./common.js";

// --- Requests ---

/** `weatherList` — list meteorological instruments under the account. */
export interface WeatherListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationId?: number | string;
  nmiCode?: string;
}

/** `weatherDetail` — detail for one meteorological instrument. */
export interface WeatherDetailParams {
  /** Meteorological instrument SN. */
  sn?: string;
}

// --- Responses ---

/** A meteorological instrument reading (shared by list rows and detail). */
export interface WeatherStation extends OpenRecord {
  id?: string | number;
  sn?: string;
  name?: string;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  nmiCode?: string;
  collectorId?: string | number;
  collectorSn?: string;
  state?: number;
  weatherModel?: number;
  /** Ambient temperature. */
  temp?: number;
  temperatureUnit?: string;
  /** PV module temperature. */
  pvTemp?: number;
  humidity?: number;
  airPressure?: number;
  rainfall?: number;
  windSpeed?: number;
  windDirection?: number | string;
  sunshineTim?: number;
  /** Total / direct / scattered solar irradiance (instantaneous). */
  totalR?: number;
  directR?: number;
  scatteredR?: number;
  /** Total / direct / scattered solar irradiance (daily accumulation). */
  totalRday?: number;
  directRday?: number;
  scatteredRday?: number;
  dataTimestamp?: string | number;
}

export interface WeatherListResponse extends OpenRecord {
  page?: SolisPage<WeatherStation>;
  records?: WeatherStation[];
}

export type WeatherDetail = WeatherStation;
