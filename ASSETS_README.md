# Ragnarok's Edge - Asset Requirements Guide

## ✅ Implementation Complete

The animation system is fully implemented and ready for your assets! Here's what has been done:

### Updated Systems:
1. **Asset Loader** (`js/core/assets.js`) - Now loads animated sprite sequences for:
   - Enemies (draugr, wolf, boss_golem, boss_wolf)
   - NPCs (forgekeeper, runespeaker, pathfinder, lorekeeper, merchant, trainer)
   - Player classes (berserker, ranger, runecaster, guardian)

2. **Rendering System** (`js/game.js`) - Updated to use animated frames:
   - Enemy rendering with state-based animations (idle, walk, attack, hit, death)
   - NPC rendering with state-based animations (idle, talk, walk)
   - Automatic frame cycling at 12 FPS

3. **Server Running** - Test the game at: **http://localhost:8080/index.html**

---

## 📋 Required Asset Files

All assets should be **SVG files** (as you've created) with transparent backgrounds.

### Enemy Assets (4 frames each)
**Location:** `assets/enemies/[enemy_name]/`

| Enemy | States | File Pattern | Example |
|-------|--------|--------------|---------|
| **Draugr** | idle, walk, attack, hit, death | `draugr_[state]_01.svg` through `_04.svg` | `assets/enemies/draugr/draugr_idle_01.svg` |
| **Wolf** | idle, walk, attack, hit, death | `wolf_[state]_01.svg` through `_04.svg` | `assets/enemies/wolf/wolf_walk_02.svg` |
| **Boss Golem** | idle, walk, attack, hit, death | `boss_golem_[state]_01.svg` through `_04.svg` | `assets/enemies/boss_golem/boss_golem_attack_03.svg` |
| **Boss Wolf** | idle, walk, attack, hit, death | `boss_wolf_[state]_01.svg` through `_04.svg` | `assets/enemies/boss_wolf/boss_wolf_death_04.svg` |

**Total:** 4 enemies × 5 states × 4 frames = **80 SVG files**

### NPC Assets (4 frames each)
**Location:** `assets/characters/npcs/`

| NPC | States | File Pattern | Example |
|-----|--------|--------------|---------|
| **Forgekeeper** | idle, talk, walk | `npc_forgekeeper_[state]_01.svg` through `_04.svg` | `assets/characters/npcs/npc_forgekeeper_idle_03.svg` |
| **Runespeaker** | idle, talk, walk | `npc_runespeaker_[state]_01.svg` through `_04.svg` | `assets/characters/npcs/npc_runespeaker_talk_02.svg` |
| **Pathfinder** | idle, talk, walk | `npc_pathfinder_[state]_01.svg` through `_04.svg` | `assets/characters/npcs/npc_pathfinder_walk_04.svg` |
| **Lorekeeper** | idle, talk, walk | `npc_lorekeeper_[state]_01.svg` through `_04.svg` | `assets/characters/npcs/npc_lorekeeper_idle_01.svg` |
| **Merchant** | idle, talk, walk | `npc_merchant_[state]_01.svg` through `_04.svg` | `assets/characters/npcs/npc_merchant_talk_03.svg` |
| **Trainer** | idle, talk, walk | `npc_trainer_[state]_01.svg` through `_04.svg` | `assets/characters/npcs/npc_trainer_walk_02.svg` |

**Total:** 6 NPCs × 3 states × 4 frames = **72 SVG files**

### Player Class Assets (4 frames each)
**Location:** `assets/characters/[class_name]/`

| Class | States | File Pattern | Example |
|-------|--------|--------------|---------|
| **Berserker** | idle, walk, run, attack, hit, death | `berserker_[state]_01.svg` through `_04.svg` | `assets/characters/berserker/berserker_attack_02.svg` |
| **Ranger** | idle, walk, run, attack, hit, death | `ranger_[state]_01.svg` through `_04.svg` | `assets/characters/ranger/ranger_idle_04.svg` |
| **Runecaster** | idle, walk, run, attack, hit, death | `runecaster_[state]_01.svg` through `_04.svg` | `assets/characters/runecaster/runecaster_run_01.svg` |
| **Guardian** | idle, walk, run, attack, hit, death | `guardian_[state]_01.svg` through `_04.svg` | `assets/characters/guardian/guardian_hit_03.svg` |

**Total:** 4 classes × 6 states × 4 frames = **96 SVG files**

---

## 🎨 Asset Specifications

### Technical Requirements:
- **Format:** SVG (preferred) or PNG with transparency
- **Frame Count:** 4 frames per animation state (01, 02, 03, 04)
- **Canvas Size:** Consistent across all frames (recommended: 64×64px for enemies/NPCs, 48×48px for players)
- **Orientation:** Characters should face **RIGHT** (engine auto-flips for left-facing)
- **Positioning:** Feet should touch bottom ~10% of canvas for consistent ground alignment
- **Naming:** Exact pattern matching required (lowercase, underscores)

### Animation Guidelines:
- **Idle:** Subtle breathing/swaying motion (4 frames loop)
- **Walk:** Walking cycle with leg/arm movement (4 frames loop)
- **Run:** Faster, more exaggerated than walk (4 frames loop)
- **Attack:** Windup → strike → recovery (4 frames, may not loop)
- **Hit:** Recoil/reaction to damage (4 frames)
- **Death:** Falling/collapsing animation (4 frames, plays once)
- **Talk:** Mouth movement, head gestures (4 frames loop)

---

## 🔧 How It Works

### Asset Loading Flow:
```javascript
// 1. Asset loader loads all animation sequences on startup
await AssetLoader.loadEnemyAnimations();  // Loads draugr_idle_01-04, etc.
await AssetLoader.loadNPCAnimations();    // Loads npc_forgekeeper_idle_01-04, etc.

// 2. Game requests current frame based on time
let animKey = 'draugr_walk';  // Base key
let frame = AssetLoader.getAnimationFrame(animKey, Date.now(), 12);
// Returns: Image object for draugr_walk_01.svg, _02.svg, etc. (cycling at 12 FPS)

// 3. Renderer draws the current frame
ctx.drawImage(frame, drawX, drawY, size, size);
```

### State Detection:
- **Enemies:** Automatically detected from game state
  - `shotTimer > 0` → attack animation
  - `moveX/moveY` present → walk animation
  - Otherwise → idle animation
  
- **NPCs:** Automatically detected from interaction state
  - `talking/dialogueOpen` → talk animation
  - `moveX/moveY` present → walk animation
  - Otherwise → idle animation

---

## 🧪 Testing

### Current Status:
✅ Asset loader configured for all enemy/NPC animations  
✅ Rendering system uses animated frames  
✅ Fallback to procedural drawing if sprites missing  
✅ Server running at http://localhost:8080  

### To Test:
1. Open http://localhost:8080/index.html
2. Check browser console for asset loading errors
3. Enemies/NPCs will show procedural art until SVG files are added
4. Once SVGs are in place, they'll automatically animate!

### Debug Commands:
```javascript
// In browser console:
console.log(AssetLoader.animations);  // See loaded animations
console.log(Object.keys(AssetLoader.animations));  // List all animation keys
```

---

## 📁 Current Asset Inventory

Based on your assets folder, you have:
- ✅ **Wolf animations:** All states (idle, walk, attack, hit, death) × 4 frames
- ✅ **Boss Wolf animations:** All states × 4 frames
- ✅ **Boss Golem animations:** Most states × 4 frames
- ✅ **Draugr animations:** Some states (check completeness)
- ✅ **All 6 NPCs:** idle, talk, walk × 4 frames each

**Missing/To Verify:**
- ⚠️ Draugr complete set (verify all 5 states have 4 frames)
- ⚠️ Boss Golem complete set (verify all 5 states have 4 frames)
- ⚠️ Player class animations (berserker, ranger, runecaster, guardian)

---

## 🚀 Next Steps

1. **Verify existing assets** match the naming convention exactly
2. **Add missing frames** for incomplete animation sets
3. **Create player class animations** for all 4 classes
4. **Test in browser** and watch animations play!
5. **Fine-tune timing** if needed (currently 12 FPS, adjustable in code)

The system is ready - just drop in your SVG files and they'll automatically animate!
