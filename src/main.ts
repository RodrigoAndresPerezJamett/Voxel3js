import * as THREE from "three";
import * as world from "./world";
import * as voxel from "./voxel";
import * as _playerEntity from "./playerEntity";
import * as _events from "./events";

const scene = new THREE.Scene();
const uiScene = new THREE.Scene();
const clock = new THREE.Clock();
let RENDER_DISTANCE = 10;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const playerEntity = _playerEntity.playerEntity;
playerEntity.setCamera(camera);

camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);
scene.background = new THREE.Color(0x87ceeb);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


const uiCamera = new THREE.OrthographicCamera(
  0,
  window.innerWidth,
  window.innerHeight,
  0,
  0,
  100
);

const canvas = document.createElement("canvas");

canvas.width = 200;
canvas.height = 50;

const ctx = canvas.getContext("2d")!;

const texture = new THREE.CanvasTexture(canvas);

const material = new THREE.SpriteMaterial({
  map: texture,
  transparent: true
});

const fpsSprite = new THREE.Sprite(material);

fpsSprite.scale.set(200, 50, 1);

fpsSprite.position.set(
  window.innerWidth - 50,
  window.innerHeight - 50,
  0
);

uiScene.add(fpsSprite);

// ====================
// Resize
// ====================

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  uiCamera.right = window.innerWidth;
  uiCamera.top = window.innerHeight;
  uiCamera.updateProjectionMatrix();

  fpsSprite.position.set(
    window.innerWidth - 50,
    window.innerHeight - 50,
    0
);
});

renderer.domElement.addEventListener("click", () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
    const locked = document.pointerLockElement === renderer.domElement;
    //console.log(locked ? "Mouse locked" : "Mouse unlocked");

    if (!locked) {
        playerEntity.components.cameraRotationLocked = true;
        playerEntity.components.cameraMovementLocked = true;
        playerEntity.components.movementLocked = true;
        playerEntity.components.rotationLocked = true;
    } else {
        playerEntity.components.cameraRotationLocked = false;
        playerEntity.components.cameraMovementLocked = false;
        playerEntity.components.movementLocked = false;
        playerEntity.components.rotationLocked = false;
    }
});

function initGame() {
    const start = performance.now();
    let voxelsCount = 0;
    const chunks = world.renderWorld(0, 0, 0, RENDER_DISTANCE);

    for (const matrices of chunks) {
        const voxels = voxel.createVoxel(matrices.length);
        voxelsCount += matrices.length;

        for (let i = 0; i < matrices.length; i++) {
            voxels.setMatrixAt(i, matrices[i]);
        }

        voxels.instanceMatrix.needsUpdate = true;
        scene.add(voxels);
    }

    const end = performance.now();

    playerEntity.setPosition(0, 2, 0);

    console.log(`initGame: ${(end - start).toFixed(2)} ms to instantiate ${voxelsCount} voxels`);
}

window.addEventListener("keydown", e => {
  //console.log("Key pressed:", e.code);
  _events.keys.add(e.code);
  _events.events.dispatchEvent(new KeyboardEvent("keydown", { code: e.code }));
});
window.addEventListener("keyup", e => {
  //console.log("Key released:", e.code);
  _events.keys.delete(e.code);
});

window.addEventListener("mousemove", e => {
    _events.events.dispatchEvent(new MouseEvent("mousemove", {
        movementX: e.movementX,
        movementY: e.movementY
    }));
});

window.addEventListener("mousedown", e => {
    console.log("Mouse click:", e.button);
});


function gameLoop() {
  requestAnimationFrame(gameLoop);



  const delta = clock.getDelta();
  const fps = 1 / delta;

  // Update FPS text
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "24px Arial";
  ctx.fillStyle = "white";

  ctx.fillText(`FPS: ${fps.toFixed(0)}`, 10, 30);

  texture.needsUpdate = true;

  renderer.autoClear = false;


  


  renderer.render(scene, camera);
  renderer.render(uiScene, uiCamera);
}


initGame();
gameLoop();