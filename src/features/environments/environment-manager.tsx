import { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, Trash2Icon, Settings2Icon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EnvironmentManager() {
  const environments = useWorkspaceStore((state) => state.environments);
  const activeEnvironmentId = useWorkspaceStore(
    (state) => state.activeEnvironmentId
  );
  const addEnvironment = useWorkspaceStore((state) => state.addEnvironment);
  const updateEnvironment = useWorkspaceStore(
    (state) => state.updateEnvironment
  );
  const deleteEnvironment = useWorkspaceStore(
    (state) => state.deleteEnvironment
  );
  const setActiveEnvironment = useWorkspaceStore(
    (state) => state.setActiveEnvironment
  );

  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);

  // If no environment is selected but we have environments, select the first one or the active one
  if (!selectedEnvId && environments.length > 0) {
    setSelectedEnvId(activeEnvironmentId || environments[0].id);
  }

  const selectedEnv = environments.find((e) => e.id === selectedEnvId);

  const handleAddVariable = () => {
    if (!selectedEnv) return;
    const newVars = [
      ...selectedEnv.variables,
      { id: uuidv4(), key: "", value: "", enabled: true },
    ];
    updateEnvironment(selectedEnv.id, selectedEnv.name, newVars);
  };

  const handleUpdateVariable = (id: string, field: string, value: any) => {
    if (!selectedEnv) return;
    const newVars = selectedEnv.variables.map((v) =>
      v.id === id ? { ...v, [field]: value } : v
    );
    updateEnvironment(selectedEnv.id, selectedEnv.name, newVars);
  };

  const handleDeleteVariable = (id: string) => {
    if (!selectedEnv) return;
    const newVars = selectedEnv.variables.filter((v) => v.id !== id);
    updateEnvironment(selectedEnv.id, selectedEnv.name, newVars);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[85vh] h-full w-full sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Manage Environments</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 gap-4 min-h-0">
          {/* Sidebar: List of Environments */}
          <div className="border-r pr-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2 gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Environments
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addEnvironment("New Environment")}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1">
                {environments.map((env) => (
                  <div
                    key={env.id}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm cursor-pointer ${
                      selectedEnvId === env.id
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedEnvId(env.id)}
                  >
                    <span className="truncate">{env.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEnvironment(env.id);
                        if (selectedEnvId === env.id) {
                          setSelectedEnvId(null);
                        }
                      }}
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content: Variables Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            {selectedEnv ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <Input
                    value={selectedEnv.name}
                    onChange={(e) =>
                      updateEnvironment(
                        selectedEnv.id,
                        e.target.value,
                        selectedEnv.variables
                      )
                    }
                    className="max-w-xs font-semibold"
                  />
                </div>
                <div className="flex-1 border rounded-md overflow-hidden flex flex-col">
                  <div className="bg-muted/50 border-b px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      Variables
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddVariable}
                      className="h-6 text-xs"
                    >
                      <PlusIcon className="h-3 w-3 mr-1" /> Add Variable
                    </Button>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30px]"></TableHead>
                            <TableHead>Variable</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedEnv.variables.map((variable) => (
                            <TableRow key={variable.id}>
                              <TableCell>
                                <Checkbox
                                  checked={variable.enabled}
                                  onCheckedChange={(c) =>
                                    handleUpdateVariable(
                                      variable.id,
                                      "enabled",
                                      c
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={variable.key}
                                  onChange={(e) =>
                                    handleUpdateVariable(
                                      variable.id,
                                      "key",
                                      e.target.value
                                    )
                                  }
                                  className="h-8 font-mono text-xs"
                                  placeholder="VARIABLE_NAME"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={variable.value}
                                  onChange={(e) =>
                                    handleUpdateVariable(
                                      variable.id,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  className="h-8 font-mono text-xs"
                                  placeholder="Value"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    handleDeleteVariable(variable.id)
                                  }
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select an environment to edit
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
