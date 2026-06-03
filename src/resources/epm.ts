import { ENDPOINTS } from "../constants.js";
import type { RequestOptions, SolisHttpClient } from "../http.js";
import type {
  EpmAllParams,
  EpmDayParams,
  EpmDaySample,
  EpmDetail,
  EpmDetailParams,
  EpmEnergyRecord,
  EpmListParams,
  EpmListResponse,
  EpmMonthParams,
  EpmYearParams,
} from "../types/epm.js";

/** Device interfaces for EPM (Export Power Manager) devices. */
export class EpmResource {
  constructor(private readonly http: SolisHttpClient) {}

  /** List EPM devices under the account. */
  list(
    params: EpmListParams,
    options?: RequestOptions,
  ): Promise<EpmListResponse> {
    return this.http.post(ENDPOINTS.epmList, { ...params }, options);
  }

  /** Get full detail for a single EPM. */
  detail(
    params: EpmDetailParams,
    options?: RequestOptions,
  ): Promise<EpmDetail> {
    return this.http.post(ENDPOINTS.epmDetail, { ...params }, options);
  }

  /** Intra-day samples for one EPM on a given day. */
  day(
    params: EpmDayParams,
    options?: RequestOptions,
  ): Promise<EpmDaySample[]> {
    const { searchinfo, ...rest } = params;
    const body = {
      ...rest,
      searchinfo: Array.isArray(searchinfo) ? searchinfo.join(",") : searchinfo,
    };
    return this.http.post(ENDPOINTS.epmDay, body, options);
  }

  /** Daily energy totals for one EPM across a month. */
  month(
    params: EpmMonthParams,
    options?: RequestOptions,
  ): Promise<EpmEnergyRecord[]> {
    return this.http.post(ENDPOINTS.epmMonth, { ...params }, options);
  }

  /** Monthly energy totals for one EPM across a year. */
  year(
    params: EpmYearParams,
    options?: RequestOptions,
  ): Promise<EpmEnergyRecord[]> {
    return this.http.post(ENDPOINTS.epmYear, { ...params }, options);
  }

  /** Yearly energy totals across the EPM's lifetime. */
  all(
    params: EpmAllParams,
    options?: RequestOptions,
  ): Promise<EpmEnergyRecord[]> {
    return this.http.post(ENDPOINTS.epmAll, { ...params }, options);
  }
}
