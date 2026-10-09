import { type Entity, createEntity } from "./entities/entities";
import { events, keys } from "./events";
import * as THREE from "three";

export const playerEntity : Entity = createEntity();

const SPEED = 0.3;


events.addEventListener("mousemove", (e) => {
    if (e instanceof MouseEvent) {
        playerEntity.rotateEntity(-e.movementY * 0.002, -e.movementX * 0.002, 0);
        playerEntity.rotateCamera(-e.movementY * 0.002, -e.movementX * 0.002, 0);
    }
});


// Should be managed in GameLoop not in events
events.addEventListener("keydown", (e) => {
    
    if (e instanceof KeyboardEvent) {

        let forwardDirection = new THREE.Vector3(1, 0, 0);
        let rightDirection = new THREE.Vector3(0, 0, 1);

        if (playerEntity.components.camera) {
            forwardDirection = new THREE.Vector3();
            forwardDirection = playerEntity.components.camera.getWorldDirection(forwardDirection);

            rightDirection = new THREE.Vector3()
                .crossVectors(forwardDirection, new THREE.Vector3(0, 1, 0))
                .normalize();
        }

        if (keys.has("KeyW")) {
            playerEntity.moveEntity( forwardDirection.x * speed,
                                     forwardDirection.y * speed,
                                     forwardDirection.z * speed);
        }
        if (keys.has("KeyS")) {
            playerEntity.moveEntity(-forwardDirection.x * speed,
                                    -forwardDirection.y * speed,
                                    -forwardDirection.z * speed);
        }
        if (keys.has("KeyA")) {
            playerEntity.moveEntity(-rightDirection.x * speed,
                                    -rightDirection.y * speed,
                                    -rightDirection.z * speed);
        } 
        if (keys.has("KeyD")) {
            playerEntity.moveEntity( rightDirection.x * speed,
                                     rightDirection.y * speed,
                                     rightDirection.z * speed);
        }
        if (keys.has("KeyF")) {
            playerEntity.components.cameraRotationLocked = !playerEntity.components.cameraRotationLocked;
        } 
        if (keys.has("Space")) {
            if (keys.has("ShiftLeft"))
            {
                playerEntity.moveEntity(0, -speed, 0);
            } else {
                playerEntity.moveEntity(0, speed, 0);
            }
            
        }
        //Event don't refire when holding, we need to implement this in GameLoop
        /*if (keys.has("LeftShift")) {
            playerEntity.moveEntity(0, -speed, 0);
        }*/
        
        if (keys.has("KeyQ")) {
            playerEntity.rotateCamera(0, 0, 0.01);
        }
        if (keys.has("KeyE")) {
            playerEntity.rotateCamera(0, 0, -0.01);
        }
        
        playerEntity.updateCameraPosition(
            playerEntity.components.position.X, 
            playerEntity.components.position.Y, 
            playerEntity.components.position.Z
        );
    }
});
