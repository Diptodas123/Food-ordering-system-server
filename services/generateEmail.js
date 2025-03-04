import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import Order from '../schema/orderSchema.js';

const sendBillThroughEmail = async (orderId) => {
    try {
        // Fetch order details
        const order = await Order.findById(orderId)
            .populate('user', 'email firstName lastName')
            .populate('restaurant', 'name');

        if (!order) {
            throw new Error('Order not found');
        }

        const source = fs.readFileSync('./email-template.hbs', 'utf8');

        const template = handlebars.compile(source);

        const html = template({
            name: order.user.firstName,
            foodItems: order.foodItems,
            totalAmount: order.totalAmount,
            year: new Date().getFullYear()
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.APP_PASSWORD,
            }
        });

        const message = {
            from: process.env.GMAIL,
            to: order.user.email,
            subject: `Order Confirmation - Your order #${order._id.toString()} has been successfully placed!`,
            html: html
        };

        await transporter.sendMail(message);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error:', error);
    }
};

export default sendBillThroughEmail;