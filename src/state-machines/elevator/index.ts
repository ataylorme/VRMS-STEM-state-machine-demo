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
    addDestinyFloor: assign({
      destinyFloors: ({ context, event }) => {
        if (event.type !== "SELECT_FLOOR") return context.destinyFloors;

        // Only add if not already in the list and not the current floor
        if (
          context.destinyFloors.includes(event.floor) ||
          context.currentFloor === event.floor
        ) {
          return context.destinyFloors;
        }

        return [...context.destinyFloors, event.floor].sort((a, b) => {
          // Sort based on direction
          const goingUp =
            context.destinyFloors.length > 0 &&
            context.destinyFloors[0] > context.currentFloor;

          return goingUp ? a - b : b - a;
        });
      },
    }),
    decreaseDoorWidth: assign({
      doorWidth: ({ context }) => Math.max(1, context.doorWidth - 2),
    }),
    increaseDoorWidth: assign({
      doorWidth: ({ context }) => Math.min(34, context.doorWidth + 2),
    }),
    moveElevator: assign({
      currentFloor: ({ context }) => {
        if (context.destinyFloors.length === 0) return context.currentFloor;

        const targetFloor = context.destinyFloors[0];
        if (targetFloor === context.currentFloor) return context.currentFloor;

        // Move towards the target floor gradually (simplified in this implementation)
        return context.currentFloor < targetFloor
          ? context.currentFloor + 1
          : context.currentFloor - 1;
      },
    }),
    removeCurrentFloorFromDestiny: assign({
      destinyFloors: ({ context }) =>
        context.destinyFloors.filter((floor) => floor !== context.currentFloor),
    }),
    decreaseWaitingTime: assign({
      elevatorWaitingTime: ({ context, event }) =>
        event.type === "TICK"
          ? Math.max(0, context.elevatorWaitingTime - event.deltaTime)
          : context.elevatorWaitingTime,
    }),
    resetWaitingTime: assign({
      elevatorWaitingTime: () => 2000,
    }),
  },
  guards: {
    isDoorFullyOpen: ({ context }) => context.doorWidth <= 1,
    isDoorFullyClosed: ({ context }) => context.doorWidth >= 34,
    hasDestinyFloors: ({ context }) => context.destinyFloors.length > 0,
    hasReachedTargetFloor: ({ context }) => {
      return (
        context.destinyFloors.length > 0 &&
        context.currentFloor === context.destinyFloors[0]
      );
    },
    isWaitTimeElapsed: ({ context }) => context.elevatorWaitingTime <= 0,
  },
}).createMachine({
  context: {
    count: 0,
    currentFloor: 0,
    destinyFloors: [],
    doorWidth: 1, // Fully open
    elevatorWaitingTime: 2000,
    floorNames: [
      "Lobby",
      "1st Floor",
      "2nd Floor",
      "3rd Floor",
      "4th Floor",
      "5th Floor",
      "6th Floor",
    ],
  },
  initial: "idle",
  on: {
    inc: { actions: "increment" },
    dec: { actions: "decrement" },
    SELECT_FLOOR: {
      actions: "addDestinyFloor",
      target: ".closing",
    },
    TICK: {
      actions: "decreaseWaitingTime",
    },
  },
  states: {
    idle: {
      on: {
        SELECT_FLOOR: {
          target: "closing",
          actions: "addDestinyFloor",
        },
      },
    },
    opening: {
      on: {
        TICK: {
          actions: "decreaseDoorWidth",
        },
      },
      always: [
        {
          guard: "isDoorFullyOpen",
          target: "waiting",
          actions: "resetWaitingTime",
        },
      ],
    },
    waiting: {
      on: {
        TICK: {
          actions: "decreaseWaitingTime",
        },
      },
      always: [
        {
          guard: "isWaitTimeElapsed",
          target: "closing",
        },
      ],
    },
    closing: {
      on: {
        TICK: {
          actions: "increaseDoorWidth",
        },
      },
      always: [
        {
          guard: "isDoorFullyClosed",
          target: "moving",
        },
      ],
    },
    moving: {
      on: {
        TICK: {
          actions: "moveElevator",
        },
      },
      always: [
        {
          guard: "hasReachedTargetFloor",
          target: "opening",
          actions: "removeCurrentFloorFromDestiny",
        },
      ],
    },
  },
});
