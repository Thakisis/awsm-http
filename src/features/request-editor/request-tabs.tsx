import { useWorkspaceStore } from "@/stores/workspace-store";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { HttpMethod } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-green-500",
  POST: "text-yellow-500",
  PUT: "text-blue-500",
  DELETE: "text-red-500",
  PATCH: "text-purple-500",
};

export function RequestTabs() {
  const openRequestIds = useWorkspaceStore((state) => state.openRequestIds);
  const activeRequestId = useWorkspaceStore((state) => state.activeRequestId);
  const nodes = useWorkspaceStore((state) => state.nodes);
  const setActiveRequest = useWorkspaceStore((state) => state.setActiveRequest);
  const closeTab = useWorkspaceStore((state) => state.closeTab);

  if (openRequestIds.length === 0) return null;

  return (
    <ScrollArea className="w-full border-b bg-muted/40 h-12 ">
      <div className="flex w-max min-w-full h-full">
        {openRequestIds.map((id) => {
          const node = nodes[id];
          if (!node || !node.data) return null;

          const isActive = id === activeRequestId;

          return (
            <div
              key={id}
              className={cn(
                "group flex w-[150px] cursor-pointer items-center justify-between border-r px-3 py-2 text-sm transition-colors hover:bg-background",
                isActive
                  ? "bg-background font-medium text-foreground border-t-2 border-t-primary"
                  : "text-muted-foreground"
              )}
              onClick={() => setActiveRequest(id)}
              onMouseDown={(e) => {
                if (e.button === 1) {
                  e.preventDefault();
                  closeTab(id);
                }
              }}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={cn(
                    "text-xs font-bold",
                    METHOD_COLORS[node.data.method]
                  )}
                >
                  {node.data.method}
                </span>
                <span className="truncate">{node.name}</span>
              </div>
              <button
                className={cn(
                  "ml-2 rounded-sm p-0.5 hover:bg-muted-foreground/20",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(id);
                }}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
