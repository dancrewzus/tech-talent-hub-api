export interface LoginResponse {
  token: string;
  user: {
    permission: string;
    id: any;
    email: string;
    fullname: string;
    name: string;
    surname: string;
    profilePicture: string;
    isLogged: boolean;
    gender: string;
    phoneNumber: string;
    role: string;
  };
}