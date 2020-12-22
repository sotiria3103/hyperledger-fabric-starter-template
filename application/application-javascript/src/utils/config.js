const { config: configuration } = require("dotenv");

configuration();

module.exports = {
    port: process.env.PORT || 8888,
    db_uri: process.env.DB_URI || "mongodb://localhost:27017/trapeze"
}