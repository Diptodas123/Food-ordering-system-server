import express from "express";
import authController from "../controllers/authController.js";
import fetchUser from "../middleware/fetchUser.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/signup", [
    body("fname", "Enter a valid first name").isLength({ min: 3 }),
    body("lname", "Enter a valid last name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").isLength({ min: 10, max: 10 }),
    body("password", "Password must be atleast 8 characters long").isLength({ min: 8 }),
], authController.signup);

router.post("/login", [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters long").isLength({ min: 8 }),
], authController.login);

router.post("/google", authController.googleAuth);

router.post("/update-profile", [
    body("fname", "Enter a valid first name").isLength({ min: 3 }),
    body("lname", "Enter a valid last name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").isLength({ min: 10, max: 10 }),
    body("password", "Password must be atleast 8 characters long").isLength({ min: 8 }),
], fetchUser, authController.updateProfile);

router.get("/getallusers", authController.getAllUsers);

router.post("/verifyCoupon/:id", [
    body("coupon", "Enter a valid coupon code").isLength({ min: 3 }),
], authController.verifyCoupon);

export default router;