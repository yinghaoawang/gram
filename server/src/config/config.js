const env = process.env.NODE_ENV ?? 'dev';

const config = {
    dev: {
        db: {
            host: process.env.PGHOST ?? 'localhost',
            port: process.env.PGPORT ?? 5432,
            database: process.env.PGDATABASE ?? 'gram',
            user: process.env.PGUSER ?? 'postgres',
            password: process.env.PGPASSWORD ?? 'password'
        },
        jwt: {
            secret:  process.env.SECRET ?? 'secretAccessToken!@#.'
        },
        session: {
            secret: process.env.SESSION_SECRET ?? 'superSessionToken^$%*'
        }
    }
};
module.exports = config[env];
