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
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Fetch the order details from session metadata if necessary
            const { userId, restaurantId, address, cartItems, totalAmount } = session.metadata;

            try {
                // Create the order in the database
                const order = await Order.create({
                    user: userId,
                    restaurant: restaurantId,
                    address,
                    foodItems: cartItems,
                    totalAmount,
                    sessionId: session.id
                });

                // Send confirmation email
                sendBillThroughEmail(user.email, {
                    user: { _id: userId, email: user.email },
                    restaurant: { _id: restaurantId },
                    address,
                    cartItems,
                    totalAmount
                });

                console.log("Order placed successfully");
            } catch (error) {
                console.error("Error placing order: ", error);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

export default router;
