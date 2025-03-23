import { t } from "@/lib/constants";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import Head from "next/head";

import "../styles/global.css";
import Layout from "./_layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>{t.index.title}</title>
        <meta name="description" content={t.index.description} />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}
