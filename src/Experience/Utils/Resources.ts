import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import type { Source } from '../../types.js'

export default class Resources extends EventEmitter {
    sources: Source[];
    items: {[key: string]: THREE.CubeTexture | THREE.Texture | GLTF};
    toLoad: number;
    loaded: number;
    loaders!: {
        gltfLoader: GLTFLoader,
        textureLoader: THREE.TextureLoader,
        cubeTextureLoader: THREE.CubeTextureLoader
    };

    constructor(sources: Source[]) {
        super()

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        if(sources.length > 0) {
            this.setLoaders()
            this.startLoading()
        }
    }

    setLoaders() {
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path as string,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path as string,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path as string[],
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source: Source, file: THREE.CubeTexture | THREE.Texture | GLTF) {
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }
}