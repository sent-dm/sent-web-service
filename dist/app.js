"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const redis_config_1 = require("./redis/redis-config");
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabaseUrl = process.env.SUPABASE_PROJECT || "";
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
}))();
const initializeSubscriberInRedis = (subscriberId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `subscriber:${subscriberId}`;
    const channelStatus = { sms: false, whatsapp: false };
    yield redis_config_1.client.set(key, JSON.stringify(channelStatus)); // Initialize both channels as false
});
// Utility function to update the Redis store
const updateRedisStore = (subscriberId, channel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = `subscriber:${subscriberId}`;
        const channelStatusRaw = yield redis_config_1.client.get(key);
        const channelStatus = channelStatusRaw ? JSON.parse(channelStatusRaw) : {};
        // Update the status
        channelStatus[channel] = true;
        yield redis_config_1.client.set(key, JSON.stringify(channelStatus));
        // Log completion if both channels are present and marked as true
        if (channelStatus.sms && channelStatus.whatsapp) {
            console.log(`Both SMS and WhatsApp subscription channels are complete for subscriber ${subscriberId}`);
        }
    }
    catch (error) {
        console.error("Error updating Redis store:", error);
    }
});
// Real-time listeners
supabase.channel('subscriber-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscriber' }, (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('New subscriber created:', payload.new);
    // Initialize Redis key for the new subscriber
    yield initializeSubscriberInRedis(payload.new.id);
}))
    .subscribe();
supabase.channel('subscriberChannel-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscriberChannel' }, (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('New subscription channel added:', payload.new);
    // Update Redis store for the subscriber with the new channel
    yield updateRedisStore(payload.new.subscriberId, payload.new.channel);
}))
    .subscribe();
app.get('/', (req, res) => {
    res.send('Hello, world from the app with Supabase Realtime subscriptions!');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
