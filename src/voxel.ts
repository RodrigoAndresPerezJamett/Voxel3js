import * as THREE from "three";

export function createVoxel(voxelCount: number): THREE.InstancedMesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
        color: 0x777777,
        wireframe: true
    });

    return new THREE.InstancedMesh(
        geometry,
        material,
        voxelCount
    );
}