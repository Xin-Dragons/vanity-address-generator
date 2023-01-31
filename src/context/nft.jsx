import { Metadata, Metaplex } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { createContext, FC, useContext, useEffect, useState } from "react";

const initial = {
  nfts: [],
  setNfts: () => {},
  refresh: () => {},
}

const PROJECT_START = Date.parse('2023-01-04')
const NOW = Date.now();

const MS_PER_MONTH = 2.628e+9;
const MS_PER_WEEK = 6.048e+8;

const NftsContext = createContext(initial);

function getDiamondLevel(nft) {
  
  const projectLife = NOW - PROJECT_START

  const last_sale = nft.last_sale
    ? Date.parse(nft.last_sale.sale_date)
    : PROJECT_START;

  const timeHeld = NOW - last_sale;
  const percent = timeHeld / projectLife * 100;

  if (percent >= 80) {
    return 'purple'
  }

  if (percent >= 50) {
    return 'red'
  }

  if (timeHeld / MS_PER_MONTH >= 1) {
    return 'cyan'
  }

  if (timeHeld / MS_PER_WEEK >= 1) {
    return 'green'
  }
}

export const NftsProvider = ({ children, includedMints }) => {
  const wallet = useWallet()
  const [nfts, setNfts] = useState([]);
  const [paidNfts, setPaidNfts] = useState([]);
  const [hasRare, setHasRare] = useState(false)
  
  async function getNfts() {
    const { data: { nfts } } = await axios.get('/api/get-nfts', { params: { publicKey: wallet?.publicKey?.toString() }});
    setNfts(
      nfts
        .sort((a, b) => a.mint.localeCompare(b.mint))
        .map(nft => {
          return {
            ...nft,
            diamond_hands_level: getDiamondLevel(nft),
            royalties_paid: !nft.last_sale || !nft.last_sale.debt || nft.last_sale.settled
          }
        })
      )
  }

  const SPECIALS = [
    'Ursa Major'
  ]

  useEffect(() => {
    const hasRare = nfts.find(nft => nft.metadata.attributes.find(att => att.trait_type === 'Headwear').value === 'Emperor Crown' || SPECIALS.includes(nft.metadata.name))
    setHasRare(hasRare)
  }, [nfts])

  useEffect(() => {
    if (wallet.connected) {
      getNfts();
    }
  }, [wallet.publicKey, wallet.connected])

  function refresh() {
    getNfts();
  }

  useEffect(() => {
    setPaidNfts(nfts.filter(nft => nft.royalties_paid).map(n => n.mint))
  }, [nfts])
  
  return (
    <NftsContext.Provider value={{ nfts, refresh, setNfts, hasRare, paidNfts }}>
      { children }
    </NftsContext.Provider>
  )
}

export function useNfts() {
  return useContext(NftsContext)
}