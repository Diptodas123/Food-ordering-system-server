import { Router } from "express";
import orderController from "../controllers/orderController.js";
import generatePayment from "../middleware/generatePayment.js";
const router = Router();

router.post("/placeOrder", generatePayment, orderController.placeOrder);

export default router;