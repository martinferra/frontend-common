export interface User {
  _id: string;
  email: string;
  fullname: string;
  createdAt: string;
  roles: string[];
  isAdmin: boolean;
}
