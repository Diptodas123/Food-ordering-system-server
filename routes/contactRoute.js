import { Router } from "express";
import { body } from "express-validator";
import contactController from "../controllers/contactController.js";
const router = Router();

router.post("/post-contact", [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Enter a valid phone number").isLength({ min: 10, max: 10 }),
    body("message", "Enter a valid message").isLength({ min: 3 }),
], contactController.postContact);

router.get("/getAllContacts", contactController.getAllContacts);

export default router;