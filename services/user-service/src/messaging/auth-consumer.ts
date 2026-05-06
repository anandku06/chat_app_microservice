import {
  AUTH_EVENT_EXCHANGE,
  AUTH_USER_REGISTERED_ROUTING_KEY,
  type AuthRegisteredEvent,
} from "@chat_app/common";

import {
  connect,
  type Channel,
  type ChannelModel,
  type Connection,
  type ConsumeMessage,
  type Replies,
} from "amqplib";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { userService } from "@/service/user.service";

type ManageConnection = Connection & ChannelModel; // this type is used to manage the connection and channel together, so we can easily close them when needed

let connectionRef: ManageConnection | null = null; // this variable will hold the connection and channel together, so we can easily manage them
let channel: Channel | null = null; // this variable will hold the channel, so we can use it to consume messages and acknowledge them
let consumerTag: string | null = null; // this variable will hold the consumer tag, so we can use it to cancel the consumer when needed

const QUEUE_NAME = "auth-service.auth-events"; // this queue will receive all auth events, we can use the routing key to filter the events we want to consume

const closeConnection = async (conn: ManageConnection) => {
  await conn.close();
  connectionRef = null;
  channel = null;
  consumerTag = null;
}; // this function is used to close the connection and reset the variables, we will use it when we want to stop consuming messages or when we encounter an error

const handleMessage = async (msg: ConsumeMessage, ch: Channel) => {
  const raw = msg.content.toString("utf-8");
  const event = JSON.parse(raw) as AuthRegisteredEvent;

  await userService.syncFromAuthUser(event.payload);

  ch.ack(msg);
}; // this function is used to handle the incoming messages, we will parse the message content, call the user service to sync the user data from the auth event, and then acknowledge the message to remove it from the queue

export const startAuthEventConsumer = async () => {
  if (!env.RABBITMQ_URL) {
    logger.error("RABBITMQ_URL is not defined in the environment variables");
    return;
  }

  if (channel) {
    return; // if the channel already exists, we are already consuming messages, so we can just return
  }

  const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection; // we create a new connection to the RabbitMQ server, and we cast it to our ManageConnection type to manage the connection and channel together
  connectionRef = connection;

  const ch = await connection.createChannel(); // we create a new channel from the connection, we will use this channel to consume messages and acknowledge them
  channel = ch;

  await ch.assertExchange(AUTH_EVENT_EXCHANGE, "topic", { durable: true }); // we assert the exchange to make sure it exists, we use a topic exchange to allow for flexible routing of messages based on the routing key
  const q = await ch.assertQueue(QUEUE_NAME, { durable: true }); // we assert the queue to make sure it exists, we set it to durable so that it will survive RabbitMQ restarts

  await ch.bindQueue(
    q.queue,
    AUTH_EVENT_EXCHANGE,
    AUTH_USER_REGISTERED_ROUTING_KEY,
  ); // we bind the queue to the exchange with the specific routing key for auth user registered events, this way we will only receive messages with this routing key in our queue

  const consumeHandler = (msg: ConsumeMessage | null) => {
    if (!msg) return; // if the message is null, we can just return, this can happen when the consumer is canceled or when the channel is closed

    void handleMessage(msg, ch).catch((e: unknown) => {
      logger.error({ err: e }, "Error handling auth event message");
      ch.nack(msg, false, false); // if there is an error handling the message, we nack it to remove it from the queue and prevent it from being re-delivered, we set requeue to false because we don't want to retry processing the same message if it fails
    });
  };

  const result: Replies.Consume = await ch.consume(q.queue, consumeHandler); // we start consuming messages from the queue, we pass the consume handler to process the incoming messages, and we store the consumer tag to be able to cancel the consumer later if needed
  consumerTag = result.consumerTag; // we store the consumer tag to be able to cancel the consumer later if needed

  connection.on("close", () => {
    logger.info("Auth Consumer connection closed!");
    connectionRef = null;
    channel = null;
    consumerTag = null;
  });

  connection.on("error", (err) => {
    logger.error({ err }, "Auth Consumer connection error!");
  });

  logger.info("Auth Consumer started and waiting for messages...");
};

export const stopAuthEventConsumer = async () => {
  try {
    const ch = channel;
    if (ch && consumerTag) {
      await ch.cancel(consumerTag); // we cancel the consumer to stop receiving messages, we use the consumer tag to identify which consumer to cancel
    }

    if (ch) {
      await ch.close(); // we close the channel to release the resources, this will also trigger the connection close event which will reset the variables
      channel = null;
    }

    const conn = connectionRef;
    if (conn) {
      await closeConnection(conn); // we close the connection to release the resources, this will also reset the variables
      connectionRef = null;
    }
  } catch (e: unknown) {
    logger.error({ err: e }, "Error stopping Auth Consumer");
  }
};
