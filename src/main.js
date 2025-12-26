import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Raycaster + mouse/touch for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Scene
const scene = new THREE.Scene();

// Sky background
const textureLoader = new THREE.TextureLoader();
textureLoader.load('/sky.jpeg', (texture) => {
  scene.background = texture;
});

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2, 5);

// Renderer
const canvas = document.getElementById('grass');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(5, 10, 5);
scene.add(light);

// Grass group
const grassGroup = new THREE.Group();
scene.add(grassGroup);

// Load GLB blade
const loader = new GLTFLoader();
loader.load('/grassblade6.glb', (gltf) => {
  const blade = gltf.scene;

  // Create many blades
  for (let i = 0; i < 2500; i++) {
    const clone = blade.clone();
    clone.position.set(
      (Math.random() - 0.5) * 10,
      0,
      (Math.random() - 0.5) * 10
    );
    clone.rotation.y = Math.random() * Math.PI;
    clone.scale.setScalar(0.3 + Math.random() * 0.3);

    // Interaction state
    clone.userData.bend = 0;
    clone.userData.bendDir = new THREE.Vector3();

    grassGroup.add(clone);
  }
});

// Mouse movement
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Touch movement (mobile)
window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  // Wind sway + bend recovery
  grassGroup.children.forEach((blade, i) => {
    // Wind
    blade.rotation.x = Math.sin(time * 1.5 + i) * 0.08;

    // Bend away from cursor
    if (blade.userData.bend > 0.001) {
      const d = blade.userData.bendDir;

      blade.rotation.x -= d.z * blade.userData.bend * 0.4;
      blade.rotation.z += d.x * blade.userData.bend * 0.4;

      // Smooth decay
      blade.userData.bend *= 0.92;
    }
  });

  // Raycast for interaction
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(grassGroup.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0];
    const blade = hit.object;

    // Direction from hit point → blade
    const dir = new THREE.Vector3()
      .subVectors(blade.position, hit.point)
      .normalize();

    blade.userData.bendDir.copy(dir);
    blade.userData.bend = 1.0; // strong bend
  }

  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});