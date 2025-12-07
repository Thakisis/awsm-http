import { Button } from "@/components/ui/button";
import { SettingsIcon, BoxIcon, BookIcon } from "lucide-react";
import { ImportExportDialog } from "@/features/workspace/import-export-dialog";
import ServerMock from "../server/server-mock";
import { useNavbarStore } from "./navbar-provider";

function NavbarButtons() {
    const {setOpenSettings,setOpenDocumentation }= useNavbarStore((state) => state.actions)
    const openSettings = useNavbarStore((state) => state.openSettings)
    console.log("openSettings",openSettings)
    return (
         <div className="flex items-center gap-2">
            <ImportExportDialog>
              <Button size={"sm"}>
                <BoxIcon size={18} />
                Import/Export
              </Button>
            </ImportExportDialog>
            <ServerMock />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpenDocumentation(true)}
            >
              <BookIcon size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenSettings(true)}
            >
              <SettingsIcon size={18} />
            </Button>
          </div>
    );
}

export default NavbarButtons;