
import {  SearchIcon } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "./navbar-provider";
function NavbarSearch() {
    const {setOpenCommand} = useNavbarStore ((state) => state.actions)
    return (
          <div className="flex items-center justify-center ">
            <Button
              variant="outline"
              className="lg:w-96 text-muted-foreground text-sm font-normal justify-between items-center"
              onClick={() => setOpenCommand(true)}
            >
              <span className="flex gap-2 items-center">
                <SearchIcon size={14} />
                Search...
              </span>
              <KbdGroup className="items-center">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
          </div>
    );
}

export default NavbarSearch;