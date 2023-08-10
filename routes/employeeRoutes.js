"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {authenticateToken} from '../middlewares/authenticate';
const router = express_1.default.Router();
const { signUp, login, refresh } = require('../controllers/employeeController');
const { get } = require('mongoose');
router.post('/register', signUp);
router.post('/login', login);
router.post('/refresh', refresh);
exports.default = router;
