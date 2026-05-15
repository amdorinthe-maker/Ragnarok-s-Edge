# Ranger Sprite Generation Pack

This document defines the exact production target for the new Ranger gameplay sprites.

Use this pack when generating or hand-authoring the new Ranger body-first gameplay sheet.

Related project references:
- [C:\Users\matth\OneDrive\Desktop\Ragnarok's Edge\docs\character-sprite-guidelines.md](C:\Users\matth\OneDrive\Desktop\Ragnarok's Edge\docs\character-sprite-guidelines.md)
- [C:\Users\matth\OneDrive\Desktop\Ragnarok's Edge\docs\player-visual-policy.md](C:\Users\matth\OneDrive\Desktop\Ragnarok's Edge\docs\player-visual-policy.md)
- [C:\Users\matth\OneDrive\Desktop\Ragnarok's Edge\assets\ui\ranger-model-sheet.png](C:\Users\matth\OneDrive\Desktop\Ragnarok's Edge\assets\ui\ranger-model-sheet.png)

## Goal

Create a real gameplay-ready Ranger sprite set that:
- matches the approved Ranger model-sheet direction
- works with separate held weapons
- works with future armor layering
- reads clearly at game scale
- does not contain a baked-in bow

This is not concept art. It is production gameplay sprite work.

## Visual Identity

The Ranger should read as:
- agile
- hooded
- quiet and deadly
- layered leather and cloak, not bulky plate
- forest / hunter / scout fantasy

Core silhouette priorities:
- hood always present
- readable cloak shape
- slim torso and fitted waist
- visible forearms/hands
- light boots
- asymmetrical layered ranger gear is okay

## Hard Requirements

Every generated frame must follow these rules:

- transparent background
- `64x64` canvas
- same feet anchor point across all frames
- no baked weapon
- no giant floating props
- no effects baked into the frame
- no painterly background remnants
- no alternate costume swaps between frames
- no cowl/hood inconsistency
- no side-turn model sheet posing that breaks gameplay readability

## Animation Set

Produce these frame counts:

1. `idle_01` to `idle_04`
2. `walk_01` to `walk_08`
3. `run_01` to `run_08`
4. `attack_ranged_01` to `attack_ranged_05`
5. `hit_01` to `hit_03`
6. `death_01` to `death_04`

Total: `32` frames

## Frame Naming

Export exactly as:

```text
idle_01.png
idle_02.png
idle_03.png
idle_04.png
walk_01.png
...
walk_08.png
run_01.png
...
run_08.png
attack_ranged_01.png
...
attack_ranged_05.png
hit_01.png
hit_02.png
hit_03.png
death_01.png
death_02.png
death_03.png
death_04.png
```

Target folder:
- `assets/characters/ranger/`

## Gameplay Pose Rules

### Idle
- subtle breathing
- stable balanced stance
- one hand capable of holding a bow grip
- no dramatic sway

### Walk
- readable travel motion
- cloak movement is okay, but not so much that the legs disappear
- main hand still looks attachment-friendly

### Run
- stronger forward energy
- cloak can flare more than walk
- body should still feel controllable and readable at small scale

### Attack Ranged
- this is the hero state
- body should clearly look like it is drawing/firing a bow
- lead arm extended
- draw arm pulled back
- chest and shoulders open into the shot
- leave negative space where the separate bow can sit cleanly

Important:
- the pose should still read as an archer even without the bow baked into the art

### Hit
- short recoil
- no comedic knockback
- preserve silhouette

### Death
- readable collapse
- avoid excessive gore
- keep cloak/body readable

## Sheet Layout Guidance

If generating by rows, use:

- row 1: idle
- row 2: walk
- row 3: run
- row 4: attack_ranged
- row 5: hit + death

If generating individually, keep the same camera angle and grounding throughout.

## Master Style Prompt

Use this as the base prompt for all Ranger sprite generation:

```text
Create a professional 2D game sprite for a hooded Norse ranger woman, body-only with no weapon, transparent background, 64x64 gameplay sprite scale, readable silhouette, dark green layered cloak, leather hunter armor, slim agile build, visible hands, boots, and hood, matching a polished fantasy action RPG. The sprite must be animation-ready, centered, feet grounded consistently, no background, no extra props, no painterly scene, no weapon baked into the art, clear pixel-friendly readability, designed for separate bow rendering in-engine.
```

## Negative Prompt

Use this with all generations:

```text
no weapon, no bow in hand, no arrows, no background, no scenery, no text, no UI, no multiple characters, no extra props, no floating items, no spell effects, no oversized cloak blobs, no inconsistent hood, no photorealism, no blurry painterly edges, no cut-off limbs, no huge hands, no abstract shapes
```

## State Prompts

### Idle Prompt

```text
Using the established hooded Norse ranger woman design, generate 4 idle animation frames for a 64x64 transparent gameplay sprite sheet. Body-only, no weapon. Subtle breathing, stable stance, cloak lightly settling, hands visible and attachment-friendly, same foot placement across frames, clean readable silhouette.
```

### Walk Prompt

```text
Using the established hooded Norse ranger woman design, generate 8 walk animation frames for a 64x64 transparent gameplay sprite sheet. Body-only, no weapon. Light traveling gait, readable leg movement, gentle cloak motion, hands still clear enough for separate weapon attachment, consistent grounding and scale across all frames.
```

### Run Prompt

```text
Using the established hooded Norse ranger woman design, generate 8 run animation frames for a 64x64 transparent gameplay sprite sheet. Body-only, no weapon. Faster forward motion, stronger cloak flow, agile hunter energy, readable limbs, same grounded scale and consistent foot anchoring across frames.
```

### Attack Ranged Prompt

```text
Using the established hooded Norse ranger woman design, generate 5 ranged attack animation frames for a 64x64 transparent gameplay sprite sheet. Body-only, no weapon baked into the art. The pose must clearly read as drawing and firing a bow, with lead arm extended, draw arm pulled back, chest opened into the shot, and clear negative space for a separate in-engine bow overlay. Maintain strong silhouette readability and consistent grounding.
```

### Hit Prompt

```text
Using the established hooded Norse ranger woman design, generate 3 hit reaction frames for a 64x64 transparent gameplay sprite sheet. Body-only, no weapon. Short recoil, readable impact reaction, silhouette preserved, no exaggerated comedy motion, same overall scale and grounding.
```

### Death Prompt

```text
Using the established hooded Norse ranger woman design, generate 4 death animation frames for a 64x64 transparent gameplay sprite sheet. Body-only, no weapon. A readable grounded collapse, cloak following motion naturally, no gore, no background, consistent art style with the rest of the Ranger set.
```

## Review Checklist

Reject any output that fails any of these:

- hood disappears in some frames
- feet slide unpredictably
- silhouette becomes muddy at small size
- hands are hidden by cloak in attack frames
- pose stops reading as an archer
- any baked bow appears
- frame-to-frame costume changes
- body proportions drift wildly
- background is not fully transparent
- output looks like concept art instead of gameplay sprite work

## Implementation Notes

Once approved, the new set should replace:
- `assets/characters/ranger/idle_*.png`
- `assets/characters/ranger/walk_*.png`
- `assets/characters/ranger/run_*.png`
- `assets/characters/ranger/attack_ranged_*.png`
- `assets/characters/ranger/hit_*.png`
- `assets/characters/ranger/death_*.png`

Do not reintroduce any baked bow masking workflow.

The new set should become the production standard for:
- body-first class rendering
- separate weapon overlays
- future armor/helm support
