import Order from "../schema/orderSchema.js";

const placeOrder = async (req, res) => {
    let success = false;
    if (!req.sessionId) {
        return res.status(400).json({ success, message: "Session not found" });
    }
    try {
        const order = await Order.create({
            user: req.body.user._id,
            restaurant: req.body.restaurant._id,
            address: req.body.address,
            foodItems: req.body.cartItems,
            totalAmount: req.body.totalAmount,
            sessionId: req.sessionId
        });

        if (!order) {
            return res.status(400).json({ success, message: "Order not placed" });
        }
        
        success = true;
        return res.status(200).json({ success, id: req.sessionId, message: "Order placed successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export default { placeOrder };
