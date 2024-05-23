import Stripe from "stripe";

const generatePayment = async (req, res, next) => {
    const { user, cartItems, deliveryCharge, discount, totalAmount, address, restaurant } = req.body;
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
            success_url: `${process.env.CLIENT_URL}/success?q=${totalAmount}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                userId: user._id,
                restaurantId: restaurant._id,
                address,
                cartItems: JSON.stringify(cartItems),
                totalAmount
            }
        });

        req.sessionId = session.id;
        res.json({ id: session.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default generatePayment;
