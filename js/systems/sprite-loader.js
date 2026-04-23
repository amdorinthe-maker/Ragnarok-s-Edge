// ── SPRITE SYSTEM ─────────────────────────────────────────────────
const SpriteSystem = {
  cache: {},
  callbacks: {},
  
  load: (key, src) => {
    return new Promise((resolve, reject) => {
      if (SpriteSystem.cache[key]) { resolve(SpriteSystem.cache[key]); return; }
      if (SpriteSystem.callbacks[key]) {
        SpriteSystem.callbacks[key].push(resolve);
        return;
      }
      SpriteSystem.callbacks[key] = [resolve];
      
      const img = new Image();
      img.onload = () => {
        SpriteSystem.cache[key] = img;
        SpriteSystem.callbacks[key].forEach(cb => cb(img));
        delete SpriteSystem.callbacks[key];
      };
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${key}`);
        delete SpriteSystem.callbacks[key];
        resolve(null);
      };
      img.src = src;
    });
  },

  loadAll: (assets) => Promise.all(Object.entries(assets).map(([key, src]) => SpriteSystem.load(key, src))),
  
  get: (key) => SpriteSystem.cache[key],
  
draw: (key, x, y, options = {}) => {
    const img = SpriteSystem.get(key);
    if (!img) return false;
    
    const TARGET_SIZE = 40;
    const scaleX = TARGET_SIZE / img.width;
    const scaleY = TARGET_SIZE / img.height;
    const scale = Math.min(scaleX, scaleY);
    
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    
    ctx.save();
    ctx.translate(x, y);
    if (options.flipX) ctx.scale(-1, 1);
    if (options.flipY) ctx.scale(1, -1);
    if (options.alpha) ctx.globalAlpha = options.alpha;
    if (options.rotation) ctx.rotate(options.rotation);
    
    ctx.drawImage(
        img, 
        -scaledW/2 + (options.offsetX || 0), 
        -scaledH/2 + (options.offsetY || 0), 
        scaledW, 
        scaledH
    );
    ctx.restore();
    return true;
},

drawLayered: (layers, x, y, commonOptions = {}) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = 'source-over';
    
    // Scale factor to fit sprites within tile size (T=40)
    const TARGET_SIZE = 64;
    
    layers.forEach(layer => {
        if (!layer || !layer.key) return;
        const img = SpriteSystem.get(layer.key);
        if (!img) return;

        ctx.save();
        const opt = { ...commonOptions, ...layer };
        
        if (opt.flipX) ctx.scale(-1, 1);
        if (opt.flipY) ctx.scale(1, -1);
        if (opt.alpha) ctx.globalAlpha = opt.alpha;
        if (opt.tint) ctx.filter = `hue-rotate(${opt.tint}deg)`;
        
        // Calculate scale to fit sprite within target size
        const scaleX = TARGET_SIZE / img.width;
        const scaleY = TARGET_SIZE / img.height;
        const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio
        
        // Apply scale and center the sprite
        const scaledW = img.width * scale;
        const scaledH = img.height * scale;
        const offsetX = opt.offsetX || 0;
        const offsetY = opt.offsetY || 0;
        
        ctx.drawImage(
            img, 
            -scaledW/2 + offsetX, 
            -scaledH/2 + offsetY, 
            scaledW, 
            scaledH
        );
        ctx.restore();
    });
    ctx.restore();
}
};

// ── CHARACTER LAYERING LOGIC ──────────────────────────────────────
const CharacterLayers = {
  layers: ['shadow', 'body', 'armor', 'weapon', 'vfx'],
  
  getConfig: (classId, equipment) => {
    const base = {
      berserker: {
        shadow: { key: 'berserker_shadow', offsetY: 22 },
        body:   { key: 'berserker_body' },
        armor:  { key: equipment?.armor ? `armor_${equipment.armor.name}` : null },
        weapon: { key: equipment?.weapon ? `weapon_${equipment.weapon.name}` : 'weapon_axe_basic' },
        vfx:    { key: P.rage ? 'vfx_rage_berserker' : null }
      },
      ranger: {
        shadow: { key: 'ranger_shadow', offsetY: 22 },
        body:   { key: 'ranger_body' },
        armor:  { key: equipment?.armor ? `armor_${equipment.armor.name}` : null },
        weapon: { key: equipment?.weapon ? `weapon_${equipment.weapon.name}` : 'weapon_bow_basic' },
        vfx:    { key: null }
      },
      runecaster: {
        shadow: { key: 'runecaster_shadow', offsetY: 22 },
        body:   { key: 'runecaster_body' },
        armor:  { key: equipment?.armor ? `armor_${equipment.armor.name}` : null },
        weapon: { key: equipment?.weapon ? `weapon_${equipment.weapon.name}` : 'weapon_staff_basic' },
        vfx:    { key: 'vfx_rune_aura' }
      },
      guardian: {
        shadow: { key: 'guardian_shadow', offsetY: 22 },
        body:   { key: 'guardian_body' },
        armor:  { key: equipment?.armor ? `armor_${equipment.armor.name}` : null },
        weapon: { key: equipment?.weapon ? `weapon_${equipment.weapon.name}` : 'weapon_sword_basic' },
        vfx:    { key: null }
      }
    };
    
    const config = base[classId] || base.berserker;
    Object.values(config).forEach(layer => layer.flipX = P.facing.x < 0);
    return config;
  }
};

// ── INTEGRATION WRAPPER ───────────────────────────────────────────
function drawPlayerSprite(sx, sy) {
  const spriteKey = `${P.classId || 'berserker'}_body`;
  
  if (!SpriteSystem.get(spriteKey)) {
    drawPlayerFigure(sx, sy); // Fallback to procedural
    return;
  }

  const config = CharacterLayers.getConfig(P.classId, P.equip);
  const orderedLayers = CharacterLayers.layers.map(name => config[name]).filter(Boolean);
  SpriteSystem.drawLayered(orderedLayers, sx, sy);
}

async function initSpriteAssets() {
  // Use AssetLoader for loading all assets
  return new Promise((resolve) => {
    console.log('📦 Loading sprites via AssetLoader...');
    
    AssetLoader.init(() => {
      // Transfer loaded images to SpriteSystem cache
      Object.entries(AssetLoader.images).forEach(([key, img]) => {
        SpriteSystem.cache[key] = img;
      });
      console.log('✅ Sprites ready.');
      resolve();
    });
  });
}