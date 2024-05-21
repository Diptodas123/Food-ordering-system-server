import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import Order from "../schema/orderSchema.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook route with raw body parser middleware
router.post("/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        // Construct the event using the raw body
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Error verifying Stripe webhook signature:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        try {
            // Update the order with the transaction ID
            const order = await Order.findOneAndUpdate(
                { sessionId: session.id },
                { transactionId: session.payment_intent },
                { new: true }
            );
            if (order) {
                console.log(`Order updated with transaction ID: ${session.payment_intent}`);
            } else {
                console.log(`Order not found for session ID: ${session.id}`);
            }
        } catch (err) {
            console.error('Error updating order:', err);
        }
    }

    res.status(200).end();
});

export default router;
