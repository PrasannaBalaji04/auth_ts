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
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const yamlContent = fs_1.default.readFileSync(__dirname + '/swagger.yaml', 'utf8');
// Parse the YAML content using js-yaml
const parsedSwaggerSpecs = yamljs_1.default.load(yamlContent);
// Routes
app.use('/employees', employeeRoutes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(parsedSwaggerSpecs));
// Start the server
(0, db_1.default)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
