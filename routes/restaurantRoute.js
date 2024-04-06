import express from "express";
import {body, validationResult} from "express-validator";
import restaurantController from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/registration", restaurantController.register);

export default router;