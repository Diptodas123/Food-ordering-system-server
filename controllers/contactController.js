import { validationResult } from "express-validator";
import Contact from "../schema/contactSchema.js";

const postContact = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    try {
        let success = false;
        const contact = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message
        });

        success = true;
        return res.status(200).json({ success, message: "Thank you for contacting us", contact });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllContacts = async (req, res) => {
    try {
        let success = false;
        const contacts = await Contact.find({});
        success = true;
        return res.status(200).json({ success, contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export default { postContact, getAllContacts };