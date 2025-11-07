"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// drizzle.config.ts
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: "./drizzle",
    schema: "./src/schema/index.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
