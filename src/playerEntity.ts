import { type Entity, createEntity } from "./entities/entities";
import { events, keys } from "./events";
import * as THREE from "three";
import { type CameraEntity } from './entities/camera';

import { 
    type RotationComponent, 
    updateRotationByDelta, 
    updatePositionByDelta, 
    setPosition, 
    createTransform } 
from "./components/transform";
import { createPhysics } from "./components/physics";

export type GameMode = "survival" | "creative" | "expectator";


export type PlayerEntity = Entity & {
    gameMode? : GameMode;
    camera? : CameraEntity,
    life?: number,
    stamina?: number,
}

export type playerOptions = {
    position?: THREE.Vector3,
    rotation?: RotationComponent,
    gameMode?: GameMode,
    camera? : CameraEntity,
    life?: number,
    stamina?: number,
    cameraRotationLocked?: boolean,
    entityRotationLocked?: boolean,
    entityMovementLocked?: boolean
}

export function createPlayerEntity(options: playerOptions = {}): PlayerEntity {
    const entity: Entity = createEntity();
    entity.transform = createTransform();
    entity.physics = createPhysics(.25, .25, .25, 0, 0 ,0);

    
    setPosition(entity.transform.position, 
        options.position?.x, 
        options.position?.y, 
        options.position?.z
    )
    
    if(options.rotation !== undefined) {
        entity.transform.rotation.quaternion.copy(options.rotation.quaternion)
        entity.transform.rotation.enabled = options.rotation.enabled
    }

    return {
        ...entity,
        gameMode : options.gameMode ?? "survival",
        life : options.life ?? 100,
        stamina : options.stamina ?? 100,
        camera : options.camera
    }
}

export function setFirstPersonMode(playerEntity: PlayerEntity, camera: CameraEntity): undefined {
    attachCameraEntityToPlayer(playerEntity, camera);

    if (playerEntity.transform) {
        camera.transform = playerEntity.transform
        //console.log("Transforms of camera are now equal to Player Entity: ", playerEntity.id);
    } else {
        //console.log("Player doesn't have a transform, unable to attach camera")
        return;
    }
        
   
    //console.log("Camera transform? ", camera.transform ? true : false, " and Player Entity? ", playerEntity.transform ? true : false)
    
    
}

export function attachCameraEntityToPlayer(playerEntity: PlayerEntity, camera: CameraEntity): undefined {
    if(playerEntity.camera == camera) {
        console.log("Entity already had a that camera, returning...") 
        return;
    }

    if(playerEntity.camera) console.log("Entity already had a camera, removing...") 
    
    playerEntity.camera = camera;
    console.log("New camera attached to Player Entity with ID: ", playerEntity.id)
}

export var _playerEntity: PlayerEntity = createPlayerEntity();

events.addEventListener("mousemove", (e) => {
    //console.log("Entramos al evento");
    if (e instanceof MouseEvent) {
        if (_playerEntity.transform?.rotation) {
            //console.log("actualizando rotacion entidad")
            updateRotationByDelta(
                _playerEntity.transform.rotation, 
                -e.movementY * 0.002, 
                -e.movementX * 0.002, 0
            )
        }

        if (_playerEntity.camera?.transform) {
            //console.log(`actualizando rotacion camera con rotacion: ${_playerEntity.camera.transform.rotation.enabled}`);
            updateRotationByDelta(
                _playerEntity.camera.transform.rotation, 
                -e.movementY * 0.002, 
                -e.movementX * 0.002, 0
            )
            _playerEntity.camera.type.quaternion.copy(_playerEntity.camera.transform.rotation.quaternion)
        }
    }
});


