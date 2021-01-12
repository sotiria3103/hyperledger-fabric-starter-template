const express = require("express");
const UserController = require("../controllers/user");

const app = express();


class EnrollRoutes {
    _userController;
    constructor () {
        this._userController = new UserController();
    }

    get routes() {
        const controller = this._userController;

        app.post("/user", controller.enrollUser);

        app.use('**', async (request, response, next) => {
            return response.status(404).json({ message: "Not found!" })
        });

        return app;
    }
}

module.exports = EnrollRoutes;