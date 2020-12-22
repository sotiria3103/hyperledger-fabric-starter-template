const path = require("path");
const fs = require("fs");

class Logger {
    get accessStreamer() {
        const logDirectoryPath = path.join(__dirname, "..", "logs");
        const logFilePath = path.join(logDirectoryPath, "access.log");
        console.log({ logDirectoryPath, logFilePath });
        if (!fs.existsSync(logDirectoryPath)) fs.mkdirSync(logDirectoryPath);

        return fs.createWriteStream(path.join(logFilePath), { flags: "a" })
    }
}

module.exports = Logger