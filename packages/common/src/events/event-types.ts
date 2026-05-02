/**
 * This file defines the types for events used in the application. It includes the structure of domain events, as well as the metadata associated with them. The types defined here are used to ensure consistency and type safety when working with events throughout the application.
 *
 * The `EventPayload` type is a generic record that can hold any key-value pairs, allowing for flexibility in the structure of event payloads. The `DomainEvent` interface defines the basic structure of an event, including its type, payload, and the time it occurred. The `EventMetaData` interface defines optional metadata that can be associated with events, such as correlation and causation IDs, as well as versioning information.
 *
 * The `OutBoundEvent` and `InBoundEvent` interfaces extend the `DomainEvent` interface to include metadata, with the distinction that outbound events may have optional metadata while inbound events require it. This design allows for clear differentiation between events being sent out and those being received, ensuring that necessary information is included when processing inbound events.
 */

export type EventPayload = Record<string, unknown>;

export interface DomainEvent<
  TType extends string,
  TPayload extends EventPayload,
> {
  type: TType;
  payload: TPayload;
  occurredAt: string;
}

export interface EventMetaData {
  correlationId?: string;
  causationId?: string;
  version?: number;
}

export interface OutBoundEvent<
  TType extends string,
  TPayload extends EventPayload,
> extends DomainEvent<TType, TPayload> {
  metaData?: EventMetaData;
}

export interface InBoundEvent<
  TType extends string,
  TPayload extends EventPayload,
> extends DomainEvent<TType, TPayload> {
  metaData: EventMetaData;
}
