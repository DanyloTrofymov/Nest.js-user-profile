export interface IUserId {
  id: string;
}

export interface IUserUsername {
  username: string;
}
export interface IUserUpdate {
  id: string;
  username: string;
  email: string;
}

export interface IUser {
  id?: string;
  username?: string;
  isActive?: boolean;
  token?: string;
}
