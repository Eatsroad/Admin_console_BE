export default interface IUserRequest extends Request {
  Token: string;
  userId: number;
}
