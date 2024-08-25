// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xe11d48); // Light gray background, change as needed

const camera = new THREE.PerspectiveCamera(55, 600 / 400, 0.1, 1000);
camera.position.set(0, 2, -15);
camera.lookAt(0, 0, 0);

const canvas = document.getElementById('laptopCanvas');
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(300, 200);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;


// Create a simple environment map
function createSimpleEnvironmentMap() {
    const format = renderer.capabilities.isWebGL2 ? THREE.RedFormat : THREE.LuminanceFormat;
    const colors = new Uint8Array([0, 0, 0, 255, 255, 255]);
    const gradientMap = new THREE.DataTexture(colors, 2, 1, format);
    gradientMap.needsUpdate = true;
    
    const cubeSize = 512;
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(cubeSize, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
    });
    
    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
    
    const material = new THREE.MeshBasicMaterial({
        map: gradientMap,
        side: THREE.BackSide,
    });
    
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material);
    scene.add(mesh);
    
    cubeCamera.update(renderer, scene);
    scene.remove(mesh);
    
    return cubeRenderTarget.texture;
}

// Create the environment map
const envMap = createSimpleEnvironmentMap();
scene.environment = envMap;


// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional lights for all sides
const createDirectionalLight = (x, y, z) => {
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(x, y, z);
    scene.add(light);
};

createDirectionalLight(5, 5, 5);   // Top-right-front
createDirectionalLight(-5, 5, 5);  // Top-left-front
createDirectionalLight(0, -5, 5);  // Bottom-front
createDirectionalLight(0, 5, -5);  // Top-back
createDirectionalLight(0, -5, -5); // Bottom-back

// Add a bright point light for the laptop screen
const screenLight = new THREE.PointLight(0xffffff, 2);
screenLight.position.set(0, 1, 1);

// Set up orbit controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true; // Adds inertia to the rotation
controls.dampingFactor = 0.05; // Adjusts the smoothness of the rotation
controls.rotateSpeed = 0.5; // Adjusts the rotation speed
controls.autoRotate = true; // Enables auto-rotation
controls.autoRotateSpeed = 1.0; // Adjusts the speed of auto-rotation
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 3;
controls.maxPolarAngle = Math.PI / 2;

// Load the 3D model
const loader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

let model;
loader.load('assets/mac-draco.glb', (gltf) => {
    model = gltf.scene;
    model.rotation.x = -Math.PI / 6; // Tilt laptop to about 60 degrees
    model.rotation.y = Math.PI;
    model.position.y = 0; // Place laptop at the center
    scene.add(model);

    // Add the screen light as a child of the model
    model.add(screenLight);

    // Improve material quality
    model.traverse((child) => {
        if (child.isMesh) {
            child.material.envMapIntensity = 1;
            child.material.needsUpdate = true;
            
            if (child.name === 'screen') {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    emissive: 0xffffff,
                    emissiveIntensity: 0.8,
                    roughness: 0.1,
                    metalness: 0.1,
                    envMap: envMap
                });
            }
        }
    });


}, undefined, (error) => {
    console.error('An error occurred while loading the model:', error);
});


// Animation loop
function rotateAnimation() {
    requestAnimationFrame(rotateAnimation);

    // Update controls in the animation loop
    controls.update();

    renderer.render(scene, camera);
}

rotateAnimation();


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        const t = performance.now() * 0.001; // Current time in seconds

        // Subtle movement
        model.position.y = Math.sin(t / 2) * 0.8;
    }

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// this code was generated by claude