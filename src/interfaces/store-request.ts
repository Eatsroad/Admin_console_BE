import internal from "stream";

export default interface IStoreRequest extends Request {
  accessToken: string;
  storeId: number;
  userId: number;
}
