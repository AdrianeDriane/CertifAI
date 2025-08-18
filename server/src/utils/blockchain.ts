import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY!, provider);

/**
 * Anchors a string hash on-chain by putting it into the tx "data" field.
 * Returns the blockchain transaction hash.
 */
export async function storeHashOnPolygon(hash: string): Promise<string> {
  // Encode the hash string as UTF-8 bytes, then to hex for the tx data
  const data = ethers.hexlify(ethers.toUtf8Bytes(hash));

  // Self-send with 0 value; we only care about the tx data and receipt
  const tx = await wallet.sendTransaction({
    to: wallet.address,
    value: 0,
    data,
  });

  // Wait until mined (so you have a confirmed receipt)
  await tx.wait();

  return tx.hash;
}

/** Optional: read back the UTF-8 data from a tx hash (for verification) */
export async function readTxDataAsString(txHash: string): Promise<string> {
  const tx = await provider.getTransaction(txHash);
  if (!tx || !tx.data) return "";
  // tx.data is hex; decode to string
  return ethers.toUtf8String(tx.data);
}
