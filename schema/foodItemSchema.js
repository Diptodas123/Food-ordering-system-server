import { Schema, model } from "mongoose";

const foodItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const FoodItem = model("FoodItem", foodItemSchema);
export default FoodItem;