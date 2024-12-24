const Router = require("express");
const requireController = require("../controller/require.controller");
const {
  userAccessmiddlware,
  authToken,
} = require("../middleware/auth.user.middleware");

class RequireRoute {
  constructor() {
    this.router = Router();
    this.path = "/api/v1/require";
    this.requirecontroller = new requireController();
    this.initializeRequireRoutes();
  }

  initializeRequireRoutes() {
    
    
    
    this.router.post(
      `${this.path}/approve-member`,
      authToken,
      userAccessmiddlware,
      this.requirecontroller.giveApproveMember.bind(this.requirecontroller)
    );


    this.router.get(
      `${this.path}/remove-user`,
      authToken,
      userAccessmiddlware,
      this.requirecontroller.removeUser.bind(this.requirecontroller)
    )

    this.router.get(`${this.path}/removeuser`);
  }
}

module.exports = { RequireRoute };
