import Order from "../schema/orderSchema.js";
import Stripe from "stripe";
const placeOrder = async (req, res) => {
    try {

    } catch (error) {

    }
}

const generatePayment = async (req, res) => {
    const { cartItems, deliveryCharge } = req.body;
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
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        });

        return res.status(200).json({ id: session.id });
    } catch (error) {
        console.log(error);
    }
}
export default { placeOrder, generatePayment }