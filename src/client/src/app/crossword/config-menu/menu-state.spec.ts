import { MenuState } from './menu-state';

describe('ConfigMenuService', () => {

    it('should be created', () => {
        expect(new MenuState()).toBeTruthy();
        const NAME = 'state1';
        const OPTIONS = [{name: 'option1', nextState: null}];
        const state = new MenuState(NAME, OPTIONS);
        expect(state.name).toEqual(NAME);
        expect(state.options).toEqual(OPTIONS);
        expect(state.options).not.toBe(OPTIONS);
    });

    it('should add an option', () => {
        const state = new MenuState();
        expect(state.options.length).toEqual(0);
        const option = {name: 'test', nextState: MenuState.none};
        state.addOption(option);
        const options = state.options;
        expect(options.length).toEqual(1);
        expect(options[0]).toEqual(option);
    });

    it('should call a callback when we arrive to that state', () => {
        const state = new MenuState();
        let wasCallbackCalled = false;
        const callback = () => wasCallbackCalled = true;
        state.arrive.subscribe(callback);
        state.arrive.next();
    });

    it('should call a callback when we leave that state', () => {
        const state = new MenuState();
        let wasCallbackCalled = false;
        const callback = () => wasCallbackCalled = true;
        state.leave.subscribe(callback);
        state.leave.next();
    });

});
