import Restaurant from "../schema/restaurantSchema.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import Review from "../schema/reviewSchema.js";
import FoodItem from "../schema/foodItemSchema.js";
const register = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {
        let success = false;

        let restaurant = await Restaurant.findOne({ email: req.body.email });
        if (restaurant) {
            return res.status(400).json({ success, message: "Sorry a restaurant with this email already exists" });
        }

        //encrypting the password
        const salt = bcrypt.genSaltSync(10);
        const securedPassword = bcrypt.hashSync(req.body.password, salt);
        restaurant = await Restaurant.create({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            state: req.body.state,
            cuisine: req.body.cuisine,
            keywords: req.body.keywords,
            hours: req.body.hours,
            phone: req.body.phone,
            email: req.body.email,
            password: securedPassword,
            bankname: req.body.bankname,
            accountno: req.body.accountno,
            ifsc: req.body.ifsc,
            menuUrl: req.body.menuUrl,
            imgUrls: req.body.imgUrls
        });

        success = true;
        return res.status(200).json({ success, restaurant, message: "Restaurant registered successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {

        let success = false;

        //check whether the restaurant with this email exists
        let restaurant = await Restaurant.findOne({ email: req.body.email });
        if (!restaurant) {
            return res.status(400).json({ success, message: "Please try to login with correct credentials" });
        }

        //check password
        const passwordCompare = await bcrypt.compare(req.body.password, restaurant.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, message: "Please try to login with correct credentials" });
        }

        const payload = {
            id: restaurant._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        success = true;
        return res.status(200).json({ success, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

const getRestaurant = async (req, res) => {

    try {
        let success = false;
        const id = new Types.ObjectId(req.params.id);
        let restaurant = await Restaurant.findById(id);
        const reviews = await Review.find({ restaurant: id }).populate("user");
        const foodItems = await FoodItem.find({ restaurant: id });
        if (!restaurant) {
            return res.status(404).json({ success, message: "Restaurant not found" });
        }

        success = true;
        return res.status(200).json({ success, restaurant, reviews, foodItems });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getallRestaurants = async (req, res) => {
    try {
        let success = false;
        let restaurants = await Restaurant.find();
        restaurants = await Promise.all(restaurants.map(async (restaurant) => {
            return {
                ...restaurant._doc,
                foodItems: await FoodItem.find({ restaurant: restaurant._id })
            }
        }));

        const rating = await Review.aggregate([
            {
                $group: {
                    _id: "$restaurant",
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        if (!restaurants) {
            return res.status(404).json({ success, message: "Restaurants not found" });
        }

        success = true;
        return res.status(200).json({ success, restaurants, rating });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const addFoodItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {
        let success = false;

        const id = new Types.ObjectId(req.params.id);
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ success, message: "Restaurant not found" });
        }

        const foodItem = await FoodItem.create({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            restaurant: req.params.id
        });

        success = true;
        return res.status(200).json({ message: "Food item added successfully", success, foodItem });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllFoodItems = async (req, res) => {

    try {
        let success = false;
        const foodItems = await FoodItem.find().populate("restaurant").sort({ createdAt: -1 });
        if (!foodItems) {
            return res.status(404).json({ success, message: "Food items not found" });
        }

        success = true;
        return res.status(200).json({ success, foodItems });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
const postReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        let success = false;

        const review = await Review.create({
            restaurant: req.params.id,
            user: req.body.user,
            comment: req.body.comment,
            rating: req.body.rating,
            image: req.body.image
        });

        success = true;
        return res.status(200).json({ success, review });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
export default { register, login, getRestaurant, getallRestaurants, postReview, addFoodItem, getAllFoodItems };