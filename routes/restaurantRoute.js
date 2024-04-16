import express from "express";
import {body} from "express-validator";
import restaurantController from "../controllers/restaurantController.js";

const router = express.Router();

router.post("/registration",[
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("address", "Enter address").exists(),
    body("city", "Enter city").exists(),
    body("pincode", "Enter a valid pincode").isLength({ min: 6, max: 6 }),
    body("state", "Enter state").exists(),
    body("cuisine", "Enter cuisine").exists(),
    body("keywords", "Enter keywords").notEmpty(),
    body("hours", "Enter hours").exists(),
    body("phone", "Enter a valid phone number").isLength({ min: 10, max: 10 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 8 characters long").isLength({ min: 8 }),
    body("bankname", "Enter a valid bank name").isLength({ min: 3 }),
    body("accountno", "Enter a valid account number").isLength({ min: 9, max: 18 }),
    body("ifsc", "Enter a valid ifsc code").isLength({ min: 11, max: 11 }),
    body("menuUrl", "Menu is required").exists(),
    body("imgUrls", "Image is required").exists(),
], restaurantController.register);

export default router;