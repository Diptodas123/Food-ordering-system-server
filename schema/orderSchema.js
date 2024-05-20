import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    address: {
        type: String,
        required: true
    },
    foodItems: {
        type: Array,
        required: true
    },
    deliveryTime: {
        type: String,
    },
    totalAmount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Order = model("Order", orderSchema);
export default Order;