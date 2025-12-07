// stores/navbarStore.ts
import { createStore } from "zustand/vanilla";

// Define el tipo de tu estado
export interface NavbarState {
	openCommand: boolean;
	openSettings: boolean;
	openDocumentation: boolean;
	actions: {
		setOpenCommand: (open: boolean) => void;
		setOpenSettings: (open: boolean) => void;
		setOpenDocumentation: (open: boolean) => void;
		toggleCommand: () => void;
		toggleSettings: () => void;
		toggleDocumentation: () => void;
		closeAll: () => void;
	};
}

export const createNavbarStore = (initialState?: Partial<NavbarState>) => {
	return createStore<NavbarState>((set) => ({
		openCommand: initialState?.openCommand ?? false,
		openSettings: initialState?.openSettings ?? false,
		openDocumentation: initialState?.openDocumentation ?? false,
		actions: {
			setOpenCommand: (open) => set({ openCommand: open }),
			setOpenSettings: (open) => set({ openSettings: open }),
			setOpenDocumentation: (open) => set({ openDocumentation: open }),
			toggleCommand: () =>
				set((state) => ({ openCommand: !state.openCommand })),
			toggleSettings: () =>
				set((state) => ({ openSettings: !state.openSettings })),
			toggleDocumentation: () =>
				set((state) => ({ openDocumentation: !state.openDocumentation })),
			closeAll: () =>
				set({
					openCommand: false,
					openSettings: false,
					openDocumentation: false,
				}),
		},
	}));
};

export type NavbarStore = ReturnType<typeof createNavbarStore>;
