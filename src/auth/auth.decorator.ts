import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../enum/roles';

export const Roles = (...roles: ROLES[]) => SetMetadata('roles', roles);
