export type JWTTokenPayload = {
    email: string;
    id: string;
    name: string;
    avatar: string;
    role: string;
};

export type JWTRefreshTokenPayload = {
    id: string;
};
