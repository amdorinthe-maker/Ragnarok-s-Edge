# Character Asset Export

These files were exported from the generated Norse spritesheets into frame-by-frame PNGs for the runtime structure under `assets/characters/`.

## What was generated

- Enemy folders: `draugr/`, `wolf/`, `boss_golem/`, `boss_wolf/`
- NPC flat files such as `npc_forgekeeper_idle_01.png`
- Player folders: `berserker/`, `ranger/`, `runecaster/`, `guardian/`

## Important note

Some requested animation sets were larger than the source sheets that had already been generated. To keep this usable immediately:

- extended walk and boss cycles were created by repeating source frames in a smooth loop
- missing `idle` rows on enemy sheets were derived from patrol frames
- missing player `hit` and `death` sets were derived from existing attack frames

If you want, these can be replaced later with dedicated source renders for fully bespoke `run`, `hit`, `death`, `block`, and `cast_channel` motions.
