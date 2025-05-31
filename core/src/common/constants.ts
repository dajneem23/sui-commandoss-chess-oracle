export const jwtConstants = Object.freeze({
  secret: process.env.JWT_SECRET!
})
export const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    MEMBER: 'member',
    BOT: 'bot',
} as const;

export const USER_STATUSES = {
    ACTIVATED: 'activated',
    DEACTIVATED: 'deactivated',
    BANNED: 'banned',
} as const;
