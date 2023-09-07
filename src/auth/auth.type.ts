export interface IUserSignUp {
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
export interface IUserSignIn {
  username: string;
  password: string;
}

export interface IUserRestorePassword {
  id: string;
  token: string;
  password: string;
  repeatPassword: string;
}
