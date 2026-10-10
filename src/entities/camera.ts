import {
    type CameraInstanceComponent,
    type CameraAttachmentComponent
} from '../components/camera';

import { type Entity, createEntity } from './entities';

export type CameraEntity = Entity & CameraInstanceComponent & {
    attachment?: CameraAttachmentComponent,
}

export function createCameraEntity(
    instance: CameraInstanceComponent,
    attachment?: CameraAttachmentComponent,
): CameraEntity {
    return {
        ...createEntity(),
        ...instance,
        attachment,
    }
}