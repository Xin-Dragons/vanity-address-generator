import { Keypair } from '@solana/web3.js';

self.addEventListener("message", event => {
  let { prefix, caseSensitive } = event.data;

  let keypair = Keypair.generate();
  if (caseSensitive) {
    while (!keypair.publicKey.toBase58().startsWith(prefix)) {
      keypair = Keypair.generate();
    }
    
    self.postMessage({ keypair })
  } else {
    while (!keypair.publicKey.toBase58().toLowerCase().startsWith(prefix.toLowerCase())) {
      keypair = Keypair.generate();
    }
    
    self.postMessage({ keypair })
  }
})