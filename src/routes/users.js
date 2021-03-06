const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

router.get("/users/signup", userController.signUp);
router.post("/users", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);
//router.get("/users/:id/upgrade", userController.showUpgradePage);
//router.get("/users/:id/downgrade", userController.showDowngradePage);
//router.post("/users/:id/upgrade", userController.upgrade);
//router.post("/users/:id/downgrade", userController.downgrade);
router.post('/users/:id/upgrade', userController.payment);
router.post('/users/:id/downgrade', userController.downgrade);
router.get("/users/:id/collaborations", userController.showCollaborations);



module.exports = router;