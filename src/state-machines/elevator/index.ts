import { setup, assign } from "xstate";
import type { ElevatorContext } from "./context";
import type { ElevatorEvent } from "./events";

// Helper functions for elevator operations
const calculateNewPosition = (
  currentFloor: number,
  targetFloor: number,
  moveSpeed: number,
): number => {
  const direction = currentFloor < targetFloor ? 1 : -1;
  const newPosition = currentFloor + direction * moveSpeed;

  return currentFloor < targetFloor
    ? Math.min(newPosition, targetFloor)
    : Math.max(newPosition, targetFloor);
};

const sortDestinyFloors = (
  floors: number[],
  currentFloor: number,
  newFloor: number,
): number[] => {
  const goingUp = floors.length > 0 && floors[0] > currentFloor;
  return [...floors, newFloor].sort((a, b) => (goingUp ? a - b : b - a));
};

// Constants
const CONSTANTS = {
  WAITING_TIME: 2000,
  DOOR_CLOSE_DELAY: 500,
  ARRIVAL_DELAY: 500,
} as const;

// State machine configuration
export const elevatorMachine = setup({
  types: {} as {
    context: ElevatorContext;
    events: ElevatorEvent;
  },
  actions: {
    openDoors: assign({
      doorOpen: () => true,
    }),
    closeDoors: assign({
      doorOpen: () => false,
    }),
    addDestinyFloor: assign({
      destinyFloors: ({ context, event }) => {
        if (event.type !== "SELECT_FLOOR") return context.destinyFloors;
        if (
          context.destinyFloors.includes(event.floor) ||
          context.currentFloor === event.floor
        ) {
          return context.destinyFloors;
        }
        return sortDestinyFloors(
          context.destinyFloors,
          context.currentFloor,
          event.floor,
        );
      },
    }),
    moveElevator: assign({
      currentFloor: ({ context, event }) => {
        if (event.type !== "TICK") return context.currentFloor;
        if (context.destinyFloors.length === 0) return context.currentFloor;
        const targetFloor = context.destinyFloors[0];
        if (targetFloor === context.currentFloor) return context.currentFloor;

        const moveSpeed = event.deltaTime / 1000;
        return calculateNewPosition(
          context.currentFloor,
          targetFloor,
          moveSpeed,
        );
      },
    }),
    removeCurrentFloorFromDestiny: assign({
      destinyFloors: ({ context }) =>
        context.destinyFloors.filter(
          (floor: number) => floor !== context.currentFloor,
        ),
    }),
    decreaseWaitingTime: assign({
      elevatorWaitingTime: ({ context, event }) => {
        if (event.type !== "TICK") return context.elevatorWaitingTime;
        return Math.max(0, context.elevatorWaitingTime - event.deltaTime);
      },
    }),
    resetWaitingTime: assign({
      elevatorWaitingTime: () => CONSTANTS.WAITING_TIME,
    }),
    decreaseDoorClosedWaitingTime: assign({
      doorClosedWaitingTime: ({ context, event }) => {
        if (event.type !== "TICK") return context.doorClosedWaitingTime;
        return Math.max(0, context.doorClosedWaitingTime - event.deltaTime);
      },
    }),
    resetDoorClosedWaitingTime: assign({
      doorClosedWaitingTime: () => CONSTANTS.DOOR_CLOSE_DELAY,
    }),
    decreaseArrivedWaitingTime: assign({
      arrivedWaitingTime: ({ context, event }) => {
        if (event.type !== "TICK") return context.arrivedWaitingTime;
        return Math.max(0, context.arrivedWaitingTime - event.deltaTime);
      },
    }),
    resetArrivedWaitingTime: assign({
      arrivedWaitingTime: () => CONSTANTS.ARRIVAL_DELAY,
    }),
  },
  guards: {
    hasDestinyFloors: ({ context }) => context.destinyFloors.length > 0,
    hasNoDestinyFloors: ({ context }) => context.destinyFloors.length === 0,
    hasReachedTargetFloor: ({ context }) =>
      context.destinyFloors.length > 0 &&
      context.currentFloor === context.destinyFloors[0],
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
    doorOpen: false,
    elevatorWaitingTime: CONSTANTS.WAITING_TIME,
    doorClosedWaitingTime: CONSTANTS.DOOR_CLOSE_DELAY,
    arrivedWaitingTime: CONSTANTS.ARRIVAL_DELAY,
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
    SELECT_FLOOR: {
      target: ".doorClosed",
      actions: ["addDestinyFloor", "closeDoors"],
    },
  },
  states: {
    // Elevator is waiting with doors closed
    idle: {
      entry: "closeDoors",
      on: {
        SELECT_FLOOR: {
          target: "doorClosed",
          actions: ["addDestinyFloor", "closeDoors"],
        },
      },
    },
    // Doors are open, waiting for passengers
    waiting: {
      entry: ["openDoors", "resetWaitingTime"],
      on: {
        TICK: { actions: "decreaseWaitingTime" },
        SELECT_FLOOR: { actions: "addDestinyFloor" },
      },
      always: [
        {
          guard: "isWaitTimeElapsed",
          target: "doorClosed",
          actions: "closeDoors",
        },
      ],
    },
    // Doors are fully closed, preparing to move
    doorClosed: {
      entry: ["closeDoors", "resetDoorClosedWaitingTime"],
      on: {
        TICK: { actions: "decreaseDoorClosedWaitingTime" },
        SELECT_FLOOR: { actions: "addDestinyFloor" },
      },
      always: [
        {
          guard: "hasNoDestinyFloors",
          target: "idle",
        },
        {
          guards: ["isDoorClosedWaitTimeElapsed", "hasDestinyFloors"],
          target: "moving",
        },
      ],
    },
    // Elevator is moving between floors
    moving: {
      entry: "closeDoors",
      on: {
        TICK: { actions: "moveElevator" },
        SELECT_FLOOR: { actions: "addDestinyFloor" },
      },
      always: [
        {
          guard: "hasReachedTargetFloor",
          target: "arrived",
          actions: ["removeCurrentFloorFromDestiny", "resetArrivedWaitingTime"],
        },
      ],
    },
    // Elevator has reached destination floor
    arrived: {
      on: {
        TICK: { actions: "decreaseArrivedWaitingTime" },
        SELECT_FLOOR: { actions: "addDestinyFloor" },
      },
      always: [
        {
          guard: "isArrivedWaitTimeElapsed",
          target: "waiting",
        },
      ],
    },
  },
});
