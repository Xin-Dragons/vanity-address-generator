import { Connection } from '@solana/web3.js'

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_HOST, 'confirmed')

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// default 14 * 2 seconds = 28 seconds
export async function pollTransaction(txnId, retries = 14) {
  if (retries <= 0) {
    throw new Error('Timed out waiting for confirmation')
  }
  try {
    console.log(`Polling txn: ${txnId}\n\nRetries remaining: ${retries}`)
    const txn = await connection.getTransaction(txnId);
    if (txn) {
      return txn;
    } else {
      await sleep(2000);
      return pollTransaction(txnId, retries - 1);
    }
  } catch {
    await sleep(2000);
    return pollTransaction(txnId, retries - 1);
  }
}                                                                                                   