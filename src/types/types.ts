interface RedisSubscriptionChannelStatus {
    sms?: boolean;
    whatsapp?: boolean;
  }
  
  // Utility type for initializing Redis data for a new Subscriber
type RedisSubscriberInit = Record<SubscriptionChannel, boolean>;


interface Subscriber {
    id: string;
    phoneNumber: string;
    defaultChannel: SubscriptionChannel;
    createdAt: Date;
    updatedAt: Date;
    countryCode?: string;
    countryIso?: string;
    verificationStatus?: Status;
    SubscriberChannels: SubscriberChannels[];
  }
  
  interface SubscriberChannels {
    id: string;
    subscriberId: string;
    channel: SubscriptionChannel;
    channelData?: any; // Use a more specific type if possible
    createdAt: Date;
    updatedAt: Date;
    valid?: Status;
    Subscriber?: Subscriber; // Made optional to avoid circular dependency in TypeScript
  }

  
  enum SubscriptionChannel {
    sms = "sms",
    whatsapp = "whatsapp",
    // Add other channels as needed
  }
  
  enum Status {
    Pending = "pending",
    Completed = "completed",
    // Add other statuses as needed
  }

export {Status, SubscriptionChannel, SubscriberChannels, Subscriber, RedisSubscriberInit, RedisSubscriptionChannelStatus}