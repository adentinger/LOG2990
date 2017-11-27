import { CollidableMesh, CollisionInfo } from '../../physic/collidable';
import { COLLISION_EVENT } from '../../physic/utils';
import { EventManager } from '../../../../event-manager.service';
import { isDynamicCollidable } from '../../physic/dynamic-collidable';
import * as THREE from 'three';
import { Kilograms } from '../../../../types';
import { Line } from '../../../../../../../common/src/math/index';
import { InvisibleWall } from './left-invisible-wall';

/* export class RightInvisibleWall extends InvisibleWall {


    constructor() {
        
    }

} */
