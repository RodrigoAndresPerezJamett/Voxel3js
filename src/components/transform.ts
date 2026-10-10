import * as THREE from "three";

export type PositionComponent = THREE.Vector3;

export type RotationComponent = {
    quaternion: THREE.Quaternion;
    enabled: boolean;
}

export type TransformComponent = {
    position: PositionComponent;
    rotation: RotationComponent;
};

const DEFAULT_EULER_ORDER: THREE.EulerOrder = 'XYZ'
const SCRATCH_VECTOR = new THREE.Vector3(); 
const SCRATCH_EULER = new THREE.Euler(0, 0, 0, DEFAULT_EULER_ORDER);
const SCRATCH_QUAT = new THREE.Quaternion();


export function createPosition(x = 0, y = 0, z = 0): PositionComponent {
    return new THREE.Vector3(x, y, z);
}

 export function setPosition(pos: PositionComponent, x: number | undefined, y: number | undefined, z: number | undefined): void {
    pos.set(x ?? 0, y ?? 0, z ?? 0);
}

export function createTransform(pos: PositionComponent = createPosition(), rot: RotationComponent = createRotation()) {

    return {
        position: pos,
        rotation: rot
    }

}

export function updatePositionByDelta(pos : PositionComponent, dx: number, dy: number, dz: number): void {

    SCRATCH_VECTOR.set(dx, dy, dz)

    pos.add(SCRATCH_VECTOR);

} 

export function createRotation(
    pitch = 0,
    yaw = 0,
    roll = 0,
    order: THREE.EulerOrder = "XYZ"
): RotationComponent {
    const q = new THREE.Quaternion();
    const euler = new THREE.Euler(pitch, yaw, roll, order);
    return {
        quaternion: q.setFromEuler(euler),
        enabled: false
    };
}

export function setRotationQuaternion(rot: RotationComponent, q: THREE.Quaternion): void {
    rot.quaternion.copy(q);
}

export function setRotationFromEuler(rot: RotationComponent, pitch: number, yaw: number, roll = 0, euler_order: THREE.EulerOrder = DEFAULT_EULER_ORDER): void {
    SCRATCH_EULER.set(pitch, yaw, roll, euler_order);
    rot.quaternion.setFromEuler(SCRATCH_EULER);
}

export function updateRotationByDelta(rot: RotationComponent, dPitch: number, dYaw: number, dRoll: number, euler_order: THREE.EulerOrder = DEFAULT_EULER_ORDER): void {
    SCRATCH_EULER.set(dPitch, dYaw, dRoll, euler_order);
    SCRATCH_QUAT.setFromEuler(SCRATCH_EULER);

    rot.quaternion.multiply(SCRATCH_QUAT);
}