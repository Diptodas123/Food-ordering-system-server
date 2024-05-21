import { Router } from "express";
import Stripe from "stripe";
import Order from "../schema/orderSchema.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Error verifying Stripe webhook signature:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const order = await Order.findOneAndUpdate({ sessionId: session.id }, {
            transactionId: session.payment_intent
        });
        console.log(`Order updated with transaction ID: ${session.payment_intent}`);
    }

    res.status(200).end();
});

export default router;