import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useUpdate } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { useStore } from '../../store/store';

import gltfModel from '../../assets/models/model-morph.glb';

const Guide = ({ ...rest }) => {
  const geoRef = useRef<THREE.BufferGeometry | undefined>();
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const currentTime = useStore(state => state.currentTime);

  const { nodes, animations } = useLoader<any>(GLTFLoader, gltfModel);

  const lightsClip = animations.filter((a: any) => a.name === 'LightAction')[0];

  useFrame(() => {
    if (mixerRef.current) mixerRef.current.setTime(currentTime);
  });

  const guideRef = useUpdate<THREE.Object3D>(obj => {
    console.log('Guide\n', obj);
    // console.log(lightsClip.tracks[0].values);
    // lightsClip.tracks[0].values = lightsClip.tracks[0].values.map(
    //   (value: number, index: number) => {
    //     // if (index > 100) return;
    //     if (index % 2 === 1) {
    //       // console.log(value);
    //       return value - 1;
    //     }
    //     return value;
    //   },
    // );
    mixerRef.current = new THREE.AnimationMixer(obj);
    const action = mixerRef.current.clipAction(lightsClip);

    action.play();
  }, []);

  useLayoutEffect(() => {
    if (!geoRef.current) {
      return;
    }
    // geoRef.current.translate(0, 0, 0);
    // geoRef.current.rotateZ((90 * Math.PI) / 180);
  }, []);

  return (
    <group {...rest} dispose={null}>
      <mesh position={nodes.Light.position} ref={guideRef}>
        <sphereGeometry
          args={[0.1, 8, 8, 0, Math.PI * 2, 0, Math.PI * 2]}
          attach="geometry"
          ref={geoRef}
        />
        <meshPhongMaterial
          color={0xffffff}
          emissive={new THREE.Color(0xffffff)}
          attach="material"
          flatShading={true}
        />
      </mesh>
    </group>
  );
};

export default Guide;
