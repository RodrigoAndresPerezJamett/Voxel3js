import * as THREE from 'three';
import { type entityId } from '../entities/entities';


// Components

export type CameraType =
  | THREE.PerspectiveCamera
  | THREE.OrthographicCamera
  | THREE.CubeCamera
  | THREE.ArrayCamera
  | THREE.Camera;

export type CameraMode = 'firstPerson' | 'thirdPerson';

export type CameraInstanceComponent = {
  instance: CameraType;
  mode: CameraMode;
};

export type CameraAttachmentComponent = {
  attachedTo: entityId;
};

export function createCameraComponent(
  instance: CameraType = new THREE.PerspectiveCamera(),
  mode: CameraMode = 'firstPerson'
): CameraInstanceComponent {
  return {
    instance,
    mode,
  };
}

export function createCameraAttachment(
  attachedTo: entityId
): CameraAttachmentComponent {
  return {
    attachedTo,
  };
}