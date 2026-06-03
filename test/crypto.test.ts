import { describe, expect, it } from "vitest";
import { bytesToBase64, utf8Bytes } from "../src/crypto/base64.js";
import { md5 } from "../src/crypto/md5.js";
import { sha1 } from "../src/crypto/sha1.js";
import { hmacSha1 } from "../src/crypto/hmac-sha1.js";
import {
  buildSignedHeaders,
  contentMd5,
  gmtDate,
} from "../src/crypto/sign.js";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

describe("base64", () => {
  it("encodes ascii", () => {
    expect(bytesToBase64(utf8Bytes("Hi"))).toBe("SGk=");
    expect(bytesToBase64(utf8Bytes("Man"))).toBe("TWFu");
    expect(bytesToBase64(utf8Bytes("Ma"))).toBe("TWE=");
    expect(bytesToBase64(utf8Bytes("M"))).toBe("TQ==");
    expect(bytesToBase64(utf8Bytes(""))).toBe("");
  });
});

describe("md5", () => {
  it("matches known hex digests", () => {
    expect(toHex(md5(utf8Bytes("")))).toBe("d41d8cd98f00b204e9800998ecf8427e");
    expect(toHex(md5(utf8Bytes("abc")))).toBe(
      "900150983cd24fb0d6963f7d28e17f72",
    );
    expect(toHex(md5(utf8Bytes("The quick brown fox jumps over the lazy dog")))).toBe(
      "9e107d9d372bb6826bd81d3542a419d6",
    );
  });

  it("matches the Content-MD5 example from the SolisCloud spec", () => {
    // Spec §2.4 / §2.5: body {"pageNo":1,"pageSize":10}
    // -> Content-MD5: kxdxk7rbAsrzSIWgEwhH4w==
    expect(contentMd5('{"pageNo":1,"pageSize":10}')).toBe(
      "kxdxk7rbAsrzSIWgEwhH4w==",
    );
  });
});

describe("sha1", () => {
  it("matches known hex digests", () => {
    expect(toHex(sha1(utf8Bytes("")))).toBe(
      "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    );
    expect(toHex(sha1(utf8Bytes("abc")))).toBe(
      "a9993e364706816aba3e25717850c26c9cd0d89d",
    );
  });
});

describe("hmac-sha1", () => {
  it("matches RFC 2202 test vectors", () => {
    const key1 = new Uint8Array(20).fill(0x0b);
    expect(toHex(hmacSha1(key1, utf8Bytes("Hi There")))).toBe(
      "b617318655057264e28bc0b6fb378c8ef146be00",
    );

    expect(
      toHex(hmacSha1(utf8Bytes("Jefe"), utf8Bytes("what do ya want for nothing?"))),
    ).toBe("effcdf6ae5eb2fa2d27416d5f184df9c259a7c79");
  });
});

describe("buildSignedHeaders", () => {
  it("produces the four required headers with a stable signature", () => {
    const headers = buildSignedHeaders({
      apiId: "1300386381676644416",
      apiSecret: "test-secret",
      method: "POST",
      resource: "/v1/api/inverterList",
      body: '{"pageNo":1,"pageSize":10}',
      date: "Fri, 26 Jul 2019 06:00:46 GMT",
      contentType: "application/json",
    });

    expect(headers["Content-MD5"]).toBe("kxdxk7rbAsrzSIWgEwhH4w==");
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Date).toBe("Fri, 26 Jul 2019 06:00:46 GMT");
    expect(headers.Authorization).toMatch(/^API 1300386381676644416:.+=*$/);

    // Deterministic for fixed inputs.
    const again = buildSignedHeaders({
      apiId: "1300386381676644416",
      apiSecret: "test-secret",
      method: "POST",
      resource: "/v1/api/inverterList",
      body: '{"pageNo":1,"pageSize":10}',
      date: "Fri, 26 Jul 2019 06:00:46 GMT",
      contentType: "application/json",
    });
    expect(again.Authorization).toBe(headers.Authorization);
  });
});

describe("gmtDate", () => {
  it("formats as an HTTP GMT string", () => {
    const formatted = gmtDate(new Date("2019-07-26T06:00:46Z"));
    expect(formatted).toBe("Fri, 26 Jul 2019 06:00:46 GMT");
  });
});
