export interface ElevatorContext {
  count: number;
  currentFloor: number;
  destinyFloors: number[];
  doorWidth: number;
  elevatorWaitingTime: number;
  doorClosedWaitingTime: number; // Add a delay after door closes before moving
  arrivedWaitingTime: number; // Add delay between arrival and door opening
  floorNames: string[];
  moveCounter: number; // Added counter to control movement speed
}
