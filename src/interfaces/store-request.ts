import internal from "stream";

export default interface IStoreRequest extends Request {
  accessToken: string;
  storeId: string;
  userId: number;
}
