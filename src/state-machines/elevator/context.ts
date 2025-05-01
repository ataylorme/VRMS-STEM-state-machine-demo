export interface ElevatorContext {
  count: number;
  currentFloor: number;
  destinyFloors: number[];
  doorOpen: boolean;
  elevatorWaitingTime: number;
  doorClosedWaitingTime: number; // Add a delay after door closes before moving
  arrivedWaitingTime: number; // Add delay between arrival and door opening
  floorNames: string[];
}
