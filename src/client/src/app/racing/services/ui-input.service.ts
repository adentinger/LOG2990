import { HostListener, Directive, OnDestroy, OnInit } from '@angular/core';
import { EventManager } from '../../event-manager.service';

export enum MouseButton {
    /**
     * Usually the left
     */
    MAIN,
    /**
     * The middle button
     */
    AUXILIARY,
    /**
     * Usually the right
     */
    SECONDARY
}

export const INPUT_EVENT = 'userinput';
export const KEYBOARD_EVENT = 'userinput-keyboard';
export const KEYDOWN_EVENT = 'userinput-keydown';
export const KEYUP_EVENT = 'userinput-keyup';
export const MOUSE_EVENT = 'userinput-mouse';
export const MOUSEDOWN_EVENT = 'userinput-mousedown';
export const MOUSEUP_EVENT = 'userinput-mouseup';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[catchInputs]', exportAs: '$inputs' })
// tslint:disable-next-line:directive-class-suffix
export class UIInputs implements OnInit, OnDestroy {
    private pressedKeys: Set<string> = new Set();
    private pressedMouseButtons: Set<MouseButton> = new Set();

    constructor(private eventManager: EventManager) { }

    public ngOnInit(): void {
        console.log('New InputService');
    }

    public ngOnDestroy(): void {
        console.log('InputService Destroyed');
    }

    public isKeyPressed(key: string): boolean {
        return this.pressedKeys.has(key);
    }

    /**
     * Returns true only if all given keys are pressed.
     * @param keys The keys to check if they are pressed or not.
     */
    public areKeysPressed(...keys: string[]): boolean {
        const initialAccumulatorValue = true;
        return keys.reduce((arePreviouKeysInSet: boolean, currentKey: string) =>
            arePreviouKeysInSet && this.pressedKeys.has(currentKey), initialAccumulatorValue);
    }

    public isAtLeastOneKeyPressed(...keys: string[]): boolean {
        const initialAccumulatorValue = false;
        return keys.reduce((isAtLeastOnePreviousKeyInSet: boolean, currentKey: string) =>
            isAtLeastOnePreviousKeyInSet || this.pressedKeys.has(currentKey), initialAccumulatorValue);
    }

    public isMouseButtonPressed(button: MouseButton): boolean {
        return this.pressedMouseButtons.has(button);
    }

    @HostListener('window:keydown', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onKeydown(event: KeyboardEvent) {
        this.pressedKeys.add(event.key.toLowerCase());

        this.eventManager.fireEvent(KEYDOWN_EVENT, { name: KEYDOWN_EVENT, data: event });
        this.eventManager.fireEvent(KEYBOARD_EVENT, { name: KEYBOARD_EVENT, data: event });
        this.eventManager.fireEvent(INPUT_EVENT, { name: INPUT_EVENT, data: event });
    }

    @HostListener('window:keyup', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onKeyUp(event: KeyboardEvent) {
        this.pressedKeys.delete(event.key.toLowerCase());

        this.eventManager.fireEvent(KEYUP_EVENT, { name: KEYUP_EVENT, data: event });
        this.eventManager.fireEvent(KEYBOARD_EVENT, { name: KEYBOARD_EVENT, data: event });
        this.eventManager.fireEvent(INPUT_EVENT, { name: INPUT_EVENT, data: event });
    }

    @HostListener('window:mousedown', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onMouseDown(event: MouseEvent) {
        this.pressedMouseButtons.add(event.button as MouseButton);

        this.eventManager.fireEvent(MOUSEDOWN_EVENT, { name: MOUSEDOWN_EVENT, data: event });
        this.eventManager.fireEvent(MOUSE_EVENT, { name: MOUSE_EVENT, data: event });
        this.eventManager.fireEvent(INPUT_EVENT, { name: INPUT_EVENT, data: event });
    }

    @HostListener('window:mouseup', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private onMouseUp(event: MouseEvent) {
        this.pressedMouseButtons.delete(event.button as MouseButton);

        this.eventManager.fireEvent(MOUSEUP_EVENT, { name: MOUSEUP_EVENT, data: event });
        this.eventManager.fireEvent(MOUSE_EVENT, { name: MOUSE_EVENT, data: event });
        this.eventManager.fireEvent(INPUT_EVENT, { name: INPUT_EVENT, data: event });
    }

}
