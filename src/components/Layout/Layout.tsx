import React, { Suspense, useRef, useEffect } from 'react';
import { ReactThreeFiber, Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import loadable from '@loadable/component';
const LdPlyr = loadable(() => import('plyr-react'));
import 'plyr-react/dist/plyr.css';

import { useStore } from '../../store/store';

import Morphtargets from '../MorphTargets/MorphTargets';
import gltfModel from '../../assets/models/model-morph.gltf';
import track01 from '../../assets/audio/01.mp3';

useLoader.preload(GLTFLoader, gltfModel);

import styles from './styles.module.scss';

const audioSrc01 = {
  type: 'audio' as Plyr.MediaType,
  sources: [
    {
      src: track01,
      type: 'audio/mp3',
    },
  ],
};

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
const Controls: React.FC<any> = ({ plyrRef, ...props }) => {
  const { gl, camera } = useThree();
  const ref = useRef<OrbitRef>();
  const { setCurrentTime } = useStore();

  useFrame(() => {
    ref.current?.update();
    plyrRef.current?.plyr && setCurrentTime(plyrRef.current?.plyr.currentTime);
  });
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

const Page: React.FC = ({ children }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
  const { nodes } = useLoader<any>(GLTFLoader, gltfModel);
  const plyrRef = useRef<any>();

  useEffect(() => {
    if (!plyrRef.current && !plyrRef.current?.plyr) {
      return;
    }

    // sets loop params after init
    // which results in looping onplay
    plyrRef.current.plyr.autoplay = true;
    plyrRef.current.plyr.loop = true;

    plyrRef.current.plyr.hideControls = true;
  }, [plyrRef.current]);

  if (!window) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <Canvas
          concurrent={true}
          style={{
            background: 'radial-gradient(at 50% 70%, #200f20 40%, #090b1f 80%, #050523 100%)',
          }}
          camera={{
            position: nodes.Camera.position,
            rotation: nodes.Camera.rotation,
          }}
          shadowMap={true}>
          {/* <ambientLight intensity={0.4} /> */}
          <Morphtargets />
          {/* <pointLight intensity={1} position={[100, 50, 100]} rotation={[-Math.PI / 2, 0, 0]} /> */}
          <directionalLight
            intensity={1}
            position={nodes.Light.position}
            rotation={nodes.Light.rotation}
          />
          <Controls
            plyrRef={plyrRef}
            maxDistance={24}
            enablePan={false}
            // autoRotate={true}
            // enableZoom={false}
            enableDamping={true}
            dampingFactor={0.5}
            // rotateSpeed={1}
            // maxPolarAngle={Math.PI / 2}
            // minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </Suspense>
      <section className={styles.page}>{children}</section>
      <section className={styles.playerContainer}>
        <LdPlyr ref={plyrRef} source={audioSrc01} />
      </section>
    </div>
  );
  /**/
};

export default Page;
