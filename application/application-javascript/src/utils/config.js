const { config: configuration } = require("dotenv");

configuration();

const env = process.env.NODE_ENV || "development";

const configurations = {
    base: {
        env,
        name: process.env.APP_NAME || "hyperledger-fabric-template",
        host: process.env.APP_HOST || "127.0.0.1",
        port: process.env.APP_PORT || 8080,
    },
    production: {
        host: process.env.PRODUCTION_HOST || "http://127.0.0.1",
        port: process.env.PRODUCTION_PORT || 80,
        database_uri: process.env.PRODUCTION_DATABASE_STRING || "mongodb://localhost:27017/hyperledger-fabric-template",
    },
    development: {
        host: process.env.DEVELOPMENT_HOST || "http://127.0.0.1",
        port: process.env.DEVELOPMENT_PORT || 8080,
        database_uri: process.env.DEVELOPMENT_DATABASE_STRING || "mongodb://localhost:27017/hyperledger-fabric-template",
    },
};

module.exports = Object.assign(
    configurations.base,
    env === "development"
        ? { ...configurations.development }
        : { ...configurations.production }
);