import * as THREE from 'three';
import type { GLTFLoader } from "three/examples/jsm/Addons.js";

export type Source = {
    name: string,
    type: string,
    path: string[] | string;
}

export type LoaderList = {
    gltfLoader: GLTFLoader,
    textureLoader: THREE.TextureLoader,
    cubeTextureLoader: THREE.CubeTextureLoader
}