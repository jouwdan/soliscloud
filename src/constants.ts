/**
 * Default SolisCloud API base URL (note the non-standard port).
 * @see https://www.soliscloud.com:13333/
 */
export const DEFAULT_BASE_URL = "https://www.soliscloud.com:13333";

/**
 * Every documented API resource path, grouped by domain. Used by the resource
 * classes and exported so callers can reference paths directly if needed.
 */
export const ENDPOINTS = {
  // --- Device: inverters ---
  inverterList: "/v1/api/inverterList",
  inverterDetail: "/v1/api/inverterDetail",
  inverterDetailList: "/v1/api/inverterDetailList",
  inverterDay: "/v1/api/inverterDay",
  inverterMonth: "/v1/api/inverterMonth",
  inverterYear: "/v1/api/inverterYear",
  inverterAll: "/v1/api/inverterAll",
  inverterShelfTime: "/v1/api/inverter/shelfTime",
  alarmList: "/v1/api/alarmList",

  // --- Device: collectors (dataloggers) ---
  collectorList: "/v1/api/collectorList",
  collectorDetail: "/v1/api/collectorDetail",
  collectorDay: "/v1/api/collector/day",

  // --- Device: EPM (Export Power Manager) ---
  epmList: "/v1/api/epmList",
  epmDetail: "/v1/api/epmDetail",
  epmDay: "/v1/api/epm/day",
  epmMonth: "/v1/api/epm/month",
  epmYear: "/v1/api/epm/year",
  epmAll: "/v1/api/epm/all",

  // --- Device: weather stations ---
  weatherList: "/v1/api/weatherList",
  weatherDetail: "/v1/api/weatherDetail",

  // --- Device: meters (ammeters) ---
  ammeterList: "/v1/api/ammeterList",
  ammeterDetail: "/v1/api/ammeterDetail",

  // --- Plant: stations ---
  userStationList: "/v1/api/userStationList",
  stationDetail: "/v1/api/stationDetail",
  stationDetailList: "/v1/api/stationDetailList",
  stationDayEnergyList: "/v1/api/stationDayEnergyList",
  stationMonthEnergyList: "/v1/api/stationMonthEnergyList",
  stationYearEnergyList: "/v1/api/stationYearEnergyList",
  stationDay: "/v1/api/stationDay",
  stationMonth: "/v1/api/stationMonth",
  stationYear: "/v1/api/stationYear",
  stationAll: "/v1/api/stationAll",
  addStation: "/v1/api/addStation",
  stationUpdate: "/v1/api/stationUpdate",
  addStationBindCollector: "/v1/api/addStationBindCollector",
  delCollector: "/v1/api/delCollector",
  addDevice: "/v1/api/addDevice",
} as const;

export type EndpointName = keyof typeof ENDPOINTS;

/**
 * Documented error codes (Appendix 1). The list in the spec is non-exhaustive;
 * the API may return other codes, so treat unknown codes as failures too.
 */
export const ERROR_CODES: Record<string, string> = {
  "0": "Success",
  R0000: "No authority",
  B0001: "Has been bound to other users",
  I0003: "Please enter SN",
  B0049: "The collector does not exist or has no permissions and cannot be viewed",
  I0000: "The necessary parameters are empty",
  B0011: "The user does not exist",
  I0012: "Incorrect account or password, please re-enter",
};

/** Inverter run state (`state` field). */
export enum InverterState {
  Online = 1,
  Offline = 2,
  Alarm = 3,
}

/** Collector run state (`state` / `collectorState` field). */
export enum CollectorState {
  Online = 1,
  Offline = 2,
}

/** Inverter product model (`productModel` / `type` field). */
export enum InverterProductModel {
  Grid = 1,
  Storage = 2,
}

/** Inverter offline classification (`stateExceptionFlag` field). */
export enum InverterOfflineFlag {
  NormalOffline = 0,
  AbnormalOffline = 1,
}

/** Power station type (Appendix 2, `stationTypeNew` / `type` field). */
export enum PowerStationType {
  Grid = 0,
  EnergyStorage = 1,
  AcCouple = 2,
  EpmGridMeter = 3,
  BuiltInMeter = 4,
  ExternalMeter = 5,
  S5OfflineParallelStorage = 6,
  S5GridParallelStorage = 7,
  GridPlusAcCouple = 8,
  OffGridEnergyStorage = 9,
  S6GridParallelStorage = 10,
  S6OfflineParallelStorage = 11,
}

/** Inverter meter type (Appendix 3, `inverterMeterModel` field). */
export enum InverterMeterModel {
  Grid = 1,
  GridAndLoadSideMeter = 2,
  GridConnectedGridSideMeter = 3,
  EnergyStorageLoadSideMeter = 4,
  EnergyStorageGridSideMeter = 5,
  Reserve = 6,
  OffGridEnergyStorage = 7,
  GridConnectedStorageDualMeter = 8,
  AcCoupleWithoutCt = 1001,
  AcCoupleWithCt = 1002,
}

/** Grid connection type for stations (`synchronizationType` field). */
export enum GridConnectionType {
  FullOnline = 0,
  SelfUse = 1,
  OffGrid = 2,
}

/** Alarm processing state (`state` field on alarm queries). */
export enum AlarmState {
  Unprocessed = 0,
  Processed = 1,
  Resolved = 2,
}
