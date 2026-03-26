// Barrel file, means it re-exports everything from the specified modules. This allows other parts of the application to import from a single location instead of having to import from multiple files.
// Why? It simplifies imports and makes the code cleaner. Instead of having to import from multiple files, you can just import from this index file.

export * from "./logger";
export type { Logger } from "pino";
export * from "./env";
