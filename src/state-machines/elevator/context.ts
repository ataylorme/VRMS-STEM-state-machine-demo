export interface ElevatorContext {
  count: number;
  currentFloor: number;
  destinyFloors: number[];
  doorWidth: number;
  elevatorWaitingTime: number;
  floorNames: string[];
  moveCounter: number; // Added counter to control movement speed
}
