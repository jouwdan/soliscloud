import type { OpenRecord, PaginationParams, SolisPage } from "./common.js";
import type { EnergyRecord } from "./inverter.js";

// --- Requests ---

/** `epmList` — list EPM (Export Power Manager) devices under the account. */
export interface EpmListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationId?: number | string;
  nmiCode?: string;
}

/** `epmDetail` — detail for one EPM. */
export interface EpmDetailParams {
  sn: string;
}

/** Recognised EPM intra-day query fields for {@link EpmDayParams.searchinfo}. */
export type EpmSearchField =
  | "u_ac1"
  | "u_ac2"
  | "u_ac3"
  | "i_ac1"
  | "i_ac2"
  | "i_ac3"
  | "p_ac1"
  | "p_ac2"
  | "p_ac3"
  | "power_factor"
  | "fac_meter"
  | "p_load"
  | "e_total_inverter"
  | "e_total_load"
  | "e_total_buy"
  | "e_total_sell";

/** `epm/day` — intra-day samples for one EPM on a date. */
export interface EpmDayParams {
  sn: string;
  /**
   * Fields to return, comma-separated. Accepts a single field, a
   * comma-separated string, or an array (joined for you by the client).
   */
  searchinfo: string | EpmSearchField[];
  /** Day to query, `yyyy-MM-dd`. */
  time: string;
  /** Device time zone offset, e.g. `8`. */
  timeZone: number;
}

/** `epm/month` — daily totals for one EPM across a month. */
export interface EpmMonthParams {
  sn: string;
  /** Month to query, `yyyy-MM`. */
  month: string;
}

/** `epm/year` — monthly totals for one EPM across a year. */
export interface EpmYearParams {
  sn: string;
  /** Year to query, `yyyy`. */
  year: string;
}

/** `epm/all` — yearly totals across the EPM's lifetime. */
export interface EpmAllParams {
  sn: string;
}

// --- Responses ---

/** A row in the EPM list. */
export interface EpmListItem extends OpenRecord {
  id?: string | number;
  sn?: string;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  nmiCode?: string;
  collectorId?: string | number;
  collectorSn?: string;
  state?: number;
  failSafe?: number;
  pEpmTotal?: number;
  pEpmTotalStr?: string;
  eTotalBuy?: number;
  eTotalBuyStr?: string;
  eTotalSell?: number;
  eTotalSellStr?: string;
  dataTimestamp?: string | number;
}

export interface EpmListResponse extends OpenRecord {
  page?: SolisPage<EpmListItem>;
  records?: EpmListItem[];
}

/** Full EPM detail. */
export interface EpmDetail extends OpenRecord {
  id?: string | number;
  sn?: string;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  collectorId?: string | number;
  collectorSn?: string;
  empSoftwareVersion?: string;
  state?: number;
  failSafe?: number;
  ctRatio?: number;
  pLimit?: number;
  pSet?: number;
  pSetStr?: string;
  powerFactor?: number;
  facMeter?: number;
  uAc1?: number;
  uAc2?: number;
  uAc3?: number;
  iAc1?: number;
  iAc2?: number;
  iAc3?: number;
  pAc1?: number;
  pAc2?: number;
  pAc3?: number;
  pLoad?: number;
  pLoadStr?: string;
  pEpmTotal?: number;
  pEpmTotalStr?: string;
  pInverterTotal?: number;
  pInverterTotalStr?: string;
  eTotalBuy?: number;
  eTotalBuyStr?: string;
  eTotalSell?: number;
  eTotalSellStr?: string;
  eTotalLoad?: number;
  eTotalLoadStr?: string;
  /** Note: spelled `eToaalInverter` in the API. */
  eToaalInverter?: number;
  dataTimestamp?: string | number;
}

/** A single intra-day EPM sample (fields depend on `searchinfo`). */
export interface EpmDaySample extends OpenRecord {
  time?: string | number;
  timeStr?: string;
  timeZone?: number;
  searchinfo?: string;
  uAc1?: number;
  uAc2?: number;
  uAc3?: number;
  iAc1?: number;
  iAc2?: number;
  iAc3?: number;
  pAc1?: number;
  pAc2?: number;
  pAc3?: number;
  powerFactor?: number;
  facMeter?: number;
  pLoad?: number;
  pLimit?: number;
  pEpmTotal?: number;
  ctRatio?: number;
  eTotalBuy?: number;
  eTotalSell?: number;
  eTotalLoad?: number;
  eToaalInverter?: number;
}

/** Daily/monthly/yearly EPM energy buckets reuse the shared energy record. */
export type EpmEnergyRecord = EnergyRecord;
