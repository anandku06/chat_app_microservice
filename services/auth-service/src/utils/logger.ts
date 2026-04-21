import { createLogger } from "@chat_app/common";
import type { Logger } from "@chat_app/common";

export const logger: Logger = createLogger({ name: "auth-service" });

