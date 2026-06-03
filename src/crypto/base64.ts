const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Base64-encode raw bytes.
 *
 * Implemented by hand (rather than relying on `btoa`/`Buffer`) so the library
 * behaves identically across browsers, Node, Deno and edge runtimes.
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  let i = 0;

  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i]! << 16) | (bytes[i + 1]! << 8) | bytes[i + 2]!;
    out +=
      ALPHABET[(n >>> 18) & 63]! +
      ALPHABET[(n >>> 12) & 63]! +
      ALPHABET[(n >>> 6) & 63]! +
      ALPHABET[n & 63]!;
  }

  const rem = bytes.length - i;
  if (rem === 1) {
    const n = bytes[i]! << 16;
    out += ALPHABET[(n >>> 18) & 63]! + ALPHABET[(n >>> 12) & 63]! + "==";
  } else if (rem === 2) {
    const n = (bytes[i]! << 16) | (bytes[i + 1]! << 8);
    out +=
      ALPHABET[(n >>> 18) & 63]! +
      ALPHABET[(n >>> 12) & 63]! +
      ALPHABET[(n >>> 6) & 63]! +
      "=";
  }

  return out;
}

const UTF8 = new TextEncoder();

/** Encode a JavaScript string to UTF-8 bytes. */
export function utf8Bytes(input: string): Uint8Array {
  return UTF8.encode(input);
}
