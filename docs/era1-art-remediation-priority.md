# Era 1 Art Remediation Priority

## Purpose

This document turns the visual policies into a concrete rebuild order.

The goal is to answer:

- what must be rebuilt first
- what can be stabilized without a full rebuild
- what should wait until after the base game is visually trustworthy

This is the recommended order for making Era 1 look professional.

## Guiding Rule

Rebuild whatever most affects the player's trust in the game first.

That means priority is based on:

1. frequency on screen
2. clarity impact
3. how much it breaks immersion when wrong
4. how much future work depends on it

## Rebuild Priority Order

## Priority 1: Weapon Family Silhouettes

This is the first and most important rebuild.

Reason:

- weapons are currently the biggest source of visual confusion
- unclear weapons instantly make the game feel unfinished
- all class presentations depend on weapons reading correctly

Families to rebuild first:

1. bow
2. hammer
3. axe
4. pike
5. sword/blade
6. dagger
7. staff/tome

Required outcome:

- every family is instantly readable at gameplay scale
- every family has a strong base silhouette
- legendary versions stay readable and do not become noisy

## Priority 2: Player Weapon Attachment System

After silhouettes are solved, rebuild the way weapons attach to the player.

Reason:

- even good weapon art looks bad with weak attachment logic
- this is where native vs off-style visual quality breaks down

Required improvements:

- grip point metadata
- scale metadata
- class-aware offsets
- attack-state-aware offsets
- better ranged support poses

Required outcome:

- off-style weapons stop looking pasted on
- native weapons remain the premium cases
- no weapon class looks like a random badge or chest icon

## Priority 3: Player Body Presentation

After weapons and attachment logic are stabilized, reassess the player body art.

Reason:

- some current body sprites support the system well
- some clearly fight it
- this is where we decide whether selective sprite rebuilds are needed

Required review by class:

- Ranger
- Runecaster
- Berserker
- Guardian

Questions to answer per class:

- does the native pose still work?
- do off-style poses fail too often?
- can support poses solve it?
- or does the class need a partial sprite rebuild?

Required outcome:

- each class has a reliable hero presentation
- no class looks fundamentally broken when equipping allowed weapons

## Priority 4: Armor Layer Strategy

Armor should be rebuilt only after player body + weapon support is clearer.

Reason:

- armor currently suffers from the same hybrid problem
- rebuilding armor before the body/weapon model is stable risks redoing work

Decision to make here:

- subtle layered treatment for light gear
- stronger silhouette treatment for heavy gear
- reduce or remove overlays that read like floating stamps

Required outcome:

- armor looks worn, not pasted
- light armor stays light
- heavy armor adds readable mass

## Priority 5: Helm Identity Pass

Helms should be refined after armor strategy is stable.

Reason:

- helms are one of the best ways to change silhouette cleanly
- they are high-value polish with relatively low risk

Required outcome:

- helms support class identity
- helms feel like real worn gear
- helms improve readability rather than cluttering the sprite

## Priority 6: Native Hero Animation Polish

Once the support floor is stable, spend the extra effort on the signature pairings.

Hero pairings:

- Ranger + bow
- Runecaster + arcane
- Berserker + axe
- Guardian + blade/shield

Reason:

- these are the combos players will most associate with class fantasy
- this is where “good” becomes “special”

Required outcome:

- native loadouts feel exceptional
- projectile/swing timing and body language feel premium

## Priority 7: Off-Style Support Pose Pass

After hero polish, revisit the off-style combinations.

Reason:

- once the system is stronger, off-style support becomes cheaper and cleaner
- not every pair needs bespoke art, but all need support

Required outcome:

- every allowed class/weapon combo meets the Era 1 minimum bar

## Priority 8: World and Prop Rebalance

Only after player/weapon readability is stable should we reconsider world scale and supporting props.

Reason:

- we should not rebuild buildings, dungeons, and layout spacing around unstable player art

Possible work here:

- slightly larger player scale
- slight tile-language adjustments
- prop size rebalance
- landmark proportion cleanup

Required outcome:

- the world supports the new player readability
- no overreaction rescale is done prematurely

## Immediate Execution Plan

If we are actually starting the rebuild now, the practical order should be:

### Phase 1

- rebuild bow family properly
- rebuild hammer family
- rebuild axe family

### Phase 2

- implement weapon metadata / pivots
- tune attachment by class and attack state
- retest all three rebuilt families

### Phase 3

- rebuild pike, sword, dagger, and staff/tome families
- finish support coverage

### Phase 4

- audit class body art against the new weapon standard
- identify which classes need support-pose fixes
- identify whether any class needs partial sprite replacement

### Phase 5

- rebuild armor strategy
- refine helms
- polish hero cases

## What We Should Not Rebuild First

Do not start with:

- full world rescale
- building rescale
- dungeon redraw
- broad armor overhaul
- more legendary variants

Reason:

- they depend on solving the player/weapon foundation first

## Bottom Line

If we want the game to look professional quickly, rebuild in this order:

1. weapon family silhouettes
2. attachment system
3. player body compatibility
4. armor strategy
5. helms
6. native hero polish
7. off-style support polish
8. world-scale reassessment

That is the highest-value path to turning the current hybrid visual system into something consistent and trustworthy.
