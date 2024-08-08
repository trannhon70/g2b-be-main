export default () => ({
    postgres: {
        DB_HOST: process.env.DB_HOST || '',
        DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
        USERNAME: process.env.USERNAME || '',
        PASSWORD: process.env.PASSWORD || '',
        DATABASE: process.env.DATABASE || '',
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectURI: process.env.GOOGLE_REDIRECT_URI || '',
    },
    jwt: {
        secretKey: process.env.SECRET_KEY || '',
        refreshTokenExpiredTime:
            process.env.REFRESH_TOKEN_EXPIRED_TIME || '365d',
        expiredTime: process.env.TOKEN_EXPIRED_TIME || '2d',
    },
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY || '',
    },
});
