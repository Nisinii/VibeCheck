import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

// ------------------------------------------------------------------
// CUSTOM SHADER: FLOWY LIQUID
// ------------------------------------------------------------------
const LiquidShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#a855f7") }, // Base Purple
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Calculate Wave Elevation (Only on top surface)
      float elevation = 0.0;
      if(position.y > 0.25) {
        elevation = sin(modelPosition.x * 3.0 + uTime * 2.0) * 0.05;
        elevation += sin(modelPosition.z * 2.0 + uTime * 1.5) * 0.03;
      }
      
      modelPosition.y += elevation;
      vElevation = elevation;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      // Create visual flow pattern
      float flow = sin(vUv.y * 10.0 + uTime) * 0.1;
      
      // Mix base color with elevation for pseudo-shadows
      vec3 finalColor = uColor + (vElevation * 0.5) + flow;
      
      gl_FragColor = vec4(finalColor, 0.95); // 0.95 Alpha
    }
  `
};

// ------------------------------------------------------------------
// 3D MODEL COMPONENT: BOBA BOT
// ------------------------------------------------------------------
const BobaBot = () => {
  const bodyRef = useRef();
  const leftPupilRef = useRef();
  const rightPupilRef = useRef();
  const liquidRef = useRef();
  const pinRef = useRef(); 

  // --- MATERIALS SETUP ---
  const materials = useMemo(() => {
    return {
      glass: new THREE.MeshPhysicalMaterial({
        transmission: 1,      
        opacity: 0.3,
        transparent: true,
        roughness: 0.05,
        metalness: 0,
        thickness: 0.1,
        ior: 1.5,
      }),
      lid: new THREE.MeshStandardMaterial({
        color: "#f3e8ff",    
        roughness: 0.2,
        metalness: 0.5,
      }),
      straw: new THREE.MeshPhysicalMaterial({
        color: "#e9d5ff",
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.5,
        thickness: 0.2,
      }),
      eyeSclera: new THREE.MeshStandardMaterial({
        color: "#e9d5ff", 
        roughness: 0.1,
        emissive: "#a855f7",
        emissiveIntensity: 0.2
      }),
      pupil: new THREE.MeshStandardMaterial({
        color: "#120e3e",    
        roughness: 0.1,
        metalness: 0.2
      }),
      blush: new THREE.MeshStandardMaterial({
        color: "#c893f9",    
        roughness: 0.6,
        metalness: 0
      }),
    }
  }, []);

  // --- ANIMATION LOOP ---
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { mouse } = state;

    // 1. Idle Float
    if (bodyRef.current) {
        bodyRef.current.position.y = Math.sin(t * 1.5) * 0.05;
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, mouse.x * 0.08, 0.05);
        bodyRef.current.rotation.y = Math.sin(t * 1) * 0.02;
    }

    // 2. Pin Float
    if (pinRef.current) {
      pinRef.current.position.y = Math.sin(t * 2 + 1) * 0.08; 
      pinRef.current.rotation.y = Math.sin(t * 1.5) * 0.1;
    }

    // 3. Liquid Shader Update
    if(liquidRef.current) {
      liquidRef.current.uniforms.uTime.value = t;
    }

    // 4. Pupil Tracking
    const targetX = mouse.x * 0.05;
    const targetY = mouse.y * 0.03;

    if (leftPupilRef.current && rightPupilRef.current) {
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(leftPupilRef.current.position.x, targetX, 0.15);
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(leftPupilRef.current.position.y, targetY, 0.15);
      
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(rightPupilRef.current.position.x, targetX, 0.15);
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(rightPupilRef.current.position.y, targetY, 0.15);
    }
  });

  return (
    <group scale={1.8}>
      
      <group ref={bodyRef}>
        {/* --- PART 1: GLASS CUP --- */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.35, 1, 32]} />
          {/* FIX: Added attach="material" */}
          <primitive object={materials.glass} attach="material" />
        </mesh>

        {/* --- PART 2: LIQUID --- */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.43, 0.36, 0.7, 32]} />
          <shaderMaterial 
            ref={liquidRef}
            args={[LiquidShader]}
            transparent={true}
          />
        </mesh>

        {/* --- PART 3: LID & STRAW --- */}
        <group position={[0, 0.5, 0]}>
          {/* Lid Rim */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.46, 0.05, 16, 64]} />
              {/* FIX: Added attach="material" */}
              <primitive object={materials.lid} attach="material" />
          </mesh>
          {/* Lid Top */}
          <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.46, 0.46, 0.02, 32]} />
              {/* FIX: Added attach="material" */}
              <primitive object={materials.lid} attach="material" />
          </mesh>
          {/* Straw */}
          <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, -0.1]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />
              {/* FIX: Added attach="material" */}
              <primitive object={materials.straw} attach="material" />
          </mesh>
        </group>

        {/* --- PART 4: EYES --- */}
        <group position={[0, 0.1, 0.42]}>
          {/* LEFT EYE */}
          <group position={[-0.2, 0, 0]}> 
              <mesh scale={[1, 1, 0.3]}>
                  <sphereGeometry args={[0.13, 32, 32]} />
                  {/* FIX: Added attach="material" */}
                  <primitive object={materials.eyeSclera} attach="material" />
              </mesh>
              <mesh ref={leftPupilRef} position={[0, 0, 0.11]} scale={[1, 1, 0.2]}>
                  <sphereGeometry args={[0.07, 32, 32]} />
                  {/* FIX: Added attach="material" */}
                  <primitive object={materials.pupil} attach="material" />
              </mesh>
          </group>

          {/* RIGHT EYE */}
          <group position={[0.2, 0, 0]}>
              <mesh scale={[1, 1, 0.3]}>
                  <sphereGeometry args={[0.13, 32, 32]} />
                  {/* FIX: Added attach="material" */}
                  <primitive object={materials.eyeSclera} attach="material" />
              </mesh>
              <mesh ref={rightPupilRef} position={[0, 0, 0.11]} scale={[1, 1, 0.2]}>
                  <sphereGeometry args={[0.07, 32, 32]} />
                  {/* FIX: Added attach="material" */}
                  <primitive object={materials.pupil} attach="material" />
              </mesh>
          </group>
        </group>

        {/* --- PART 5: FACE (BLUSH & SMILE) --- */}
        <group position={[0, -0.05, 0.41]}>
          {/* Left Blush Cheek */}
          <mesh position={[-0.22, 0, 0]} scale={[1, 0.6, 0.2]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              {/* FIX: Added attach="material" */}
              <primitive object={materials.blush} attach="material" />
          </mesh>
          
          {/* Right Blush Cheek */}
          <mesh position={[0.22, 0, 0]} scale={[1, 0.6, 0.2]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              {/* FIX: Added attach="material" */}
              <primitive object={materials.blush} attach="material" />
          </mesh>

          {/* Smile */}
          <mesh position={[0, -0.02, 0]} rotation={[0, 0, -Math.PI / 2 - (Math.PI * 0.5) / 2]}>
              <torusGeometry args={[0.1, 0.015, 12, 32, Math.PI * 0.5]} />
              {/* FIX: Added attach="material" */}
              <primitive object={materials.pupil} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
const BobaBotComponent = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] cursor-none relative z-10">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        
        {/* LIGHTING SETUP */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, 5, -5]} intensity={2} color="#d8b4fe" />
        <pointLight position={[0, -5, 5]} intensity={2} color="#a855f7" />

        {/* Global Float */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
           <BobaBot />
        </Float>
        
        {/* Environment */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default BobaBotComponent;