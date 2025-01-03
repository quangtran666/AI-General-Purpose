import { MathUtils } from "@/lib/math.utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface PDFInfo {
  currentPage: number;
  numPages: number;
}

interface PDFState {
  zoomLevel: Record<string, number>;
  pdfInfo: Record<string, PDFInfo>;
  setZoomLevel: (documentId: string, zoomLevel: number) => void;
  getZoomLevel: (documentId: string) => number;
  resetZoomLevel: (documentId: string) => void;
  setPdfNumPages: (documentId: string, numPages: number) => void;
  getPdfNumPages: (documentId: string) => number;
  setCurrentPage: (documentId: string, currentPage: number) => void;
  getCurrentPage: (documentId: string) => number;
}

const DEFAULT_ZOOM = 0.7;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.2;

export const usePDFStore = create(
  devtools(
    immer<PDFState>((set, get) => ({
      zoomLevel: {},
      pdfInfo: {},
      setZoomLevel: (documentId, zoomLevel) => {
        set((state) => {
          state.zoomLevel[documentId] = MathUtils.clamp(
            zoomLevel,
            MIN_ZOOM,
            MAX_ZOOM
          );
        });
      },
      getZoomLevel: (documentId) => {
        return get().zoomLevel[documentId] || DEFAULT_ZOOM
      },
      resetZoomLevel: (documentId) => {
        set((state) => {
            state.zoomLevel[documentId] = DEFAULT_ZOOM
        })
      },
      setPdfNumPages: (documentId, numPages) => {
        set((state) => {
          state.pdfInfo[documentId] = { numPages, currentPage: 0 };
        })
      },
      getPdfNumPages: (documentId) => {
        return get().pdfInfo[documentId]?.numPages || 0;
      },
      setCurrentPage: (documentId, currentPage) => {
        set((state) => {
          if (state.pdfInfo[documentId]) {
            state.pdfInfo[documentId].currentPage = Math.min(Math.abs(currentPage), state.pdfInfo[documentId].numPages);
          }
          console.log(state.pdfInfo[documentId].numPages)
        })
      },
      getCurrentPage: (documentId) => {
        return get().pdfInfo[documentId]?.currentPage || 0;
      }
    })),
    { name: "PdfsState", store: "PdfsState"}
  )
);
