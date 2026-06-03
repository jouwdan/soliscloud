import { ENDPOINTS } from "../constants.js";
import type { RequestOptions, SolisHttpClient } from "../http.js";
import type {
  AmmeterDetail,
  AmmeterDetailParams,
  AmmeterListParams,
  AmmeterListResponse,
} from "../types/meter.js";

/** Device interfaces for meters (ammeters). */
export class MetersResource {
  constructor(private readonly http: SolisHttpClient) {}

  /** List meters under the account. */
  list(
    params: AmmeterListParams,
    options?: RequestOptions,
  ): Promise<AmmeterListResponse> {
    return this.http.post(ENDPOINTS.ammeterList, { ...params }, options);
  }

  /** Get full detail for a single meter. */
  detail(
    params: AmmeterDetailParams,
    options?: RequestOptions,
  ): Promise<AmmeterDetail> {
    return this.http.post(ENDPOINTS.ammeterDetail, { ...params }, options);
  }
}
