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

The last player of the gmae is the winner.
The game can be played in solo.

### Moving the pieces


### Montage
The EEGs were recorded from 64 electrodes as per the international 10-10 system (excluding electrodes Nz, F9, F10, FT9, FT10, A1, A2, TP9, TP10, P9, and P10).

![EEG montage picture](pictures/montage.png)

## Run program
The program is write and run using python3.

`sudo apt update`

`apt install python3-pip`

Install all the requirements:

`pip install -r requirements.txt`

### Use case

```
➜  tpv git:(master) ✗ python3 tpv.py -h               
usage: PROG [-h] [-p] [-s [SUBJECTS ...]] [-r [RUNS ...] | -t [TASKS ...]] [-v [VERBOSE ...]]

Total Perspective Vortex

options:
  -h, --help            show this help message and exit
  -p, --predict         Perform prediction mode
  -s [SUBJECTS ...], --subjects [SUBJECTS ...]
                        List of subjects to train
  -r [RUNS ...], --runs [RUNS ...]
                        List of runs to train
  -t [TASKS ...], --tasks [TASKS ...]
                        List of tasks to train where:
                        0 : Motor execution: left vs right hand - [3, 7, 11]
                        1 : Motor imagery: left vs right hand - [4, 8, 12]
                        2 : Motor execution: hands vs feet - [5, 9, 13]
                        3 : Motor imagery: hands vs feet - [6, 10, 14]
                        4 : Motor execution/imagery: left vs right hand - [3, 7, 11, 4, 8, 12]
                        5 : Motor execution/imagery: hands vs feet - [5, 9, 13, 6, 10, 14]
  -v [VERBOSE ...], --verbose [VERBOSE ...]
                        Display graphs where:
                        montage : electrodes montage
                        filter : filter graph before/after
                        graph : data, before and after filering
                        mne : display all mne function log
```

Run training on the entire dataset:

`python3 tpv.v`

Run prediction on the entire dataset:

`python3 tpv.v -p`

Run training for the subject nb 42 on the runs nb 6, 7, 8, 9 ([see runs](README.md#experimental-protocol)).

`python3 tpv.py -s 42 -r 6 7 8 9`

Run training for the subjects nb 1, 2, 3, 4, 5 on the motor execution: left vs right hand (task 1)

`python3 tpv.py -s 1 2 3 4 5 -t 1`

### Screenshots

Filtering by frequencies (low: 7Hz, high: 30Hz):

![Before filtering](pictures/signal_before.png)

![After filtering](pictures/signal_after.png)

Result on records before/after filtering:

![Graphs records](pictures/graph.png)
