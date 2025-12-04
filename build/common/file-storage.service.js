"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileStorageService = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const crypto_1 = require("crypto");
exports.fileStorageService = {
    async saveImage(fileBuffer, originalFilename) {
        const uploadDir = path_1.default.join(process.cwd(), 'public', 'uploads');
        await promises_1.default.mkdir(uploadDir, { recursive: true });
        const fileExtension = path_1.default.extname(originalFilename);
        const uniqueFilename = `${(0, crypto_1.randomUUID)()}${fileExtension}`;
        const filePath = path_1.default.join(uploadDir, uniqueFilename);
        await promises_1.default.writeFile(filePath, fileBuffer);
        return `/uploads/${uniqueFilename}`;
    },
};
