import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { client as redisClient, connectRedis } from './redis/redis-config';
import { SubscriptionChannel, RedisSubscriptionChannelStatus } from './types/types';

const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
const supabaseUrl = process.env.SUPABASE_PROJECT || "";

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 3000;

(async () => {
  await connectRedis();
})();

const initializeSubscriberInRedis = async (subscriberId: string) => {
    const key = `subscriber:${subscriberId}`;
    const channelStatus: RedisSubscriptionChannelStatus = { sms: false, whatsapp: false };
    await redisClient.set(key, JSON.stringify(channelStatus)); // Initialize both channels as false
};

// Utility function to update the Redis store
const updateRedisStore = async (subscriberId: string, channel: SubscriptionChannel) => {
    try {
      const key = `subscriber:${subscriberId}`;
      const channelStatusRaw = await redisClient.get(key);
      const channelStatus: RedisSubscriptionChannelStatus = channelStatusRaw ? JSON.parse(channelStatusRaw) : {};

      // Update the status
      channelStatus[channel] = true;
      await redisClient.set(key, JSON.stringify(channelStatus));
  
      // Log completion if both channels are present and marked as true
      if (channelStatus.sms && channelStatus.whatsapp) {
        console.log(`Both SMS and WhatsApp subscription channels are complete for subscriber ${subscriberId}`);
      }
    } catch (error) {
      console.error("Error updating Redis store:", error);
    }
};

// Real-time listeners
supabase.channel('subscriber-changes')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscriber'}, 
    async (payload) => {
      console.log('New subscriber created:', payload.new);
      // Initialize Redis key for the new subscriber
      await initializeSubscriberInRedis(payload.new.id);
    })
  .subscribe();

supabase.channel('subscriberChannel-changes')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subscriberChannel'}, 
    async (payload) => {
      console.log('New subscription channel added:', payload.new);
      // Update Redis store for the subscriber with the new channel
      await updateRedisStore(payload.new.subscriberId, payload.new.channel);
    })
  .subscribe();

app.get('/', (req, res) => {
  res.send('Hello, world from the app with Supabase Realtime subscriptions!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});