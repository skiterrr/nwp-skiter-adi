import { Permission } from "./permission";

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  permissions: Permission[];
}
