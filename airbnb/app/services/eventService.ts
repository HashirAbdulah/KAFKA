import { EventEmitter } from "events";

// Define event types
export enum EventTypes {
  PROFILE_UPDATED = "profile:updated",
  AUTH_STATE_CHANGED = "auth:stateChanged",
  PROPERTY_ADDED = "property:added",
  PROPERTY_UPDATED = "property:updated",
  PROPERTY_DELETED = "property:deleted",
  SETTINGS_UPDATED = "settings:updated",
}

// Create a singleton event emitter
class EventService {
  private static instance: EventService;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  // Subscribe to an event
  public subscribe(
    event: EventTypes,
    callback: (...args: any[]) => void
  ): void {
    this.emitter.on(event, callback);
  }

  // Unsubscribe from an event
  public unsubscribe(
    event: EventTypes,
    callback: (...args: any[]) => void
  ): void {
    this.emitter.off(event, callback);
  }

  // Emit an event
  public emit(event: EventTypes, ...args: any[]): void {
    this.emitter.emit(event, ...args);
  }
}

export const eventService = EventService.getInstance();
