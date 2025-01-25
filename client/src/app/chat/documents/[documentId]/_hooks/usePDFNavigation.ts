import {useCallback, useState, useEffect} from "react";
import {usePDFStore} from "@/stores/pdfstore";
import {usePageInView} from './usePageInView';

export const usePDFNavigation = (documentId: string) => {
    const [pageRefs, setPageRefs] = useState<(HTMLDivElement | null)[]>([]);
    const {setCurrentPage, getPdfNumPages} = usePDFStore();
    const { createIntersectionObserver } = usePageInView(documentId);
    
    const setPageRef = useCallback(
        (index: number, ref: HTMLDivElement | null) => {
            setPageRefs((prev) => {
                const newRefs = [...prev];
                newRefs[index] = ref;
                return newRefs;
            });
        },
        []
    );

    useEffect(() => {
        if (pageRefs.length > 0) {
            const observer = createIntersectionObserver(pageRefs);
            return () => observer.disconnect();
        }
    }, [pageRefs]);

    // Scroll to certain page then set the current page
    const scrollToPage = useCallback(
        (pageNumber: number) => {
            if (pageNumber < 0 || pageNumber > getPdfNumPages(documentId)) return;

            const pageRef = pageRefs[pageNumber];
            pageRef?.scrollIntoView({behavior: "smooth"});
            setCurrentPage(documentId, pageNumber);
        },
        [documentId, getPdfNumPages, pageRefs, setCurrentPage]
    );
    
    return {
        scrollToPage,
        setPageRef
    }
}