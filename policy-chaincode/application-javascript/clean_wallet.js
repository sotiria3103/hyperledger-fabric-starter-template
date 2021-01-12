const rimraf = require('rimraf');

rimraf('./src/controllers/wallet/', { disableGlob: true }, (error) => {
    if (error) {
        console.error("Failed to remove wallet");
        console.error(JSON.stringify(error, null, 2));
    }
})