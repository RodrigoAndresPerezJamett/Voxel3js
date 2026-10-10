import { Vector3 } from "three"

export type PhysicsComponent = {
  velocity?: Vector3;
  acceleration?: Vector3;
  maxSpeed: number;
  enabled: boolean;
};

export function createPhysics(
    vx = .0, vy = .0, vz = .0,
    ax = .0, ay = .0, az = .0,
    maxSpeed = 9999,
    enabled = true
): PhysicsComponent {
  return {
    velocity: new Vector3(vx, vy, vz),
    acceleration: new Vector3(ax, ay, az),
    maxSpeed: maxSpeed,
    enabled: enabled,
  };
}