import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { gsap } from 'gsap';

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 3;

const scene = new THREE.Scene();
let drone;
let mixer;
const loader = new GLTFLoader();
loader.load(
  'animated_drone.glb',
  function (gltf) {
    drone = gltf.scene;
    scene.add(drone);

    mixer = new THREE.AnimationMixer(drone);
    mixer.clipAction(gltf.animations[0]).play();
    modelMove();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  function (error) {
    console.log('An error happened: ', error);
  }
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three').appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// axis helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const topLight = new THREE.DirectionalLight(0xffffff);
topLight.position.set(5, 5, 5);
scene.add(topLight);

const reRender = () => {
  requestAnimationFrame(reRender);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
};
reRender();

const arrPos = [
  {
    id: 'section1',
    position: { x: -0.18, y: -0.15, z: 0 },
    positionMobile: { x: 0, y: -0.3, z: -2 },
    rotation: { x: 0.2, y: 0.5, z: 0 },
  },
  {
    id: 'section2',
    position: { x: 0.3, y: -0.15, z: 0 },
    positionMobile: { x: 0.1, y: 0.08, z: -2 },
    rotation: { x: 0, y: -0.5, z: 0 },
  },
  {
    id: 'section3',
    position: { x: 0, y: -0.15, z: -2 },
    positionMobile: { x: -0.1, y: -0.4, z: -3 },
    rotation: { x: 0.2, y: 0.3, z: 0 },
  },
  {
    id: 'section4',
    position: { x: -0.2, y: 0, z: 0 },
    positionMobile: { x: 0, y: 0.12, z: -2 },
    rotation: { x: 1.5, y: 0, z: 0 },
  },
];

const modelMove = () => {
  const sections = document.querySelectorAll('.section');
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPos.findIndex((item) => item.id === currentSection);
  if (position_active >= 0) {
    let new_coordinates = arrPos[position_active];
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const position = isMobile
      ? new_coordinates.positionMobile
      : new_coordinates.position;
    const rotation = new_coordinates.rotation;

    gsap.to(drone.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 3,
      ease: 'power2.out',
    });
    gsap.to(drone.rotation, {
      x: rotation.x,
      y: rotation.y,
      z: rotation.z,
      duration: 3,
      ease: 'back.out',
    });
  }
};

window.addEventListener('scroll', () => {
  if (drone) {
    modelMove();
  }
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
