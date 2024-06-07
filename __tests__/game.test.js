const Game = require('../src/Game');
const Player = require('../src/Player');

jest.useFakeTimers();

let spy = jest.spyOn(console, "log");
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

    it('should change the number of players', () => {
        players['p5'] = new Player('p5', 'room1');
        game.changeNumberOfPlayers(players);
        expect(game.players).toBe(players);
        expect(game.nb_players).toBe(5);
        delete players['p5'];
        game.changeNumberOfPlayers(players);
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

    it('should pause the game', () => {
        game.pause();
        expect(game.isRunning).toBe(false);
        game.start();
    });
    
    it('should tick and spawn pieces', () => {
        jest.advanceTimersByTime(1000);
        expect(game.gameDuration).not.toBe(0);
        expect(game.level).toBe(0);
        expect(spy).toHaveBeenCalledWith("tick", 0, 0);
        spy.mockRestore();
        Object.values(players).forEach(player => {
            expect(player.piece).not.toBeNull();
        });
    });

    it('should move a piece to the left', () => {
        spy = jest.spyOn(game.players['p1'].piece, "move");
        game.keyboardMove('left', 'p1');
        expect(spy).toHaveBeenCalledWith(-1, 0);
    });

    it('should move a piece to the right', () => {
        game.keyboardMove('right', 'p1');
        expect(spy).toHaveBeenCalledWith(1, 0);
   });

    it('should move a piece down', () => {
        game.keyboardMove('down', 'p1');
        expect(spy).toHaveBeenCalledWith(0, -1);
        spy.mockRestore();
    });

    it('should not over the game if there are at least 2 players alive', () => {
        game.players['p1'].status = 0;
        game.players['p2'].status = 0;
        game.players['p3'].status = 0;
        game.players['p4'].status = 1;
        game.gameOver('p3');
        expect(game.players['p3'].status).toBe(1);
        expect(game.players['p3'].piece).toBeNull();
        expect(game.isOver).toBe(false);

    });

    it('should over the game if there is only 1 player alive', () => {
        game.players['p1'].status = 0;
        game.players['p2'].status = 0;
        game.players['p3'].status = 1;
        game.players['p4'].status = 1;
        game.gameOver('p2');
        expect(game.players['p2'].status).toBe(1);
        expect(game.players['p2'].piece).toBeNull();
        expect(game.isOver).toBe(true);
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