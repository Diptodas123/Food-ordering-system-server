import Stripe from "stripe";
import Order from "../schema/orderSchema.js";

const generatePayment = async (req, res, next) => {
    const { user, cartItems, deliveryCharge, discount, totalAmount, address, restaurant } = req.body;
    try {
        // Create a temporary order record in the database
        const tempOrder = await Order.create({
            user: user._id,
            restaurant: restaurant._id,
            address,
            foodItems: cartItems,
            totalAmount,
            sessionId: null, // Will update this after creating Stripe session
            status: "pending" // Add a status to track payment state
        });

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
            success_url: `${process.env.CLIENT_URL}/success?q=${totalAmount}`, // Redirect URL after successful payment
            cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect URL if payment is canceled
            metadata: {
                orderId: tempOrder._id.toString() // Store the temporary order ID in the metadata
            }
        });

        // Update the order with the session ID
        tempOrder.sessionId = session.id;
        await tempOrder.save();

        req.sessionId = session.id;
        res.json({ id: session.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default generatePayment;
