# [Erugo](https://na4n.github.io/erugo) 
Erugo is a dungeon crawler that runs in the browser and is written in Javascript.
Features a gauntlet of 10 levels, randomly generated, with trainable character attributes. 

# Why
I mean why not.

I grew up (mostly) without modern consoles and the earliest gaming experience I had besides my Wii (Wii Sports/Resort) was emulating old consoles on my Toshiba Chromebook 2. Playing Rogue on DOSbox and Legend of Zelda Minish Cap on VisualBoyAdvance made me a lifelong RPG lover, and to get back to my roots (and learn Javascript) I made Erugo.

# To Do
## Code Quality
- add stats to non-ending game condition (clipboard.js)
1. implement async request queue to handle messages
2. separate *dungeon.js* --> Entity Manager (character/enemy things), Dungeon (layout, refresh, etc.), Messages (pull current from *main.js*)
3. split entity types in *dungeon.js*
5. comments in *dungeon.js*, *main.js*, *player.js*
6. reduce DOM manipulation, if possible

## Features
1. randomize stair locations on last levels
2. increase mob awareness radius based on level
3. fix defense (game winnable 5% of the time?)

