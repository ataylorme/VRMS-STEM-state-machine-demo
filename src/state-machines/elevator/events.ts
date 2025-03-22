interface IncrementEvent {
  type: "inc";
}
interface DecrementEvent {
  type: "dec";
}
interface SelectFloorEvent {
  type: "SELECT_FLOOR";
  floor: number;
}
interface DoorOpenedEvent {
  type: "DOOR_OPENED";
}
interface DoorClosedEvent {
  type: "DOOR_CLOSED";
}
interface WaitTimeElapsedEvent {
  type: "WAIT_TIME_ELAPSED";
}
interface FloorArrivedEvent {
  type: "FLOOR_ARRIVED";
}
interface TickEvent {
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
