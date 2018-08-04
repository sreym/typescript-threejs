import * as THREE from 'three';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;

function init(): void {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 1000);
  camera.position.z = 800;
  let texture = new THREE.TextureLoader().load('textures/crate.gif');
  let geometry = new THREE.SphereBufferGeometry(200, 100, 100);
  // let geometry = new THREE.BoxBufferGeometry(200, 200, 200);
  let material = new THREE.MeshBasicMaterial({ map: texture });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let lastX:any, lastY:any;
function onMouseMove(e:MouseEvent) {
  if (e.buttons != 1) {
    lastX = undefined;
    lastY = undefined;
    return;
  }
  if (lastX && lastY) {
    let dx = e.clientX - lastX;
    let dy = e.clientY - lastY;
    mesh.rotation.y += dx / 100;
    mesh.rotation.x += dy / 100;
  }
  lastX = e.clientX;
  lastY = e.clientY;
}

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();
