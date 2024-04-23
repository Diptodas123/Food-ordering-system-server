import { Schema, model, Types } from "mongoose";
const reviewSchema = new Schema({
    restaurant: {
        type: Types.ObjectId,
        ref: "Restaurant",
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

const Review = model("Review", reviewSchema);
export default Review;