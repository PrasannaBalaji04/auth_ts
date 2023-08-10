"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // console.log(req.headers);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Missing token' });
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET; // Access the environment variable
    // const payload = { userId: 123 };
    if (!secretKey) {
        throw new Error('Secret key not found in environment variables');
    }
    jsonwebtoken_1.default.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        if (typeof decoded === "string") {
            const decodedPayload = jsonwebtoken_1.default.decode(token);
        }
        else {
            req.body.userId = decoded.id;
            next();
        }
    });
}
exports.authenticateToken = authenticateToken;
module.exports = {
    authenticateToken
};
