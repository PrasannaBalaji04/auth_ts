"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_1 = __importDefault(require("../models/employee"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validators_1 = require("../services/validators");
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password, DoB, token, mobile } = req.body;
            const date = Date.parse(DoB);
            const dateObject = new Date(date);
            if (!(0, validators_1.validateEmail)(email)) {
                console.log("email not valid");
                res.status(400).json({ error: 'Invalid email address' });
            }
            const passwordErrors = (0, validators_1.validatePassword)(password);
            if (Array.isArray(passwordErrors)) {
                // Now TypeScript knows value is an array
                if (passwordErrors.length > 0) {
                    console.log("password not valid");
                    res.status(400).json({ error: 'Invalid password', passwordErrors });
                }
            }
            else {
                console.log('Value is not an array');
            }
            // Check if the email is already registered
            const existingUser = yield employee_1.default.findOne({ email });
            if (existingUser) {
                res.status(409).json({ success: false, message: 'Email already registered' });
            }
            else {
                // Encrypt the password
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Create a new employee with the encrypted password
                const employee = yield employee_1.default.create({
                    name,
                    email,
                    password: hashedPassword,
                    DoB: dateObject,
                    token,
                    mobile
                });
                res.status(201).json({ success: true, message: 'User created successfully' });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('An error occurred:', error.message);
                res.status(500).json({ success: false, error: error.message });
            }
            else {
                console.error('An unknown error occurred:', error);
            }
        }
    });
}
// // Log in a user and generate a JWT token
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Find the employee by email
            const employee = yield employee_1.default.findOne({ email });
            if (!employee) {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
            else {
                // Validate the password
                const isPasswordValid = yield bcrypt_1.default.compare(password, employee.password.toString());
                if (!isPasswordValid) {
                    res.status(401).json({ success: false, message: 'Invalid email or password' });
                }
                const secretKey = process.env.ACCESS_TOKEN_SECRET;
                if (!secretKey) {
                    throw new Error('Secret key not found in environment variables');
                }
                // Generate a JWT token
                else {
                    const token = jsonwebtoken_1.default.sign({ id: employee._id }, secretKey, { expiresIn: '1h' });
                    const refreshToken = jsonwebtoken_1.default.sign({ id: employee._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1D' });
                    const updateOperation = {
                        $set: {
                            token: token,
                        },
                    };
                    yield employee_1.default.updateOne({ _id: employee._id }, updateOperation);
                    res.cookie('jwt', refreshToken, { httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000 });
                    res.json({ success: true, token });
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('An error occurred:', error.message);
                res.status(500).json({ success: false, error: error.message });
            }
            else {
                console.error('An unknown error occurred:', error);
            }
        }
    });
}
// Refresh token
function refresh(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt) {
            // Destructuring refreshToken from cookie
            const refreshToken = req.cookies.jwt;
            // console.log(refreshToken);
            // Verifying refresh token
            jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    // Wrong Refesh Token
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                if (typeof decoded === "string") {
                    const decodedPayload = jsonwebtoken_1.default.decode(refreshToken);
                }
                else {
                    // Correct token we send a new access token
                    const accessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                    return res.json({ accessToken });
                }
            });
        }
        else {
            res.status(406).json({ message: 'Unauthorized' });
        }
    });
}
module.exports = {
    signUp,
    login,
    refresh
};
