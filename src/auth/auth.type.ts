export interface IUserId {
  id: string;
}

export interface IUserUsername {
  username: string;
}

export interface IUserSignup {
  username: string;
  password: string;
  email: string;
  repeatPassword: string;
}

export interface IUserChangePassword {
  id: string;
  oldPassword: string;
  password: string;
  repeatPassword: string;
}
export interface IUserUpdate {
  id: string;
  username: string;
  email: string;
}
export interface IUserLogin {
  username: string;
  password: string;
}

export interface IUser {
  id?: string;
  username?: string;
  isActive?: boolean;
  token?: string;
}

export interface IUserRestorePassword {
  id: string;
  token: string;
  password: string;
  repeatPassword: string;
}
