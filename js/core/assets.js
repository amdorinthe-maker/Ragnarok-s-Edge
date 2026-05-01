/**
 * Asset Loader Module
 * Handles loading of all game assets (sprites, audio, etc.)
 */

const AssetLoader = {
    images: {},
    animations: {},  // Store animation sequences
    audio: {},
    loadedCount: 0,
    totalAssets: 0,
    onLoadComplete: null,
    isLoaded: false,
    initPromise: null,
    didFireLoadComplete: false,

    // Asset paths configuration
    paths: {
        characters: 'assets/characters/',
        enemies: 'assets/enemies/',
        weapons: 'assets/weapons/',
        armor: 'assets/armor/',
        projectiles: 'assets/projectiles/',
        vfx: 'assets/vfx/',
        shadows: 'assets/shadows/',
        audio: 'assets/audio/'
    },

    /**
     * Initialize and load all assets
     * @param {Function} callback - Called when all assets are loaded
     */
    async init(callback) {
        if (this.initPromise) {
            if (callback) {
                if (this.isLoaded) callback();
                else this.onLoadComplete = callback;
            }
            return this.initPromise;
        }

        this.onLoadComplete = callback;
        this.loadedCount = 0;
        this.totalAssets = 0;
        this.isLoaded = false;
        this.didFireLoadComplete = false;
        this.images = {};
        this.animations = {};
        this.audio = {};

        this.initPromise = this.loadAllAssets();
        await this.initPromise;
        return this.initPromise;
    },

    /**
     * Load all asset categories
     */
    async loadAllAssets() {
        const assetLists = [
            this.loadCharacterSprites(),
            this.loadEnemySprites(),
            this.loadNPCSprites(),
            this.loadWatcherSprites(),
            this.loadWeaponSprites(),
            this.loadArmorSprites(),
            this.loadHelmetSprites(),
            this.loadProjectileSprites(),
            this.loadVFXSprites(),
            this.loadShadowSprites(),
            this.loadAudioFiles()
        ];

        // Flatten the array of arrays
        let allAssets = assetLists.flat();
        
        // Load animations (these are promise-based, not asset objects)
        await this.loadCharacterAnimations();
        await this.loadEnemyAnimations();
        await this.loadNPCAnimations();
        
        this.totalAssets = allAssets.length;

        if (this.totalAssets === 0) {
            console.warn('No assets found to load');
            this.isLoaded = true;
            this.initPromise = null;
            if (this.onLoadComplete && !this.didFireLoadComplete) {
                this.didFireLoadComplete = true;
                this.onLoadComplete();
            }
            return;
        }

        allAssets.forEach(asset => this.loadAsset(asset));
    },

    /**
     * Load a single asset (image or audio)
     */
    loadAsset(asset) {
        const { type, key, src } = asset;

        if (type === 'image') {
            const img = new Image();
            img.onload = () => this.onAssetLoaded();
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                this.onAssetLoaded(); // Continue even if failed
            };
            img.src = src;
            this.images[key] = img;
        } else if (type === 'audio') {
            const audio = new Audio(src);
            const handleLoad = () => {
                audio.removeEventListener('canplaythrough', handleLoad);
                audio.removeEventListener('error', handleError);
                this.onAssetLoaded();
            };
            const handleError = (e) => {
                audio.removeEventListener('canplaythrough', handleLoad);
                audio.removeEventListener('error', handleError);
                console.warn(`Failed to load audio: ${src} (file may be empty or missing)`);
                this.onAssetLoaded(); // Continue even if failed
            };
            
            audio.addEventListener('canplaythrough', handleLoad);
            audio.addEventListener('error', handleError);
            
            // Preload with timeout fallback
            audio.load();
            this.audio[key] = audio;
            
            // Fallback timeout in case events don't fire (empty files)
            setTimeout(() => {
                if (!audio.readyState || audio.readyState < 2) {
                    console.warn(`Audio timeout: ${src}`);
                    handleLoad();
                }
            }, 2000);
        }
    },

    /**
     * Callback when an asset finishes loading
     */
    onAssetLoaded() {
        this.loadedCount++;
        if (this.loadedCount >= this.totalAssets && this.onLoadComplete && !this.didFireLoadComplete) {
            this.isLoaded = true;
            this.didFireLoadComplete = true;
            const onLoadComplete = this.onLoadComplete;
            this.initPromise = null;
            onLoadComplete();
        }
    },

    /**
     * Get loading progress (0-1)
     */
    getProgress() {
        if (this.totalAssets === 0) return 1;
        return Math.min(1, this.loadedCount / this.totalAssets);
    },

    /**
     * Get an image by key
     */
    getImage(key) {
        return this.images[key] || null;
    },

    /**
     * Play an audio sound
     */
    playSound(key, volume = 1.0) {
        const sound = this.audio[key];
        if (sound) {
            sound.volume = volume;
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
    },

    // Asset List Generators

    loadCharacterSprites() {
        const classes = ['berserker', 'ranger', 'runecaster', 'guardian'];
        const assets = [];

        classes.forEach(cls => {
            // Use the first idle frame as the static body fallback.
            const bodyKey = `${cls}_body`;
            const bodySrc = `${this.paths.characters}${cls}/idle_01.png`;
            assets.push({ type: 'image', key: bodyKey, src: bodySrc });
            
            // Load shadow SVG
            const shadowKey = `${cls}_shadow`;
            const shadowSrc = `${this.paths.shadows}${cls}_shadow.svg`;
            assets.push({ type: 'image', key: shadowKey, src: shadowSrc });
        });

        return assets;
    },

    loadEnemySprites() {
        const enemies = [
            'draugr',
            'wolf',
            'enemydarkelf',
            'enemyfiredemon',
            'enemyfrostgiant',
            'enemyskeleton',
            'enemytroll'
        ];
        const bosses = [
            'boss_golem',
            'boss_wolf',
            'bossboneking',
            'bossforgeguardian',
            'bossgarmr',
            'bosshel',
            'bossjormungandr',
            'bossmimirsecho',
            'bossodinshadow',
            'bosssurtr',
            'bossveilscribe'
        ];
        const assets = [];

        enemies.forEach(enemy => {
            assets.push({
                type: 'image',
                key: enemy,
                src: `${this.paths.enemies}${enemy}/idle_01.png`
            });
        });

        bosses.forEach(boss => {
            assets.push({
                type: 'image',
                key: boss,
                src: `${this.paths.enemies}${boss}/idle_01.png`
            });
        });
        // Add generic enemy shadow
        assets.push({ 
            type: 'image', 
            key: 'enemy_shadow', 
            src: `${this.paths.shadows}enemy_shadow.svg` 
        });

        return assets;
    },

    loadWeaponSprites() {
        const weapons = [
            { key: 'axe', src: 'axe.svg' },
            { key: 'blade', src: 'blade.svg' },
            { key: 'bow', src: 'bow_master.png' },
            { key: 'arcane', src: 'arcane.svg' },
            { key: 'dagger', src: 'dagger.svg' },
            { key: 'hammer', src: 'hammer.svg' },
            { key: 'pike', src: 'pike.svg' },
            { key: 'berserker_axe', src: 'berserker_axe.svg' },
            { key: 'draugr_sword', src: 'draugr_sword.svg' },
            { key: 'frost_blade', src: 'frost_blade.svg' },
            { key: 'hunter_longbow', src: 'bow_master.png' },
            { key: 'bifrost_bow', src: 'bow_master.png' },
            { key: 'skadi_longbow', src: 'bow_master.png' },
            { key: 'ravenstorm_bow', src: 'bow_master.png' },
            { key: 'mjolnir_echo', src: 'mjolnir_echo.svg' },
            { key: 'worldbreaker_hammer', src: 'worldbreaker_hammer.svg' },
            { key: 'stormbinder_hammer', src: 'stormbinder_hammer.svg' },
            { key: 'runepiercer', src: 'runepiercer.svg' },
            { key: 'gungnir_pike', src: 'gungnir_pike.svg' },
            { key: 'worldroot_pike', src: 'worldroot_pike.svg' },
            { key: 'gravewake_pike', src: 'gravewake_pike.svg' },
            { key: 'storm_staff', src: 'storm_staff.svg' },
            { key: 'mimir_staff', src: 'mimir_staff.svg' },
            { key: 'voidseidr_tome', src: 'voidseidr_tome.svg' },
            { key: 'starfire_staff', src: 'starfire_staff.svg' },
            { key: 'surtr_brand', src: 'surtr_brand.svg' },
            { key: 'tyrfing_blade', src: 'tyrfing_blade.svg' },
            { key: 'skullsplitter_axe', src: 'skullsplitter_axe.svg' },
            { key: 'hrimnir_axe', src: 'hrimnir_axe.svg' },
            { key: 'oathcleaver_axe', src: 'oathcleaver_axe.svg' },
            { key: 'helfang_dagger', src: 'helfang_dagger.svg' },
            { key: 'nightveil_dagger', src: 'nightveil_dagger.svg' },
            { key: 'raven_talon_dagger', src: 'raven_talon_dagger.svg' },
            { key: 'axe_basic', src: 'axe_basic.svg' },
            { key: 'bow_basic', src: 'bow_basic.svg' },
            { key: 'staff_basic', src: 'staff_basic.svg' },
            { key: 'sword_basic', src: 'sword_basic.svg' }
        ];
        const assets = [];

        weapons.forEach(weapon => {
            const key = `weapon_${weapon.key}`;
            const src = `${this.paths.weapons}${weapon.src}`;
            assets.push({ type: 'image', key, src });
        });

        return assets;
    },

    loadArmorSprites() {
        const armors = [
            'leather_vest',
            'warden_mail',
            'ashen_cuirass',
            'barrow_plate',
            'dragon_scale',
            'helwoven_shroud',
            'seidr_mantle',
            'serpent_scale',
            'valkyrie_plate'
        ];
        const assets = [];

        armors.forEach(armor => {
            const key = `armor_${armor}`;
            const src = `${this.paths.armor}${armor}.svg`;
            assets.push({ type: 'image', key, src });
        });

        return assets;
    },

    loadNPCSprites() {
        const npcs = [
            { role: 'forgekeeper', key: 'npc_forgekeeper' },
            { role: 'runespeaker', key: 'npc_runespeaker' },
            { role: 'pathfinder', key: 'npc_pathfinder' },
            { role: 'lorekeeper', key: 'npc_lorekeeper' },
            { role: 'merchant', key: 'npc_merchant' },
            { role: 'trainer', key: 'npc_trainer' }
        ];
        const assets = [];

        // Load animated NPCs from folders
        npcs.forEach(npc => {
            // Load idle and talk animations (most NPCs have these)
            const states = ['idle', 'talk', 'walk'];
            states.forEach(state => {
                for (let i = 1; i <= 4; i++) {
                    const key = `${npc.key}_${state}_${String(i).padStart(2, '0')}`;
                    const src = `${this.paths.characters}npcs/npc_${npc.role}_${state}_${String(i).padStart(2, '0')}.svg`;
                    assets.push({ type: 'image', key, src });
                }
            });
        });

        return assets;
    },

    loadHelmetSprites() {
        const helms = [
            'allfather_sigil',
            'death_helm',
            'moonveil_hood',
            'ravenguard_helm',
            'skald_hood',
            'thor_helm',
            'wolf_pelt'
        ];
        const assets = [];

        helms.forEach(helm => {
            const key = `helm_${helm}`;
            const src = `${this.paths.armor}${helm}.svg`;
            assets.push({ type: 'image', key, src });
        });

        return assets;
    },

    loadWatcherSprites() {
        return [
            { type: 'image', key: 'watcher_huginn', src: `${this.paths.characters}watcher_huginn.svg` },
            { type: 'image', key: 'watcher_muninn', src: `${this.paths.characters}watcher_muninn.svg` }
        ];
    },

    loadProjectileSprites() {
        const projectiles = [
            { png: 'proj_arrow_01', svg: 'arrow', key: 'projectile_arrow' },
            { png: 'proj_fireball_01', svg: 'fireball', key: 'projectile_fireball' },
            { png: 'proj_ice_shard_01', svg: 'ice_shard', key: 'projectile_ice_shard' },
            { png: 'proj_axe_01', svg: 'axe', key: 'projectile_axe' },
            { png: 'proj_arcane_orb_01', svg: 'arcane_orb', key: 'projectile_arcane_orb' }
        ];
        const assets = [];

        projectiles.forEach(proj => {
            assets.push({ type: 'image', key: proj.key, src: `${this.paths.projectiles}${proj.png}.png` });
            assets.push({ type: 'image', key: `${proj.key}_fallback`, src: `${this.paths.projectiles}${proj.svg}.svg` });
        });

        return assets;
    },

    loadVFXSprites() {
        const vfx = ['rage_berserker', 'rune_aura'];
        const assets = [];

        vfx.forEach(effect => {
            const key = `vfx_${effect}`;
            const src = `${this.paths.vfx}${effect}.svg`;
            assets.push({ type: 'image', key, src });
        });

        return assets;
    },

    loadShadowSprites() {
        // Shadows are loaded with characters
        return [];
    },

    loadAudioFiles() {
        // The game currently uses WebAudio synthesis in game.js.
        // Skip file-audio preloads here to avoid browser 416/media errors
        // from placeholder or partial audio files in the assets folder.
        return [];
    },

    /**
     * Load a sequence of images for animation
     * @param {string} key - Base key for the animation
     * @param {string} path - Path pattern (use {frame} as placeholder)
     * @param {number} start - Start frame number
     * @param {number} end - End frame number
     * @param {string} ext - File extension
     */
    async loadAnimationSequence(key, path, start, end, ext = '.png') {
        const frames = [];
        for (let i = start; i <= end; i++) {
            // Pad number with zeros (e.g., 01, 02)
            const frameNum = i.toString().padStart(2, '0');
            const fullPath = path.replace('{frame}', frameNum).replace('{ext}', ext);
            try {
                const img = await this.loadImage(fullPath);
                frames.push(img);
            } catch (e) {
                console.warn(`Missing animation frame: ${fullPath}`);
                // Push null or a fallback if a frame is missing
                frames.push(null);
            }
        }
        if (!this.animations[key]) this.animations[key] = {};
        this.animations[key].frames = frames;
        this.animations[key].length = frames.length;
    },

    async loadAnimationSequenceCandidates(key, pathPatterns, start, end) {
        const frames = [];
        let chosenPatternIndex = -1;
        let firstLoadedFrame = null;
        let lastLoadedFrame = null;

        for (let i = start; i <= end; i++) {
            const frameNum = i.toString().padStart(2, '0');
            let loadedFrame = null;

            if (chosenPatternIndex >= 0) {
                const chosenPath = pathPatterns[chosenPatternIndex].replace('{frame}', frameNum);
                try {
                    loadedFrame = await this.loadImage(chosenPath);
                } catch (e) {
                    loadedFrame = lastLoadedFrame || firstLoadedFrame || null;
                }
            } else {
                for (let patternIndex = 0; patternIndex < pathPatterns.length; patternIndex++) {
                    const fullPath = pathPatterns[patternIndex].replace('{frame}', frameNum);
                    try {
                        loadedFrame = await this.loadImage(fullPath);
                        chosenPatternIndex = patternIndex;
                        break;
                    } catch (e) {}
                }
            }

            if (loadedFrame) {
                if (!firstLoadedFrame) firstLoadedFrame = loadedFrame;
                lastLoadedFrame = loadedFrame;
            }

            if (!loadedFrame && pathPatterns.length && !firstLoadedFrame) {
                console.warn(`Missing animation frame: ${pathPatterns[0].replace('{frame}', frameNum)}`);
            }

            frames.push(loadedFrame || lastLoadedFrame || firstLoadedFrame || null);
        }

        if (firstLoadedFrame) {
            for (let i = 0; i < frames.length; i++) {
                if (!frames[i]) frames[i] = firstLoadedFrame;
            }
        }

        if (!this.animations[key]) this.animations[key] = {};
        this.animations[key].frames = frames;
        this.animations[key].length = frames.length;
    },

    /**
     * Helper to load a single image (promise-based)
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });
    },

    /**
     * Load all character animations
     */
    async loadCharacterAnimations() {
        const classes = ['berserker', 'ranger', 'runecaster', 'guardian'];
        const states = ['idle', 'walk', 'run', 'attack', 'hit', 'death'];
        const attackVariants = ['melee', 'ranged', 'magic', 'shield'];
        
        for (const cls of classes) {
            for (const state of states) {
                let patterns = [];
                if (state === 'attack') {
                    const attackMap = {
                        berserker: 'attack_melee',
                        ranger: 'attack_ranged',
                        runecaster: 'attack_magic',
                        guardian: 'attack_shield'
                    };
                    patterns = [
                        `assets/characters/${cls}/${attackMap[cls]}_{frame}.png`,
                        `assets/characters/${cls}/attack_{frame}.png`,
                        `assets/characters/${cls}/${cls}_attack_{frame}.svg`
                    ];
                } else {
                    patterns = [
                        `assets/characters/${cls}/${state}_{frame}.png`,
                        `assets/characters/${cls}/${cls}_${state}_{frame}.svg`
                    ];
                }
                await this.loadAnimationSequenceCandidates(`${cls}_${state}`, patterns, 1, 4);
            }

            for (const variant of attackVariants) {
                const variantPatterns = [
                    `assets/characters/${cls}/attack_${variant}_{frame}.png`,
                    `assets/characters/${cls}/${cls}_attack_${variant}_{frame}.svg`
                ];
                await this.loadAnimationSequenceCandidates(`${cls}_attack_${variant}`, variantPatterns, 1, 4);
            }
        }
    },

    /**
     * Load Enemy Animations
     */
    async loadEnemyAnimations() {
        const enemies = [
            'draugr',
            'wolf',
            'enemydarkelf',
            'enemyfiredemon',
            'enemyfrostgiant',
            'enemyskeleton',
            'enemytroll',
            'boss_golem',
            'boss_wolf',
            'bossboneking',
            'bossforgeguardian',
            'bossgarmr',
            'bosshel',
            'bossjormungandr',
            'bossmimirsecho',
            'bossodinshadow',
            'bosssurtr',
            'bossveilscribe'
        ];
        const states = ['idle', 'walk', 'attack', 'hit', 'death'];

        for (const enemy of enemies) {
            for (const state of states) {
                const patterns = [
                    `assets/enemies/${enemy}/${state}_{frame}.png`,
                    `assets/enemies/${enemy}/${enemy}_${state}_{frame}.svg`
                ];
                await this.loadAnimationSequenceCandidates(`${enemy}_${state}`, patterns, 1, 4);
            }
        }
    },

    /**
     * Load NPC Animations
     */
    async loadNPCAnimations() {
        const npcs = ['forgekeeper', 'runespeaker', 'pathfinder', 'lorekeeper', 'merchant', 'trainer'];
        const states = ['idle', 'talk', 'walk'];

        for (const npc of npcs) {
            for (const state of states) {
                let patterns = [];
                if (state === 'talk') {
                    patterns = [
                        `assets/characters/npc_${npc}_wave_{frame}.png`,
                        `assets/characters/npc_${npc}_cast_{frame}.png`,
                        `assets/characters/npc_${npc}_attack_{frame}.png`,
                        `assets/characters/npcs/npc_${npc}_${state}_{frame}.svg`
                    ];
                } else {
                    patterns = [
                        `assets/characters/npc_${npc}_${state}_{frame}.png`,
                        `assets/characters/npcs/npc_${npc}_${state}_{frame}.svg`
                    ];
                }
                await this.loadAnimationSequenceCandidates(`npc_${npc}_${state}`, patterns, 1, 4);
            }
        }
    },

    /**
     * Get current animation frame based on time
     * @param {string} animKey - Animation key
     * @param {number} time - Current time or frame counter
     * @param {number} fps - Frames per second
     */
    getAnimationFrame(animKey, time, fps = 12) {
        const anim = this.animations[animKey];
        if (!anim || !anim.frames || anim.frames.length === 0) return null;
        
        const frameIndex = Math.floor((time / 1000) * fps) % anim.frames.length;
        return anim.frames[frameIndex] || anim.frames.find(Boolean) || null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetLoader;
}
