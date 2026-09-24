import { UserRole } from '@portfolio/shared';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  username: string;
};
