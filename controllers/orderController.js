import Order from "../schema/orderSchema.js";
import Stripe from "stripe";
import { Types } from "mongoose";
const generatePayment = async (req, res) => {
    const { cartItems, deliveryCharge, discount, totalAmount } = req.body;
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = cartItems.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        images: [item.image]
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }
        });

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charge",
                    images: ["https://www.newlivingconcept.com/image/newlivingconcept/image/data/all_product_images/product-594/jOmFWoNo1631522288.png"]
                },
                unit_amount: discount > 0 ? (deliveryCharge - discount) * 100 : deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        return res.status(200).json({ success: true, sessionUrl: session.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const placeOrder = async (req, res) => {
    try {
        let success = false;
        const order = await Order.create({
            user: req.body.user._id,
            restaurant: req.body.restaurant._id,
            address: req.body.address,
            foodItems: req.body.cartItems,
            totalAmount: req.body.totalAmount,
        });

        if (!order) {
            return res.status(400).json({ success, message: "Order not placed" });
        }

        success = true;
        return res.status(200).json({ success, message: "Order placed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getOrderById = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ success: false, message: "Please login" });
    }

    try {

        let success = false;

        const userId = new Types.ObjectId(req.user);

        const orderDetails = await Order.findOne({ user: userId, _id: req.params.id }).populate("restaurant", "name address imgUrls");

        if (!orderDetails) {
            return res.status(404).json({ success, message: "Order not found" });
        }

        success = true;
        return res.status(200).json({ success, orderDetails });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        let success = false;
        const orderId = new Types.ObjectId(req.params.id);
        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ success, message: "Order not found" });
        }

        order.status = req.body.status;
        await order.save();
        success = true;

        return res.status(200).json({ success, message: "Order status updated successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllOrders = async (req, res) => {
    try {
        let success = false;

        const orders = await Order.find({}).populate("restaurant", "_id name address imgUrls").populate("user", "firstName lastName");

        if (!orders) {
            return res.status(404).json({ success, message: "Orders not found" });
        }

        success = true;
        return res.status(200).json({ success, orders });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getTopSellingDishesByRestaurant = async (req, res) => {
    try {

        const restaurantId = new Types.ObjectId(req.params.id);
        const topSellingDishesByRestaurant = await Order.aggregate([
            {
                $match: {
                    restaurant: restaurantId
                }
            },
            {
                $unwind: "$foodItems"
            },
            {
                $group: {
                    _id: "$foodItems.name",
                    count: { $sum: "$foodItems.quantity" }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);

        return res.status(200).json({ topSellingDishesByRestaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export default {
    placeOrder, generatePayment, getOrderById,
    updateOrderStatus, getAllOrders, getTopSellingDishesByRestaurant
};