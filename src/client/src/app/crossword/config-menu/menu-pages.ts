import { ConfigMenuState } from './config-menu-state';

export let MENU_PAGES: ConfigMenuState[] = [
    {
        id: 0,
        name: 'Game Mode',
        options: [
            {
                name: 'Classic',
                nextPage: 1
            },
            {
                name: 'Dynamic',
                nextPage: 1
            }
        ]
    },
    {
        id: 1,
        name: 'Player Number',
        options: [
            {
                name: 'Single Player',
                nextPage: 3
            },
            {
                name: 'Two Player',
                nextPage: 2
            }
        ]
    },
    {
        id: 2,
        name: 'Create/Join',
        options: [
            {
                name: 'Create New Game',
                nextPage: 3
            },
            {
                name: 'Join Game',
                nextPage: 4
            }
        ]
    },
    {
        id: 3,
        name: 'Difficulty',
        options: [
            {
                name: 'Easy',
                nextPage: -1
            },
            {
                name: 'Normal',
                nextPage: -1
            },
            {
                name: 'BRUTAL',
                nextPage: -1
            }
        ]
    },
    {
        id: 4,
        name: 'Pending Games',
        options: {
            url: 'http://localhost:3000/crossword/filter/10',
            nextPage: -1,
            fetchedOptions: ['Mock Game']
        }
    }
];
