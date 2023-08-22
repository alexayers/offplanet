# The Outpost


![Screenshot](https://github.com/alexayers/offplanet/blob/main/images/screenshot.png?raw=true)

**Entrypoint**

The main entry point is ./src/app/main.ts which initiates screens, and starts the initial screen  
./src/app/screens/planetSurface.ts.

**What is a Screen?**

Everything in the engine is organized around the concept of a screen which handles input and state management for a given renderer (ie: what you currently see on the screen). 

1. init: A function called during initiation of the class which sets up the ECS for a given screen
2. onEnter: A function called every time you return to the screen from another screen
3. onExit: A function called every time to leave the screen for another screen
4. keyboard: A function for all your keyboard handling
5. mouseClick: A function for processing all mouse click events
6. mouseMove: A function for processing all mouse move events
7. logicLoop: A function for processing all your game's logic
8. renderLoop: A function for processing all your game's rendering

**Main Game Loop**

1. Execute any shared global logic (ie: think something like the passage of time which occurs regardless of the current screen)
2. Execute current screen logic
3. Clear screen
4. Execute current game screen renderLoop
5. Go to 1

**Run dependencies:**

`npm install`

**To run:**

`npm run start`

**How to Play**

You can use the arrow keys to walk around. 

Use 1 or 2 to switch between drill and wrench. Drill can break rocks on planet surface.

Press space to open doors. 

**Additional Code Credit**

I ported the Javascript ray caster from https://github.com/almushel/raycast-demo to Typescript and cleaned up the code to make it more reusable. The ported code is found in ./src/lib/rendering/rayCaster 
