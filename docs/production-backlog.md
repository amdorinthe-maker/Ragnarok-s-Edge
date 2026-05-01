# Ragnarok's Edge Production Backlog

This backlog translates the design roadmap into build order.

The goal is to protect the core identity of the game:

- endless Norse dungeon runner first
- progression and narrative layered around the descent
- no feature should weaken the run-to-run loop
- Era 1 should ship as a complete base game
- Era 2 should arrive later like an expansion or DLC

## Build Next

These are the highest-priority items because they complete Era 1 as the base game.

### 1. Subclass Unlock Flow

Status:

- system foundation exists
- current subclass flow is close, but needs full normal-play validation

Need:

- verify unlocked subclass state through save/load
- verify Broken Bifrost gate flow in normal progression
- verify attunement, re-attunement, and reclass behavior
- make sure the player always understands why a subclass is locked or available

Why this matters:

- the class system now supports main + subclass cleanly
- the missing piece is making it fully trustworthy in live play

### 2. Attribute / Skill Progression Balance

Need:

- tune `Vigor`, `Mind`, `Might`, `Guard`, and `Swiftness`
- make sure each level matters without overpowering the attribute layer
- make sure the 10-level skill-point cadence still feels exciting
- keep skill trees meaningful relative to attribute growth

Why this matters:

- the new progression structure is promising, but it still needs long-term balance

### 3. Combat Feel / Collision Pass

Need:

- tune melee reach and hit registration
- verify projectile hit fairness across all classes
- make enemy hitboxes feel honest
- make skill responsiveness feel consistent

Why this matters:

- combat feel is the heart of the run loop

### 4. Salvage / Anti-Stash-Bloat System

Need:

- finish defining what old gear converts into
- make salvage value and dust sinks feel worthwhile
- create a basic loot cleanup strategy before future content adds more volume
- verify stash pressure feels sustainable through the Era 1 shard cycle

Why this matters:

- endless floors plus scaling loot will overwhelm the stash without a good conversion economy

### 5. Era 1 Milestone Pacing

Need:

- define floor-25, floor-50, floor-75, and floor-100 expectations
- make milestone challenge and reward cadence clearer
- ensure the endless descent has rhythm and escalating payoff

Why this matters:

- endless runs need structure to stay compelling

### 6. UI Text / Encoding Cleanup

Need:

- remove remaining mojibake in `index.html` and `js/game.js`
- normalize labels, prompts, messages, and item text
- make sure skill, inventory, dungeon, and NPC text all render cleanly

Why this matters:

- it directly affects readability and perceived quality

### 7. Skill Tree Polish Pass

Need:

- add better branch identity
- add node icons or simple symbols
- improve locked, unlocked, and attuned feedback
- make subclass selection feel more intentional inside the panel

Why this matters:

- the system works now
- the next improvement is presentation and clarity

## Later Polish

These are valuable, but should follow the next stable Era 1 progression milestone.

### 8. Dungeon Route Identity / Readability Pass

Need:

- preserve clarity between walls and floors
- strengthen unique character for Barrow, Ember, and Seer
- make interactables and route landmarks easy to read
- improve special-room identity

Why this matters:

- routes should feel distinct without sacrificing gameplay readability

### 9. Class Art Cleanup Passes

Need:

- revisit Ranger off-weapon body cleanup later
- revisit Runecaster off-weapon body cleanup later
- revisit Berserker off-weapon cleanup later
- revisit Guardian body polish later

Why this matters:

- the current renderer-side solutions are stable
- but some cases are still compromises rather than final art answers

### 10. Side Building / Ravenwatch Identity Pass

Need:

- more role-specific props on side structures
- small landmark clutter
- stronger identity for forge, lodge, council/storehouse, and gate areas

Why this matters:

- the hub silhouette is much stronger now
- the next step is making it feel more inhabited and specific

### 11. Route-Specific Environmental Depth

Need:

- stronger route identity in dungeon props, not just floor tone
- more route-specific hazards and set dressing
- stronger visual distinction at a glance

Why this matters:

- helps each descent route feel memorable over long play

### 12. Class Skill Balancing

Need:

- tune damage, cooldowns, and mana costs for the class skill sets
- test main/subclass combinations
- identify broken or weak pairings

Why this matters:

- the structure is good now
- balance will determine whether the system stays fun deep into endless play

### 13. Better NPC / Lore Delivery

Need:

- rewrite additional NPC dialogue to match the refined Broken Bifrost framing
- align Midgard, gate, watcher, and merchant lines with the new cosmology
- remove older wording that no longer fits the current setting

Why this matters:

- the title and opening narrative are aligned now
- the rest of the world text should eventually catch up

## Long-Term Dream

These are aspirational items that should be built only after Era 1 is complete.

### 14. Multi-Era Expansion Structure

Potential:

- Era 1: foundational shard cycle
- Era 2: first expansion layer
- Era 3+: deeper route mutations, relic goals, and era-specific progression loops

Goal:

- expand the endless descent through new baselines and systems
- avoid simply repeating another 3 shards from another 300 floors

### 15. Era-Specific Objectives Beyond Raw Floor Count

Potential:

- relic hunts
- challenge floor conditions
- milestone bosses
- corrupted routes
- attunement trials

Goal:

- keep long-term progression from becoming repetitive

### 16. Advanced Buildcraft

Potential:

- more subclass synergies
- passive interactions between main and subclass
- capstone branch nodes
- relic-driven build pivots

Goal:

- deepen replayability without overcomplicating the first hours

### 17. Economy Expansion

Potential:

- forge materials
- rune dust
- relic fragments
- era attunement costs
- stash automation or smart sorting

Goal:

- expand the loot economy once the base salvage loop is healthy
