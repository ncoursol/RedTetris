const RoomManager = require("../src/RoomManager");

var manager = new RoomManager();

const room1 = "test-room-1";
const room2 = "test-room-2";
const player1 = "test-player-1";
const player2 = "test-player-2";

describe("Room", function () {
    describe("initialization", function () {
        it("should have an empty active_rooms object", function () {
            expect(manager.active_rooms).toEqual({});
        });
        it("should have a players object", function () {
            expect(manager.players).toEqual({});
        });
        it("should add a player to the players object", function () {
            manager.add_player(player1, "lobby");
            expect(manager.players).toHaveProperty(player1);
        });
        it("should not add a player to the players object if they already exist", function () {
            manager.add_player(player1, "lobby");
            expect(manager.players).toHaveProperty(player1);
            expect(Object.keys(manager.players).length).toEqual(1);
        });
        it("should remove a player from the players object", function () {
            manager.remove_player(player1);
            expect(manager.players).not.toHaveProperty(player1);
        });
    });

    describe("add_room", function () {
        it("should add a room to the active_rooms object", function () {
            manager.add_room(room1);
            expect(manager.active_rooms).toHaveProperty(room1);
            expect(manager.active_rooms[room1]).toHaveProperty("state");
            expect(manager.active_rooms[room1].state).toEqual("stop");
            expect(manager.active_rooms[room1]).toHaveProperty("players");
            expect(manager.active_rooms[room1].players).toEqual({});
        });
        it("should not add a room to the active_rooms object if it already exists", function () {
            manager.add_room(room1);
            expect(manager.active_rooms[room1]).toHaveProperty("players");
            expect(manager.active_rooms[room1].players).toEqual({});
            expect(Object.keys(manager.active_rooms).length).toEqual(1);
        });
        it("should add a second room to the active_rooms object", function () {
            manager.add_room(room2);
            expect(manager.active_rooms).toHaveProperty(room2);
            expect(Object.keys(manager.active_rooms).length).toEqual(2);
        });
    });

    describe("remove_room", function () {
        beforeAll(function () {
            manager = new RoomManager();
            manager.add_player(player1, "lobby");
            manager.add_room(room1);
            manager.add_room(room2);
        });
        it("should remove a room from the active_rooms object", function () {
            manager.remove_room(room1);
            expect(manager.active_rooms).not.toHaveProperty(room1);
            expect(Object.keys(manager.active_rooms).length).toEqual(1);
        });
        it("should not remove a room from the active_rooms object if it does not exist", function () {
            manager.remove_room("non-existent-room");
            expect(Object.keys(manager.active_rooms).length).toEqual(1);
            manager.remove_room(room1);
            expect(Object.keys(manager.active_rooms).length).toEqual(1);
        });
        it("should stop the game if the game object exist and if the game is running", function () {
            const game = {
                gameDuration: 1,
                stop: jest.fn(),
            };
            manager.active_rooms[room2].game = game;
            manager.remove_room(room2);
            expect(game.stop).toHaveBeenCalled();
        });
    });

    describe("add_player_to_room", function () {
        beforeAll(function () {
            manager = new RoomManager();
            manager.add_player(player1, "lobby");
            manager.add_player(player2, "lobby");
            manager.add_room(room1);
        });
        it("should add a player to a room", function () {
            const game = {
                changeNumberOfPlayers: jest.fn(),
            };
            manager.active_rooms[room1].game = game;
            manager.add_player_to_room(room1, player1);
            expect(game.changeNumberOfPlayers).toHaveBeenCalled();

            expect(manager.active_rooms[room1].players).toHaveProperty(player1);
        });
        it("should not add a player to a room if they are already in it", function () {
            manager.add_player_to_room(room1, player1);
            expect(manager.active_rooms[room1].players).toHaveProperty(player1);
            expect(Object.keys(manager.active_rooms[room1].players).length).toEqual(1);
        });
        it("should add a second player to a room", function () {
            manager.add_player_to_room(room1, player2);
            expect(manager.active_rooms[room1].players).toHaveProperty(player2);
            expect(Object.keys(manager.active_rooms[room1].players).length).toEqual(2);
        });
    });

    describe("remove_player_from_room", function () {
        beforeAll(function () {
            manager = new RoomManager();
            manager.add_player(player1, "lobby");
            manager.add_player(player2, "lobby");
            manager.add_room(room1);
            manager.add_player_to_room(room1, player1);
            manager.add_player_to_room(room1, player2);
        });
        it("should remove a player from a room", function () {
            const game = {
                changeNumberOfPlayers: jest.fn(),
            };
            manager.active_rooms[room1].game = game;
            manager.remove_player_from_room(room1, player1);
            expect(game.changeNumberOfPlayers).toHaveBeenCalled();
            expect(manager.active_rooms[room1].players).not.toContain(player1);
            expect(Object.keys(manager.active_rooms[room1].players).length).toEqual(1);
        });
        it("should not remove a player from a room if they are not in it", function () {
            manager.remove_player_from_room(room1, player1);
            expect(Object.keys(manager.active_rooms[room1].players).length).toEqual(1);
        });
        it("should remove the last player and the room", function () {
            manager.remove_player_from_room(room1, player2);
            expect(manager.active_rooms[room1]).toBeUndefined();
            expect(Object.keys(manager.active_rooms).length).toEqual(0);
        });
        it("should return undefined if the room does not exist", function () {
            expect(
                manager.remove_player_from_room("non-existent-room", player1)
            ).toBeUndefined();
        });
    });

    describe("get_state", function () {
        beforeAll(function () {
            manager = new RoomManager();
            manager.add_player(player1, "lobby");
            manager.add_player(player2, "lobby");
            manager.add_room(room1);
            manager.add_player_to_room(room1, player1);
            manager.add_player_to_room(room1, player2);
        });
        it("should as stop state by default", function () {
            const info = manager.get_rooms_info(room1);
            expect(info.state).toEqual("stop");
        });
        it("should change room state", function () {
            manager.set_room_state(room1, "play");
            const info = manager.get_rooms_info(room1);
            expect(info.state).toEqual("play");
        });
        it("should not change room state if the room does not exist", function () {
            manager.set_room_state("non-existent-room", "play");
            const info = manager.get_rooms_info("non-existent-room");
            expect(info).toBeNull();
        });
        it("should create a game object if the state is start", function () {
            manager.set_room_state(room1, "start");
            const info = manager.get_rooms_info(room1);
            expect(info.state).toEqual("start");
            expect(info.game).toBeDefined();
        });
    });

    describe("get_info", function () {
        beforeAll(function () {
            manager = new RoomManager();
            manager.add_player(player1, "lobby");
            manager.add_player(player2, "lobby");
            manager.add_room(room1);
            manager.add_room(room2);
            manager.add_player_to_room(room1, player1);
            manager.add_player_to_room(room1, player2);
        });
        it("should return an array of room objects", function () {
            const roomsInfo = manager.get_rooms_info();
            expect(roomsInfo).toBeInstanceOf(Object)
            expect(Object.keys(roomsInfo).length).toEqual(2);
            expect(Object.keys(roomsInfo)[0]).toEqual(room1);
            expect(Object.keys(roomsInfo)[0]).toContain(room1);
            expect(Object.keys(roomsInfo)[1]).toEqual(room2);
            expect(Object.keys(roomsInfo)[1]).toContain(room2);
            expect(Object.keys(roomsInfo[room1].players).length).toEqual(2);
        });
        it("should return a room object", function () {
            const roomInfo = manager.get_rooms_info(room1);
            expect(roomInfo).toHaveProperty("state");
            expect(roomInfo).toHaveProperty("players");
            expect(roomInfo.players).toHaveProperty(player1);
            expect(roomInfo.players).toHaveProperty(player2);
        });
        it("should return null if the room does not exist", function () {
            const roomInfo = manager.get_rooms_info("non-existent-room");
            expect(roomInfo).toBeNull();
        });
        it("should return the room of a player", function () {
            const roomName = manager.get_player_room(player1);
            expect(roomName).toEqual(room1);
        });
        it("should return null if there are no room", function () {
            manager = new RoomManager();
            const roomInfo = manager.get_rooms_info(room1);
            expect(roomInfo).toBeNull();
        });
    });

    describe("get_player_room", function () {
        beforeAll(function () {
            manager = new RoomManager();
            manager.add_player(player1, "lobby");
            manager.add_player(player2, "lobby");
            manager.add_room(room1);
            manager.add_player_to_room(room1, player1, 'player1');
            manager.add_player_to_room(room1, player2, 'player2');
        });
        it("should return the room of a player", function () {
            const roomName = manager.get_player_room(player1);
            expect(roomName).toEqual(room1);
            const roomName2 = manager.get_player_room(player2);
            expect(roomName2).toEqual(room1);
        });
        it("should return null if the player does not exist", function () {
            const roomName = manager.get_player_room("non-existent-player");
            expect(roomName).toBeNull();
        });
        it("should return the room of a player by username", function () {
            const roomName = manager.get_player_room_by_username('player1');
            expect(roomName).toEqual(room1);
            const roomName2 = manager.get_player_room_by_username('player2');
            expect(roomName2).toEqual(room1);
        });
        it("should return null if the player does not exist", function () {
            const roomName = manager.get_player_room_by_username("non-existent-player");
            expect(roomName).toBeNull();
        });
    });

    describe("verbose", function () {
        it("should log to the console if verbose is true", function () {
            const spy = jest.spyOn(console, "log");
            manager.verbose = true;
            manager.logSocket("test");
            expect(spy).toHaveBeenCalledWith(
                `\u001b[36m[socket]\u001b[0m test`
            );
            spy.mockRestore();
        });
        it("should not log to the console if verbose is false", function () {
            const spy = jest.spyOn(console, "log");
            manager.verbose = false;
            manager.logSocket("test");
            expect(spy).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});