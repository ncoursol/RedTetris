const SocketManager = require("../src/SocketManager");

var manager = new SocketManager();

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
            manager.add_player(player1, "socket");
            expect(manager.players).toHaveProperty(player1);
        });
        it("should not add a player to the players object if they already exist", function () {
            manager.add_player(player1, "socket");
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
            expect(manager.active_rooms[room1].length).toEqual(0);
        });
        it("should not add a room to the active_rooms object if it already exists", function () {
            manager.add_room(room1);
            expect(manager.active_rooms[room1].length).toEqual(0);
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
            manager = new SocketManager();
            manager.add_player(player1, "socket");
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
    });

    describe("add_player_to_room", function () {
        beforeAll(function () {
            manager = new SocketManager();
            manager.add_player(player1, "socket");
            manager.add_player(player2, "socket");
            manager.add_room(room1);
        });
        it("should add a player to a room", function () {
            manager.add_player_to_room(room1, player1);
            expect(manager.active_rooms[room1]).toContain(player1);
        });
        it("should not add a player to a room if they are already in it", function () {
            manager.add_player_to_room(room1, player1);
            expect(manager.active_rooms[room1].length).toEqual(1);
        });
        it("should add a second player to a room", function () {
            manager.add_player_to_room(room1, player2);
            expect(manager.active_rooms[room1]).toContain(player2);
            expect(manager.active_rooms[room1].length).toEqual(2);
        });
    });

    describe("remove_player_from_room", function () {
        beforeAll(function () {
            manager = new SocketManager();
            manager.add_player(player1, "socket");
            manager.add_player(player2, "socket");
            manager.add_room(room1);
            manager.add_player_to_room(room1, player1);
            manager.add_player_to_room(room1, player2);
        });
        it("should remove a player from a room", function () {
            manager.remove_player_from_room(room1, player1);
            expect(manager.active_rooms[room1]).not.toContain(player1);
            expect(manager.active_rooms[room1].length).toEqual(1);
        });
        it("should not remove a player from a room if they are not in it", function () {
            manager.remove_player_from_room(room1, player1);
            expect(manager.active_rooms[room1].length).toEqual(1);
        });
        it("should remove the last player and the room", function () {
            manager.remove_player_from_room(room1, player2);
            expect(manager.active_rooms[room1]).toBeUndefined();
            expect(Object.keys(manager.active_rooms).length).toEqual(0);
        });
        it("should return undefined if the room does not exist", function () {
            expect(manager.remove_player_from_room("non-existent-room", player1)).toBeUndefined();
        });
    });

    describe("get_info", function () {
        beforeAll(function () {
            manager = new SocketManager();
            manager.add_player(player1, "socket");
            manager.add_player(player2, "socket");
            manager.add_room(room1);
            manager.add_room(room2);
            manager.add_player_to_room(room1, player1);
            manager.add_player_to_room(room1, player2);
        });
        it("should return an array of room objects", function () {
            const roomsInfo = manager.get_rooms_info();
            expect(roomsInfo).toBeInstanceOf(Array);
            expect(roomsInfo.length).toEqual(2);
            expect(roomsInfo[0]).toHaveProperty("roomName");
            expect(roomsInfo[0]).toHaveProperty("players");
        });
        it("should return a room object", function () {
            const roomInfo = manager.get_room_info(room1);
            expect(roomInfo).toHaveProperty("roomName");
            expect(roomInfo).toHaveProperty("players");
        });
        it("should return undefined if the room does not exist", function () {
            const roomInfo = manager.get_room_info("non-existent-room");
            expect(roomInfo).toBeUndefined();
        });
        it("should return the room of a player", function () {
            const roomName = manager.get_player_room(player1);
            expect(roomName).toEqual(room1);
        });
        it("should return undefined if there are no room", function () {
            manager = new SocketManager();
            const roomInfo = manager.get_room_info(room1);
            expect(roomInfo).toBeUndefined();
        });
        it("should return an empty array if there are no rooms", function () {
            manager = new SocketManager();
            const roomName = manager.get_rooms_info();
            expect(roomName).toEqual([]);
        });
    });

    describe("verbose", function () {
        it("should log to the console if verbose is true", function () {
            const spy = jest.spyOn(console, "log");
            manager.verbose = true;
            manager.logSocket("test");
            expect(spy).toHaveBeenCalledWith(`\u001b[36m[socket]\u001b[0m test`);
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
