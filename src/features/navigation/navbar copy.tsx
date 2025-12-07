
import { NavbarProvider } from "./navbar-provider";
import NavbarTitle from "./navbar-title";
import NavbarDocumentation from "./navbar-documentation";
import NavbarSettings from "./navbar-settings";

import NavbarSearch from "./navbar-search";
import NavbarButtons from "./navbar-buttons";

export function Navbar() {
  return (
   
  <NavbarProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4 justify-between">
          <NavbarTitle />
          <NavbarSearch />
          <NavbarButtons />
        </div>
      </header>
      <NavbarDocumentation />
      <NavbarSettings />
    </NavbarProvider>
    
  );
}
