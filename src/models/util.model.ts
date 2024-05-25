
export enum MessageTypes {
    ERROR="error",
    SUCCESS="success"
}

export interface Message {
    type: MessageTypes,
    message: string
}