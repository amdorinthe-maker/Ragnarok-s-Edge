# Era 1 Visual Support Policy

## Purpose

This policy defines the minimum visual quality standard for all class and weapon combinations in Era 1.

The goal is simple:

- no equipable weapon should look broken
- no class/weapon combination should look unfinished
- native class/weapon combinations should look exceptional
- off-style class/weapon combinations should still look clean and intentional

This is the quality bar that must be met before Era 2 is treated like an expansion.

## Core Rule

If a weapon can drop and be equipped, it must meet a minimum visual quality bar on every class that can use it.

That means off-style support is not optional.

We do **not** need fully bespoke hand-authored premium animation for every class/weapon combination in Era 1.

We **do** need every allowed combination to:

- read clearly
- attach cleanly
- animate sensibly
- avoid clipping or nonsense silhouettes

## Era 1 Quality Tiers

## Tier 1: Native Hero Cases

These are the signature class/weapon pairings.

- Ranger + bow
- Runecaster + arcane
- Berserker + axe
- Guardian + blade/shield

These should receive the best treatment:

- best silhouette quality
- best pose compatibility
- strongest attack readability
- most expressive skill integration
- most polished projectile or swing presentation

These combinations define the visual identity of each class.

## Tier 2: Universal Support Cases

These are non-native but still valid equipment combinations.

They do **not** need to surpass the hero cases, but they **must** still feel professional.

Support-case standards:

- the weapon family is instantly recognizable
- the held asset does not read like an icon, badge, or random object
- the weapon does not clip badly through the body
- the class does not look like it is holding the wrong object backward
- the attack motion still reads as intentional
- the combo does not look unfinished

Off-style should mean:

- less signature
- not less competent

## Minimum Pass/Fail Standard

Every class/weapon combination must pass these checks.

## A combination fails if:

- the weapon silhouette is unclear at gameplay scale
- the player cannot identify the weapon family at a glance
- the attachment looks pasted on
- the weapon overlaps the body in a confusing way
- the attack motion looks physically nonsensical
- the asset reads like an icon rather than in-world equipment
- the asset reads like an abstract symbol rather than a real weapon
- the combination would make a player think the game is unfinished

## A combination passes if:

- the weapon reads correctly at a glance
- the hand/grip relationship is believable enough
- the attack pose communicates the weapon type
- there is no obvious clipping disaster
- the result looks intentional and stable

## Native Bonus Standard

Native pairings should go beyond the minimum support bar.

They should feel:

- class-defining
- premium
- expressive
- visually distinctive

Native quality should be achieved through:

- stronger body-pose compatibility
- class-appropriate hand placement
- better skill integration
- superior motion readability
- richer visual FX

## What Era 1 Does Not Require

Era 1 does **not** require:

- bespoke hand-authored premium animation for every class/weapon combination
- a total world rescale
- a full visual reboot
- perfect parity between every weapon on every class

Era 1 **does** require:

- no broken combinations
- no embarrassing silhouettes
- no unreadable weapon families

## System Requirements To Meet This Policy

To support this standard, the runtime/art model must improve in specific ways.

## Required system improvements

1. Weapon-family silhouette standardization
   - bows must look like bows
   - hammers must look like hammers
   - axes must look like axes
   - pikes must look like pikes
   - daggers must look like daggers
   - staves and tomes must be unmistakable

2. Proper held-weapon metadata
   - grip point
   - scale
   - idle angle
   - attack angle
   - class-aware overrides when needed

3. Better support poses for off-style use
   - not fully bespoke
   - but enough to avoid obvious mismatch

4. Cleaner armor and helm layering
   - no floating badge blocks
   - no unreadable chest overlays

5. Stronger readability-first review process
   - every new asset must be judged at gameplay scale
   - not only in isolation

## Asset Strategy

For Era 1, art production should follow this order:

1. Build readable base weapon-family silhouettes
2. Make those silhouettes work across all classes
3. Add legendary identity through:
   - color
   - rune accents
   - glow
   - projectile FX
   - material treatment
4. Only then push more ornate variants

Legendary should never come at the cost of readability.

## Weapon Rules

## Hard Readability Rule

From this point forward:

- no abstract weapon shapes
- no symbolic shorthand silhouettes
- no “close enough” family reads
- no asset survives if a blind viewer misidentifies the weapon family

Detail is encouraged, but only after the core silhouette is unmistakable.

## Bows

- must have a strong curved silhouette
- must have a readable grip
- must look like an actual bow before any rune or glow detail is added
- no clutter that hides the bow arc
- legendary flavor should come from runes/glow, not overlapping geometry

## Hammers

- must read as blunt striking heads first
- should not look like shields, icons, or generic blocks
- silhouette must stay clean when held by any class

## Axes

- must read as an axe head clearly
- not a lollipop, badge, or generic block
- beard, wedge, or crescent shape should be obvious

## Pikes

- must read as long reach weapons
- head and shaft relationship must be clear
- not just “a narrow stick”

## Swords and daggers

- must read as blades immediately
- guard and point should be clear when possible
- no oversized chunking that turns them into abstract shapes

## Staffs and tomes

- staffs must read as held magical implements
- tomes must read as books or magical codices
- neither should feel like generic rectangles

## Character Rules

Character silhouettes must support equipment readability.

That means:

- native combinations get the strongest pose fidelity
- off-style combinations get support poses that avoid obvious mismatch
- if a sprite body fights the equipped weapon too hard, the system must compensate or that combo fails review

## World Scale Policy

Do **not** enlarge the whole world just to hide asset problems.

World scale changes should only happen if:

- the asset language is stable
- weapon readability is solved
- class silhouettes are stable
- dungeon readability remains strong after tests

Bigger sprites are an option later, but not a substitute for clear art direction now.

## Review Policy

Every important class/weapon combination should be checked in-context:

- idle
- moving
- attacking
- facing left and right
- in dungeon lighting
- at actual gameplay camera scale

If it fails there, it fails.

Every rebuilt weapon family should also pass a blind-recognition test:

- show the asset alone
- ask a fresh viewer what object it is
- if the answer is not the intended weapon family, it fails and must be rebuilt

## Era 1 Success Definition

Era 1 visual support is considered complete when:

- all native hero cases look excellent
- all off-style supported cases look clean and intentional
- no allowed weapon family looks ambiguous
- no class/weapon combination looks embarrassing or unfinished

That is the standard required before Era 2 is treated as DLC rather than base-game rescue work.
