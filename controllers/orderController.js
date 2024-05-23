const placeOrder = async (req, res) => {
    return res.status(200).json({id: req.params.id, success: true, message: "Order creation is handled by webhook" });
};

export default { placeOrder };
