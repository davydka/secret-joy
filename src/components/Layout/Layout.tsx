import React, { Suspense, useRef } from 'react';
import { ReactThreeFiber, Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Morphtargets from '../MorphTargets/MorphTargets';
import gltfModel from '../../assets/models/model-morph.gltf';

useLoader.preload(GLTFLoader, gltfModel);

import styles from './styles.module.scss';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

interface OrbitRef {
  update: () => void;
}

extend({ OrbitControls });
const Controls: React.FC<any> = props => {
  const { gl, camera } = useThree();
  const ref = useRef<OrbitRef>();
  useFrame(() => ref.current?.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const Page: React.FC = ({ children }) => {
  const { nodes } = useLoader<any>(GLTFLoader, gltfModel);

  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <Canvas
          style={{
            background: 'radial-gradient(at 50% 70%, #200f20 40%, #090b1f 80%, #050523 100%)',
          }}
          camera={{
            // position: [0, 6, 15],
            position: nodes.Camera.position,
            rotation: nodes.Camera.rotation,
          }}
          shadowMap={true}>
          {/* <ambientLight intensity={0.4} /> */}
          <Morphtargets />
          {/* <pointLight intensity={1} position={[100, 50, 100]} rotation={[-Math.PI / 2, 0, 0]} /> */}
          <pointLight
            intensity={1}
            position={nodes.Light.position}
            rotation={nodes.Light.rotation}
          />
          <Controls
          // autoRotate={true}
          // enablePan={false}
          // enableZoom={false}
          // enableDamping={true}
          // dampingFactor={0.5}
          // rotateSpeed={1}
          // maxPolarAngle={Math.PI / 2}
          // minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </Suspense>
      <section className={styles.page}>{children}</section>
    </div>
  );
  /**/
};

export default Page;
