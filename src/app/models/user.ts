import {Permission} from "./permission";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  permissions: Permission[];
}
