import * as THREE from 'three';
import { 
    createTransform,
    type TransformComponent,
} from '../components/transform';
import {
    type PhysicsComponent,
    createPhysics
} from '../components/physics';

export type EntityId = number;

export type Entity = {
  id: EntityId;
  transform: TransformComponent; // Position + Rotation live inside here
  physics?: PhysicsComponent;
};

export function createEntity(
    id = 0,
    x = 0, y = .0, z = .0, 
    pitch = .0, yaw = .0, roll = .0, order: THREE.EulerOrder = "XYZ",
    vx = .0, vy = .0, vz = .0,
    ax = .0, ay = .0, az = .0
): Entity {
    return {
        id: id,
        transform: createTransform(
            x, y, z,
            pitch, yaw, roll, order
        ),
        physics: createPhysics(
            vx, vy, vz,
            ax, ay, az
        )
    }
};

