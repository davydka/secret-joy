import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useUpdate } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';

import gltfModel from '../../assets/models/model-morph.glb';

const Cube = ({ ...rest }) => {
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const currentTime = useStore(state => state.currentTime);

  const { nodes, animations } = useLoader<any>(GLTFLoader, gltfModel);

  const morphClip = animations.filter((a: any) => a.name === 'KeyAction')[0];

  const meshRef = useUpdate<THREE.Mesh>(mesh => {
    console.log('hello Key Cube', mesh);
    mesh.updateMorphTargets();
    if (mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[0] = 1;
    }
    mixerRef.current = new THREE.AnimationMixer(mesh);
    const action = mixerRef.current.clipAction(morphClip);

    action.play();
  }, []);

  useFrame(() => {
    if (mixerRef.current) mixerRef.current.setTime(currentTime);
  });

  return (
    <group {...rest} dispose={null}>
      <mesh
        ref={meshRef}
        dispose={null}
        geometry={nodes.Cube.geometry}
        material={nodes.Cube.material}
        position={nodes.Cube.position}
      />
    </group>
  );
};

export default Cube;
