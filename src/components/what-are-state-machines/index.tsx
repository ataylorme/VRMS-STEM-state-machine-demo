import "./styles.css";

interface WhatAreStateMachinesProps {
  setShowDemo: (show: boolean) => void;
}

export default function WhatAreStateMachines(props: WhatAreStateMachinesProps) {
  const { setShowDemo } = props;
  return (
    <div id="content">
      <h1>VRMS-STEM State Machine Demo: How Elevators Think! 🛗</h1>
      <p>
        Hey there, future engineers! 👋 Ever wondered how elevators know what to
        do? They use something really cool called a{" "}
        <strong>state machine</strong>. Let's learn about it together!
      </p>
      <h2>What's a State Machine? 🤔</h2>
      <p>
        Think of a state machine like a flowchart that tells something (like an
        elevator) what it can and can't do at any moment. It's kind of like
        having a set of rules for a game:
      </p>
      <ul>
        <li>You can only be in one state at a time</li>
        <li>You can only move between states in specific ways</li>
        <li>Different things (events) happen in different states</li>
      </ul>
      <h2>Our Elevator Example 🏢</h2>
      <p>Our elevator has these main states (situations it can be in):</p>
      <h3>States</h3>
      <ol>
        <li>
          <strong>Idle</strong> - The doors are closed, waiting for someone to
          press a button
        </li>
        <li>
          <strong>Waiting</strong> - The doors are open, giving people time to
          get in or out
        </li>
        <li>
          <strong>Door Closed</strong> - The doors are closed and checking where
          to go next
        </li>
        <li>
          <strong>Moving</strong> - Going up or down to another floor
        </li>
        <li>
          <strong>Arrived</strong> - Just reached a floor and getting ready to
          let people in/out
        </li>
      </ol>
      <h3>What the Elevator Knows (Context) 📝</h3>
      <p>The elevator keeps track of:</p>
      <ul>
        <li>Which floor it's on right now</li>
        <li>Which floors it needs to visit</li>
        <li>Whether the doors are open or closed</li>
        <li>How long to wait with doors open</li>
        <li>The names of all the floors (like "Lobby" or "2nd Floor")</li>
      </ul>
      <h3>How It Works 🎮</h3>
      <ol>
        <li>
          <p>When you press a floor button:</p>
          <ul>
            <li>
              If the elevator is idle → It ensures doors are closed and gets
              ready to move
            </li>
            <li>
              If it's already moving → It adds that floor to its "to-visit" list
            </li>
          </ul>
        </li>
        <li>
          <p>The elevator is smart about visiting floors:</p>
          <ul>
            <li>
              If it's going up, it visits floors in order from bottom to top
            </li>
            <li>
              If it's going down, it visits floors in order from top to bottom
            </li>
            <li>It won't stop at a floor it's already on</li>
          </ul>
        </li>
        <li>
          <p>Safety features:</p>
          <ul>
            <li>Doors must be fully closed before moving</li>
            <li>
              The elevator waits a moment after arriving before opening doors
            </li>
            <li>
              It gives people enough time to enter/exit before closing doors
            </li>
          </ul>
        </li>
      </ol>
      <h2>Try It Yourself! 🚀</h2>
      <p>You can see the elevator in action and:</p>
      <ul>
        <li>Watch how it moves between different states</li>
        <li>See which floors it's planning to visit</li>
        <li>Understand how it makes decisions</li>
        <li>Press buttons to send it to different floors</li>
      </ul>
      <h2>Why Do We Use State Machines? 🌟</h2>
      <ol>
        <li>
          <strong>Safety</strong>: They help make sure things happen in the
          right order (like doors closing before moving)
        </li>
        <li>
          <strong>Organization</strong>: They make complicated systems easier to
          understand
        </li>
        <li>
          <strong>Reliability</strong>: They help prevent mistakes (like moving
          with doors open)
        </li>
        <li>
          <strong>Planning</strong>: They help us think about all the possible
          situations
        </li>
      </ol>
      <h2>Real-World Applications 🌍</h2>
      <p>
        State machines aren't just for elevators! They're used in lots of
        places:
      </p>
      <ul>
        <li>Traffic lights</li>
        <li>Vending machines</li>
        <li>Video game characters</li>
        <li>Automated car washes</li>
        <li>Smartphone apps</li>
      </ul>
      <p>
        Now you know how elevators "think" using state machines! Maybe you'll
        create your own state machine someday to solve a different problem! 🎉
      </p>
      <hr />
      <p>
        <em>
          This demo was created to help students learn about state machines and
          programming concepts at the STEM career fair.
        </em>
      </p>
      <center>
        <button
          type="button"
          onClick={() => setShowDemo(true)}
          style={{
            padding: "10px 20px",
            fontSize: "36px",
            textAlign: "center",
          }}
        >
          See the Elevator in Action!
        </button>
      </center>
    </div>
  );
}
