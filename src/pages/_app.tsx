import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {Global, MantineProvider} from "@mantine/core";
import {ModalsProvider} from '@mantine/modals';
import {Notifications} from '@mantine/notifications';
import {RouterTransition} from "@/components/Layout/RouterTransition";

function MyFontStyles() {
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

function MyGlobalStyles() {
    return (
        <Global
            styles={[
                {
                    "*": {
                        boxSizing: "border-box",
                    },
                    body: {
                        margin: 0,
                        padding: 0,
                        fontFamily: "Noto Sans Thai",
                        userSelect: "none",
                    },
                    "html, body, #__next": {
                        height: "100%",
                    },
                },
            ]}
        />
    );
}

export default function App({Component, pageProps}: AppProps) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "light",
                fontFamily: "Noto Sans Thai",
                primaryColor: "indigo",
            }}
        >
            <MyFontStyles/>
            <MyGlobalStyles/>
            <RouterTransition/>
            <Notifications limit={5}/>

            <ModalsProvider>
                <Layout>
                        <Component {...pageProps}/>
                </Layout>
            </ModalsProvider>
        </MantineProvider>
    );
}
