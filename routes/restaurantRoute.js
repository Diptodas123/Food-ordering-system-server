import express from "express";
import restaurantController from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/registration", restaurantController.register);

export default router;