import { createTheme, ThemeProvider } from '@mui/material/styles';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, SlopeWalletAdapter, BackpackWalletAdapter, BraveWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { useMemo } from 'react';
import { NftsProvider } from '../context/nft';
import hashlist from '../hashlist.json'

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6cbec9'
        }
    }
})

const App = ({ Component, pageProps }) => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint
    const endpoint = process.env.NEXT_PUBLIC_RPC_HOST;

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SlopeWalletAdapter(),
            new BackpackWalletAdapter(),
            new BraveWalletAdapter()
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <NftsProvider includedMints={hashlist}>
                        <ThemeProvider theme={theme}>
                            <Component {...pageProps} />
                        </ThemeProvider>
                    </NftsProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
