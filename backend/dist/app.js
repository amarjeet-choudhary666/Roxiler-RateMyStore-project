"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({ limit: '16kb' }));
app.use(express_1.default.urlencoded({ limit: '16kb', extended: true }));
app.use((0, cookie_parser_1.default)());
const user_Routes_1 = __importDefault(require("./routes/user.Routes"));
const storeowner_routes_1 = __importDefault(require("./routes/storeowner.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
app.use("/v1/api/users", user_Routes_1.default);
app.use("/v1/api/storeowner", storeowner_routes_1.default);
app.use("/v1/api/admin", admin_routes_1.default);
