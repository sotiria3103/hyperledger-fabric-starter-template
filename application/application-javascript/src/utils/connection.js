const mongoose = require("mongoose");
const config = require("./config");

mongoose.Promise = global.Promise;

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
};

exports.dbConnection = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.db_uri, dbOptions, (error) => {
            if (error) reject({ ...error, message: "Unable to connect to database" })

            resolve("Connected to database successfully");
        });
    });
};