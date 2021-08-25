import internal from "stream";

export default interface IStoreRequest extends Request {
  Token: string;
  storeId: string;
  userId: number;
}
