import jwt from "jsonwebtoken";
const fetchUser = (req, res, next) => {
    let token = req.header("auth-token");
    
    if (!token) {
        return res.status(401).send("Unauthorized: No Token Provided");
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    // Trim whitespace
    token = token.trim();

    // Check if token is empty after trimming
    if (!token) {
        return res.status(401).send("Unauthorized: Invalid Token Format");
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