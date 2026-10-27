# DSA Bluff

Local multiplayer prototype of the approved game in RULES.md.

## Run on your computer

Install Node.js 20 or newer. No npm packages or installation step are required.

```sh
cd DSA-Bluff
npm start
```

Open **http://localhost:3000**. Create a room, open a second browser tab, and join with the room code under a different name. Use a fresh tab rather than duplicating an existing player tab. Each tab stores its own reconnect token in sessionStorage.

For phones, connect them to the same Wi-Fi as the computer running the server, and open `http://YOUR_COMPUTER_LAN_IP:3000`. The server binds to all interfaces. Allow Node incoming connections if your operating system asks. A phone's localhost refers to the phone, not the game server.

Use another port with `PORT=3001 npm start` or `node server.js --port 3001`.

## Implemented

- Room codes, 2–8 players, host start and reveal advance.
- Live server-sent updates, server timing, private role-specific views.
- Randomized role rotation and answer order; opaque answer identifiers.
- One or two full rotations, equal Bluffer turns, shared winners, replay.
- 1–4 highlighted numbered blanks; bundled replacements preview in the code.
- Exact approved integer scoring, penalties, timeouts and locked submissions.
- Refresh/reconnect in the same tab while the server is running.
- 16 authored Python puzzles, six topic playlists and Mixed.
- Pattern explanations and counterexamples in the reveal.

## Check

```sh
npm test
python3 test/validate_puzzles.py
```

The Node tests cover complete 2–8 player games, role and phase restrictions, secrecy, timeouts, scoring, capacity, and puzzle structure. The optional Python check executes all correct completions against independent reference functions over small generated inputs and finds a counterexample for every distractor. This is curated-content validation, not arbitrary code execution by players.

## Prototype limitations

Rooms and scores live in server memory: restarting the server clears them. No accounts, saved match history, lobby player removal, or automatic host transfer yet. A disconnected player retains their seat and receives normal timeout penalties; the host must reconnect in their original tab to advance. Narrow playlists repeat puzzles when the game is longer than the playlist. Mixed has enough unique puzzles for a standard eight-player game. Phones may need to scroll horizontally on the longest code lines; visual polish and device-specific tuning remain future work.

Architecture: Node built-in HTTP server + server-sent events, pure game engine, vanilla HTML/CSS/JS. No external services, build step, or runtime dependencies. Correct answers and explanations are withheld from clients until reveal. Keep this as a local playtest prototype; production hosting and persistence are separate future work.
