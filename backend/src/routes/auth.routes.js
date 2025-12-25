const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Register tenant
router.post(
  "/register-tenant",
  [
    body("tenantName").notEmpty(),
    body("subdomain").notEmpty(),
    body("adminEmail").isEmail(),
    body("adminPassword").isLength({ min: 8 }),
    body("adminFullName").notEmpty(),
  ],
  authController.registerTenant
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
    body("tenantSubdomain").optional().isString(),
  ],
  authController.login
);

// Get current user
router.get("/me", authenticate, authController.me);

// Logout
router.post("/logout", authenticate, authController.logout);

module.exports = router;
