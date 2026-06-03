import { describe, expect, it, vi } from "vitest";
import { SolisClient } from "../src/client.js";
import { SolisApiError, SolisHttpError } from "../src/errors.js";
import type { FetchLike } from "../src/http.js";

function mockFetch(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
): { fetch: FetchLike; calls: Array<Parameters<FetchLike>> } {
  const calls: Array<Parameters<FetchLike>> = [];
  const fetch: FetchLike = vi.fn(async (url, options) => {
    calls.push([url, options]);
    return {
      ok: init.ok ?? true,
      status: init.status ?? 200,
      text: async () =>
        typeof body === "string" ? body : JSON.stringify(body),
    };
  });
  return { fetch, calls };
}

function makeClient(fetch: FetchLike): SolisClient {
  return new SolisClient({
    apiId: "test-id",
    apiSecret: "test-secret",
    fetch,
  });
}

describe("SolisClient", () => {
  it("signs the request and unwraps the data payload", async () => {
    const { fetch, calls } = mockFetch({
      success: true,
      code: "0",
      msg: "success",
      data: { page: { records: [{ sn: "ABC123" }] } },
    });
    const client = makeClient(fetch);

    const result = await client.inverters.list({ pageNo: 1, pageSize: 20 });

    expect(result.page?.records?.[0]?.sn).toBe("ABC123");

    const [url, options] = calls[0]!;
    expect(url).toBe("https://www.soliscloud.com:13333/v1/api/inverterList");
    expect(options.method).toBe("POST");
    expect(options.body).toBe('{"pageNo":1,"pageSize":20}');
    expect(options.headers["Content-MD5"]).toBeTruthy();
    expect(options.headers.Authorization).toMatch(/^API test-id:/);
    expect(options.headers.Date).toMatch(/GMT$/);
  });

  it("joins EPM searchinfo arrays into a comma string", async () => {
    const { fetch, calls } = mockFetch({
      success: true,
      code: "0",
      msg: "success",
      data: [],
    });
    const client = makeClient(fetch);

    await client.epm.day({
      sn: "EPM1",
      searchinfo: ["u_ac1", "p_load"],
      time: "2024-01-01",
      timeZone: 8,
    });

    const body = JSON.parse(calls[0]![1].body) as { searchinfo: string };
    expect(body.searchinfo).toBe("u_ac1,p_load");
  });

  it("throws SolisApiError on a failed envelope", async () => {
    const { fetch } = mockFetch({
      success: false,
      code: "R0000",
      msg: "No authority",
      data: null,
    });
    const client = makeClient(fetch);

    await expect(
      client.stations.list({ pageNo: 1, pageSize: 20 }),
    ).rejects.toMatchObject({
      name: "SolisApiError",
      code: "R0000",
    });
    await expect(
      client.stations.list({ pageNo: 1, pageSize: 20 }),
    ).rejects.toBeInstanceOf(SolisApiError);
  });

  it("throws SolisHttpError on a non-2xx status", async () => {
    const { fetch } = mockFetch("Internal Server Error", {
      ok: false,
      status: 500,
    });
    const client = makeClient(fetch);

    await expect(
      client.meters.detail({ sn: "M1" }),
    ).rejects.toBeInstanceOf(SolisHttpError);
  });

  it("throws SolisHttpError on invalid JSON", async () => {
    const { fetch } = mockFetch("<html>not json</html>");
    const client = makeClient(fetch);

    await expect(
      client.weather.detail({ sn: "W1" }),
    ).rejects.toBeInstanceOf(SolisHttpError);
  });

  it("requires credentials", () => {
    expect(() => new SolisClient({ apiId: "", apiSecret: "x" })).toThrow();
    expect(() => new SolisClient({ apiId: "x", apiSecret: "" })).toThrow();
  });
});
