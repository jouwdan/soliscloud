import { ENDPOINTS } from "../constants.js";
import type { RequestOptions, SolisHttpClient } from "../http.js";
import type {
  AlarmListParams,
  AlarmListResponse,
  EnergyRecord,
  InverterAllParams,
  InverterDayParams,
  InverterDaySample,
  InverterDetail,
  InverterDetailListParams,
  InverterDetailParams,
  InverterListParams,
  InverterListResponse,
  InverterMonthParams,
  InverterShelfTimeParams,
  InverterShelfTimeResponse,
  InverterYearParams,
} from "../types/inverter.js";

/** Device interfaces for inverters, plus the account-wide alarm list. */
export class InvertersResource {
  constructor(private readonly http: SolisHttpClient) {}

  /** List inverters under the account (max 100 per call). */
  list(
    params: InverterListParams,
    options?: RequestOptions,
  ): Promise<InverterListResponse> {
    return this.http.post(ENDPOINTS.inverterList, { ...params }, options);
  }

  /** Get full detail for a single inverter (by `id` or `sn`). */
  detail(
    params: InverterDetailParams,
    options?: RequestOptions,
  ): Promise<InverterDetail> {
    return this.http.post(ENDPOINTS.inverterDetail, { ...params }, options);
  }

  /** Get details for multiple inverters by serial number. */
  detailList(
    params: InverterDetailListParams,
    options?: RequestOptions,
  ): Promise<InverterListResponse> {
    return this.http.post(ENDPOINTS.inverterDetailList, { ...params }, options);
  }

  /** Intra-day samples for one inverter on a given day. */
  day(
    params: InverterDayParams,
    options?: RequestOptions,
  ): Promise<InverterDaySample[]> {
    return this.http.post(ENDPOINTS.inverterDay, { ...params }, options);
  }

  /** Daily energy totals for one inverter across a month. */
  month(
    params: InverterMonthParams,
    options?: RequestOptions,
  ): Promise<EnergyRecord[]> {
    return this.http.post(ENDPOINTS.inverterMonth, { ...params }, options);
  }

  /** Monthly energy totals for one inverter across a year. */
  year(
    params: InverterYearParams,
    options?: RequestOptions,
  ): Promise<EnergyRecord[]> {
    return this.http.post(ENDPOINTS.inverterYear, { ...params }, options);
  }

  /** Yearly energy totals across the inverter's lifetime. */
  all(
    params: InverterAllParams,
    options?: RequestOptions,
  ): Promise<EnergyRecord[]> {
    return this.http.post(ENDPOINTS.inverterAll, { ...params }, options);
  }

  /** Warranty (quality assurance) data for multiple inverters. */
  shelfTime(
    params: InverterShelfTimeParams,
    options?: RequestOptions,
  ): Promise<InverterShelfTimeResponse> {
    return this.http.post(ENDPOINTS.inverterShelfTime, { ...params }, options);
  }

  /** Device alarm list under the account. */
  alarms(
    params: AlarmListParams,
    options?: RequestOptions,
  ): Promise<AlarmListResponse> {
    return this.http.post(ENDPOINTS.alarmList, { ...params }, options);
  }
}
