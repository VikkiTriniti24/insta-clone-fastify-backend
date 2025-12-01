"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const app = (0, fastify_1.default)({ logger: true });
app.get('/', async () => {
    return 'Hello world';
});
const start = async () => {
    try {
        await app.listen({
            port: Number(process.env.PORT ?? 3000),
            host: process.env.HOST ?? '127.0.0.1',
        });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
