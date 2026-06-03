import type { OpenRecord, PaginationParams, SolisPage } from "./common.js";

// --- Requests ---

/** `ammeterList` — list meters under the account. */
export interface AmmeterListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationId?: number | string;
}

/** `ammeterDetail` — detail for one meter. */
export interface AmmeterDetailParams {
  sn: string;
}

// --- Responses ---

/** A row in the meter list. */
export interface AmmeterListItem extends OpenRecord {
  id?: string | number;
  sn?: string;
  name?: string;
  stationId?: string | number;
  stationName?: string;
  collectorId?: string | number;
  collectorSn?: string;
  state?: number;
  /** Total active power. */
  psum?: number;
  psumStr?: string;
  psumPec?: number;
  eTodayPositiveActive?: number;
  eTodayReverseActive?: number;
  eTotalPositiveActive?: number;
  eTotalReverseActive?: number;
  dataTimestamp?: string | number;
}

export interface AmmeterListResponse extends OpenRecord {
  page?: SolisPage<AmmeterListItem>;
  records?: AmmeterListItem[];
}

/** Full meter detail (three-phase quantities A/B/C). */
export interface AmmeterDetail extends OpenRecord {
  id?: string | number;
  sn?: string;
  name?: string;
  stationId?: string | number;
  stationName?: string;
  collectorId?: string | number;
  collectorSn?: string;
  state?: number;
  electricMeter?: string;
  currentTransformer?: string;
  fAc?: number;
  /** Phase A. */
  uA?: number;
  iA?: number;
  pA?: number;
  aLookedPower?: number;
  aReactivePower?: number;
  /** Phase B. */
  uB?: number;
  iB?: number;
  pB?: number;
  bLookedPower?: number;
  bReactivePower?: number;
  /** Phase C. */
  uC?: number;
  iC?: number;
  pC?: number;
  cLookedPower?: number;
  cReactivePower?: number;
  averagePowerFactor?: number;
  totalReactivePower?: number;
  totalViewPower?: number;
  psum?: number;
  psumStr?: string;
  psumPec?: number;
  eTodayPositiveActive?: number;
  eTodayReverseActive?: number;
  eMonthPositiveActive?: number;
  eMonthReverseActive?: number;
  eYearPositiveActive?: number;
  eYearReverseActive?: number;
  eTotalPositiveActive?: number;
  eTotalReverseActive?: number;
  dataTimestamp?: string | number;
}
