# Ragnarok's Edge Era 1 Completion Checklist

Era 1 is the complete base game.

Era 2 is not part of base-game scope. It should begin only after Era 1 is stable, satisfying, and complete enough to stand alone. Era 2 should feel like the first expansion or DLC, not like unfinished base-game work spilling forward.

## Era 1 Definition

Era 1 should stand on its own as:

- a full endless Norse dungeon runner
- a complete three-shard progression arc
- a stable class, subclass, attribute, and skill foundation
- a satisfying loot, salvage, and buildcraft loop
- a readable, polished Ravenwatch hub and three clear dungeon routes

If a player stopped after Era 1, the game should still feel complete.

## Required Systems

### 1. Core Descent Loop

- class selection is stable and readable
- Ravenwatch hub flow is clear
- entering and leaving dungeons feels clean
- endless floor scaling works reliably
- deep-floor pacing supports "how far can I go?" play

Done means:

- the player can repeatedly descend, return, improve, and push deeper without confusion or system friction

### 2. Three-Route Shard Progression

- Barrow Descent, Ember route, and Seer Hollow are all fully playable
- each route has a clear floor-100 shard objective
- shard tracking works correctly with save/load
- Broken Bifrost gate progression is understandable

Done means:

- the player clearly understands the Era 1 long-term goal of collecting all 3 shards

### 3. Main Class + Subclass Progression

- main-class identity is meaningful
- subclass unlock flow works through real progression
- unlocked subclass state persists
- attunement, re-attunement, and reclass behavior are stable
- subclass skills and tree access obey the intended rules

Done means:

- subclassing feels earned and integrated, not like a debug-only convenience

### 4. Attribute + Skill Progression

- every level grants 1 attribute point
- every 10 levels grants 1 skill point
- attribute spending is understandable and worthwhile
- skill-tree pacing feels rewarding
- no major branch is obviously dead or broken

Done means:

- leveling always matters and both short-term and long-term progression feel good

### 5. Loot, Inventory, Stash, and Salvage

- loot rarity and reward pacing feel consistent
- inventory flow is understandable
- stash use is sustainable
- salvage converts excess gear into meaningful value
- Relic Dust has enough uses to justify the system

Done means:

- players are not pushed into endless hoarding and old gear can be turned into progress

## Required Gameplay Polish

### 6. Combat Feel Pass

- melee hit feel is reliable across all classes
- ranged projectiles feel accurate and fair
- enemy hitboxes and player hitboxes feel believable
- skills are readable and useful
- combat pacing remains fun on both shallow and deeper floors

Done means:

- players lose because of danger and choices, not because the combat feels unreliable

### 7. Dungeon Readability and Route Identity

- paths and walls are easy to distinguish
- event markers and interactables are readable
- Barrow, Ember, and Seer each feel visually distinct
- route identity affects more than just color
- milestone rooms and special spaces feel noticeable

Done means:

- players can read a room at a glance and know which route they are in without checking the UI

### 8. Floor Milestone Pacing

- floors 25, 50, 75, and 100 have clear identity or reward expectations
- pacing of elites, events, and challenge spikes feels intentional
- deep floors feel escalatory instead of repetitive

Done means:

- the run has rhythm, not just infinite sameness

## Required UI, Text, and Presentation

### 9. Text and Encoding Cleanup

- visible mojibake is removed from major panels, dungeon events, loot text, NPC interactions, and progression prompts
- labels are normalized
- tooltips are readable
- class and system terminology is consistent

Done means:

- UI friction is no longer distracting from the game itself

### 10. Skill Tree and Attribute UI Polish

- locked, unlocked, and attuned states are obvious
- branch readability is improved
- attribute panel is easy to understand
- skill descriptions communicate real value clearly

Done means:

- progression UI feels like a real game feature rather than a prototype menu

### 11. Ravenwatch Presentation Pass

- core structures feel distinct and readable
- the hub reflects progression state clearly
- key landmarks are visually memorable
- the gate, lodge, hall, and support buildings all have clear roles

Done means:

- Ravenwatch feels like a strong home base, not just a staging area

## Required Stability Work

### 12. Save / Load / Reclass Reliability

- shard progress saves correctly
- subclass unlocks save correctly
- attribute and skill points save correctly
- reclass refunds work safely
- no major progression data is easy to corrupt through normal play

Done means:

- players can trust the progression layer

### 13. Codebase Stabilization

- high-risk overlapping logic in `game.js` is reduced where practical
- critical progression and combat paths are easier to reason about
- future Era 2 work will not require rescuing broken Era 1 systems first

Done means:

- the base game is maintainable enough to expand confidently

## Nice To Have, But Not Blocking Era 1

- deeper side-building prop passes in Ravenwatch
- more bespoke skill-tree icons and connector art
- more class art cleanup for non-native weapon cases
- extra environmental animation polish
- more narrative flavor text on secondary interactions

These improve quality, but should not delay Era 1 completion if the core game is already stable and satisfying.

## Era 1 Release Gate

Era 1 is complete when all of the following are true:

- the three-route shard chase is fully playable and understandable
- subclass unlock and attunement are part of the real progression flow
- leveling, skills, and attributes feel rewarding
- loot, stash, and salvage form a stable economy
- combat is readable and reliable
- the UI is clean enough that text and presentation are not constant distractions
- Ravenwatch and the dungeons feel intentional rather than placeholder

## What Era 2 Means

Only after this checklist is satisfied should Era 2 begin.

At that point, Era 2 should be treated as:

- the first expansion
- a new layer of challenge and progression
- a reward for players who completed the Era 1 shard cycle
- a content growth phase, not a repair phase