// Should be managed in GameLoop not in events
events.addEventListener("keydown", (e) => {
    
    if (e instanceof KeyboardEvent) {

        // console.log(keys)        
        let forwardDirection = new THREE.Vector3(1, 0, 0); // World forward
        let rightDirection = new THREE.Vector3(0, 1, 0); // World right

        if (_playerEntity.camera && _playerEntity.camera.mode == 'firstPerson') { 
            forwardDirection = _playerEntity.camera.type.getWorldDirection(forwardDirection);

            rightDirection = new THREE.Vector3()
                .crossVectors(forwardDirection, rightDirection)
                .normalize();
        }

        // This could be also be written better, just using velocity additions inside if cases depending on keys pressed, and then only updating position one time per frame depending on velocity direction and magnitude

        //console.log(_playerEntity.transform)
        if (keys.has("KeyW") && _playerEntity.transform) {
            updatePositionByDelta(
                _playerEntity.transform.position, 
                forwardDirection.x * (_playerEntity.physics?.velocity?.x ?? 0),
                forwardDirection.y * (_playerEntity.physics?.velocity?.y ?? 0),
                forwardDirection.z * (_playerEntity.physics?.velocity?.z ?? 0),
            )
        }
        if (keys.has("KeyS") && _playerEntity.transform) {
            updatePositionByDelta(
                _playerEntity.transform.position, 
                forwardDirection.x * -(_playerEntity.physics?.velocity?.x ?? 0),
                forwardDirection.y * -(_playerEntity.physics?.velocity?.y ?? 0),
                forwardDirection.z * -(_playerEntity.physics?.velocity?.z ?? 0),
            )
        }
        if (keys.has("KeyA") && _playerEntity.transform) {
            updatePositionByDelta(
                _playerEntity.transform.position, 
                rightDirection.x * -(_playerEntity.physics?.velocity?.x ?? 0),
                rightDirection.y * -(_playerEntity.physics?.velocity?.y ?? 0),
                rightDirection.z * -(_playerEntity.physics?.velocity?.z ?? 0),
            )
        } 
        if (keys.has("KeyD") && _playerEntity.transform) {
            updatePositionByDelta(
                _playerEntity.transform.position, 
                rightDirection.x * (_playerEntity.physics?.velocity?.x ?? 0),
                rightDirection.y * (_playerEntity.physics?.velocity?.y ?? 0),
                rightDirection.z * (_playerEntity.physics?.velocity?.z ?? 0),
            )
        }
        if (keys.has("KeyF") && _playerEntity.camera && _playerEntity.camera.transform && _playerEntity.transform) {
            _playerEntity.camera.transform.rotation.enabled = !_playerEntity.camera.transform.rotation.enabled;
            _playerEntity.transform.rotation.enabled = !_playerEntity.transform.rotation.enabled;
        } 
        if (keys.has("Space") && _playerEntity.transform) {
            if (keys.has("ShiftLeft"))
            {
                updatePositionByDelta(
                    _playerEntity.transform.position,
                    0, -(_playerEntity.physics?.velocity?.y ?? 0), 0
                );
            } else {
                updatePositionByDelta(
                    _playerEntity.transform.position,
                    0, (_playerEntity.physics?.velocity?.y ?? 0), 0
                );
            }
            
        }
        //Event don't refire when holding, we need to implement this in GameLoop
        /*if (keys.has("LeftShift")) {
            playerEntity.moveEntity(0, -speed, 0);
        }*/
        
        if (keys.has("KeyQ") && _playerEntity.camera && _playerEntity.camera.transform) {
            updateRotationByDelta(
                _playerEntity.camera.transform.rotation, 
                0, 
                0, 
                0.01
            )
        }
        if (keys.has("KeyE") && _playerEntity.camera && _playerEntity.camera.transform) {
            updateRotationByDelta(
                _playerEntity.camera.transform.rotation, 
                0, 
                0, 
                -0.01
            )
        }

        // Sync camera with player
        if(_playerEntity.camera?.transform) {
            // Sync camera rotation
            _playerEntity.camera.type.quaternion.copy(_playerEntity.camera.transform.rotation.quaternion)

            //Sync camera position
            _playerEntity.camera?.type.position.copy(_playerEntity.camera.transform?.position)
        }
    
    }
});
