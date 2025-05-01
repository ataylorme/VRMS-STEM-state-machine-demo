# VRMS-STEM State Machine Demo: How Elevators Think! 🛗

Hey there, future engineers! 👋 Ever wondered how elevators know what to do? They use something really cool called a **state machine**. Let's learn about it together!

## What's a State Machine? 🤔

Think of a state machine like a flowchart that tells something (like an elevator) what it can and can't do at any moment. It's kind of like having a set of rules for a game:
- You can only be in one state at a time
- You can only move between states in specific ways
- Different thing (events) happen in different states

## Our Elevator Example 🏢

Our elevator has these main states (situations it can be in):

### States
1. **Idle** - The doors are open, waiting for someone to press a button
2. **Opening** - The doors are opening up
3. **Waiting** - The doors are open, giving people time to get in or out
4. **Closing** - The doors are closing
5. **Door Closed** - The doors are fully closed and checking where to go next
6. **Moving** - Going up or down to another floor
7. **Arrived** - Reached a floor and getting ready to open doors

### What the Elevator Knows (Context) 📝

The elevator keeps track of:
- Which floor it's on right now
- Which floors it needs to visit
- How open or closed the doors are
- How long to wait with doors open
- The names of all the floors (like "Lobby" or "2nd Floor")

### How It Works 🎮

1. When you press a floor button:
   - If the elevator is idle → It starts closing its doors
   - If it's already moving → It adds that floor to its "to-visit" list

2. The elevator is smart about visiting floors:
   - If it's going up, it visits floors in order from bottom to top
   - If it's going down, it visits floors in order from top to bottom
   - It won't stop at a floor it's already on

3. Safety features:
   - Doors must be fully closed before moving
   - The elevator waits a moment after arriving before opening doors
   - It gives people enough time to enter/exit before closing doors

## Try It Yourself! 🚀

You can see the elevator in action and:
- Watch how it moves between different states
- See which floors it's planning to visit
- Understand how it makes decisions
- Press buttons to send it to different floors

## Why Do We Use State Machines? 🌟

1. **Safety**: They help make sure things happen in the right order (like doors closing before moving)
2. **Organization**: They make complicated systems easier to understand
3. **Reliability**: They help prevent mistakes (like moving with doors open)
4. **Planning**: They help us think about all the possible situations

## Real-World Applications 🌍

State machines aren't just for elevators! They're used in lots of places:
- Traffic lights
- Vending machines
- Video game characters
- Automated car washes
- Smartphone apps

Now you know how elevators "think" using state machines! Maybe you'll create your own state machine someday to solve a different problem! 🎉

---
*This demo was created to help students learn about state machines and programming concepts at the STEM career fair.*

