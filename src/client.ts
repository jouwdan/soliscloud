import { SolisHttpClient, type SolisHttpClientOptions } from "./http.js";
import { CollectorsResource } from "./resources/collectors.js";
import { EpmResource } from "./resources/epm.js";
import { InvertersResource } from "./resources/inverters.js";
import { MetersResource } from "./resources/meters.js";
import { StationsResource } from "./resources/stations.js";
import { WeatherResource } from "./resources/weather.js";

export type SolisClientOptions = SolisHttpClientOptions;

/**
 * Framework-agnostic client for the SolisCloud Platform API (V2.0.3).
 *
 * Groups every documented endpoint under a typed resource:
 * - {@link SolisClient.inverters} — inverter data and account alarms
 * - {@link SolisClient.collectors} — collectors (dataloggers)
 * - {@link SolisClient.epm} — Export Power Manager devices
 * - {@link SolisClient.weather} — meteorological instruments
 * - {@link SolisClient.meters} — meters (ammeters)
 * - {@link SolisClient.stations} — power stations and device bindings
 *
 * @example
 * ```ts
 * const solis = new SolisClient({ apiId: "...", apiSecret: "..." });
 * const { page } = await solis.inverters.list({ pageNo: 1, pageSize: 20 });
 * console.log(page?.records);
 * ```
 */
export class SolisClient {
  /** Underlying signed HTTP transport. Use {@link SolisClient.request} for raw calls. */
  readonly http: SolisHttpClient;

  readonly inverters: InvertersResource;
  readonly collectors: CollectorsResource;
  readonly epm: EpmResource;
  readonly weather: WeatherResource;
  readonly meters: MetersResource;
  readonly stations: StationsResource;

  constructor(options: SolisClientOptions) {
    this.http = new SolisHttpClient(options);
    this.inverters = new InvertersResource(this.http);
    this.collectors = new CollectorsResource(this.http);
    this.epm = new EpmResource(this.http);
    this.weather = new WeatherResource(this.http);
    this.meters = new MetersResource(this.http);
    this.stations = new StationsResource(this.http);
  }

  /**
   * Escape hatch for endpoints not yet wrapped, or for sending raw bodies.
   * Signs and POSTs to `resource`, returning the unwrapped `data`.
   */
  request<TData = unknown>(
    resource: string,
    body?: Record<string, unknown>,
  ): Promise<TData> {
    return this.http.post<TData>(resource, body);
  }
}
