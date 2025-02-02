import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";

interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
}

export const useSidebarStore = create(
    devtools(
        immer<SidebarState>((set) => ({
            isOpen: true,
            toggle: () => set((state) => {
                state.isOpen = !state.isOpen;
            })
        })),
        { name: "SidebarState" }
    )
)