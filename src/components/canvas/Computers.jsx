import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/AmineLogo.gltf");
  const logoRef = useRef();  // Add a ref to track the logo mesh
  const spotLightRef = useRef();  // Ref to track the spotlight


  // Rotate the logo on the Y-axis (for pole-like rotation)
  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // Adjust speed of rotation here
    }

    if (spotLightRef.current) {
      // Dynamically adjust the spotlight intensity based on rotation
      const angle = logoRef.current.rotation.y;
      // Make the intensity fluctuate between 1 and 3 based on the Y rotation of the logo
      spotLightRef.current.intensity = 1.5 + Math.sin(angle) * 1.5;
    }
  });

  return (
    <mesh ref={logoRef}> {/* Attach the ref to the mesh */}
      <hemisphereLight intensity={0.15} groundColor='black' />
{/* Constant ambient light for visibility at all times */}
      <ambientLight intensity={0.01} />

      {/* Spotlight with dynamic intensity */}
      <spotLight
        //ref={spotLightRef}  // Attach ref to control the spotlight
        position={[-20, 50, 2000]}  // Adjust position of the spotlight
        angle={0.12}
        penumbra={1}
        intensity={1}  // Initial intensity
        castShadow
        shadow-mapSize={1024}
      />
        <spotLight
        //ref={spotLightRef}  // Attach ref to control the spotlight
        position={[-20, 50, -2000]}  // Adjust position of the spotlight
        angle={0.12}
        penumbra={1}
        intensity={1}  // Initial intensity
        castShadow
        shadow-mapSize={1024}
      />
        


      <pointLight intensity={5} />
      
      <primitive
        object={computer.scene.children[0]}
        scale={isMobile ? 0.04 : 0.05} // Decrease the scale
        position={isMobile ? [0, -3, 0] : [0, -0.5, 0]} // Try adjusting this
        rotation={[-Math.PI / 2, 0, 0]} // Leave rotation the same
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const updateIsMobile = () => setIsMobile(window.innerWidth <= 500);
  
  updateIsMobile();  // Check on initial render
  
  window.addEventListener('resize', updateIsMobile);  // Add listener for window resize
  
  return () => {
    window.removeEventListener('resize', updateIsMobile);  // Clean up listener on unmount
  };
}, []);


  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
  enableZoom={false}
  maxPolarAngle={Math.PI / 2}
  minPolarAngle={Math.PI / 2}
  autoRotate={true}  // Enable auto rotation
  autoRotateSpeed={2} // Adjust the speed of the auto rotation
  minAzimuthAngle={-Infinity} // Allow infinite rotation on Y-axis
  maxAzimuthAngle={Infinity} // Allow infinite rotation on Y-axis
/>
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
