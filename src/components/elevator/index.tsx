import { useMachine } from "@xstate/react";
import { elevatorMachine } from "../../state-machines/elevator";
import { useEffect, useRef } from "react";
import "./styles.css";

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
      return "Subindo";
    }
    return "Descendo";
  };

  // Calculate elevator top position (simplified)
  const getElevatorStyle = () => {
    // Map floor number to position (simplification)
    const floorHeight = 65; // approximate height per floor
    const top = 395 - state.context.currentFloor * floorHeight;
    return { top: `${top}px` };
  };

  const directionText = getDirectionText();

  return (
    <div className="elevator-demo">
      <div className="handle">
        <div className="display">
          <div>{state.context.floorNames[state.context.currentFloor]}</div>
          {directionText && <div>{directionText}</div>}
        </div>
        <div className="buttons">
          <div className="btn-container bottom">
            <button
              type="button"
              className={`btn-floor ${state.context.destinyFloors.includes(0) ? "active" : ""}`}
              onClick={() => handleFloorSelection(0)}
            >
              T
            </button>
          </div>
          {[1, 2, 3, 4, 5, 6].map((floor) => (
            <div key={floor} className="btn-container floor">
              <button
                type="button"
                className={`btn-floor floor ${state.context.destinyFloors.includes(floor) ? "active" : ""}`}
                onClick={() => handleFloorSelection(floor)}
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
