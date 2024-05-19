import mongoose, { Types } from "mongoose";

const restaurantShema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    keywords: {
        type: String,
        required: true
    },
    hours: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bankname: {
        type: String,
        required: true
    },
    accountno: {
        type: String,
        required: true
    },
    ifsc: {
        type: String,
        required: true
    },
    imgUrls: {
        type: Array,
        required: true
    },
    menuUrl: {
        type: String,
        required: true
    },
    rating: {
        type: Types.ObjectId,
        ref: "Review",
    },
}, { timestamps: true });

const restaurantModel = mongoose.model("Restaurant", restaurantShema);
export default restaurantModel;