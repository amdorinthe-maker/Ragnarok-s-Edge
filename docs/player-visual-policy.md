# Player Visual Policy

## Purpose

This policy defines the visual standard for the player character in Era 1.

It exists to answer one question:

What should the player look like on screen so the whole game feels readable, intentional, and premium?

This document assumes:

- no current player asset is untouchable
- current class sprites, overlays, and poses may be replaced if they fight the game
- the final standard matters more than preserving any one existing implementation

## Core Rule

The player character is the single most important visual object in the game.

At gameplay scale, the player must always communicate:

- class identity
- facing direction
- current weapon family
- current action
- special state or power state

If the current art model prevents that, the art model must change.

## Non-Negotiable Standards

The player model fails if:

- the class silhouette is muddy
- equipment reads like pasted icons
- weapons look detached from the body
- weapons read like abstract symbols instead of real objects
- armor overlays obscure the character more than they enrich it
- attack animations do not communicate the weapon family
- off-style weapons make the class look unfinished
- the player cannot be read immediately in motion

The player model passes if:

- each class is recognizable at a glance
- equipped weapon family reads clearly
- movement and attack states are understandable without zooming in
- armor and helm layers enhance the silhouette instead of cluttering it
- the character still feels like one coherent sprite instead of stacked assets

## The Real Design Goal

The player does not need to look ultra-detailed.

The player does need to look:

- readable
- intentional
- class-specific
- well-animated
- compatible with equipment

Readability is more important than decorative density.

## Hard Visual Rule

From this point forward:

- no more abstract weapon shapes
- no more symbolic object shorthand
- no more shipping assets that require explanation

If a weapon cannot be identified immediately at gameplay scale, it fails.

## Current Honest Assessment

The current system is a hybrid:

- class body sprites
- separate held-weapon sprites
- optional armor overlays
- optional helm overlays
- class-native poses that sometimes support the weapon
- off-style cases that often expose the seams

This hybrid can work, but only if the body art and attachment system are designed for each other.

Right now they are only partially aligned.

That means the player model is not yet on a fully professional footing.

## What We Must Be Willing To Change

If the current player art blocks the overall quality bar, we must be willing to change:

- body scale
- sprite proportions
- pose language
- animation sets
- armor layering approach
- weapon attachment approach
- even the base art style if necessary

No current implementation should be protected just because it already exists.

## Era 1 Player Quality Tiers

## Tier 1: Hero Presentation

These are the signature class presentations:

- Ranger using bows
- Runecaster using arcane focus
- Berserker using axes
- Guardian using blade/shield

These should look exceptional and define the class fantasy.

They need:

- clean silhouette
- clear action poses
- strong visual identity
- readable motion
- polished weapon integration

## Tier 2: Supported Presentation

These are off-style or secondary loadouts.

They do not need to outperform the hero presentations, but they must still feel polished and intentional.

That means:

- no clipping disasters
- no random object feeling
- no visual confusion
- no “prototype” look

## Player Readability Rules

At gameplay scale, the player silhouette must answer:

### 1. What class is this?

Class identity should come from:

- stance
- shoulders
- robes or cloak shape
- armor mass
- silhouette weight
- class trim colors

Not primarily from the weapon.

### 2. What weapon family is equipped?

The player should visibly read:

- bow
- axe
- hammer
- pike
- blade
- dagger
- staff
- tome

If a viewer cannot tell the family quickly, the combo fails.

### 3. What action is happening?

Idle, movement, attack, and power states must be legible.

Attack animation should show:

- pull/draw for bows
- extension or thrust for pikes
- casting projection for arcane
- impact commitment for heavy melee

### 4. Is the player empowered or altered?

Special states such as rage, frost, arcane empowerment, or subclass resonance should read through:

- glow
- aura
- trail
- added visual accents

Not through muddy overlays.

## Recommended Art Direction

For Era 1, the safest high-quality direction is:

### Stylized sprite readability

