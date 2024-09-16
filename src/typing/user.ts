export type UserResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
  }
};