// === Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Black background
document.body.appendChild(renderer.domElement);

// === Texture Loader ===
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('./textures/wood.jpg');
const metalTexture = textureLoader.load('./textures/metal.jpg');
const marbleTexture = textureLoader.load('./textures/marble.jpg');
const glowTexture = textureLoader.load('./textures/glow.jpg');
const stoneTexture = textureLoader.load('./textures/stone.jpg');
const glassTexture = textureLoader.load('./textures/glass.jpg');

// === Materials ===
const woodMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const metalMaterial = new THREE.MeshPhongMaterial({ map: metalTexture, shininess: 100 });
const marbleMaterial = new THREE.MeshLambertMaterial({ map: marbleTexture });
const glowMaterial = new THREE.MeshPhongMaterial({ map: glowTexture, shininess: 100 });
const stoneMaterial = new THREE.MeshStandardMaterial({ map: stoneTexture});
const glassMaterial = new THREE.MeshPhongMaterial({ map: glassTexture, shininess: 100 });

// === Room ===
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), woodMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), stoneMaterial);
backWall.position.set(0, 5, -10);
scene.add(backWall);

const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), stoneMaterial);
sideWall.rotation.y = Math.PI / 2;
sideWall.position.set(-10, 5, 0);
scene.add(sideWall);

// === Windows ===

// Back wall window (centered)
const window1 = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 3),  // width, height
  glassMaterial
);
window1.position.set(0, 5, -9.99); // slightly in front of back wall
scene.add(window1);

// Side wall window (right side)
const window2 = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  glassMaterial
);
window2.rotation.y = Math.PI / 2;
window2.position.set(-9.99, 5, 3); // slightly off wall so no z-fighting
scene.add(window2);

// === Table ===
const tableTop = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 3), woodMaterial);
tableTop.position.set(0, 2, 0);
scene.add(tableTop);

const makeLeg = (x, z) => {
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), metalMaterial);
  leg.position.set(x, 1, z);
  scene.add(leg);
};
makeLeg(-2, -1.3); makeLeg(2, -1.3); makeLeg(-2, 1.3); makeLeg(2, 1.3);

// === Counter / Bar ===
const counter = new THREE.Mesh(new THREE.BoxGeometry(8, 2.5, 2), woodMaterial);
counter.position.set(-6, 1.25, 5);
scene.add(counter);

// === Stools ===
for (let i = -2; i <= 2; i += 2) {
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 32), woodMaterial);
  seat.position.set(-6, 2.6, 5 + i);
  scene.add(seat);

  const stoolLegs = [
    new THREE.Vector3(-6.4, 1.3, 5 + i - 0.4),
    new THREE.Vector3(-5.6, 1.3, 5 + i - 0.4),
    new THREE.Vector3(-6.4, 1.3, 5 + i + 0.4),
    new THREE.Vector3(-5.6, 1.3, 5 + i + 0.4)
  ];
  stoolLegs.forEach(pos => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.6), metalMaterial);
    leg.position.copy(pos);
    scene.add(leg);
  });
}

// === Bookshelf (wider) ===
const shelfWidth = 3;      // wider
const shelfHeight = 5;
const shelfDepth = 0.5;
const numShelves = 4;

// Bookshelf frame (sides)
const side1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, shelfHeight, shelfDepth),
  woodMaterial
);
side1.position.set(7, shelfHeight / 2, -5);
scene.add(side1);

const side2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, shelfHeight, shelfDepth),
  woodMaterial
);
side2.position.set(7 + shelfWidth - 0.2, shelfHeight / 2, -5);
scene.add(side2);

// Back panel
const backPanel = new THREE.Mesh(
  new THREE.BoxGeometry(shelfWidth, shelfHeight, 0.1),
  woodMaterial
);
backPanel.position.set(7 + shelfWidth / 2 - 0.1, shelfHeight / 2, -5 - 0.2);
scene.add(backPanel);

// Bookshelf shelves (thicker)
for (let i = 0; i < numShelves; i++) {
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(shelfWidth, 0.2, shelfDepth),
    woodMaterial
  );
  shelf.position.set(7 + shelfWidth / 2 - 0.1, (i + 1) * (shelfHeight / (numShelves + 1)), -5);
  scene.add(shelf);
}

// Optional: Add books
for (let i = 0; i < numShelves; i++) {
  const booksPerShelf = 6; // more books to fill width
  for (let j = 0; j < booksPerShelf; j++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.7, 0.1),
      new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    );
    book.position.set(
      7 + 0.2 + j * 0.5, // spread books across wider shelf
      (i + 1) * (shelfHeight / (numShelves + 1)),
      -5
    );
    scene.add(book);
  }
}

// === Hanging Lamp ===
const lampShade = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), glowMaterial);
lampShade.position.set(0, 9, 0);
lampShade.rotation.x = Math.PI;
scene.add(lampShade);

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffaa55, 1, 20);
pointLight.position.set(0, 8, 0);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// === Camera ===
camera.position.set(10, 6, 12);
camera.lookAt(0, 2, 0);

// === Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === WASD Movement ===
const moveSpeed = 0.2;
const keys = { w: false, a: false, s: false, d: false };

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
});

// === Rain Particles ===
const rainCount = 1000;
const rainGeometry = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 3);

for (let i = 0; i < rainCount; i++) {
  rainPositions[i * 3] = Math.random() * 40 - 20;
  rainPositions[i * 3 + 1] = Math.random() * 20 + 5;
  rainPositions[i * 3 + 2] = Math.random() * 40 - 20;
}

rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));

const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaff,
  size: 0.1,
  transparent: true
});

const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);

// === Animate ===
function animate() {
  requestAnimationFrame(animate);

  // WASD camera movement
  if (keys.w) camera.position.z -= moveSpeed;
  if (keys.s) camera.position.z += moveSpeed;
  if (keys.a) camera.position.x -= moveSpeed;
  if (keys.d) camera.position.x += moveSpeed;

  camera.lookAt(0, 2, 0); // Keep looking at the table

    // Rain falling animation
    const positions = rainGeometry.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3 + 1] -= 0.2;
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = Math.random() * 20 + 10;
      }
    }
    rainGeometry.attributes.position.needsUpdate = true;

    // === Lamp flicker animation ===
const time = Date.now() * 0.001; // time in seconds
const flicker = (Math.sin(time * 2) + 1) / 2; // oscillates 0–1
glowMaterial.emissiveIntensity = 0.3 + flicker * 0.7; // smooth glow
lampShade.intensity = 0.5 + flicker * 0.7; // sync the actual light

  
    renderer.render(scene, camera);
  }
  animate();


