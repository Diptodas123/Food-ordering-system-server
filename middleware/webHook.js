import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import Order from "../schema/orderSchema.js";
import sendBillThroughEmail from "../services/generateEmail.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to parse the Stripe webhook payload
router.post("/stripe", bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Retrieve the temporary order using the order ID from metadata
            const orderId = session.metadata.orderId;

            try {
                const order = await Order.findById(orderId);

                if (!order) {
                    console.error("Order not found:", orderId);
                    return res.status(404).send("Order not found");
                }

                // Update the order status to confirmed
                order.status = "confirmed";
                await order.save();

                // Send confirmation email
                sendBillThroughEmail(order.user.email, {
                    user: { _id: order.user, email: order.user.email },
                    restaurant: { _id: order.restaurant },
                    address: order.address,
                    cartItems: order.foodItems,
                    totalAmount: order.totalAmount
                });

                console.log("Order placed successfully");
            } catch (error) {
                console.error("Error updating order: ", error);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

export default router;
