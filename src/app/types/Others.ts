export type Message = {
  text: string;
  type: MessageType | null;
};

export enum MessageType {
  SUCCESS,
  FAILURE,
}
