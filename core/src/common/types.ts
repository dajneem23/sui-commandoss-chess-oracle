import { USER_ROLES, USER_STATUSES } from './constants';

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export type ClientData = AccessTokenSignPayload & {
    iat: number;
    exp: number;
};

export type AccessTokenSignPayload = {
    sub: string;
    id: string;
    role: UserRole;
    organizationId?: string;
};
