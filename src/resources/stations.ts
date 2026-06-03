import { ENDPOINTS } from "../constants.js";
import type { RequestOptions, SolisHttpClient } from "../http.js";
import type {
  AddDeviceParams,
  AddStationBindCollectorParams,
  AddStationParams,
  AddStationResult,
  DelCollectorParams,
  StationAllParams,
  StationDayEnergyListParams,
  StationDayParams,
  StationDaySample,
  StationDetail,
  StationDetailListParams,
  StationDetailListResponse,
  StationDetailParams,
  StationEnergyListResponse,
  StationEnergyRecord,
  StationListParams,
  StationListResponse,
  StationMonthEnergyListParams,
  StationMonthParams,
  StationUpdateParams,
  StationYearEnergyListParams,
  StationYearParams,
} from "../types/station.js";

/** Plant interfaces for power stations and their device bindings. */
export class StationsResource {
  constructor(private readonly http: SolisHttpClient) {}

  /** List power stations under the account. */
  list(
    params: StationListParams,
    options?: RequestOptions,
  ): Promise<StationListResponse> {
    return this.http.post(ENDPOINTS.userStationList, { ...params }, options);
  }

  /** Get full detail for a single station (by `id` or `nmiCode`). */
  detail(
    params: StationDetailParams,
    options?: RequestOptions,
  ): Promise<StationDetail> {
    return this.http.post(ENDPOINTS.stationDetail, { ...params }, options);
  }

  /** Get details for multiple stations. */
  detailList(
    params: StationDetailListParams,
    options?: RequestOptions,
  ): Promise<StationDetailListResponse> {
    return this.http.post(ENDPOINTS.stationDetailList, { ...params }, options);
  }

  /** Daily generation for multiple stations on a given day. */
  dayEnergyList(
    params: StationDayEnergyListParams,
    options?: RequestOptions,
  ): Promise<StationEnergyListResponse> {
    return this.http.post(ENDPOINTS.stationDayEnergyList, { ...params }, options);
  }

  /** Daily totals for multiple stations across a month. */
  monthEnergyList(
    params: StationMonthEnergyListParams,
    options?: RequestOptions,
  ): Promise<StationEnergyListResponse> {
    return this.http.post(
      ENDPOINTS.stationMonthEnergyList,
      { ...params },
      options,
    );
  }

  /** Yearly totals for multiple stations. */
  yearEnergyList(
    params: StationYearEnergyListParams,
    options?: RequestOptions,
  ): Promise<StationEnergyListResponse> {
    return this.http.post(
      ENDPOINTS.stationYearEnergyList,
      { ...params },
      options,
    );
  }

  /** Intra-day samples for one station on a given day. */
  day(
    params: StationDayParams,
    options?: RequestOptions,
  ): Promise<StationDaySample[]> {
    return this.http.post(ENDPOINTS.stationDay, { ...params }, options);
  }

  /** Daily totals for one station across a month. */
  month(
    params: StationMonthParams,
    options?: RequestOptions,
  ): Promise<StationEnergyRecord[]> {
    return this.http.post(ENDPOINTS.stationMonth, { ...params }, options);
  }

  /** Monthly totals for one station across a year. */
  year(
    params: StationYearParams,
    options?: RequestOptions,
  ): Promise<StationEnergyRecord[]> {
    return this.http.post(ENDPOINTS.stationYear, { ...params }, options);
  }

  /** Yearly totals across the station's lifetime. */
  all(
    params: StationAllParams,
    options?: RequestOptions,
  ): Promise<StationEnergyRecord[]> {
    return this.http.post(ENDPOINTS.stationAll, { ...params }, options);
  }

  /** Create a new power station. */
  add(
    params: AddStationParams,
    options?: RequestOptions,
  ): Promise<AddStationResult> {
    return this.http.post(ENDPOINTS.addStation, { ...params }, options);
  }

  /** Modify an existing power station. Resolves to `null` on success. */
  update(
    params: StationUpdateParams,
    options?: RequestOptions,
  ): Promise<null> {
    return this.http.post(ENDPOINTS.stationUpdate, { ...params }, options);
  }

  /** Create a station and bind a collector to it. */
  addAndBindCollector(
    params: AddStationBindCollectorParams,
    options?: RequestOptions,
  ): Promise<AddStationResult | string> {
    return this.http.post(
      ENDPOINTS.addStationBindCollector,
      { ...params },
      options,
    );
  }

  /** Unbind a collector from its station. Resolves to `null` on success. */
  unbindCollector(
    params: DelCollectorParams,
    options?: RequestOptions,
  ): Promise<null> {
    return this.http.post(ENDPOINTS.delCollector, { ...params }, options);
  }

  /** Bind inverter(s) to a station. Resolves to `null` on success. */
  bindInverter(
    params: AddDeviceParams,
    options?: RequestOptions,
  ): Promise<null> {
    return this.http.post(ENDPOINTS.addDevice, { ...params }, options);
  }
}
