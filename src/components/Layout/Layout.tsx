import React, { Suspense, useRef, useMemo } from 'react';
import { ReactThreeFiber, Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as styles from './styles.module.scss';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}

interface OrbitRef {
  update: Function;
}

extend({ OrbitControls });
const Controls: React.FC<any> = props => {
  const { gl, camera } = useThree();
  const ref = useRef<OrbitRef>();
  useFrame(() => ref.current?.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const Page: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <Canvas
          style={{
            background: 'radial-gradient(at 50% 70%, #200f20 40%, #090b1f 80%, #050523 100%)',
          }}
          camera={{ position: [0, 0, 15] }}
          shadowMap>
          <ambientLight intensity={0.4} />
          <mesh>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshNormalMaterial attach="material" />
          </mesh>
          <Controls
          // autoRotate
          // enablePan={false}
          // enableZoom={false}
          // enableDamping
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
};

export default Page;
