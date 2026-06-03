# soliscloud

A framework-agnostic TypeScript client for the **SolisCloud Platform API** (Ginlong / Solis), implementing the complete V2.0.3 specification.

- ✅ **Complete API coverage** — all 37 documented device and plant endpoints
- ✅ **Zero runtime dependencies** — pure-TypeScript request signing (MD5, HMAC-SHA1, Base64)
- ✅ **Runs anywhere** — browser, Node 18+, Deno, Bun, Cloudflare Workers, edge runtimes (uses the global `fetch`)
- ✅ **Fully typed** — typed request params and response shapes for every endpoint, plus enums for all status/appendix codes
- ✅ **ESM + CommonJS** builds with `.d.ts` declarations

The signing logic is verified against the worked example in the spec (the `Content-MD5` of `{"pageNo":1,"pageSize":10}` is `kxdxk7rbAsrzSIWgEwhH4w==`) and against the RFC 2202 HMAC-SHA1 test vectors.

## Installation

```bash
npm install soliscloud
```

## Getting your credentials

Log in to [www.soliscloud.com](https://www.soliscloud.com) → **Account** → **Basic Settings** → **API Management** to obtain your **API ID** and **API Secret**. Keep the secret confidential.

## Quick start

```ts
import { SolisClient } from "soliscloud";

const solis = new SolisClient({
  apiId: process.env.SOLIS_API_ID!,
  apiSecret: process.env.SOLIS_API_SECRET!,
});

// List inverters under the account
const { page, inverterStatusVo } = await solis.inverters.list({
  pageNo: 1,
  pageSize: 20,
});
console.log(`${inverterStatusVo?.normal} online`, page?.records);

// Detail for one inverter (by id or sn)
const detail = await solis.inverters.detail({ sn: "120B40198150131" });
console.log(detail.pac, detail.pacStr);

// Intra-day generation curve
const samples = await solis.inverters.day({
  sn: "120B40198150131",
  money: "EUR",
  time: "2024-06-01",
  timeZone: 8,
});
```

Every call returns the **unwrapped `data` payload** — the `{ success, code, msg, data }` envelope is handled for you, and a failed envelope throws a `SolisApiError`.

## Configuration

```ts
const solis = new SolisClient({
  apiId: "...",
  apiSecret: "...",

  // Optional:
  baseUrl: "https://www.soliscloud.com:13333", // default
  timeoutMs: 30_000,                            // per-request timeout; 0 disables
  fetch: customFetch,                           // inject a fetch (Node < 18, proxies, tests)
  contentType: "application/json",            // signing content-type (see note below)
  defaultHeaders: { "User-Agent": "my-app/1.0" },
});
```

> **Content-Type note.** The default signing content type is `application/json`. The spec's "Request Standard Format" section lists `application/json;charset=UTF-8`, but the live server computes its signature over plain `application/json` and rejects the charset variant with `403 "wrong sign"` (verified against the production API). Override `contentType` only if a particular deployment requires it.

> **Clock skew.** The API rejects requests whose `Date` header differs from server time by more than ±15 minutes. Ensure the host clock is reasonably accurate.

## API surface

The client groups every endpoint under a typed resource.

### `solis.inverters`
| Method | Endpoint | Description |
|---|---|---|
| `list(params)` | `inverterList` | Inverters under the account (≤100/call) |
| `detail(params)` | `inverterDetail` | Single inverter detail |
| `detailList(params)` | `inverterDetailList` | Multiple inverter details by SN |
| `day(params)` | `inverterDay` | Intra-day samples for a day |
| `month(params)` | `inverterMonth` | Daily totals for a month |
| `year(params)` | `inverterYear` | Monthly totals for a year |
| `all(params)` | `inverterAll` | Yearly totals (lifetime) |
| `shelfTime(params)` | `inverter/shelfTime` | Warranty / quality assurance data |
| `alarms(params)` | `alarmList` | Device alarm list under the account |

### `solis.collectors`
| Method | Endpoint | Description |
|---|---|---|
| `list(params)` | `collectorList` | Collectors (dataloggers) |
| `detail(params)` | `collectorDetail` | Single collector detail |
| `day(params)` | `collector/day` | Intra-day signal samples |

### `solis.epm` (Export Power Manager)
| Method | Endpoint | Description |
|---|---|---|
| `list(params)` | `epmList` | EPM devices |
| `detail(params)` | `epmDetail` | Single EPM detail |
| `day(params)` | `epm/day` | Intra-day samples (`searchinfo` accepts an array) |
| `month(params)` | `epm/month` | Daily totals for a month |
| `year(params)` | `epm/year` | Monthly totals for a year |
| `all(params)` | `epm/all` | Yearly totals (lifetime) |

### `solis.weather`
| Method | Endpoint | Description |
|---|---|---|
| `list(params)` | `weatherList` | Meteorological instruments |
| `detail(params)` | `weatherDetail` | Single instrument detail |

### `solis.meters`
| Method | Endpoint | Description |
|---|---|---|
| `list(params)` | `ammeterList` | Meters |
| `detail(params)` | `ammeterDetail` | Single meter detail |

### `solis.stations`
| Method | Endpoint | Description |
|---|---|---|
| `list(params)` | `userStationList` | Power stations under the account |
| `detail(params)` | `stationDetail` | Single station detail |
| `detailList(params)` | `stationDetailList` | Multiple station details |
| `dayEnergyList(params)` | `stationDayEnergyList` | Daily generation, many stations, on a day |
| `monthEnergyList(params)` | `stationMonthEnergyList` | Daily totals, many stations, for a month |
| `yearEnergyList(params)` | `stationYearEnergyList` | Yearly totals, many stations |
| `day(params)` | `stationDay` | Intra-day samples for one station |
| `month(params)` | `stationMonth` | Daily totals for a month |
| `year(params)` | `stationYear` | Monthly totals for a year |
| `all(params)` | `stationAll` | Yearly totals (lifetime) |
| `add(params)` | `addStation` | Create a station |
| `update(params)` | `stationUpdate` | Modify a station |
| `addAndBindCollector(params)` | `addStationBindCollector` | Create a station and bind a collector |
| `unbindCollector(params)` | `delCollector` | Unbind a collector |
| `bindInverter(params)` | `addDevice` | Bind inverter(s) to a station |

## Error handling

```ts
import { SolisApiError, SolisHttpError } from "soliscloud";

try {
  await solis.stations.detail({ id: "123" });
} catch (err) {
  if (err instanceof SolisApiError) {
    // API returned success:false or a non-zero code
    console.error(err.code, err.apiMessage, err.resource);
  } else if (err instanceof SolisHttpError) {
    // Transport-level failure (non-2xx, network, bad JSON)
    console.error(err.status, err.body);
  }
}
```

Both extend `SolisError`, so you can catch either with `instanceof SolisError`.

## Enums & constants

Status codes and appendix values are exported as enums:

```ts
import {
  InverterState,        // Online=1, Offline=2, Alarm=3
  CollectorState,       // Online=1, Offline=2
  InverterProductModel, // Grid=1, Storage=2
  PowerStationType,     // Appendix 2
  InverterMeterModel,   // Appendix 3
  GridConnectionType,   // FullOnline=0, SelfUse=1, OffGrid=2
  AlarmState,           // Unprocessed=0, Processed=1, Resolved=2
  ENDPOINTS,            // path map
  ERROR_CODES,          // Appendix 1
} from "soliscloud";
```

## Advanced usage

### Cancellation & per-call timeouts

```ts
const controller = new AbortController();
const result = await solis.inverters.list(
  { pageNo: 1, pageSize: 20 },
  { signal: controller.signal, timeoutMs: 10_000 },
);
```

### Raw / future endpoints

```ts
// Sign and POST an arbitrary body; returns the unwrapped `data`.
const data = await solis.request("/v1/api/someNewEndpoint", { foo: "bar" });
```

### Standalone signing

```ts
import { buildSignedHeaders, contentMd5 } from "soliscloud";

const headers = buildSignedHeaders({
  apiId, apiSecret,
  method: "POST",
  resource: "/v1/api/inverterList",
  body: '{"pageNo":1,"pageSize":10}',
});
```

## Notes & conventions

- **All requests are `POST`** with a JSON body; the library signs each request with `Content-MD5`, `Date`, and `Authorization` headers per the spec.
- **Data updates every 5 minutes** server-side.
- **Units are separate fields.** Numeric values come with a companion `…Str` unit field (e.g. `pac` + `pacStr`), as in the API.
- Response interfaces type the documented fields and carry an index signature, so undocumented or dynamically-indexed fields (e.g. `pow1`…`pow32`, `uPv1`…`uPv32`) remain accessible and forward-compatible.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## License

MIT
