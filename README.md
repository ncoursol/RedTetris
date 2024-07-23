<div>
  
</div>

# RedTetris

## Introduction
This subject aims to create a web multiplayer Tetris game using Javascript, Vue.js, Node.js and socket.io.

42 subject: [https://cdn.intra.42.fr/pdf/pdf/84885/en.subject.pdf](https://cdn.intra.42.fr/pdf/pdf/130200/en.subject.pdf)

The subject focuses on implementing an asyncronous multiplayer game from the front to the back and managing all the communications between users and server.

## The Game
Tetris is a puzzle game (see Wikipedia), whose subject is to contain falling pieces as
long as possible in a Playground. The game is over when the field no longer offers enough
room for a new piece to fall. When one or more lines of land are complete, they disappear,
allowing to postpone the expiry of the game

Each player has his own playing field, all players undergo the same series of pieces.
As soon as a player destroys lines on his ground, the opposing players receive n - 1 lines
in penalty, then indestructible, which fit at the bottom of their playground.
A terrain consists of 10 columns and 20 lines. Each player can graphically observe the
list of his opponents (name) and the specter of their land. For each column, a spectrum
indicates the first line occupied by a piece without providing any details about occupation
of the following lines. As soon as the terrain is updated, all opponents must visualize the
evolution of their spectrum.

The last player of the game is the winner.
The game can be played in solo.

### Moving the pieces


## Run program
The program is write and run using python3.

`sudo apt update`

`apt install python3-pip`

Install all the requirements:

`pip install -r requirements.txt`

### Screenshots

Filtering by frequencies (low: 7Hz, high: 30Hz):

![Before filtering](pictures/signal_before.png)

![After filtering](pictures/signal_after.png)

Result on records before/after filtering:

![Graphs records](pictures/graph.png)
