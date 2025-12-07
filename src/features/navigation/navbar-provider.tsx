// providers/NavbarProvider.tsx
import { createContext, useContext, useRef, ReactNode } from 'react'
import { useStore } from 'zustand'
import { createNavbarStore, NavbarStore, NavbarState } from './navbar-store'

// creamos un contexto para el store
const NavbarContext = createContext<NavbarStore | null>(null)


interface NavbarProviderProps {
  children: ReactNode
  initialState?: Partial<NavbarState>
}


export function NavbarProvider({ children, initialState }: NavbarProviderProps) {
  const storeRef = useRef<NavbarStore | null>(null)
  
  if (!storeRef.current) {
    storeRef.current = createNavbarStore(initialState)
  }
  
  return (
    <NavbarContext.Provider value={storeRef.current}>
      {children}
    </NavbarContext.Provider>
  )
}

// Hook para usar la store dentro del contexto
export function useNavbarStore<T>(
  selector: (state: NavbarState) => T
): T {
  const store = useContext(NavbarContext)
  
  if (!store) {
    throw new Error('Store no encontrado asegurse de que este usando navbar provider') 
  }
  
  return useStore(store, selector)
}