"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use(express_1.default.json())
    .use("/api", routes_1.default)
    .use((0, cors_1.default)());
(0, swagger_1.setupSwagger)(app);
// Start the server
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
});
//# sourceMappingURL=index.js.map