import { useMachine } from "@xstate/react";
import { elevatorMachine } from "../../state-machines/elevator";
import { useEffect, useRef } from "react";
import "./styles.css";

// State coordinates for the diagram
const statePositions = {
  idle: { x: 150, y: 50 },
  opening: { x: 50, y: 150 },
  waiting: { x: 150, y: 150 },
  closing: { x: 250, y: 150 },
  doorClosed: { x: 250, y: 250 },
  moving: { x: 150, y: 250 },
  arrived: { x: 50, y: 250 },
};

// State descriptions for tooltips
const stateDescriptions = {
  idle: "Elevator is waiting for a floor selection with doors open",
  opening: "Doors are in the process of opening",
  waiting: "Doors are open, waiting for passengers",
  closing: "Doors are in the process of closing",
  doorClosed:
    "Doors are fully closed. Opens if no floors to visit, otherwise starts moving",
  moving: "Elevator is moving between floors",
  arrived: "Elevator has reached the target floor",
};

function StateDiagram({ currentState }: { currentState: string }) {
  return (
    <svg
      width="600"
      height="600"
      className="state-diagram"
      aria-label="Elevator State Machine Diagram"
      role="img"
    >
      {/* Draw connections between states */}
      <g className="connections">
        <path d="M150,50 L50,150" />
        <path d="M50,150 L150,150" />
        <path d="M150,150 L250,150" />
        <path d="M250,150 L250,250" />
        <path d="M250,250 L150,250" />
        <path d="M150,250 L50,250" />
        <path d="M50,250 L50,150" />
        {/* <path d="M250,250 Q150,200 50,150" className="transition-path" /> */}
      </g>

      {/* Draw state circles */}
      {Object.entries(statePositions).map(([state, pos]) => (
        <g
          key={state}
          transform={`translate(${pos.x},${pos.y})`}
          className="state-group"
        >
          <title>
            {stateDescriptions[state as keyof typeof stateDescriptions]}
          </title>
          <circle
            r="20"
            className={`state-node ${currentState === state ? "active" : ""}`}
          />
          <text dy=".3em" textAnchor="middle" className="state-label">
            {state}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ElevatorComponent() {
  const [state, send] = useMachine(elevatorMachine);
  const prevTimeRef = useRef(Date.now());

  // Create a tick effect to simulate animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - prevTimeRef.current;
      prevTimeRef.current = now;

      send({ type: "TICK", deltaTime });
    }, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [send]);

  // Floor selection handler
  const handleFloorSelection = (floor: number) => {
    send({ type: "SELECT_FLOOR", floor });
  };

  // Get direction text
  const getDirectionText = () => {
    if (state.context.destinyFloors.length === 0) return null;

    const nextFloor = state.context.destinyFloors[0];
    if (nextFloor > state.context.currentFloor) {
      return "Going Up";
    }
    return "Going Down";
  };

  // Calculate elevator top position (simplified)
  const getElevatorStyle = () => {
    // Map floor number to position (simplification)
    const floorHeight = 65; // approximate height per floor

    // Use actual current floor value (which may be decimal during transition) for positioning
    const top = 395 - state.context.currentFloor * floorHeight;
    return { top: `${top}px` };
  };

  // Get current floor for display
  const getCurrentFloorName = () => {
    const floorIndex = Math.round(state.context.currentFloor);
    return state.context.floorNames[floorIndex];
  };

  // Get current floor index as integer for button disabling
  const getCurrentFloorIndex = () => Math.round(state.context.currentFloor);

  const directionText = getDirectionText();

  return (
    <div className="elevator-demo">
      <div className="sm-json">
        <pre>{JSON.stringify(state.context, null, 2)}</pre>
        <div className="state-diagram-container">
          <h3>State Machine Diagram</h3>
          <StateDiagram currentState={state.value as string} />
        </div>
      </div>
      <div className="handle">
        <div className="display">
          <div>{getCurrentFloorName()}</div>
          {directionText && <div>{directionText}</div>}
        </div>
        <div className="buttons">
          <div className="btn-container bottom">
            <button
              type="button"
              className={`btn-floor ${state.context.destinyFloors.includes(0) ? "active" : ""}`}
              onClick={() => handleFloorSelection(0)}
              disabled={getCurrentFloorIndex() === 0}
            >
              L
            </button>
          </div>
          {[1, 2, 3, 4, 5, 6].map((floor) => (
            <div key={floor} className="btn-container floor">
              <button
                type="button"
                className={`btn-floor floor ${state.context.destinyFloors.includes(floor) ? "active" : ""}`}
                onClick={() => handleFloorSelection(floor)}
                disabled={getCurrentFloorIndex() === floor}
              >
                {floor}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="building">
        <div className="elevator-container">
          <div className="elevator" style={getElevatorStyle()}>
            <div
              className="elevator-door"
              style={{ width: `${state.context.doorWidth}px` }}
            />
            <div className="elevator-light" />
          </div>
        </div>
        <div className="floors">
          {[0, 1, 2, 3, 4, 5, 6].map((floor) => (
            <div key={floor} className="floor" data-floor={floor}>
              {floor === 0 ? (
                <div className="floor-door" />
              ) : (
                <div className="floor-window" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
