import { useWorkspaceStore } from "@/stores/workspace-store";
import { SidebarItem } from "./sidebar-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusIcon,
  FolderPlusIcon,
  FilePlusIcon,
  PlugIcon,
  BoxIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EnvironmentSelector } from "../environments/environment-selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistorySidebar } from "./history-sidebar";
import { TestResultsSidebar } from "./test-results-sidebar";
import { HistoryIcon, FolderIcon, BeakerIcon } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function Sidebar() {
  const rootIds = useWorkspaceStore((state) => state.rootIds);
  const nodes = useWorkspaceStore((state) => state.nodes);
  const addNode = useWorkspaceStore((state) => state.addNode);
  const moveNode = useWorkspaceStore((state) => state.moveNode);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeNode = nodes[activeId];
    const overNode = nodes[overId];

    if (!activeNode || !overNode) return;

    // If dropping over a collection/folder or workspace, move INTO it
    if (
      (overNode.type === "collection" || overNode.type === "workspace") &&
      activeId !== overId
    ) {
      // Prevent workspace from being moved into anything
      if (activeNode.type === "workspace") {
        // Fall through to sibling reordering (only allowed if target is root)
      } else {
        const newParentId = overId;
        const newIndex = overNode.children ? overNode.children.length : 0;
        moveNode(activeId, newParentId, newIndex);
        return;
      }
    }

    // Moving relative to overNode (sibling)
    const newParentId = overNode.parentId;

    // Constraint: Workspaces cannot be moved into a non-root parent
    if (activeNode.type === "workspace" && newParentId) {
      return;
    }

    let newIndex = 0;

    if (newParentId) {
      const parent = nodes[newParentId];
      if (parent && parent.children) {
        newIndex = parent.children.indexOf(overId);
      }
    } else {
      newIndex = rootIds.indexOf(overId);
    }

    moveNode(activeId, newParentId, newIndex);
  };

  const handleCreateRoot = (
    type: "workspace" | "collection" | "request" | "websocket"
  ) => {
    addNode(
      null,
      type,
      type === "workspace"
        ? "New Workspace"
        : type === "collection"
        ? "New Folder"
        : type === "request"
        ? "New Request"
        : "New WebSocket"
    );
  };

  return (
    <div className="h-full border-r flex flex-col">
      <div className="p-[5.5px] border-b bg-muted/40">
        <EnvironmentSelector />
      </div>

      <Tabs defaultValue="explorer" className="flex-1 flex flex-col min-h-0">
        <div className="px-2 pt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="explorer" className="text-xs px-0">
              <FolderIcon className="size-3 " /> Explorer
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs px-0">
              <HistoryIcon className="size-3" /> History
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs px-0">
              <BeakerIcon className="size-3 " /> Tests
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="explorer"
          className="flex-1 flex flex-col min-h-0 m-0 "
        >
          <div className="px-2 flex items-center justify-between group">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Collections
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCreateRoot("workspace")}>
                  <BoxIcon /> New Workspace
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCreateRoot("collection")}
                >
                  <FolderPlusIcon /> New Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateRoot("request")}>
                  <FilePlusIcon /> New Request
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateRoot("websocket")}>
                  <PlugIcon /> New WebSocket
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ContextMenu>
            <ContextMenuTrigger className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <div className=" min-h-full">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={rootIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {rootIds.map((id) => (
                        <SidebarItem key={id} nodeId={id} level={0} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </ScrollArea>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleCreateRoot("workspace")}>
                <BoxIcon /> New Workspace
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCreateRoot("collection")}>
                <FolderPlusIcon /> New Folder
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCreateRoot("request")}>
                <FilePlusIcon /> New Request
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCreateRoot("websocket")}>
                <PlugIcon /> New WebSocket
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </TabsContent>

        <TabsContent value="history" className="flex-1 min-h-0">
          <HistorySidebar />
        </TabsContent>

        <TabsContent value="tests" className="flex-1 min-h-0">
          <TestResultsSidebar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
