const { Router } = require("express");
const authController = require("../controllers/authControllers");

const router = Router();

router.get("/check-auth", authController.check_auth);
router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

module.exports = router;
