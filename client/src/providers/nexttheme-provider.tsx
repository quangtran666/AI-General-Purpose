"use client"

import {ReactNode, useEffect, useState} from "react";
import {ThemeProvider} from "next-themes";

export const NextThemeProvider = ({children} : {children: ReactNode}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>; 
    }
    
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        > 
            {children}
        </ThemeProvider>
    )
}