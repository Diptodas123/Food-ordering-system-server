import { Router } from "express";
import orderController from "../controllers/orderController.js";
const router = Router();

router.post("/placeOrder", orderController.placeOrder);

router.post("/generatePayment", orderController.generatePayment);

export default router;