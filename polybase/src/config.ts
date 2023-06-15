import assert from "assert";
import { SigningKey } from "ethers";

assert(process.env.STREAMER_PRIVATE_KEY, "STREAMER_PRIVATE_KEY is not set");

const privateKey = process.env.STREAMER_PRIVATE_KEY;

export function getStreamerPrivateKey() {
  return privateKey;
}
export function getStreamerPublicKey() {
  const key = new SigningKey(privateKey);
  return "0x" + key.publicKey.slice(4);
}
