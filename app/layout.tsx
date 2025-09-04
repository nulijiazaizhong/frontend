"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import CSRLayout from "./csr_layout";
import { AuthProvider } from "@/apis/auth";
import Script from "next/script";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    // The ETS2LA window does not allow F5, so we need to implement that
    // handle ourselves.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "F5") {
                event.preventDefault();
                window.location.reload();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <html lang="en">
            <head>
                <title>ETS2LA</title>
                <meta name="description" content="ETS2LA Frontend Page" />
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#131316" />
                <meta name="google-adsense-account" content="ca-pub-6002744323117854" />
                <link rel="icon" href="/favicon.ico" />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6002744323117854"
                    crossOrigin="anonymous"
                ></script>

                {/* <!-- Google tag (gtag.js) --> */}
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-BF3MJ44Z66" />
                <Script id="google-analytics">{`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-BF3MJ44Z66');
                `}</Script>
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sidebarbg overflow-hidden w-screen h-screen`}
            >
                <AuthProvider>
                    <CSRLayout>{children}</CSRLayout>
                </AuthProvider>
            </body>
        </html>
    );
}