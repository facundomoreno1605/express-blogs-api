const express = require("express");
const router = express.Router();
const validateMiddleware = require("./../middlewares/validate.middleware");
const { userValidations, authValidations } = require("./../validations");
const { AuthController } = require("./../controllers");

router.post(
  "/auth/register",
  validateMiddleware(userValidations.createUserSchema),
  AuthController.register
);

router.post(
  "/auth/login",
  validateMiddleware(authValidations.loginSchema),
  AuthController.login
);

router.post(
  "/auth/refresh-token",
  validateMiddleware(authValidations.refreshTokenSchema),
  AuthController.refreshToken
);

module.exports = router;
