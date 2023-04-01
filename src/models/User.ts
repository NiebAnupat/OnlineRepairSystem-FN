export default interface User {
  user_id?: string;
  username?: string;
  avatar?: Buffer;
  user_role?: string;
  changeAt?: Date;
}

export interface UserSignInResponse {
  token: string;
}
