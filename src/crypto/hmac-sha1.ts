import { sha1 } from "./sha1.js";

const BLOCK_SIZE = 64;

/**
 * HMAC-SHA1 over `message` using `key`, returning the 20-byte MAC.
 *
 * The SolisCloud `Authorization` signature is the Base64 encoding of this MAC.
 */
export function hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
  let normalizedKey = key;
  if (normalizedKey.length > BLOCK_SIZE) {
    normalizedKey = sha1(normalizedKey);
  }

  const padded = new Uint8Array(BLOCK_SIZE);
  padded.set(normalizedKey);

  const inner = new Uint8Array(BLOCK_SIZE + message.length);
  const outerPrefix = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    inner[i] = padded[i]! ^ 0x36;
    outerPrefix[i] = padded[i]! ^ 0x5c;
  }
  inner.set(message, BLOCK_SIZE);
  const innerHash = sha1(inner);

  const outer = new Uint8Array(BLOCK_SIZE + innerHash.length);
  outer.set(outerPrefix);
  outer.set(innerHash, BLOCK_SIZE);
  return sha1(outer);
}
