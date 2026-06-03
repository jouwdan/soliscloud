import type { OpenRecord, PaginationParams, SolisPage } from "./common.js";

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------

/** `userStationList` — list power stations under the account. */
export interface StationListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  nmiCode?: string;
  /** Restrict to a batch of station IDs. */
  idList?: Array<number | string>;
}

/** `stationDetail` — detail for one station. Provide `id` or `nmiCode`. */
export interface StationDetailParams {
  id?: number | string;
  nmiCode?: string;
}

/** `stationDetailList` — details for many stations. */
export interface StationDetailListParams extends PaginationParams {
  pageSize: number | string;
  idList?: Array<number | string>;
  /** For guest accounts, set to `3`. */
  stationType?: number;
}

/** `stationDayEnergyList` — daily generation for many stations on a date. */
export interface StationDayEnergyListParams extends PaginationParams {
  pageSize: number | string;
  /** Day to query, `yyyy-MM-dd`. */
  time: string;
  /** Comma-separated station IDs. */
  stationIds?: string;
  idList?: Array<number | string>;
}

/** `stationMonthEnergyList` — daily totals for many stations across a month. */
export interface StationMonthEnergyListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationIds?: string;
  nmiCode?: string;
  idList?: Array<number | string>;
}

/** `stationYearEnergyList` — yearly totals for many stations. */
export interface StationYearEnergyListParams extends PaginationParams {
  pageNo: number | string;
  pageSize: number | string;
  stationIds?: string;
  nmiCode?: string;
  idList?: Array<number | string>;
}

/** `stationDay` — intra-day samples for one station on a date. */
export interface StationDayParams {
  id?: number | string;
  money: string;
  /** Day to query, `yyyy-MM-dd`. */
  time: string;
  /** Device time zone offset, e.g. `8`. */
  timeZone: number;
  nmiCode?: string;
}

/** `stationMonth` — daily totals for one station across a month. */
export interface StationMonthParams {
  id?: number | string;
  money: string;
  /** Month to query, `yyyy-MM`. */
  month: string;
  timeZone: number;
  nmiCode?: string;
}

/** `stationYear` — monthly totals for one station across a year. */
export interface StationYearParams {
  id?: number | string;
  money: string;
  /** Year to query, `yyyy`. */
  year: string;
  timeZone: number;
  nmiCode?: string;
}

/** `stationAll` — yearly totals across the station's lifetime. */
export interface StationAllParams {
  id?: number | string;
  money: string;
  timeZone: number;
  nmiCode?: string;
}

/** `addStation` — create a new power station. */
export interface AddStationParams extends OpenRecord {
  /** One inverter SN to bind (or use `collectorSn`). */
  inverterSn?: string;
  /** One collector SN to bind (or use `inverterSn`). */
  collectorSn?: string;
  stationName: string;
  /** Default: owner's account. */
  userId?: number | string;
  /** Owner's mobile phone. */
  mobile?: string;
  /** Installed capacity in kWp. */
  capacity: string | number;
  latitude?: string;
  longitude?: string;
  /** Module inclination angle. */
  dip?: number;
  /** Module azimuth. */
  azimuth?: number;
  /** Currency for revenue calc, e.g. `EUR`, `CNY`. */
  money: string;
  /** Detailed address. */
  addr: string;
  countryStr?: number | string;
  regionStr?: number | string;
  cityStr?: number | string;
  /** Revenue per kWh. */
  price: number | string;
  /** Time zone offset. */
  offset?: number;
  /** Number of modules. */
  module?: string | number;
  installerEmail?: string;
  installerMobile?: string;
  nmiCode?: string | number;
}

/** `stationUpdate` — modify an existing power station. */
export interface StationUpdateParams extends OpenRecord {
  id?: number | string;
  stationName: string;
  mobile?: string;
  capacity: string | number;
  latitude?: string;
  longitude?: string;
  dip?: number;
  azimuth?: number;
  money?: string;
  /** Revenue per kWh. */
  price: number | string;
  addr: string;
  countryStr?: number | string;
  regionStr?: number | string;
  cityStr?: number | string;
  module?: string | number;
  installerEmail?: string;
  installerMobile?: number | string;
  nmiCode?: string;
  /** Daylight Saving Time: 0=Off, 1=On (default 0). */
  daylightSwitch?: number;
}

/** `addStationBindCollector` — create a station and bind a collector. */
export interface AddStationBindCollectorParams extends OpenRecord {
  /** Collector SN(s); comma-separate multiple. */
  sn?: string;
  stationName: string;
  userId?: number | string;
  capacity: string | number;
  picName?: string;
  latitude?: string;
  longitude?: string;
  dip?: number;
  azimuth?: number;
  money?: string;
  addr?: string;
  countryStr?: string;
  regionStr?: string;
  cityStr?: string;
  price?: number | string;
  offset?: number;
  /** Station type, see {@link PowerStationType}. */
  type?: number;
  /** Grid connection type: 0=full online, 1=self use, 2=off grid. */
  synchronizationType?: number;
  installTime?: string;
  module?: number;
  installerEmail?: string;
  installerMobile?: number | string;
  nmiCode?: string;
  /** Daylight Saving Time: 0=Off, 1=On (default 0). */
  daylightSwitch?: number;
}

