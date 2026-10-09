import * as THREE from "three";

export type PositionComponent = THREE.Vector3;

export type RotationComponent = {
    // Rotation of the world as a quaternion
    quaternion: THREE.Quaternion,
    // Rotation of the world as Euler angles 
    euler: THREE.Euler 
};

export type TransformComponent = {
    position: PositionComponent,
    rotation: RotationComponent
}

const SCRATCH_VECTOR = new THREE.Vector3();
const SCRATCH_EULER = new THREE.Euler(0, 0, 0, 'YXZ');
const SCRATCH_QUATERNION = new THREE.Quaternion();

export function createPosition(x = 0, y = 0, z = 0): PositionComponent {
    return new THREE.Vector3(x, y, z);
}

export function createRotation(
    pitch = 0,
    yaw = 0,
    roll = 0,
    order: THREE.EulerOrder = "XYZ"
): RotationComponent {
    const euler = new THREE.Euler(pitch, yaw, roll, order);
    const quaternion = new THREE.Quaternion().setFromEuler(euler);

    return { quaternion, euler };
}

export function createTransform(x = 0, y = 0, z = 0, pitch = 0, yaw = 0, roll = 0, order : THREE.EulerOrder = "XYZ"): TransformComponent {
    return {
        position: createPosition(x, y, z),
        rotation: createRotation(pitch, yaw, roll, order)
    };
}

export function setPosition(pos : PositionComponent, x: number, y: number, z: number): void {
    pos.set(x, y, z);
}

export function updatePositionByDelta(pos : PositionComponent, dx: number, dy: number, dz: number): void {
    SCRATCH_VECTOR.set(dx, dy, dz)
    pos.add(SCRATCH_VECTOR);
}

export function setRotation(rot : RotationComponent, quaternion: THREE.Quaternion): void {
    rot.quaternion.copy(quaternion);
    rot.euler.setFromQuaternion(quaternion);
}

export function updateRotationByDelta(rot : RotationComponent, dPitch: number, dYaw: number, dRoll: number): void {
    
    SCRATCH_EULER.set(dPitch, dYaw, dRoll, rot.euler.order);
    SCRATCH_QUATERNION.setFromEuler(SCRATCH_EULER);

    rot.quaternion.multiply(SCRATCH_QUATERNION);
    rot.euler.setFromQuaternion(SCRATCH_QUATERNION)
    
}