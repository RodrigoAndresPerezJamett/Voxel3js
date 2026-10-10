import { 
    type TransformComponent,
    setPosition
} from '../components/transform';
import {
    type PhysicsComponent,
} from '../components/physics';

export type EntityId = number;

export type Entity = {
  id: EntityId;
  transform?: TransformComponent; // Position + Rotation live inside here
  physics?: PhysicsComponent;
};

let nextId = 0;

export function createEntity(id: EntityId = nextId++): Entity {
  return { id };
}

export function setEntityPosition(entity: Entity, x: number, y:number, z:number) {
    if(entity.transform) setPosition(entity.transform.position, x, y, z);
}

