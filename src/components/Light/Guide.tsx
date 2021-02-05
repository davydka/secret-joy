import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useUpdate } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';

import gltfModel from '../../assets/models/model-morph.glb';

const Guide = ({ ...rest }) => {
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const currentTime = useStore(state => state.currentTime);

  const { nodes, animations } = useLoader<any>(GLTFLoader, gltfModel);

  const lightsClip = animations.filter((a: any) => a.name === 'LightAction')[0];

  useFrame(() => {
    if (mixerRef.current) mixerRef.current.setTime(currentTime);
  });

  const guideRef = useUpdate<THREE.Light>(light => {
    console.log('Guide\n', light);
    mixerRef.current = new THREE.AnimationMixer(light);
    const action = mixerRef.current.clipAction(lightsClip);

    action.play();
  }, []);

  useFrame(() => {
    if (mixerRef.current) mixerRef.current.setTime(currentTime);
  });

  return (
    <group {...rest} dispose={null}>
      <mesh position={nodes.Light.position} ref={guideRef}>
        <sphereGeometry args={[0.1, 8, 8, 0, Math.PI * 2, 0, Math.PI * 2]} attach="geometry" />
        <meshPhongMaterial color={0xffffff} attach="material" />
      </mesh>
    </group>
  );
};

export default Guide;
