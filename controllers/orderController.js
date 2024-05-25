import Order from "../schema/orderSchema.js";
import Stripe from "stripe";

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

export default { placeOrder, generatePayment };