"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const posts_routes_1 = __importDefault(require("./common/posts.routes"));
const database_plugin_1 = __importDefault(require("./core/database/database.plugin"));
const reels_routes_1 = __importDefault(require("./modules/reels/reels.routes"));
const tagged_routes_1 = __importDefault(require("./modules/tagged/tagged.routes"));
const highlights_routes_1 = __importDefault(require("./modules/highlights/highlights.routes"));
const app = (0, fastify_1.default)({ logger: true });
app.register(multipart_1.default);
app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    return payload;
});
app.options('*', async (_request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    reply.send();
});
app.get('/', async () => {
    return 'Hello world';
});
app.register(database_plugin_1.default);
app.register(posts_routes_1.default);
app.register(reels_routes_1.default);
app.register(tagged_routes_1.default);
app.register(highlights_routes_1.default);
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
