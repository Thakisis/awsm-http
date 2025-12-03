import React, { useState } from "react";
import { NodeType } from "@/types";
import { useWorkspaceStore } from "@/stores/workspace-store";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  FileJsonIcon,
  MoreHorizontalIcon,
  FolderPlusIcon,
  FilePlusIcon,
  Trash2Icon,
  Edit2Icon,
  BoxIcon,
  PlugIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface SidebarItemProps {
  nodeId: string;
  level?: number;
}

export function SidebarItem({ nodeId, level = 0 }: SidebarItemProps) {
  const node = useWorkspaceStore((state) => state.nodes[nodeId]);
  const activeRequestId = useWorkspaceStore((state) => state.activeRequestId);
  const {
    toggleExpand,
    setActiveRequest,
    addNode,
    deleteNode,
    updateNodeName,
  } = useWorkspaceStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node?.name || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: nodeId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!node) return null;

  const isExpanded = node.isExpanded;
  const isActive = activeRequestId === nodeId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === "request" || node.type === "websocket") {
      setActiveRequest(nodeId);
    } else {
      toggleExpand(nodeId);
    }
  };

  const handleCreate = (type: NodeType) => {
    addNode(
      nodeId,
      type,
      type === "collection"
        ? "New Folder"
        : type === "request"
        ? "New Request"
        : "New WebSocket"
    );
    // No need to toggleExpand here, addNode handles it
  };

  const handleRename = () => {
    setEditName(node.name);
    setIsEditing(true);
  };

  const submitRename = () => {
    if (editName.trim()) {
      updateNodeName(nodeId, editName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submitRename();
    if (e.key === "Escape") setIsEditing(false);
  };

  const Icon =
    node.type === "workspace"
      ? BoxIcon
      : node.type === "collection"
      ? FolderIcon
      : node.type === "websocket"
      ? PlugIcon
      : FileJsonIcon;

  return (
    <div ref={setNodeRef} style={style}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "group flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-accent/50 text-sm select-none",
              isActive && "bg-accent text-accent-foreground font-medium"
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={handleClick}
            {...attributes}
            {...listeners}
          >
            <div className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground">
              {node.type !== "request" &&
                node.type !== "websocket" &&
                (isExpanded ? (
                  <ChevronDownIcon size={14} />
                ) : (
                  <ChevronRightIcon size={14} />
                ))}
            </div>

            <Icon
              size={16}
              className={cn(
                "shrink-0",
                node.type === "request"
                  ? "text-blue-500"
                  : node.type === "websocket"
                  ? "text-purple-500"
                  : "text-yellow-500"
              )}
            />

            {isEditing ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={submitRename}
                onKeyDown={handleKeyDown}
                className="h-6 text-xs py-0 px-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate flex-1">{node.name}</span>
            )}

            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-1 hover:bg-background rounded-sm">
                    <MoreHorizontalIcon size={14} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {node.type !== "request" && node.type !== "websocket" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleCreate("collection")}
                      >
                        <FolderPlusIcon />
                        New Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreate("request")}>
                        <FilePlusIcon />
                        New Request
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCreate("websocket")}
                      >
                        <PlugIcon />
                        New WebSocket
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleRename}>
                    <Edit2Icon />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteNode(nodeId)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2Icon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {node.type !== "request" && node.type !== "websocket" && (
            <>
              <ContextMenuItem onClick={() => handleCreate("collection")}>
                <FolderPlusIcon />
                New Folder
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCreate("request")}>
                <FilePlusIcon />
                New Request
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCreate("websocket")}>
                <PlugIcon />
                New WebSocket
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onClick={handleRename}>
            <Edit2Icon />
            Rename
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => deleteNode(nodeId)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2Icon />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && node.children && (
        <div>
          <SortableContext
            items={node.children}
            strategy={verticalListSortingStrategy}
          >
            {node.children.map((childId) => (
              <SidebarItem key={childId} nodeId={childId} level={level + 1} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}
