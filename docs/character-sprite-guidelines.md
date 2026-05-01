# Character Sprite Guidelines

These character sheets are intended to work with in-engine held weapon sprites.

## Core Model

- Frame size: `64x64`
- Feet should land in a consistent place across the whole sheet.
- Keep the body centered and scaled consistently across classes.
- Character art should not include a baked-in weapon.
- Hands should stay posed as if they are gripping or casting.

## Visual Priorities

- Class identity should come from silhouette, clothing, posture, trim, glow, hood, cape, armor shape, and stance.
- Weapons should be attached by the game engine, not painted into the body sprite.
- Leave readable space around the lead hand so attached weapon sprites do not merge into the torso.

## Animation Intent

### Idle

- Subtle breathing or sway only.
- No dramatic arm motion.
- Keep the grip/casting hand readable.

### Walk / Run

- Let the body carry motion.
- Avoid extreme hand drift between frames.
- Keep the body readable even when a held weapon is attached later.

### Attack Melee

- Lead hand forward.
- Clear torso twist or lunge.
- Hands should imply a strike without painting in the weapon itself.

### Attack Ranged

- Front arm extended.
- Rear arm pulled back or braced.
- Pose should still read as ranged even if the bow is attached later by the engine.

### Attack Magic

- One hand or focus arm should read as a casting anchor.
- Leave room for spell VFX and attached arcane focus sprites.

### Attack Shield

- Braced stance.
- Forearm forward.
- Weight committed into the guard or shove.

## Class Notes

### Berserker

- Broad silhouette.
- Aggressive lean.
- Armor and fur can carry the weight that a big weapon used to imply.

### Ranger

- Light, athletic stance.
- Clear forward hand and open chest line.
- Avoid a baked bow silhouette wrapping the body.

### Runecaster

- Casting hand should stay readable.
- Robe flow is good, but do not let cloth fully hide the grip/focus hand.

### Guardian

- Grounded, square stance.
- Shield-side body language can stay even without a painted shield.
- Shoulder and torso mass should sell the defensive role.

## Current Asset Goal

The current project assets should trend toward:

1. No painted weapons in body frames.
2. Readable hands and forearms.
3. Clear attack intent by pose.
4. Character identity preserved through outfit and silhouette.

## Follow-Up

If we make new sheets later, preferred order is:

1. `idle`
2. `walk`
3. `run`
4. Native attack set for each class
5. Alternate attack sets for cross-style weapon use
