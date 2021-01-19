import React, { useRef } from 'react';
import { useFrame, useLoader, useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import gltfModel from '../../assets/models/model-morph.gltf';

useLoader.preload(GLTFLoader, gltfModel);

const Morphtargets = ({ ...rest }) => {
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const clockRef = useRef(new THREE.Clock());

  const { nodes, animations, ...gltf } = useLoader<any>(GLTFLoader, gltfModel);

  const morphClip = animations.filter((a: any) => a.name === 'KeyAction')[0];
  nodes.Cube.material = new THREE.MeshNormalMaterial({ morphTargets: true });

  const meshRef = useUpdate<THREE.Mesh>(mesh => {
    console.log('hello', mesh, morphClip);
    mesh.updateMorphTargets();
    if (mesh.morphTargetInfluences) {
      mesh.morphTargetInfluences[0] = 1;
    }
    mixerRef.current = new THREE.AnimationMixer(mesh);
    const action = mixerRef.current.clipAction(morphClip);

    action.play();
  }, []);

  useFrame(() => {
    if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta());
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
