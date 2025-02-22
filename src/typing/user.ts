export type UserResponse = {
  accessToken: string;
  user: {
    userId: string;
    email: string;
  }
};