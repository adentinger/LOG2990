import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { COLLISION_EVENT } from '../../physic/utils';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';


class InvisibleWall extends CollidableMesh {

    private static readonly SLOW_FACTOR = 0.2;
    public readonly mass = 10;

    constructor() {
        super();
    }

    @EventManager.Listener(COLLISION_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onCollision(event: EventManager.Event<CollisionInfo>) {
        const collision = event.data;
        if (collision.source === this && isDynamicCollidable(collision.target)) {
            collision.target.velocity.multiplyScalar(InvisibleWall.SLOW_FACTOR);
        }
    }

}
