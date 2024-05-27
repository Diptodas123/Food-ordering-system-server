import express from "express";
import authController from "../controllers/authController.js";
import fetchUser from "../middleware/fetchUser.js";
import { body } from "express-validator";

const router = express.Router();

//endpoints for user manupulation
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

router.patch("/update-profile", [
    body("fname", "Enter a valid first name").isLength({ min: 3 }),
    body("lname", "Enter a valid last name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").isLength({ min: 10, max: 10 }),
    body("password", "Password must be atleast 8 characters long").isLength({ min: 8 }),
], fetchUser, authController.updateProfile);

//endpoint to get all users
router.get("/getallusers", authController.getAllUsers);

router.post("/verifyCoupon/:id", [
    body("coupon", "Enter a valid coupon code").isLength({ min: 3 }),
], authController.verifyCoupon);


// --------------------------
//endpoints to fetch all orders of a user
router.get("/getAllOrders", fetchUser, authController.getAllOrders);


// --------------------------
//endpoints for address manupulation
router.post("/addAddress", fetchUser, authController.addAddress);
router.patch("/updateAddress/:index", fetchUser, authController.updateAddress);
router.delete("/deleteAddress/:index", fetchUser, authController.deleteAddress);
router.get("/getAllAddress", fetchUser, authController.getAllAddress);


//endpoint to add coupon from the admin side
router.post("/addCoupon", [
    body("coupon", "Enter a valid coupon code").isLength({ min: 3 }),
    body("discount", "Enter a valid discount").isLength({ min: 1, max: 2 }),
], authController.addCoupon);


router.get("/getAllCoupons", authController.getAllCoupons);

export default router;