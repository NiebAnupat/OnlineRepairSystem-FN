import Layout from "@/components/Layout";
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {Global, MantineProvider} from "@mantine/core";
import {ModalsProvider} from '@mantine/modals';
import {Notifications} from '@mantine/notifications';
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "@/components/dev";
import {RouterTransition} from "@/components/Layout/RouterTransition";

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
            <RouterTransition/>
            <Notifications limit={5}/>

            <ModalsProvider>
                <Layout>
                    <DevSupport ComponentPreviews={ComponentPreviews}
                                useInitialHook={useInitial}
                    >
                        <Component {...pageProps} />
                    </DevSupport>
                </Layout>
            </ModalsProvider>
        </MantineProvider>
    );
}
