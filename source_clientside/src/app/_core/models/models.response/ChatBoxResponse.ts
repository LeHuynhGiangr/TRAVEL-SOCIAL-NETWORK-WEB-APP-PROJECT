import { MessageUnit } from "./MessageUnit";

export interface ChatBoxResponse {
    chatBoxId: string,
    memberMetadataJson?: string,
    chatContentJson: any[],
}