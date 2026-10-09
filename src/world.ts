import * as THREE from "three";

export const chunk = {
    WIDTH: 16,
    HEIGHT: 1024,
    DEPTH: 16
} as const;

export const worldSize = {
    X: 3, // Number of chunks in the world along the x-axis
    Y: 3 // Number of chunks in the world along the y-axis
} as const;


export function globalCoordsToChunk(x: number, z: number) {
    return {
        x: Math.floor(x / chunk.WIDTH),
        z: Math.floor(z / chunk.DEPTH)
    };
}

export function localCoordsInChunk(x: number, z: number) {
    return {
        x: ((x % chunk.WIDTH) + chunk.WIDTH) % chunk.WIDTH,
        z: ((z % chunk.DEPTH) + chunk.DEPTH) % chunk.DEPTH
    };
}

export function localToWorld(chunkX: number, chunkZ: number, i: number) {

    let localX: number, localZ: number;

    
    localX = i % chunk.WIDTH;
    localZ = Math.floor(i / chunk.WIDTH);
     

    return {
        x: chunkX * chunk.WIDTH + localX,
        z: chunkZ * chunk.DEPTH + localZ
    };
}

export function renderWorld(worldX: number, worldY: number, worldZ: number, renderDistance: number = 3) {
    const pivotChunk = globalCoordsToChunk(worldX, worldZ);
    const chunksToRender: THREE.Matrix4[][] = [];

    for (let x = pivotChunk.x - renderDistance; x <= pivotChunk.x + renderDistance; x++) {
        for (
            let z = pivotChunk.z - renderDistance;
            z <= pivotChunk.z + renderDistance;
            z++
        ) {
            const matrices: THREE.Matrix4[] = [];

            for (let i = 0; i < chunk.WIDTH; i++) {
                for (let j = 0; j < chunk.DEPTH; j++) {
                    const matrix = new THREE.Matrix4();

                    matrix.setPosition(
                        x * chunk.WIDTH + i,
                        0,
                        z * chunk.DEPTH + j
                    );

                    matrices.push(matrix);
                }
            }

            chunksToRender.push(matrices);
        }
    }

    return chunksToRender;
}