export interface ElevatorContext {
  count: number;
  currentFloor: number;
  destinyFloors: number[];
  doorOpen: boolean;
  elevatorWaitingTime: number;
  doorClosedWaitingTime: number;
  arrivedWaitingTime: number;
  floorNames: string[];
}
