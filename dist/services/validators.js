"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = void 0;
const validator_1 = __importDefault(require("validator"));
const password_validator_1 = __importDefault(require("password-validator"));
function validateEmail(email) {
    if (!validator_1.default.isEmail(email)) {
        return false;
    }
    return true;
}
exports.validateEmail = validateEmail;
function validatePassword(password) {
    const schema = new password_validator_1.default();
    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().uppercase() // Must have uppercase letters
        .has().lowercase() // Must have lowercase letters
        .has().digits(1) // Must have at least 1 digit
        .has().not().spaces(); // Should not have spaces
    return schema.validate(password, { list: true });
}
exports.validatePassword = validatePassword;
