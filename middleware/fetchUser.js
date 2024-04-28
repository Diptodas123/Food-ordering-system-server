import jwt from "jsonwebtoken";
const fetchUser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send("Unauthorized: No Token Provided");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send("Unauthorized: Invalid Token");
    }
}

export default fetchUser;