const path = require("path");
const fs = require("fs");

class Logger {
    get accessStreamer() {
        const logDirectoryPath = path.join(__dirname, "..", "logs");
        const logFilePath = path.join(logDirectoryPath, "access.log");

        if (!fs.existsSync(logDirectoryPath)) fs.mkdirSync(logDirectoryPath);

        return fs.createWriteStream(logFilePath, {
            interval: '1d',
            path: logDirectoryPath,
            flags: "a"
        })
    }
}

module.exports = Logger