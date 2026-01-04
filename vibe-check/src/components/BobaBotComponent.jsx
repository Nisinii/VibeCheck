import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

// ------------------------------------------------------------------
// CUSTOM SHADER: FLOWY LIQUID
// ------------------------------------------------------------------
// This shader creates the waving effect on top of the liquid.
// Vertex Shader: Modifies geometry shape (creates the waves).
// Fragment Shader: Modifies color (creates the moving gradients).
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
      
      // Calculate Wave Elevation
      float elevation = 0.0;
      
      // Only animate vertices near the top of the liquid (y > 0.25)
      // This keeps the bottom of the liquid flat in the cup.
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
      // Create visual flow pattern based on UV coordinates and time
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
  // References for animating specific parts
  const bodyRef = useRef();
  const leftPupilRef = useRef();
  const rightPupilRef = useRef();
  const liquidRef = useRef();
  const pinRef = useRef(); 

  // --- MATERIALS SETUP ---
  // Using useMemo ensures materials are created once and reused (Performance)
  const materials = useMemo(() => {
    return {
      glass: new THREE.MeshPhysicalMaterial({
        transmission: 1,      // Glass-like transparency
        opacity: 0.3,
        transparent: true,
        roughness: 0.05,
        metalness: 0,
        thickness: 0.1,
        ior: 1.5,             // Index of Refraction for glass
      }),
      lid: new THREE.MeshStandardMaterial({
        color: "#f3e8ff",     // Pale lavender
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
        emissive: "#a855f7",  // Slight purple glow
        emissiveIntensity: 0.2
      }),
      pupil: new THREE.MeshStandardMaterial({
        color: "#120e3e",     // Deep Indigo/Black
        roughness: 0.1,
        metalness: 0.2
      }),
      blush: new THREE.MeshStandardMaterial({
        color: "#c893f9",     // Soft Pink/Purple
        roughness: 0.6,
        metalness: 0
      }),
    }
  }, []);

  // --- ANIMATION LOOP ---
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { mouse } = state;

    // 1. Idle Float Animation (Subtle Bobbing)
    if (bodyRef.current) {
        bodyRef.current.position.y = Math.sin(t * 1.5) * 0.05;
        // Rotate body slightly towards mouse X position
        bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, mouse.x * 0.08, 0.05);
        bodyRef.current.rotation.y = Math.sin(t * 1) * 0.02;
    }

    // 2. Pin Float Animation (Independent rhythm)
    if (pinRef.current) {
      pinRef.current.position.y = Math.sin(t * 2 + 1) * 0.08; 
      pinRef.current.rotation.y = Math.sin(t * 1.5) * 0.1;
    }

    // 3. Update Liquid Shader Time (Makes waves move)
    if(liquidRef.current) {
      liquidRef.current.uniforms.uTime.value = t;
    }

    // 4. Mouse Tracking for Pupils (Follow the cursor)
    const targetX = mouse.x * 0.05;
    const targetY = mouse.y * 0.03;

    if (leftPupilRef.current && rightPupilRef.current) {
      // Lerp (Linear Interpolation) smoothens the movement
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(leftPupilRef.current.position.x, targetX, 0.15);
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(leftPupilRef.current.position.y, targetY, 0.15);
      
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(rightPupilRef.current.position.x, targetX, 0.15);
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(rightPupilRef.current.position.y, targetY, 0.15);
    }
  });

  return (
    <group scale={1.8}> {/* Master Scale for the whole bot */}
      
      <group ref={bodyRef}>
        {/* --- PART 1: GLASS CUP --- */}
        <mesh position={[0, 0, 0]}>
          {/* CylinderArgs: [RadiusTop, RadiusBottom, Height, Segments] */}
          <cylinderGeometry args={[0.45, 0.35, 1, 32]} />
          <primitive object={materials.glass} />
        </mesh>

        {/* --- PART 2: LIQUID --- */}
        {/* Positioned at y=-0.15 so it fills the bottom half perfectly */}
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
          {/* Lid Rim (Torus) */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.46, 0.05, 16, 64]} />
              <primitive object={materials.lid} />
          </mesh>
          {/* Lid Top (Flattened Cylinder) */}
          <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.46, 0.46, 0.02, 32]} />
              <primitive object={materials.lid} />
          </mesh>
          {/* Straw (Cylinder) */}
          <mesh position={[0.15, 0.2, 0]} rotation={[0, 0, -0.1]}>
              {/* Shortened straw height to 0.6 for cuteness */}
              <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />
              <primitive object={materials.straw} />
          </mesh>
        </group>

        {/* --- PART 4: EYES --- */}
        <group position={[0, 0.1, 0.42]}>
          {/* LEFT EYE */}
          <group position={[-0.2, 0, 0]}> 
              <mesh scale={[1, 1, 0.3]}>
                  <sphereGeometry args={[0.13, 32, 32]} />
                  <primitive object={materials.eyeSclera} />
              </mesh>
              <mesh ref={leftPupilRef} position={[0, 0, 0.11]} scale={[1, 1, 0.2]}>
                  <sphereGeometry args={[0.07, 32, 32]} />
                  <primitive object={materials.pupil} />
              </mesh>
          </group>

          {/* RIGHT EYE */}
          <group position={[0.2, 0, 0]}>
              <mesh scale={[1, 1, 0.3]}>
                  <sphereGeometry args={[0.13, 32, 32]} />
                  <primitive object={materials.eyeSclera} />
              </mesh>
              <mesh ref={rightPupilRef} position={[0, 0, 0.11]} scale={[1, 1, 0.2]}>
                  <sphereGeometry args={[0.07, 32, 32]} />
                  <primitive object={materials.pupil} />
              </mesh>
          </group>
        </group>

        {/* --- PART 5: FACE (BLUSH & SMILE) --- */}
        <group position={[0, -0.05, 0.41]}>
          {/* Left Blush Cheek */}
          <mesh position={[-0.22, 0, 0]} scale={[1, 0.6, 0.2]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <primitive object={materials.blush} />
          </mesh>
          
          {/* Right Blush Cheek */}
          <mesh position={[0.22, 0, 0]} scale={[1, 0.6, 0.2]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <primitive object={materials.blush} />
          </mesh>

          {/* Smile (Half Torus) */}
          <mesh position={[0, -0.02, 0]} rotation={[0, 0, -Math.PI / 2 - (Math.PI * 0.5) / 2]}>
              {/* args: [radius, thickness, radialSegments, tubularSegments, arcLength] */}
              <torusGeometry args={[0.1, 0.015, 12, 32, Math.PI * 0.5]} />
              <primitive object={materials.pupil} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ------------------------------------------------------------------
// MAIN EXPORTED COMPONENT (CANVAS WRAPPER)
// ------------------------------------------------------------------
const BobaBotComponent = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] cursor-none relative z-10">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        
        {/* LIGHTING SETUP */}
        <ambientLight intensity={0.5} />
        {/* Key Light (White) */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        {/* Rim Light (Soft Purple) */}
        <pointLight position={[-10, 5, -5]} intensity={2} color="#d8b4fe" />
        {/* Fill Light (Deep Purple) */}
        <pointLight position={[0, -5, 5]} intensity={2} color="#a855f7" />

        {/* Global Float for the entire scene */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
           <BobaBot />
        </Float>
        
        {/* City Environment Reflection */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default BobaBotComponent;