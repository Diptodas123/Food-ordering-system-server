import { Router } from "express";
import orderController from "../controllers/orderController.js";
import fetchUser from "../middleware/fetchUser.js";
const router = Router();

router.post("/placeOrder", orderController.placeOrder);

router.post("/generatePayment", orderController.generatePayment);

router.get("/getOrder/:id", fetchUser, orderController.getOrderById);


// endpoint to update order status from the restaurant side
router.put("/updateOrderStatus/:id", orderController.updateOrderStatus);


//endpoint to fetch all orders
router.get("/getAllOrders", orderController.getAllOrders);

//endpoint to fetch top selling dishes
router.get("/topSellingDishes/:id", orderController.getTopSellingDishesByRestaurant);

export default router;