import { WorkspaceContextSnapshot } from "../workspace";

export interface DesktopSnapshot {
  id: string;
  name: string;
  workspaceContexts: WorkspaceContextSnapshot[];
}