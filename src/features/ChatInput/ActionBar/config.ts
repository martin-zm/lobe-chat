import STT from '../STT';
import Clear from './Clear';
import History from './History';
import Knowledge from './Knowledge';
import ModelSwitch from './ModelSwitch';
import Temperature from './Temperature';
import { MainToken, PortalToken } from './Token';
import Tools from './Tools';
import Upload from './Upload';
import RagFile from "./RagFile";

export const actionMap = {
  clear: Clear,
  fileUpload: Upload,
  history: History,
  knowledgeBase: Knowledge,
  mainToken: MainToken,
  model: ModelSwitch,
  portalToken: PortalToken,
  ragFile: RagFile,
  stt: STT,
  temperature: Temperature,
  tools: Tools,
} as const;

export type ActionKeys = keyof typeof actionMap;
