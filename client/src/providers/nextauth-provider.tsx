"use client"

import type {Session} from "next-auth"
import {SessionProvider} from "next-auth/react";
import React from "react";

export default function NextAuthProviders({session, children}: { session: Session | null, children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}