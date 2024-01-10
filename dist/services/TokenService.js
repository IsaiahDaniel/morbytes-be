"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// "5m" "30d"
const generateToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const tokenGen = jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: "6h" });
    return tokenGen;
};
exports.default = generateToken;
