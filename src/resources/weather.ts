import { ENDPOINTS } from "../constants.js";
import type { RequestOptions, SolisHttpClient } from "../http.js";
import type {
  WeatherDetail,
  WeatherDetailParams,
  WeatherListParams,
  WeatherListResponse,
} from "../types/weather.js";

/** Device interfaces for meteorological instruments (weather stations). */
export class WeatherResource {
  constructor(private readonly http: SolisHttpClient) {}

  /** List meteorological instruments under the account. */
  list(
    params: WeatherListParams,
    options?: RequestOptions,
  ): Promise<WeatherListResponse> {
    return this.http.post(ENDPOINTS.weatherList, { ...params }, options);
  }

  /** Get full detail for a single meteorological instrument. */
  detail(
    params: WeatherDetailParams = {},
    options?: RequestOptions,
  ): Promise<WeatherDetail> {
    return this.http.post(ENDPOINTS.weatherDetail, { ...params }, options);
  }
}
