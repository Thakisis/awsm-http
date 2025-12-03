import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  TreeNode,
  NodeType,
  RequestData,
  ResponseData,
  WorkspaceState,
} from "../types";

interface WorkspaceActions {
  addNode: (parentId: string | null, type: NodeType, name: string) => string;
  deleteNode: (id: string) => void;
  updateNodeName: (id: string, name: string) => void;
  updateRequestData: (id: string, data: Partial<RequestData>) => void;
  toggleExpand: (id: string) => void;
  setActiveRequest: (id: string | null) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
  setResponse: (requestId: string, response: ResponseData) => void;
  initializeMockData: () => void;
  importWorkspace: (data: {
    nodes: Record<string, TreeNode>;
    rootIds: string[];
  }) => void;
}

const DEFAULT_REQUEST_DATA: RequestData = {
  url: "",
  method: "POST",
  params: [],
  headers: [
    {
      id: uuidv4(),
      key: "Content-Type",
      value: "application/json",
      enabled: true,
    },
  ],
  auth: { type: "none" },
  body: {
    type: "json",
    content: '{\n  "key": "value"\n}',
    formData: [],
    formUrlEncoded: [],
  },
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceActions>()(
  persist(
    (set, get) => ({
      nodes: {},
      rootIds: [],
      activeRequestId: null,
      openRequestIds: [],
      responses: {},

      addNode: (parentId, type, name) => {
        const id = uuidv4();
        const newNode: TreeNode = {
          id,
          parentId,
          name,
          type,
          children: type !== "request" ? [] : undefined,
          isExpanded: true,
          data: type === "request" ? { ...DEFAULT_REQUEST_DATA } : undefined,
        };

        set((state) => {
          const newNodes = { ...state.nodes, [id]: newNode };
          let newRootIds = [...state.rootIds];

          if (parentId) {
            // IMPORTANT: We must use state.nodes[parentId] to get the current parent state
            // NOT newNodes[parentId] because newNodes is just a shallow copy of the map so far
            const parent = state.nodes[parentId];
            if (parent) {
              newNodes[parentId] = {
                ...parent,
                children: parent.children ? [...parent.children, id] : [id],
                isExpanded: true, // Force expand
              };
            }
          } else {
            newRootIds.push(id);
          }

          return { nodes: newNodes, rootIds: newRootIds };
        });

        return id;
      },

      deleteNode: (id) => {
        set((state) => {
          const nodeToDelete = state.nodes[id];
          if (!nodeToDelete) return state;

          // 1. Identify all IDs to delete (target + descendants)
          const idsToDelete = new Set<string>();
          const markForDeletion = (nodeId: string) => {
            idsToDelete.add(nodeId);
            const node = state.nodes[nodeId];
            if (node && node.children) {
              node.children.forEach(markForDeletion);
            }
          };
          markForDeletion(id);

          // 2. Create new nodes object excluding deleted ones
          const newNodes: Record<string, TreeNode> = {};
          Object.keys(state.nodes).forEach((key) => {
            if (!idsToDelete.has(key)) {
              newNodes[key] = state.nodes[key];
            }
          });

          // 3. Update parent's children list
          let newRootIds = [...state.rootIds];
          if (nodeToDelete.parentId) {
            // Check if parent still exists (it should, unless we are deleting root)
            // Use newNodes to get the parent because we want to keep other changes if any
            // But wait, parent is NOT in idsToDelete, so it is in newNodes.
            const parent = newNodes[nodeToDelete.parentId];
            if (parent) {
              newNodes[nodeToDelete.parentId] = {
                ...parent,
                children: parent.children
                  ? parent.children.filter((childId) => childId !== id)
                  : [],
              };
            }
          } else {
            newRootIds = newRootIds.filter((rootId) => rootId !== id);
          }

          // 4. Update active request and open tabs
          // Only deselect if the active request is actually being deleted
          let newActiveRequestId = state.activeRequestId;
          let newOpenRequestIds = [...state.openRequestIds];

          // Remove deleted nodes from open tabs
          newOpenRequestIds = newOpenRequestIds.filter(
            (id) => !idsToDelete.has(id)
          );

          if (newActiveRequestId && idsToDelete.has(newActiveRequestId)) {
            // If active request is deleted, try to switch to another open tab
            newActiveRequestId =
              newOpenRequestIds.length > 0
                ? newOpenRequestIds[newOpenRequestIds.length - 1]
                : null;
          }

          return {
            nodes: newNodes,
            rootIds: newRootIds,
            activeRequestId: newActiveRequestId,
            openRequestIds: newOpenRequestIds,
          };
        });
      },

      updateNodeName: (id, name) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], name },
          },
        }));
      },

      updateRequestData: (id, data) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node || node.type !== "request" || !node.data) return state;

          return {
            nodes: {
              ...state.nodes,
              [id]: {
                ...node,
                data: { ...node.data, ...data },
              },
            },
          };
        });
      },

      toggleExpand: (id) => {
        set((state) => {
          const node = state.nodes[id];
          if (!node) return state;
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, isExpanded: !node.isExpanded },
            },
          };
        });
      },

      setActiveRequest: (id) => {
        set((state) => {
          if (!id) return { activeRequestId: null };

          const newOpenRequestIds = [...state.openRequestIds];
          if (!newOpenRequestIds.includes(id)) {
            newOpenRequestIds.push(id);
          }

          return {
            activeRequestId: id,
            openRequestIds: newOpenRequestIds,
          };
        });
      },

      closeTab: (id) => {
        set((state) => {
          const newOpenRequestIds = state.openRequestIds.filter(
            (tabId) => tabId !== id
          );
          let newActiveRequestId = state.activeRequestId;

          if (state.activeRequestId === id) {
            // If closing the active tab, switch to the next available one (or previous)
            // Logic: try to go to the one to the right, if not, the one to the left
            // Actually, standard browser behavior is usually to go to the right, unless it was the last one, then left.
            // But simpler logic: just pick the last one in the new list for now, or maintain index.
            // Let's try to be smart: find index of closed tab
            const closedIndex = state.openRequestIds.indexOf(id);

            if (newOpenRequestIds.length === 0) {
              newActiveRequestId = null;
            } else if (closedIndex >= newOpenRequestIds.length) {
              // It was the last one, so pick the new last one
              newActiveRequestId =
                newOpenRequestIds[newOpenRequestIds.length - 1];
            } else {
              // Pick the one that is now at the same index (which was to the right)
              newActiveRequestId = newOpenRequestIds[closedIndex];
            }
          }

          return {
            openRequestIds: newOpenRequestIds,
            activeRequestId: newActiveRequestId,
          };
        });
      },

      closeOtherTabs: (id) => {
        set((state) => {
          if (!state.openRequestIds.includes(id)) return state;
          return {
            openRequestIds: [id],
            activeRequestId: id,
          };
        });
      },

      closeAllTabs: () => {
        set({
          openRequestIds: [],
          activeRequestId: null,
        });
      },

      setResponse: (requestId, response) => {
        set((state) => ({
          responses: {
            ...state.responses,
            [requestId]: response,
          },
        }));
      },

      importWorkspace: (data) => {
        set({
          nodes: data.nodes,
          rootIds: data.rootIds,
          activeRequestId: null,
          openRequestIds: [],
          responses: {},
        });
      },

      initializeMockData: () => {
        const { nodes } = get();
        if (Object.keys(nodes).length > 0) return;

        const { addNode } = get();

        // Clear existing
        set({
          nodes: {},
          rootIds: [],
          activeRequestId: null,
          openRequestIds: [],
          responses: {},
        });

        const wsId = addNode(null, "workspace", "My Workspace");

        const authFolderId = addNode(wsId, "collection", "Auth");
        const loginReqId = addNode(authFolderId, "request", "Login User");
        get().updateRequestData(loginReqId, {
          url: "https://jsonplaceholder.typicode.com/posts",
          method: "POST",
          body: {
            type: "json",
            content:
              '{\n  "username": "admin",\n  "password": "password123"\n}',
          },
        });

        const usersFolderId = addNode(wsId, "collection", "Users");
        const listUsersId = addNode(usersFolderId, "request", "List Users");
        get().updateRequestData(listUsersId, {
          url: "https://jsonplaceholder.typicode.com/users",
          method: "GET",
          body: { type: "none", content: "" },
        });

        const createUserReqId = addNode(
          usersFolderId,
          "request",
          "Create User"
        );
        get().updateRequestData(createUserReqId, {
          url: "https://jsonplaceholder.typicode.com/users",
          method: "POST",
          body: {
            type: "json",
            content:
              '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}',
          },
        });
      },
    }),
    {
      name: "workspace-storage",
      partialize: (state) => ({
        nodes: state.nodes,
        rootIds: state.rootIds,
        activeRequestId: state.activeRequestId,
        openRequestIds: state.openRequestIds,
      }),
    }
  )
);
