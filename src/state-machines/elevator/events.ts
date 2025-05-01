export interface IncrementEvent {
  type: "inc";
}
export interface DecrementEvent {
  type: "dec";
}
export interface SelectFloorEvent {
  type: "SELECT_FLOOR";
  floor: number;
}
export interface DoorOpenedEvent {
  type: "DOOR_OPENED";
}
export interface DoorClosedEvent {
  type: "DOOR_CLOSED";
}
export interface WaitTimeElapsedEvent {
  type: "WAIT_TIME_ELAPSED";
}
export interface FloorArrivedEvent {
  type: "FLOOR_ARRIVED";
}
export interface TickEvent {
  type: "TICK";
  deltaTime: number;
}

export type ElevatorEvent =
  | IncrementEvent
  | DecrementEvent
  | SelectFloorEvent
  | DoorOpenedEvent
  | DoorClosedEvent
  | WaitTimeElapsedEvent
  | FloorArrivedEvent
  | TickEvent;
