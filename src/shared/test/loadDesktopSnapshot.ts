import fs from 'fs';
import path from 'path';
import { WorkspaceSnapshot } from '../../workspace/types';

/**
 * Loads the desktop snapshot JSON and returns it as a WorkspaceSnapshot object.
 * @returns {WorkspaceSnapshot}
 */
export function loadDesktopSnapshot(): WorkspaceSnapshot {
  const filePath = path.resolve(__dirname, './desktop-snapshot.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as WorkspaceSnapshot;
}
