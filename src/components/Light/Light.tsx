import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useUpdate } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';

import gltfModel from '../../assets/models/model-morph.glb';

const Light = ({ ...rest }) => {
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const currentTime = useStore(state => state.currentTime);

  const { nodes, animations } = useLoader<any>(GLTFLoader, gltfModel);

  const lightsClip = animations.filter((a: any) => a.name === 'LightAction')[0];

  const lightsRef = useUpdate<THREE.Light>(light => {
    console.log('hello Light', light);
    mixerRef.current = new THREE.AnimationMixer(light);
    const action = mixerRef.current.clipAction(lightsClip);

    action.play();
  }, []);

  useFrame(() => {
    if (mixerRef.current) mixerRef.current.setTime(currentTime);
  });

  return (
    <group {...rest} dispose={null}>
      <directionalLight
        ref={lightsRef}
        intensity={0.85}
        position={nodes.Light.position}
        rotation={nodes.Light.rotation}
      />
    </group>
  );
};

export default Light;
