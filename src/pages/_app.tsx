import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider, Global } from '@mantine/core';

function MyGlobalStyles() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "Noto Sans Thai",
            src: `url("https://cdn.jsdelivr.net/gh/lazywasabi/thai-web-fonts@7/fonts/NotoSansThai/NotoSansThai-Regular.woff2") format("woff2")`,
            fontStyle: "normal",
            fontWeight: "normal",
            fontDisplay: "swap",
          },
        },
      ]}
    />
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles
    withNormalizeCSS
    theme={{
      colorScheme: 'light',
      fontFamily: 'Noto Sans Thai',
      primaryColor: 'indigo',
    }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MantineProvider>
  );
}