/** `delCollector` — unbind a collector from its station. */
export interface DelCollectorParams {
  /** Collector SN. */
  sn?: string;
  /** 1=delete all inverters too, 0=keep them (default). */
  deleteInvert: number | string;
}

/** `addDevice` — bind inverter(s) to a station. */
export interface AddDeviceParams {
  /** Station ID (or use `nmiCode`). */
  id?: number | string;
  /** Inverter SN(s); comma-separate multiple. */
  sn: string;
  nmiCode?: string;
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

/** A row in the station list. */
export interface StationListItem extends OpenRecord {
  id?: string | number;
  sno?: string;
  stationName?: string;
  userId?: string | number;
  nmiCode?: string;
  addr?: string;
  capacity?: number;
  capacityStr?: string;
  /** Real-time power. */
  power?: number;
  powerStr?: string;
  /** 1=online, 2=offline, 3=alarm. */
  state?: number;
  /** Station type, see {@link PowerStationType}. */
  stationTypeNew?: number;
  dayEnergy?: number;
  dayEnergyStr?: string;
  monthEnergy?: number;
  monthEnergyStr?: string;
  yearEnergy?: number;
  yearEnergyStr?: string;
  allEnergy?: number;
  allEnergyStr?: string;
  dayIncome?: number;
  dayIncomeUnit?: string;
  allIncome?: number;
  allIncomeUnit?: string;
  fullHour?: number;
  timeZone?: number;
  dataTimestamp?: string | number;
}

/** Aggregate station counts returned alongside the list. */
export interface StationStatusVo extends OpenRecord {
  all?: number;
  normal?: number;
  offline?: number;
  fault?: number;
}

export interface StationListResponse extends OpenRecord {
  page?: SolisPage<StationListItem>;
  stationStatusVo?: StationStatusVo;
  records?: StationListItem[];
}

/** Full station detail. */
export interface StationDetail extends OpenRecord {
  id?: string | number;
  stationName?: string;
  userId?: string | number;
  nmiCode?: string;
  addr?: string;
  capacity?: number;
  capacityStr?: string;
  power?: number;
  powerStr?: string;
  state?: number;
  stationTypeNew?: number;
  dayEnergy?: number;
  dayEnergyStr?: string;
  monthEnergy?: number;
  yearEnergy?: number;
  yearEnergyStr?: string;
  allEnergy?: number;
  allEnergyStr?: string;
  dayInCome?: number;
  dayInComeUnit?: string;
  allInCome?: number;
  allInComeUnit?: string;
  monthInCome?: number;
  yearInCome?: number;
  batteryPower?: number;
  batteryPowerStr?: string;
  batteryCapacity?: number;
  batteryPercent?: number;
  familyLoadPower?: number;
  familyLoadPowerStr?: string;
  gridPurchasedDayEnergy?: number;
  gridPurchasedTotalEnergy?: number;
  gridSellDayEnergy?: number;
  gridSellTotalEnergy?: number;
  homeLoadEnergy?: number;
  homeLoadEnergyStr?: string;
  psum?: number;
  psumStr?: string;
  fullHour?: number;
  /** Environmental: CO2 avoided / equivalent trees. */
  powerStationAvoidedCo2?: number;
  powerStationNumTree?: number;
  azimuth?: number;
  dip?: number;
  timeZone?: number;
  timeZoneName?: string;
  daylight?: number;
  daylightSwitch?: number;
  /** Weather (sr/condTxt) when a weather source is linked. */
  sr?: number;
  condTxtD?: string;
  condTxtN?: string;
  tmpMax?: number;
  tmpMin?: number;
  dataTimestamp?: string | number;
}

export interface StationDetailListResponse extends OpenRecord {
  page?: SolisPage<StationDetail>;
  records?: StationDetail[];
}

/** A single intra-day station sample from `stationDay`. */
export interface StationDaySample extends OpenRecord {
  power?: number;
  powerStr?: string;
  /** Timestamp (ms). */
  time?: number | string;
  /** Solar irradiance (W/m²). */
  totalR?: number;
  batteryCapacitySoc?: number;
}

/** A station energy bucket from month/year/all endpoints. */
export interface StationEnergyRecord extends OpenRecord {
  id?: string | number;
  energy?: number;
  energyStr?: string;
  /** Timestamp (ms). */
  date?: number | string;
  dateStr?: string;
  money?: string | number;
  moneyStr?: string;
}

export interface StationEnergyListResponse extends OpenRecord {
  page?: SolisPage<StationEnergyRecord>;
  records?: StationEnergyRecord[];
}

/** Result of `addStation` / `addStationBindCollector`. */
export interface AddStationResult extends OpenRecord {
  id?: string | number;
  stationId?: string | number;
}
