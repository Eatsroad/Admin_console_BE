import internal from "stream";

export default interface IStoreRequest extends Request {
  accessToken: string;
  storeId: number;
  user_id;
}
