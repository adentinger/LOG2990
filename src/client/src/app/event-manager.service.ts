import { Injectable } from '@angular/core';
import { InstanceOf, NotImplementedError, Class } from '../../../common/src/utils';

/**
 * @class
 * The class representation of an event.
 */
class EventBis<T = any> {
    constructor(
    /**
     * The event's name.
     */
    public readonly name: string,
    /**
     * The event's payload.
     */
    public data: T) { }
}

export declare type EventListener = <E extends EventBis>(event: E) => void;
declare type FieldName = string | symbol;

const EVENT_LISTENERS_PROPERTY_NAMES: Map<InstanceOf<Class<any>>, Map<string, FieldName>> = new Map();

@Injectable()
export class EventManager {
    private readonly EVENT_LISTENERS: Map<string, Set<EventListener>> = new Map();
    private readonly EVENT_LISTENERS_ONCE: Map<string, Set<EventListener>> = new Map();

    public registerClass<T extends Class = any>(instance: InstanceOf<T>): void {
        const handlersName = EVENT_LISTENERS_PROPERTY_NAMES.get(Object.getPrototypeOf(instance));
        for (const [eventType, propertyName] of handlersName) {
            this.addListener(eventType, instance[propertyName].bind(instance));
        }
    }

    /**
     * Adds an {@link EventListener} to the given event type.
     */
    public addListener(type: string, listener: EventListener): void {
        if (!this.EVENT_LISTENERS.has(type)) {
            this.EVENT_LISTENERS.set(type, new Set());
        }
        this.EVENT_LISTENERS.get(type).add(listener);
    }

    public addListenerOnce(type: string, listener: EventListener): void {
        if (!this.EVENT_LISTENERS_ONCE.has(type)) {
            this.EVENT_LISTENERS_ONCE.set(type, new Set());
        }
        this.EVENT_LISTENERS_ONCE.get(type).add(listener);
    }

    public removeListener(type: string, listener: EventListener): void {
        if (this.EVENT_LISTENERS.has(type)) {
            this.EVENT_LISTENERS.get(type).delete(listener);
        }
        if (this.EVENT_LISTENERS_ONCE.has(type)) {
            this.EVENT_LISTENERS_ONCE.get(type).delete(listener);
        }
    }

    public fireEvent<E extends EventBis>(type: string, event: E): void {
        const LISTENERS = this.EVENT_LISTENERS.get(type);
        if (LISTENERS !== undefined) {
            for (const listener of LISTENERS) {
                listener(event);
            }
        }
        this.fireEventOnce(type, event);
    }

    private fireEventOnce<E extends EventBis>(type: string, event: E): void {
        const LISTENERS = this.EVENT_LISTENERS_ONCE.get(type);
        if (LISTENERS !== undefined) {
            for (const listener of LISTENERS) {
                listener(event);
            }
            LISTENERS.clear();
        }
    }
}

export namespace EventManager {
    export declare type Event<T = any> = EventBis<T>;
}

// Decorator
export function EventListener(eventType: string): MethodDecorator {
    return <T extends Class>(prototype: InstanceOf<T>, propertyName: FieldName, descriptor: PropertyDescriptor): void => {
        if (!EVENT_LISTENERS_PROPERTY_NAMES.has(prototype)) {
            EVENT_LISTENERS_PROPERTY_NAMES.set(prototype, new Map());
        }
        EVENT_LISTENERS_PROPERTY_NAMES.get(prototype).set(eventType, propertyName);
    };
}
