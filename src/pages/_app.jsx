import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../styles/globals.css';
import Script from 'next/script'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6cbec9'
    }
  }
})

const App = ({ Component, pageProps }) => {
  
  return (
    <><Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-0FJF0WRDRK"/>
        <Script
          id='google-analytics'
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0FJF0WRDRK', {
                page_path: window.location.pathname,
              });
            `,
            }}
        />
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider></>
  );
};

export default App;
