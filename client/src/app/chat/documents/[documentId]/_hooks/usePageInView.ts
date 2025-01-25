import { usePDFStore } from '@/stores/pdfstore';

export const usePageInView = (documentId: string) => {
  const { setCurrentPage } = usePDFStore();

  const createIntersectionObserver = (pageRefs: (HTMLDivElement | null)[]) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNumber = Number(entry.target.getAttribute('data-page-number'));
            setCurrentPage(documentId, pageNumber);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the page is visible
      }
    );

    pageRefs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return observer;
  };

  return { createIntersectionObserver };
}; 