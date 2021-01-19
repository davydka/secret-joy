import React, { useEffect, useRef } from 'react';
import { useFrame, useLoader, useResource, useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MDDLoader } from 'three/examples/jsm/loaders/MDDLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import model from '../../assets/models/model.mdd';
import gltfModel from '../../assets/models/model.gltf';
import fbxModel from '../../assets/models/model.fbx';
import objModel from '../../assets/models/model.obj';

useLoader.preload(FBXLoader, fbxModel);
useLoader.preload(GLTFLoader, gltfModel);
useLoader.preload(MDDLoader, model);
useLoader.preload(OBJLoader, objModel);

const vertices = new Float32Array([
  -1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  1.0,
  1.0,

  1.0,
  1.0,
  1.0,
  -1.0,
  1.0,
  1.0,
  -1.0,
  -1.0,
  1.0,
]);

const Morphtargets = ({ ...rest }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const cubeMeshRef = useRef<THREE.Mesh>();
  const mixerRef = useRef<THREE.AnimationMixer | undefined>();
  const clockRef = useRef(new THREE.Clock());

  const { nodes, ...gltf } = useLoader<any>(GLTFLoader, gltfModel);
  const { morphTargets, clip } = useLoader<any>(MDDLoader, model);
  const fbx = useLoader<any>(FBXLoader, fbxModel);
  const fbxMesh = fbx.children.filter(_item => _item.name === 'Cube')[0];
  fbxMesh.geometry.morphAttributes.position = morphTargets;
  const obj = useLoader<any>(OBJLoader, objModel);
  const objMesh = obj.children[0];
  objMesh.geometry.morphAttributes.position = morphTargets;

  // console.log('fbx', fbxMesh);
  // console.log('obj', objMesh);

  nodes.Cube.geometry.morphAttributes.position = morphTargets;
  nodes.Cube.material = new THREE.MeshNormalMaterial({ morphTargets: true });
  const morphTargetInfluences = [];
  for (let i = 0, l = morphTargets.length; i < l; i++) {
    morphTargetInfluences.push(0);
  }

  const morphTargetDictionary = {} as any;
  for (let i = 0, l = morphTargets.length; i < l; i++) {
    morphTargetDictionary[`morph_${i}`] = i;
  }

  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(morphTargets[0].array, 3));
  // geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  // const geometry = new THREE.SphereBufferGeometry(5, 32, 32);
  // geometry.morphAttributes.position = morphTargets;
  // (geometry as any).setFromPoints(vertices);
  console.log('morphTargets[0]', morphTargets[0].array);
  console.log('nodes.Cube.geometry', nodes.Cube.geometry);
  // console.log('nodes', nodes);

  const meshRef = useUpdate<THREE.Mesh>(mesh => {
    // console.log('hello', mesh);
    // mesh.geometry.setFromPoints(morphTargets[0].array);
    // (geo as any).setFromPoints(vertices);
  }, []);
  // geometry.addAttribute('position', new THREE.BufferAttribute(morphTargets, 3));
  // geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
  // geometry.setIndex(new THREE.BufferAttribute(faces, 3));
  // console.log('morphTargets', morphTargets);
  // console.log('geometry', geometry);

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      if (!cubeMeshRef.current) {
        return;
      }

      timeoutRef.current && window.clearInterval(timeoutRef.current);
      cubeMeshRef.current.updateMorphTargets();
      if (cubeMeshRef.current.morphTargetInfluences) {
        cubeMeshRef.current.morphTargetInfluences[0] = 0.25;
      }

      mixerRef.current = new THREE.AnimationMixer(cubeMeshRef.current);
      // const action = mixerRef.current.clipAction(clip);
      // action.play();
      console.log('cubeMeshRef', cubeMeshRef.current);
      console.log('clockRef.current.getElapsedTime()', clockRef.current.getElapsedTime());
    }, 2000);

    return () => {
      console.log('cleaning up', timeoutRef);
      timeoutRef.current && window.clearInterval(timeoutRef.current);
    };
  }, [cubeMeshRef.current]);

  useFrame(() => {
    // console.log(clockRef.current.getElapsedTime());
    if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta());
    if (cubeMeshRef.current && cubeMeshRef.current.morphTargetInfluences) {
      cubeMeshRef.current.morphTargetInfluences[0] = Math.abs(
        Math.sin(clockRef.current.getElapsedTime() / 1),
      );
      // console.log(clockRef.current.getDelta() / 1000);
    }
  });

  return (
    <group {...rest} dispose={null}>
      {/*
      <pointLight ref={lightRef} position={[2, 4, 0]} intensity={20} color={0xffcc77} />
      {pLight1 && <pointLightHelper args={[pLight1]} />} */}
      {/* <line>
        <bufferGeometry attach="geometry" ref={buffRef} />
      </line> */}
      <mesh
        ref={cubeMeshRef}
        // ref={meshRef}
        dispose={null}
        // geometry={geometry}
        // material={material}
        // geometry={objMesh.geometry}
        geometry={fbxMesh.geometry}
        // geometry={nodes.Cube.geometry}
        material={nodes.Cube.material}
        morphTargetInfluences={morphTargetInfluences}
        morphTargetDictionary={morphTargetDictionary}
      />
    </group>
  );
};

export default Morphtargets;
