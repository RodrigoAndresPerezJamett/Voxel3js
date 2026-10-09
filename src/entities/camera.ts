import { 
    type TransformComponent
} from '../components/transform';

import {
    type PhysicsComponent
} from '../components/physics'

import {
    type CameraInstanceComponent,
    type CameraAttachmentComponent,
} from '../components/camera';

import { type Entity } from './entities';

export type CameraEntity = Entity & {
    instance: CameraInstanceComponent,
    attachment?: CameraAttachmentComponent,
}

export function createCameraEntity(
    id: number, 
    transform: TransformComponent,
    physics: PhysicsComponent,
    instance: CameraInstanceComponent,
    attachment?: CameraAttachmentComponent,
): CameraEntity {
    return {
        id,
        transform,
        physics,
        instance,
        attachment,
    }
}