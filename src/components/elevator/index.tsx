import { useMachine } from "@xstate/react";
import { elevatorMachine } from "../../state-machines/elevator";

export default function ElevatorComponent() {
  const [state, send] = useMachine(elevatorMachine);

  return (
    <>
      <div>{state.context.count}</div>
      <button type="button" onClick={() => send({ type: "inc" })}>
        Increment
      </button>
      <button type="button" onClick={() => send({ type: "dec" })}>
        Decrement
      </button>
    </>
  );
}
