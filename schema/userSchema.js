import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    favourite: {
        type: Object,
        default: { items: [], restaurants: [] }
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: Object,
        default: {
            address: [{
                addressLine: String,
                landmark: String,
                city: String,
                state: String,
                country: String,
                pincode: String
            }]
        }
    },
    coupon: {
        type: Object,
        default: {
            code: "WELCOME",
            discount: 50,
        }
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;