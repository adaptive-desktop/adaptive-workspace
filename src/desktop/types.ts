import { WorkspaceSnapshot } from '../workspace';

export interface DesktopSnapshot {
  id: string;
  name: string;
  bottomDrawer: { enabled: boolean };
  leftSidebar: { enabled: boolean };
  rightSidebar: { enabled: boolean };
  topBar: { enabled: boolean };
  workspace: WorkspaceSnapshot[];
}
