import { setup, assign } from "xstate";
import type { ElevatorContext } from "./context";
import type { ElevatorEvent } from "./events";

export const elevatorMachine = setup({
  types: {
    context: {} as ElevatorContext,
    events: {} as ElevatorEvent,
  },
  actions: {
    increment: assign({
      count: ({ context }) => context.count + 1,
    }),
    decrement: assign({
      count: ({ context }) => context.count - 1,
    }),
  },
  guards: {},
}).createMachine({
  context: { count: 0 },
  on: {
    inc: { actions: "increment" },
    dec: { actions: "decrement" },
  },
  states: {},
});
