import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import LeftNav from "@/components/overview/left-nav";
import React from "react";
import {getSession} from "../../auth";
import NextAuthProviders from "@/providers/nextauth-provider";
import {Toaster} from "@/components/ui/toaster";
import {ReactQueryProvider} from "@/providers/reactquery-provider";
import {NextThemeProvider} from "@/providers/nexttheme-provider";
import {MobileNav} from "@/components/mobile-nav";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Chat PDF",
    description: "Chat PDF Semantic Kernel",
    icons: {
        icon: [{url: "/favicon.ico"}],
    }
};

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const session = await getSession();

    return (
        <html lang="en" className={`${roboto.className}`} suppressHydrationWarning>
        <body>
        <NextThemeProvider>
            <NextAuthProviders session={session}>
                <ReactQueryProvider>
                    <main className="flex flex-col md:flex-row h-svh">
                        <div
                            className="md:hidden fixed top-0 left-0 w-full z-50 bg-collapse_nav_tooltip px-2 py-2">
                            <MobileNav/>
                        </div>
                        <LeftNav className={"hidden md:flex"}/>
                        <div className="bg-white text-black flex-1 mt-14 md:mt-0 h-svh">
                            {children}
                        </div>
                        <Toaster/>
                    </main>
                </ReactQueryProvider>
            </NextAuthProviders>
        </NextThemeProvider>
        </body>
        </html>
    );
}
