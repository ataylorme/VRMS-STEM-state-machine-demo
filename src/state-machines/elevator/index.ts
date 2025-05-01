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
      currentFloor: ({ context, event }) => {
        if (context.destinyFloors.length === 0) return context.currentFloor;

        const targetFloor = context.destinyFloors[0];
        if (targetFloor === context.currentFloor) return context.currentFloor;

        // Calculate movement based on deltaTime
        // Moving at 1 floor per second
        const moveSpeed = (event.type === "TICK" ? event.deltaTime : 0) / 1000;

        // Determine direction and apply speed
        const direction = context.currentFloor < targetFloor ? 1 : -1;
        const newPosition = context.currentFloor + direction * moveSpeed;

        // Return new position
        return context.currentFloor < targetFloor
          ? Math.min(newPosition, targetFloor) // Moving up
          : Math.max(newPosition, targetFloor); // Moving down
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
    resetDoorStateOnIdle: assign({
      doorWidth: () => 1, // Fully open when idle
    }),
    ensureClosedDoors: assign({
      doorWidth: () => 34, // Ensure doors are fully closed when moving
    }),
    resetDoorClosedWaitingTime: assign({
      doorClosedWaitingTime: () => 500, // 500ms delay after door closes before moving
    }),
    decreaseDoorClosedWaitingTime: assign({
      doorClosedWaitingTime: ({ context, event }) =>
        event.type === "TICK"
          ? Math.max(0, context.doorClosedWaitingTime - event.deltaTime)
          : context.doorClosedWaitingTime,
    }),
    resetArrivedWaitingTime: assign({
      arrivedWaitingTime: () => 500, // 500ms delay after elevator arrives before opening door
    }),
    decreaseArrivedWaitingTime: assign({
      arrivedWaitingTime: ({ context, event }) =>
        event.type === "TICK"
          ? Math.max(0, context.arrivedWaitingTime - event.deltaTime)
          : context.arrivedWaitingTime,
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
    isDoorClosedWaitTimeElapsed: ({ context }) =>
      context.doorClosedWaitingTime <= 0,
    isArrivedWaitTimeElapsed: ({ context }) => context.arrivedWaitingTime <= 0,
  },
}).createMachine({
  context: {
    count: 0,
    currentFloor: 0,
    destinyFloors: [],
    doorWidth: 1, // Fully open
    elevatorWaitingTime: 0,
    doorClosedWaitingTime: 500, // 500ms delay after door closes
    arrivedWaitingTime: 500, // 500ms delay after elevator stops
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
      entry: "resetDoorStateOnIdle",
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
        SELECT_FLOOR: {
          actions: "addDestinyFloor",
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
          target: "doorClosed",
          actions: ["ensureClosedDoors", "resetDoorClosedWaitingTime"],
        },
      ],
    },
    doorClosed: {
      // New state to ensure a visual delay after doors close
      on: {
        TICK: {
          actions: "decreaseDoorClosedWaitingTime",
        },
        SELECT_FLOOR: {
          actions: "addDestinyFloor",
        },
      },
      always: [
        {
          guard: "isDoorClosedWaitTimeElapsed",
          target: "moving",
        },
      ],
    },
    moving: {
      entry: "ensureClosedDoors", // Double-ensure doors are closed when entering
      on: {
        TICK: {
          actions: "moveElevator",
        },
        SELECT_FLOOR: {
          actions: "addDestinyFloor",
        },
      },
      always: [
        {
          guard: "hasReachedTargetFloor",
          target: "arrived",
          actions: ["removeCurrentFloorFromDestiny", "resetArrivedWaitingTime"],
        },
      ],
    },
    arrived: {
      // New state to wait after arriving before opening doors
      on: {
        TICK: {
          actions: "decreaseArrivedWaitingTime",
        },
        SELECT_FLOOR: {
          actions: "addDestinyFloor",
        },
      },
      always: [
        {
          guard: "isArrivedWaitTimeElapsed",
          target: "opening",
        },
      ],
    },
  },
});
