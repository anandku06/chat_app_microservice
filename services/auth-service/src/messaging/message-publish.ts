import {
  AUTH_EVENT_EXCHANGE,
  AUTH_USER_REGISTERED_ROUTING_KEY,
  type AuthUserRegisteredEventPayload,
} from "@chat_app/common";
import { connect, type Channel, type ChannelModel } from "amqplib";

import { logger } from "@/utils/logger";
import { env } from "@/config/env";

let connectionRef: ChannelModel | null = null;
let channel: Channel | null = null;

export const initPublisher = async () => {
  if (!env.RABBITMQ_URL) {
    logger.warn(
      "RABBITMQ_URL is not defined. Skipped RabbitMQ initialization.",
    );
    return;
  }

  if (channel) {
    return;
  }

  const connection = await connect(env.RABBITMQ_URL);
  connectionRef = connection;
  channel = await connection.createChannel();

  await channel.assertExchange(AUTH_EVENT_EXCHANGE, "topic", { durable: true });

  connection.on("close", () => {
    logger.warn("RabbitMQ connection closed!");
    channel = null;
    connectionRef = null;
  });

  connection.on("error", (e) => {
    logger.error({ e });
  });

  logger.info("Auth Service RabbitMQ publisher initialized!");
};

export const publishUserRegistered = (
  payload: AuthUserRegisteredEventPayload,
) => {
  if (!channel) {
    logger.warn("RabbitMQ channel is not initialized. Skipping publish.");
    return;
  }

  const event = {
    type: AUTH_USER_REGISTERED_ROUTING_KEY,
    payload,
    occurredAt: new Date().toISOString(),
    metaData: {
      version: 1,
    },
  };

  const published = channel.publish(
    AUTH_EVENT_EXCHANGE,
    AUTH_USER_REGISTERED_ROUTING_KEY,
    Buffer.from(JSON.stringify(event)),
    { persistent: true },
  );

  if (!published) {
    logger.warn({ event }, "Failed to publish event to RabbitMQ");
  }
};

export const closePublisher = async () => {
  try {
    const ch = channel;
    if (ch) {
      await ch.close();
      channel = null;
    }

    const conn = connectionRef;
    if (conn) {
      await conn.close();
      connectionRef = null;
    }
  } catch (e) {
    logger.error({ e }, "Error while closing RabbitMQ connection/channel");
  }
};
