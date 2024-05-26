import { Router } from "express";
import orderController from "../controllers/orderController.js";
import fetchUser from "../middleware/fetchUser.js";
const router = Router();

router.post("/placeOrder", orderController.placeOrder);

router.post("/generatePayment", orderController.generatePayment);

router.get("/getOrder/:id",fetchUser, orderController.getOrderById);

export default router;