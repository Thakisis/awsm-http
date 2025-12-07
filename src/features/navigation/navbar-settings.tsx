import { CommandPalette } from "@/features/command-palette/command-palette";
import { SettingsDialog } from "@/features/settings/settings-dialog";
import { useNavbarStore } from "./navbar-provider";

function NavbarSettings() {
    
    const {setOpenSettings,setOpenCommand }= useNavbarStore((state) => state.actions)
    const openCommand = useNavbarStore((state) => state.openCommand)
    const openSettings = useNavbarStore((state) => state.openSettings)
    console.log("openSettings",openSettings)
    
    return (
        <>
        <CommandPalette
        open={openCommand}
        onOpenChange={setOpenCommand}
        onOpenSettings={() => setOpenSettings(true)}
      />

      <SettingsDialog open={openSettings} onOpenChange={setOpenSettings} />
            
        </>
    );
}

export default NavbarSettings;