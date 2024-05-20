import { Router } from "express";
import orderController from "../controllers/orderController.js";
const router = Router();

router.post("/generatePayment", orderController.generatePayment);

router.post("/placeOrder", orderController.placeOrder);
export default router;