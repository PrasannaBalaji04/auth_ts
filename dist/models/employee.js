"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    DoB: { type: Date, required: true },
    token: { type: String, required: false },
    mobile: { type: String, required: true }
});
;
const EmployeeModel = mongoose_1.default.model('Employee', employeeSchema);
exports.default = EmployeeModel;
