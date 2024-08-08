export enum ENVIRONMENT_VAR {
    // Zalo
    ZALO_ZNS_URL = 'ZALO_ZNS_URL',
    ZALO_ZNS_TEMPLATE_REPORT_CREATED = 'ZALO_ZNS_TEMPLATE_REPORT_CREATED',
    ZALO_ZNS_REFRESH_TOKEN = 'ZALO_ZNS_REFRESH_TOKEN',
    ZALO_ZNS_ACCESS_TOKEN = 'ZALO_ZNS_ACCESS_TOKEN',
    SECRET_KEY_ZNS = 'SECRET_KEY_ZNS',
    APP_ID_ZNS = 'APP_ID_ZNS',
    ZALO_ACCESS_TOKEN_FROM_REFRESH_TOKEN_URL = 'ZALO_ACCESS_TOKEN_FROM_REFRESH_TOKEN_URL',
    ZALO_ZNS_OTP_TEMPLATE = 'ZALO_ZNS_OTP_TEMPLATE',

    // System
    VERSION = 'VERSION',
    WEB_URL = 'WEB_URL',

    // Discord
    DISCORD_ERROR_CHANNEL_WEBHOOK = 'DISCORD_ERROR_CHANNEL_WEBHOOK',
    DISCORD_UPDATE_ZALO_WEBHOOK = 'DISCORD_UPDATE_ZALO_WEBHOOK',

    // Email Sender
    EMAIL_SENDER = 'EMAIL_SENDER',
    TRANSPORT_SENDER = 'TRANSPORT_SENDER',
    FROM_SENDER = 'FROM_SENDER',

    // Super Admin
    SUPER_ADMIN_EMAIL = 'SUPER_ADMIN_EMAIL',

    // boolean
    BOOLEAN_ENABLE_ZALO_REPORT_CREATED = 'BOOLEAN_ENABLE_ZALO_REPORT_CREATED',

    // Sendgrid
    SENDGRID_OTP_TEMPLATE_ID = 'SENDGRID_OTP_TEMPLATE_ID',
    SENDGRID_API_KEY = 'SENDGRID_API_KEY',
}

export enum TOKEN_TYPE {
    OTP = 'OTP',
}