# Visual Direction Plan

## Honest Assessment

The current hybrid presentation has hit its limit.

Right now the game mixes:

- painterly or soft-edged character sprites
- small vector held-weapon overlays
- body sprites that were not authored around separate weapon attachments
- a world scale that was tuned for readability before equipment silhouette mattered

That is why some combinations look great and others collapse.

The Ranger + bow works because it is the one place where:

- the body pose already implies archery
- the bow silhouette is familiar
- the projectile sells the fantasy

The off-class or non-native weapon cases fail because the current model tries to solve a production-art problem with runtime offsets.

## What Bigger Models Will And Will Not Fix

Making the player models larger **can** help:

- weapons will have more readable silhouettes
- armor and helm layers will have more room
- class identity can read from farther away

Making the player models larger will **not** fix:

- muddy or ambiguous weapon silhouettes
- body poses that do not support separate held weapons
- mismatched art styles between body sprites and weapon overlays

So the answer is:

**Yes, larger/more defined models are possible.**

**No, scale alone is not the real fix.**

## Recommended Direction

For Era 1, the professional path is:

### 1. Lock the visual language

Everything on screen should answer one question immediately:

- is it a bow?
- is it a hammer?
- is it a staff?
- is it plate armor?
- is it a shrine?

That means silhouette first, detail second.

### 2. Stop using “icon art” for held weapons

Held weapons must be authored as real in-world sprite assets, not logo-like vector symbols.

Rules:

- one strong silhouette per weapon family
- readable grip
- readable striking end
- no decorative overlap that breaks the silhouette
- “legendary” comes from glow, trim, runes, trail FX, and color, not from extra shape noise

### 3. Treat native class/weapon pairings as hero cases

These should look best:

- Ranger + bow
- Runecaster + arcane
- Berserker + axe
- Guardian + blade/shield

Off-class weapon cases should still be good, but they do not need to drive the entire visual model.

### 4. Build a proper attachment system

Weapon attachment needs metadata, not ad hoc offsets.

Each held asset should eventually define:

- grip point
- preferred scale
- idle angle
- attack angle
- per-class offset overrides

### 5. Delay a full world-scale increase until the asset model is stable

Do **not** enlarge the whole world first.

Reason:

- it will magnify weak assets
- it will create map-density and collision problems
- it will force re-tuning props, buildings, dungeons, and combat spacing all at once

The safer order is:

1. fix asset readability
2. standardize held-weapon art
3. improve character layering
4. then consider a world-scale pass

## Two Viable Production Paths

## Path A: Era 1 Readability Pass (Recommended)

Keep the current overall scale.

Focus on:

- better weapon silhouettes
- consistent held-asset style
- cleaner armor treatment
- stronger class readability
- no ambiguous random-shape assets

Pros:

- achievable within Era 1
- protects current gameplay readability
- lower rework cost

Cons:

- not a full visual reboot
- some off-class weapon poses will still be compromises

## Path B: Full Visual Rebuild

Move to larger characters, larger tile language, and re-authored assets around that scale.

Would likely mean:

- bigger body sprites
- larger props/buildings relative to the player
- reauthored held weapons
- likely new dungeon/world paint pass

Pros:

- highest ceiling
- more premium final look

Cons:

- expensive
- risks destabilizing Era 1 scope
- effectively becomes a visual reboot

## Lead Recommendation

For Era 1:

Choose **Path A** and commit to a professional readability standard.

That means:

- no more abstract or confusing held-weapon silhouettes
- bows look like bows
- hammers look like hammers
- staves look like staves
- pikes look like pikes
- armor reads as worn gear, not pasted blocks

Then, after Era 1 is complete:

- decide whether Era 2 is the first content expansion
- or whether a larger-scale visual remaster becomes its own project

## Immediate Art Rules

From this point on:

- if the silhouette is unclear at gameplay scale, the asset fails
- if ornament hides the core form, the asset fails
- if the player cannot identify the weapon family at a glance, the asset fails
- if an overlay reads like a floating square or badge, the asset fails

## Immediate Build Order

1. Standardize weapon-family silhouettes
2. Replace weak unique held skins with readable family-based variants
3. Rework armor to be subtler or move to class-aware variants
4. Add weapon metadata / pivots
5. Reassess whether the world scale still needs enlargement

## What We Should Not Do Yet

- Do not rescale the entire world immediately
- Do not keep stacking more unique assets on a weak base model
- Do not try to solve every class/weapon mismatch with offsets alone

## Bottom Line

It **can** be done.

But the professional way to get there is:

- silhouette-first weapons
- consistent asset language
- proper attachment metadata
- measured world-scale changes only after the weapon/body model is stable
