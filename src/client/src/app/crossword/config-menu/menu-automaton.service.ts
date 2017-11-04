import { Injectable } from '@angular/core';

/**
 * @class MenuAutomatonService
 * @description Represents the Finite State Machine of the configuration menu.
 * For example, with choice '1' (2-player game) while in 'Player Number?' state,
 * we go to state 'Create or Join?'.
 */
@Injectable()
export class MenuAutomatonService {

  constructor() { }

}
