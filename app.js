"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/employees', employeeRoutes_1.default);
// Start the server
(0, db_1.default)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
// const express = require('express');
// const cors = require("cors");
// const cookie = require('cookie-parser');
// const connectDB = require('./config/db');
// const employeeRoutes = require('./routes/employeeRoutes');
// const app = express();
// app.use(cors({ origin: true, credentials: true }))
// app.use(cookie())
// // Connect to MongoDB
// app.use(express.json());
// // Middleware
