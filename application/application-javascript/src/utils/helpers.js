module.exports.prettyJSONString = (inputString) => {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

module.exports.shutDown = (server) => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}