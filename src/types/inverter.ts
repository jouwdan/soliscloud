import type { OpenRecord, PaginationParams, SolisPage } from "./common.js";

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

/** `inverterList` — list inverters under the account (max 100 per call). */
export interface InverterListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  /** Restrict to a single station. */
  stationId?: number | string;
  /** Restrict to a single NMI (Australian National Meter Identifier). */
  nmiCode?: string;
  /** Restrict to a batch of inverter serial numbers. */
  snList?: string[];
}

/**
 * `inverterDetail` — detail for one inverter. Provide `id` or `sn`
 * (at least one is required).
 */
export interface InverterDetailParams {
  /** Inverter ID. */
  id?: number | string;
  /** Inverter serial number. */
  sn?: string;
}

/** `inverterDetailList` — details for many inverters by SN. */
export interface InverterDetailListParams extends PaginationParams {
  pageSize: number | string;
  /** Up to 1000 SNs as an array (serialized comma-separated on the wire). */
  snList?: string[];
  /** For guest accounts, set to `3`. */
  stationType?: number;
}

/** `inverterDay` — intra-day samples for one inverter on a date. */
export interface InverterDayParams {
  id?: number | string;
  sn?: string;
  /** Currency for revenue calc, e.g. `EUR`, `CNY`. */
  money: string;
  /** Day to query, `yyyy-MM-dd`. */
  time: string;
  /** Device time zone offset, e.g. `8`. */
  timeZone: number;
}

/** `inverterMonth` — daily totals for one inverter across a month. */
export interface InverterMonthParams {
  id?: number | string;
  sn?: string;
  money: string;
  /** Month to query, `yyyy-MM`. */
  month: string;
}

/** `inverterYear` — monthly totals for one inverter across a year. */
export interface InverterYearParams {
  id?: number | string;
  sn?: string;
  money: string;
  /** Year to query, `yyyy`. */
  year: string;
}

/** `inverterAll` — yearly totals across the inverter's lifetime. */
export interface InverterAllParams {
  id?: number | string;
  sn?: string;
  money: string;
}

/** `inverter/shelfTime` — warranty (quality assurance) data for inverters. */
export interface InverterShelfTimeParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  /** Single SN, or multiple comma-separated SNs (max 1000). */
  sn?: string;
}

/** `alarmList` — device alarms under the account. */
export interface AlarmListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationId?: number | string;
  /** Restrict to alarms for one device SN. */
  alarmDeviceSn?: string;
  /** Start of alarm window, `yyyy-MM-dd`. */
  alarmBeginTime?: string;
  /** End of alarm window, `yyyy-MM-dd`. */
  alarmEndTime?: string;
  nmiCode?: string;
  /** Filter by status: 0 unprocessed, 1 processed, 2 resolved. */
  state?: number;
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

/** Aggregate inverter counts returned alongside the inverter list. */
export interface InverterStatusVo extends OpenRecord {
  all?: number;
  normal?: number;
  offline?: number;
  fault?: number;
  mppt?: number;
}

/** A row in the inverter list. Many additional fields may be present. */
export interface InverterListItem extends OpenRecord {
  id?: string | number;
  sn?: string;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  collectorId?: string | number;
  collectorSn?: string;
  collectorState?: number;
  power?: number;
  powerStr?: string;
  etoday?: number;
  etodayStr?: string;
  etotal?: number;
  etotalStr?: string;
  pac?: number;
  pacStr?: string;
  /** 1=online, 2=offline, 3=alarm. */
  state?: number;
  /** 0=normal offline, 1=abnormal offline. */
  stateExceptionFlag?: number;
  /** 1=grid, 2=storage. */
  productModel?: string | number;
  fullHour?: number;
  totalFullHour?: number;
  dcInputType?: number;
  acOutputType?: number;
  inverterMeterModel?: number;
  dataTimestamp?: string | number;
  dataTimestampStr?: string;
  timeZone?: number;
  nmiCode?: string;
  batteryPower?: number;
  batteryCapacitySoc?: number;
}

export interface InverterListResponse extends OpenRecord {
  inverterStatusVo?: InverterStatusVo;
  page?: SolisPage<InverterListItem>;
  mpptSwitch?: number;
}

/** Full inverter detail. Hundreds of fields are possible; common ones typed. */
export interface InverterDetail extends OpenRecord {
  id?: string | number;
  sn?: string;
  stationId?: string | number;
  stationName?: string;
  userId?: string | number;
  collectorId?: string | number;
  collectorName?: string;
  collectorsn?: string;
  currentState?: string;
  model?: string;
  name?: string;
  /** 1=grid, 2=storage. */
  type?: number;
  power?: number;
  powerStr?: string;
  pac?: number;
  pacStr?: string;
  pacPec?: number;
  fac?: number;
  facStr?: string;
  /** 1=online, 2=offline, 3=alarm. */
  state?: number;
  eToday?: number;
  eTodayStr?: string;
  eMonth?: number;
  eMonthStr?: string;
  eYear?: number;
  eYearStr?: string;
  eTotal?: number;
  eTotalStr?: string;
  inverterTemperature?: number;
  batteryPower?: number;
  batteryPowerStr?: string;
  batteryCapacitySoc?: number;
  batteryHealthSoh?: number;
  batteryVoltage?: number;
  batteryVoltageStr?: string;
  familyLoadPower?: number;
  familyLoadPowerStr?: string;
  pSum?: number;
  pSumStr?: string;
  dataTimestamp?: string | number;
  acOutputType?: number;
  dcInputType?: number;
}

/** A single intra-day sample point from `inverterDay`. */
export interface InverterDaySample extends OpenRecord {
  dataTimestamp?: string | number;
  timeStr?: string;
  pac?: number;
  pacStr?: string;
  pacPec?: number;
  eToday?: number;
  eTotal?: number;
  fac?: number;
  inverterTemperature?: number;
  batteryPower?: number;
  batteryCapacitySoc?: number;
  batteryHealthSoh?: number;
  familyLoadPower?: number;
  pSum?: number;
}

/** A daily/monthly/yearly energy bucket from `inverterMonth/Year/All`. */
export interface EnergyRecord extends OpenRecord {
  energy?: number;
  energyStr?: string;
  /** Timestamp (ms) for the bucket. */
  date?: number | string;
  dateStr?: string;
  money?: string | number;
  moneyStr?: string;
  gridPurchasedEnergy?: number;
  gridSellEnergy?: number;
  batteryChargeEnergy?: number;
}

/** A row in the warranty (`inverter/shelfTime`) result. */
export interface InverterShelfTimeItem extends OpenRecord {
  sn?: string;
  updateShelfTime?: string | number;
  updateShelfEndTime?: string | number;
}

export interface InverterShelfTimeResponse extends OpenRecord {
  page?: SolisPage<InverterShelfTimeItem>;
  records?: InverterShelfTimeItem[];
}

/** A row in the alarm list. */
export interface AlarmItem extends OpenRecord {
  alarmCode?: string;
  alarmMsg?: string;
  advice?: string;
  alarmLevel?: string | number;
  alarmDeviceSn?: string;
  alarmEndTime?: string | number;
  stationId?: string | number;
  stationName?: string;
  nmiCode?: string;
  warningInfoData?: number;
  state?: number;
}

export interface AlarmListResponse extends OpenRecord {
  page?: SolisPage<AlarmItem>;
  records?: AlarmItem[];
}
