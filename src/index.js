import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import skyImage from "./textures/sky2.jpg";

//デバッグ
const gui = new dat.GUI({width:300, height:300});


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyImage);
scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(8, 8, 32, 32);

//color
const colorObject ={};//初期化
colorObject.depthColor = "#3f85ab";
colorObject.surfaceColor = "#b7d4e6";




// Material
const material = new THREE.ShaderMaterial({
vertexShader: vertexShader,
fragmentShader: fragmentShader,

uniforms:{
  uWaveLength:{value:0.28},//振幅
  uFrequency:{value: new THREE.Vector2(3.0,3.5)},//周波数
  uTime:{value:0.0},//時間
  uWaveSpeed:{value:0.9},//速度
  uDepthColor:{value: new THREE.Color(colorObject.depthColor)},//深色
  uSurfaceColor:{value: new THREE.Color(colorObject.surfaceColor)},//表面色
  uColorOffset:{value:0.03},//色相
  uColorMutiplier:{value:9.0},//輝度
  uSmallWaveElevation:{value:0.15},//小波の高さ
  uSmallWaveFrequency:{value:3.0},//小波の周波数
  uSmallWaveSpeed:{value:0.2},//小波の速度
},
});


//デバッグを追加
gui
.add(material.uniforms.uWaveLength,'value')
.min(0)
.max(1)
.step(0.001)
.name("uWaveLength");

gui
.add(material.uniforms.uFrequency.value,'x')
.min(0)
.max(10)
.step(0.001)
.name("uFrequencyX");
gui
.add(material.uniforms.uFrequency.value,'y')
.min(0)
.max(10)
.step(0.001)
.name("uFrequencyY");
gui
.add(material.uniforms.uWaveSpeed,'value')
.min(0)
.max(4)
.step(0.001)
.name("uWeaveSpeed");
gui
.add(material.uniforms.uColorOffset,'value')
.min(0)
.max(1)
.step(0.001)
.name("uColorOffset");
gui
.add(material.uniforms.uColorMutiplier,'value')
.min(0)
.max(10)
.step(0.001)
.name("uColorMutiplier");
gui
.add(material.uniforms.uSmallWaveElevation,'value')
.min(0)
.max(1)
.step(0.001)
.name("uSmallWaveElevation");
gui
.add(material.uniforms.uSmallWaveFrequency,'value')
.min(0)
.max(30)
.step(0.001)
.name("uSmallWaveFrequency");
gui
.add(material.uniforms.uSmallWaveSpeed,'value')
.min(0)
.max(4)
.step(0.001)
.name("uSmallWaveSpeed");

gui.addColor(colorObject,'depthColor').onChange(()=>{
  material.uniforms.uDepthColor.value .set(colorObject.depthColor);
});
gui.addColor(colorObject,'surfaceColor').onChange(()=>{
  material.uniforms.uSurfaceColor.value .set(colorObject.surfaceColor);
});

// gui.show(false);//guiを非表示


// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0.23, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);//カメラをマウスにより動かす
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  //カメラを演習場に周回させる
  camera.position.x = Math.sin(elapsedTime*0.1)*2.1;
  camera.position.z = Math.cos(elapsedTime*0.1)*1.2;

  // camera.lookAt(
  //   Math.cos(elapsedTime),
  //   Math.sin(elapsedTime)*0.2,
  //   Math.sin(elapsedTime)*0.4
  //   );

  // controls.update();//カメラの位置をマウスにより動かす

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
