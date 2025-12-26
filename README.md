# Interactive Grass Demo

A small Three.js experiment that renders a field of animated grass with:
- Wind sway
- Cursor interaction (grass bends away from the mouse)
- Touch interaction for mobile
- Sky background
- GLB grass blade model

## How to Run

1. Install dependencies:
   npm install

2. Start the development server:
   npm run dev

3. Open the project in your browser:
   http://localhost:5173

## Project Structure

- `main.js` — main Three.js scene, animation, interaction logic
- `public/sky.jpeg` — sky background image
- `public/grassblade6.glb` — grass blade model
- `index.html` — canvas container
- `package.json` — Vite config and scripts

## Notes

- Grass bends away from the cursor using raycasting
- Wind sway is procedural and blended with interaction
- Works on desktop and mobile