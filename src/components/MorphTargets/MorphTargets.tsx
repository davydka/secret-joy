import React, { useRef } from 'react';
import { useFrame, useLoader, useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';

import gltfModel from '../../assets/models/model-morph.gltf';

useLoader.preload(GLTFLoader, gltfModel);

const Morphtargets = ({ ...rest }) => {
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const currentTime = useStore(state => state.currentTime);

  const { nodes, animations } = useLoader<any>(GLTFLoader, gltfModel);

  const morphClip = animations.filter((a: any) => a.name === 'KeyAction')[0];
  nodes.Cube.material = new THREE.MeshNormalMaterial({
    morphTargets: true,
    side: THREE.DoubleSide,
  });

  const meshRef = useUpdate<THREE.Mesh>(mesh => {
    console.log('hello', mesh);
    mesh.updateMorphTargets();
    if (mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[0] = 1;
    }
    mixerRef.current = new THREE.AnimationMixer(mesh); // todo: look at useAnimation
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
      />
    </group>
  );
};

export default Morphtargets;
