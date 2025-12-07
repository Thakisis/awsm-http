
import { DocumentationDialog } from "@/features/documentation/documentation-dialog";
import { useNavbarStore } from "./navbar-provider";
function NavbarDocumentation() {
    const {setOpenDocumentation }= useNavbarStore((state) => state.actions)
    const openDocumentation = useNavbarStore((state) => state.openDocumentation)
    return (
          <DocumentationDialog
        open={openDocumentation}
        onOpenChange={setOpenDocumentation}
      />
    );
}

export default NavbarDocumentation;