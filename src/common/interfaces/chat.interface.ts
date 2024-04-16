export interface NewMessage {
  message: string;
  clientNumber: string;
}

export interface MessageData {
  message: string;
  from: string;
  clientNumber: string;
  threadId: string;
  tokens: number;
  createdAt: string;
}

export interface CreateAssistant {
  name: string;
  description: string;
  instructions: string;
  tools?: any[];
  model: string;
}

export interface InsertMessage {
  content: string;
}