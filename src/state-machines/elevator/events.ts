interface IncrementEvent {
  type: "inc";
}
interface DecrementEvent {
  type: "dec";
}

export type ElevatorEvent = IncrementEvent | DecrementEvent;
