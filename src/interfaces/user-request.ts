export default interface IUserRequest extends Request {
  accessToken: string;
  userId: number;
}
