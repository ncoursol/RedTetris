const Game = require('../src/Game');
const Player = require('../src/Player');

jest.useFakeTimers();

const spy = jest.spyOn(console, "log");
let players;
let game;
let io;

describe('Game', () => {
    beforeAll(() => {
        players = {
            'p1': new Player('p1', 'room1'),
            'p2': new Player('p2', 'room1'),
            'p3': new Player('p3', 'room1'),
            'p4': new Player('p4', 'room1'),
        };
        Object.values(players).forEach((el, index) => {
            el.username = 'name' + index * 10;
        });
        game = new Game(players, 4);
        io = {
            to: jest.fn(() => io),
            emit: jest.fn(),
        };
    });

    it('should create a Game object', () => {
        expect(game.players).toBe(players);
        expect(game.nb_players).toBe(4);
        expect(game.grids).toEqual({});
        expect(game.pieceStack).toEqual([]);
        expect(game.gameDuration).toBe(0);
        expect(game.level).toBe(0);
        expect(game.isRunning).toBe(false);
        expect(game.isOver).toBe(false);
    });

    it('should initialize the game', () => {
        game.init(io, 'room1');
        expect(game.grids).toEqual({
            'p1': Array(21).fill(Array(10).fill(["black", "null"])),
            'p2': Array(21).fill(Array(10).fill(["black", "null"])),
            'p3': Array(21).fill(Array(10).fill(["black", "null"])),
            'p4': Array(21).fill(Array(10).fill(["black", "null"])),
        });
        expect(game.pieceStack.length).toBe(7);
    });

    it('should start the game', () => {
        game.start();
        expect(game.isRunning).toBe(true);
        expect(game.isOver).toBe(false);
        expect(game.gameDuration).toBe(0);
    });

    it('should tick and spawn pieces', () => {
        jest.advanceTimersByTime(500);
        expect(game.gameDuration).toBe(1);
        expect(game.level).toBe(0);
        expect(spy).toHaveBeenCalledWith("tick", 0, 0);
        spy.mockRestore();
        Object.values(players).forEach(player => {
            expect(player.piece).not.toBeNull();
        });
    });

    it('should stop the game', () => {
        game.stop();
        expect(game.grids).toEqual({
            'p1': Array(21).fill(Array(10).fill(["black", "null"])),
            'p2': Array(21).fill(Array(10).fill(["black", "null"])),
            'p3': Array(21).fill(Array(10).fill(["black", "null"])),
            'p4': Array(21).fill(Array(10).fill(["black", "null"])),
        });
    });

});