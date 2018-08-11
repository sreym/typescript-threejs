import * as THREE from 'three';
import * as initFBXLoader from './fbxloader.js';
initFBXLoader(THREE);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mesh: THREE.Mesh;
let raycaster: THREE.Raycaster;
let clock = new THREE.Clock();

let mouse = new THREE.Vector2();

let light1:THREE.PointLight;

let mixers:any[] = [];

function init(): void {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 1000);
  raycaster = new THREE.Raycaster();
  camera.position.z = 800;
  let texture = new THREE.TextureLoader().load('textures/crate.gif');
  let geometry = new THREE.SphereBufferGeometry(200, 100, 100);
  // let geometry = new THREE.BoxBufferGeometry(200, 200, 200);
  // let material = new THREE.MeshBasicMaterial({ map: texture });
  let material = new THREE.MeshLambertMaterial( { color: 0x2194CE } );
  mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  light1 = new THREE.PointLight( 0xff0040, 10, 2000 );
  scene.add( light1 );
  light1.position.set(100, 0, 300);

  var loader = new THREE.FBXLoader();
  loader.load( 'Samba Dancing.fbx', function ( object:any ) {
    object.mixer = new THREE.AnimationMixer( object );
    mixers.push( object.mixer );
    var action = object.mixer.clipAction( object.animations[ 0 ] );
    action.play();
    object.traverse( function ( child:any ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    scene.add( object );
  } );

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
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
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
  raycaster.setFromCamera( mouse, camera );
  let intersects = raycaster.intersectObjects( scene.children );
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.scale.x *= 1.001;
  }

  if ( mixers.length > 0 ) {
    for ( var i = 0; i < mixers.length; i ++ ) {
      mixers[ i ].update( clock.getDelta() );
    }
  }
  renderer.render(scene, camera);
}

init();
animate();
