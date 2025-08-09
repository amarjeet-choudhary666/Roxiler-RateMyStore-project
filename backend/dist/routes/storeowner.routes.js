"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_owner_controller_1 = require("../controllers/shop_owner.controller");
const router = (0, express_1.Router)();
router.post("/", shop_owner_controller_1.registerShopOwner);
router.post("/login", shop_owner_controller_1.loginShopOwner);
exports.default = router;
