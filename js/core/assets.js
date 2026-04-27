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
        this.onLoadComplete = callback;
        await this.loadAllAssets();
    },

    /**
     * Load all asset categories
     */
    async loadAllAssets() {
        const assetLists = [
            this.loadCharacterSprites(),
            this.loadEnemySprites(),
            this.loadNPCSprites(),
            this.loadWeaponSprites(),
            this.loadArmorSprites(),
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
            if (this.onLoadComplete) this.onLoadComplete();
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
        if (this.loadedCount >= this.totalAssets && this.onLoadComplete) {
            this.isLoaded = true;
            this.onLoadComplete();
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
            // Load body PNG
            const bodyKey = `${cls}_body`;
            const bodySrc = `${this.paths.characters}${cls}_body.png`;
            assets.push({ type: 'image', key: bodyKey, src: bodySrc });
            
            // Load shadow SVG
            const shadowKey = `${cls}_shadow`;
            const shadowSrc = `${this.paths.shadows}${cls}_shadow.svg`;
            assets.push({ type: 'image', key: shadowKey, src: shadowSrc });
        });

        return assets;
    },

    loadEnemySprites() {
        const enemies = ['draugr', 'wolf'];
        const bosses = ['boss_golem', 'boss_wolf'];
        const assets = [];
        
        // Load animated enemies from folders
        enemies.forEach(enemy => {
            // Load all animation frames for this enemy
            const states = ['idle', 'walk', 'attack', 'hit', 'death'];
            states.forEach(state => {
                for (let i = 1; i <= 4; i++) {
                    const key = `enemy_${enemy}_${state}_${String(i).padStart(2, '0')}`;
                    const src = `${this.paths.enemies}${enemy}/${enemy}_${state}_${String(i).padStart(2, '0')}.svg`;
                    assets.push({ type: 'image', key, src });
                }
            });
        });
        
        // Load boss animations
        bosses.forEach(boss => {
            const states = ['idle', 'walk', 'attack', 'hit', 'death'];
            states.forEach(state => {
                for (let i = 1; i <= 4; i++) {
                    const key = `enemy_${boss}_${state}_${String(i).padStart(2, '0')}`;
                    const src = `${this.paths.enemies}${boss}/${boss}_${state}_${String(i).padStart(2, '0')}.svg`;
                    assets.push({ type: 'image', key, src });
                }
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
        const weapons = ['axe_basic', 'bow_basic', 'staff_basic', 'sword_basic'];
        const assets = [];

        weapons.forEach(weapon => {
            const key = `weapon_${weapon}`;
            const src = `${this.paths.weapons}${weapon}.svg`;
            assets.push({ type: 'image', key, src });
        });

        return assets;
    },

    loadArmorSprites() {
        const armors = ['leather_vest', 'warden_mail'];
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

    loadProjectileSprites() {
        const projectiles = [
            { name: 'arrow', key: 'projectile_arrow' },
            { name: 'fireball', key: 'projectile_fireball' },
            { name: 'ice_shard', key: 'projectile_ice_shard' },
            { name: 'axe', key: 'projectile_axe' },
            { name: 'arcane_orb', key: 'projectile_arcane_orb' }
        ];
        const assets = [];

        projectiles.forEach(proj => {
            const src = `${this.paths.projectiles}${proj.name}.svg`;
            assets.push({ type: 'image', key: proj.key, src });
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
        // Audio files are in subdirectories (sfx/ and music/)
        const sounds = [
            'melee', 'hit', 'arrow', 'arcane', 'potion'
        ];
        const assets = [];

        sounds.forEach(sound => {
            const key = `sfx_${sound}`;
            const src = `${this.paths.audio}sfx/${sound}.wav`;
            assets.push({ type: 'audio', key, src });
        });

        // Music tracks
        const music = ['dungeon', 'world', 'boss'];
        music.forEach(track => {
            const key = `music_${track}`;
            const src = `${this.paths.audio}music/${track}.ogg`;
            assets.push({ type: 'audio', key, src });
        });

        return assets;
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
        
        for (const cls of classes) {
            for (const state of states) {
                // Expecting path like: assets/characters/berserker/berserker_idle_{frame}.png
                const path = `assets/characters/${cls}/${cls}_${state}_{frame}{ext}`;
                // Assuming 4 frames per animation for now
                await this.loadAnimationSequence(`${cls}_${state}`, path, 1, 4);
            }
        }
    },

    /**
     * Load Enemy Animations
     */
    async loadEnemyAnimations() {
        const enemies = ['draugr', 'wolf', 'boss_golem', 'boss_wolf'];
        const states = ['idle', 'walk', 'attack', 'hit', 'death'];

        for (const enemy of enemies) {
            for (const state of states) {
                const path = `assets/enemies/${enemy}/${enemy}_${state}_{frame}{ext}`;
                await this.loadAnimationSequence(`${enemy}_${state}`, path, 1, 4);
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
                const path = `assets/characters/npcs/npc_${npc}_${state}_{frame}{ext}`;
                await this.loadAnimationSequence(`npc_${npc}_${state}`, path, 1, 4);
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
        return anim.frames[frameIndex];
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetLoader;
}
