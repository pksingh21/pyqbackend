"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); // Importing the app module
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file, where PORT might be defined
dotenv_1.default.config();
const port = process.env.PORT || 3000;
app_1.default.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
