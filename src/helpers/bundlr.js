import { WebBundlr } from '@bundlr-network/client';
import toast from 'react-hot-toast';

export async function uploadFile(file, mime, wallet) {
  const bundlr = new WebBundlr("https://node1.bundlr.network", "solana", wallet, {
    providerUrl: process.env.NEXT_PUBLIC_RPC_HOST
  });
  await bundlr.ready();
  const tags = [{
    name: 'Content-Type',
    value: mime
  }];
  const txn = bundlr.createTransaction(file, { tags })
  const size = txn.size;
  const price = await bundlr.getPrice(size);
  console.log(price.toNumber())
  const balance = await bundlr.getLoadedBalance();
  console.log(balance.toNumber())
  if (balance.isLessThan(price)) {
    const promise = bundlr.fund(price.minus(balance).multipliedBy(1.1).integerValue());

    toast.promise(promise, {
      loading: 'Funding bundlr network for upload...',
      success: 'Confirmed',
      error: 'Error funding, please try again',
    });

    await promise
  }

  await txn.sign();
  const id = txn.id;
  const upload = txn.upload()

  const uri = `https://arweave.net/${id}`;

  toast.promise(upload, {
    loading: 'Uploading new metadata...',
    success: 'Metadata uploaded!',
    error: 'Error uploading, please try again',
  });

  await upload;
  return uri;
}