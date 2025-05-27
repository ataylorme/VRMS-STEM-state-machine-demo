import "./App.css";
import { useState } from "react";
import ElevatorComponent from "./components/elevator";
import WhatAreStateMachines from "./components/what-are-state-machines/index.tsx";

function App() {
  const [showDemo, setShowDemo] = useState(false);
  return (
    <>
      {showDemo ? (
        <div id="main">
          <ElevatorComponent />
        </div>
      ) : (
        <WhatAreStateMachines setShowDemo={setShowDemo} />
      )}
    </>
  );
}

export default App;
