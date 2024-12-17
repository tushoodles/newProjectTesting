const AuthRoutes = require("../routes/auth.routes.js");
const UserRoutes = require("../routes/user.routes.js");

module.exports = [
    new AuthRoutes(),
    new UserRoutes(),
];
