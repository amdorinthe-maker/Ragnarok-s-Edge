/**
 * Asset Loader Module
 * Handles loading of all game assets (sprites, audio, etc.)
 */

const AssetLoader = {
    images: {},
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
    init(callback) {
        this.onLoadComplete = callback;
        this.loadAllAssets();
    },

    /**
     * Load all asset categories
     */
    loadAllAssets() {
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
        const allAssets = assetLists.flat();
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

        // Load regular enemies
        enemies.forEach(enemy => {
            const key = `enemy_${enemy}`;
            const src = `${this.paths.enemies}${enemy}.svg`;
            assets.push({ type: 'image', key, src });
        });
        
        // Load bosses
        bosses.forEach(boss => {
            const key = `enemy_${boss}`;
            const src = `${this.paths.enemies}${boss}.svg`;
            assets.push({ type: 'image', key, src });
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
            { role: 'Forgekeeper', key: 'npc_forgekeeper' },
            { role: 'Runespeaker', key: 'npc_runespeaker' },
            { role: 'Pathfinder', key: 'npc_pathfinder' },
            { role: 'Lorekeeper', key: 'npc_lorekeeper' },
            { role: 'Road Merchant', key: 'npc_road_merchant' },
            { role: 'War-Trainer', key: 'npc_war_trainer' }
        ];
        const assets = [];

        npcs.forEach(npc => {
            const src = `${this.paths.characters}npc_${npc.role.toLowerCase().replace(/\s+/g, '_')}.png`;
            assets.push({ type: 'image', key: npc.key, src });
        });

        // Add generic merchant fallback
        assets.push({ 
            type: 'image', 
            key: 'npc_merchant', 
            src: `${this.paths.characters}npc_merchant.png` 
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
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetLoader;
}
