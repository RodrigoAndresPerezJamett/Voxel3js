import * as THREE from 'three';
import { type EntityId } from '../entities/entities';


// Components

export type CameraType =
  | THREE.PerspectiveCamera
//  | THREE.OrthographicCamera

export type CameraMode = 'firstPerson' | 'thirdPerson';

export type CameraInstanceComponent = {
  type: CameraType;
  mode: CameraMode;
};

// Maybe we shouldn't have this... It may go against ECS methodology... and it creates overhead because we will have to de-couple it in case the enitityId is no longer valid
export type CameraAttachmentComponent = {
  attachedTo: EntityId;
};

export function createCameraComponent(
  type: CameraType = new THREE.PerspectiveCamera(),
  mode: CameraMode = 'firstPerson'
): CameraInstanceComponent {
  return {
    type,
    mode,
  };
}

export function createCameraAttachment(
  attachedTo: EntityId
): CameraAttachmentComponent {
  return {
    attachedTo,
  };
}