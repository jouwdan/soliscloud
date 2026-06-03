import { ENDPOINTS } from "../constants.js";
import type { RequestOptions, SolisHttpClient } from "../http.js";
import type {
  CollectorDayParams,
  CollectorDaySample,
  CollectorDetail,
  CollectorDetailParams,
  CollectorListParams,
  CollectorListResponse,
} from "../types/collector.js";

/** Device interfaces for collectors (dataloggers). */
export class CollectorsResource {
  constructor(private readonly http: SolisHttpClient) {}

  /** List collectors under the account. */
  list(
    params: CollectorListParams,
    options?: RequestOptions,
  ): Promise<CollectorListResponse> {
    return this.http.post(ENDPOINTS.collectorList, { ...params }, options);
  }

  /** Get full detail for a single collector (by `id` or `sn`). */
  detail(
    params: CollectorDetailParams,
    options?: RequestOptions,
  ): Promise<CollectorDetail> {
    return this.http.post(ENDPOINTS.collectorDetail, { ...params }, options);
  }

  /** Intra-day signal samples for one collector on a given day. */
  day(
    params: CollectorDayParams,
    options?: RequestOptions,
  ): Promise<CollectorDaySample[]> {
    return this.http.post(ENDPOINTS.collectorDay, { ...params }, options);
  }
}