- stronger silhouette shapes
- slightly bolder pose language
- reduced soft visual noise
- equipment that reads from gameplay distance
- details that support the silhouette instead of hiding it

This does **not** require full realism.

It does require commitment to a consistent sprite logic.

## Art Style Options

## Option A: Refined Current Style

Keep the existing painterly/stylized class sprites, but rebuild:

- weapon attachments
- armor layers
- problematic off-style pose support

Pros:

- lower cost
- preserves familiar class identity
- best for finishing Era 1

Cons:

- current art still imposes constraints
- some compromises remain

## Option B: Clean Sprite Rebuild

Rebuild class sprites to be more explicitly sprite-readable and equipment-friendly.

Pros:

- highest consistency
- better weapon/armor integration
- clearer silhouettes

Cons:

- larger workload
- requires replacing more current art

## Option C: Full Scale-and-Style Remaster

Increase player sprite scale and rebuild the world around it.

Pros:

- highest long-term ceiling
- more room for equipment and animation detail

Cons:

- major production reset
- likely beyond a practical Era 1 finish pass

## Lead Recommendation

For Era 1:

Choose **Option A with selective Option B upgrades**.

Meaning:

- keep what already works
- replace what consistently fails
- allow partial sprite rebuilds when a class or weapon family cannot meet the standard otherwise

Do not force a total remaster unless the hybrid system proves fundamentally unfixable.

## Player Scale Policy

Do not enlarge the player globally until we confirm:

- body silhouettes are stable
- weapon families read correctly
- dungeons and world still feel proportionate
- props and buildings still support gameplay clarity

Player enlargement is allowed later, but should be a deliberate art-direction decision, not a bandage for weak assets.

## Armor Policy

Armor should support the player model, not bury it.

That means:

- light armor should remain light and silhouette-friendly
- heavy armor should add mass clearly
- overlays should never read as floating blocks
- if an armor layer cannot be made readable, it should be replaced, simplified, or converted into a subtler class-aware treatment

Named or legendary armor should feel distinct through:

- silhouette accents
- trim
- layered shoulder/collar shapes
- glow or rune treatment

Not through giant chest stickers.

## Helm Policy

Helms are valuable because they change the silhouette clearly.

Helms should:

- frame the head cleanly
- preserve class readability
- feel like actual worn gear
- avoid swallowing the face/body sprite

Helms are one of the best places to add identity without destroying readability.

## Animation Policy

The player does not need every animation to be large.

But every animation must be clear.

Animation rules:

- idle: subtle, readable
- walk/run: directional and class-appropriate
- attack: weapon-family-specific
- cast: visually projected outward
- heavy swings: committed and weighted
- ranged attacks: believable draw and release

If a class/weapon pair cannot communicate the weapon through the current frames, that pair needs either:

- a better fallback pose system
- a partial sprite rebuild
- or a class-specific support pose

## Attachment Policy

Weapon attachments should be treated like production assets, not temporary offsets.

Required eventually:

- grip point metadata
- scale metadata
- class-aware hand offsets
- attack-state-aware offsets
- optional left/right variance when needed

Without this, the player model will always have visible seams.

## Review Checklist

Every player presentation should be checked in-context:

- idle
- walking
- sprinting
- attacking
- facing left and right
- in world lighting
- in dungeon lighting
- with native and off-style weapons

If it looks unfinished in those tests, it fails review.

Weapon families should also be checked through blind recognition:

- show the held asset or family asset alone
- ask what it is
- if the answer is not the intended weapon family, the asset fails

## Era 1 Success Definition

Era 1 player visuals are complete when:

- each class has a strong core identity
- native weapon pairings look excellent
- off-style pairings still look intentional and stable
- armor and helms support the silhouette
- the player never reads as a stack of disconnected parts

## Final Rule

We should not preserve current sprites, poses, or art styles just because they already exist.

If changing them makes the overall game better, clearer, and more professional, we should change them.
