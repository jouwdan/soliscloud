import type { OpenRecord, PaginationParams, SolisPage } from "./common.js";

// --- Requests ---

/** `collectorList` — list collectors (dataloggers) under the account. */
export interface CollectorListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationId?: number | string;
  nmiCode?: string;
}

/** `collectorDetail` — detail for one collector. Provide `id` or `sn`. */
export interface CollectorDetailParams {
  id?: number | string;
  sn?: string;
}

/** `collector/day` — intra-day signal samples for one collector. */
export interface CollectorDayParams {
  sn: string;
  /** Day to query, `yyyy-MM-dd`. */
  time: string;
  /** Device time zone offset, e.g. `8`. */
  timeZone: number;
}

// --- Responses ---

/** A row in the collector list. */
export interface CollectorListItem extends OpenRecord {
  id?: string | number;
  sn?: string;
  name?: string;
  model?: string;
  /** 1=online, 2=offline. */
  state?: number;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  nmiCode?: string;
  /** Signal strength bucket. */
  rssiLevel?: number;
  contractTime?: string | number;
  dataTimestamp?: string | number;
}

/** Aggregate collector counts returned alongside the list. */
export interface CollectorStatusVo extends OpenRecord {
  all?: number;
  normal?: number;
  offline?: number;
  fault?: number;
}

export interface CollectorListResponse extends OpenRecord {
  page?: SolisPage<CollectorListItem>;
  records?: CollectorListItem[];
}

/** Full collector detail. */
export interface CollectorDetail extends OpenRecord {
  id?: string | number;
  sn?: string;
  name?: string;
  model?: string;
  state?: number;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  addr?: string;
  lanIp?: string;
  connectedSsid?: string;
  rssiLevel?: number;
  /** Number of devices currently connected. */
  actualNumber?: number;
  /** Maximum number of supported devices. */
  maximumNumber?: number;
  dataUploadCycle?: number;
  totalWorkingTime?: number;
  factoryTime?: string | number;
  contractTime?: string | number;
  dataTimestamp?: string | number;
}

/** A single intra-day collector signal sample. */
export interface CollectorDaySample extends OpenRecord {
  collectorId?: string | number;
  collectorSn?: string;
  time?: string | number;
  timeStr?: string;
  timeZone?: number;
  /** Signal strength. */
  rssi?: number;
  rssiLevel?: number;
  pec?: number;
  dataTimestamp?: string | number;
}
