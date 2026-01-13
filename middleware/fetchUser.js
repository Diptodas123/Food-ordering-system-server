import jwt from "jsonwebtoken";
const fetchUser = (req, res, next) => {
    let token = req.header("auth-token");
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    // Trim whitespace
    token = token.trim();

    // Check if token is empty or invalid strings
    if (!token || token === "undefined" || token === "null" || token === "[object Object]") {
        console.log("Invalid token format received:", token);
        return res.status(401).json({ error: "Unauthorized: Invalid Token Format" });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        console.log("JWT Verification Error:", err.message);
        console.log("Token received:", token.substring(0, 20) + "...");
        return res.status(401).json({ error: "Unauthorized: Invalid or Expired Token" });
    }
}

export default fetchUser;