const SpriteSystem = {
  cache: {},
  callbacks: {},

  load(key, src) {
    return new Promise((resolve) => {
      if (SpriteSystem.cache[key]) {
        resolve(SpriteSystem.cache[key]);
        return;
      }
      if (SpriteSystem.callbacks[key]) {
        SpriteSystem.callbacks[key].push(resolve);
        return;
      }
      SpriteSystem.callbacks[key] = [resolve];

      const img = new Image();
      img.onload = () => {
        SpriteSystem.cache[key] = img;
        SpriteSystem.callbacks[key].forEach((cb) => cb(img));
        delete SpriteSystem.callbacks[key];
      };
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${key}`);
        SpriteSystem.callbacks[key].forEach((cb) => cb(null));
        delete SpriteSystem.callbacks[key];
      };
      img.src = src;
    });
  },

  loadAll(assets) {
    return Promise.all(Object.entries(assets).map(([key, src]) => SpriteSystem.load(key, src)));
  },

  get(key) {
    return SpriteSystem.cache[key] || null;
  },

  drawLayered(layers, x, y, commonOptions = {}) {
    ctx.save();
    ctx.translate(x, y);

    const targetSize = 64;

    layers.forEach((layer) => {
      if (!layer || !layer.key) return;
      const img = SpriteSystem.get(layer.key);
      if (!img) return;

      ctx.save();
      const opt = { ...commonOptions, ...layer };
      if (opt.flipX) ctx.scale(-1, 1);
      if (opt.flipY) ctx.scale(1, -1);
      if (opt.alpha != null) ctx.globalAlpha = opt.alpha;
      if (opt.rotation) ctx.rotate(opt.rotation);
      if (opt.tint) ctx.filter = `hue-rotate(${opt.tint}deg)`;

      const scale = Math.min(targetSize / img.width, targetSize / img.height);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;

      ctx.drawImage(
        img,
        -scaledW / 2 + (opt.offsetX || 0),
        -scaledH / 2 + (opt.offsetY || 0),
        scaledW,
        scaledH
      );
      ctx.restore();
    });

    ctx.restore();
  }
};

const CharacterLayers = {
  layers: ['shadow', 'body', 'armor', 'weapon', 'vfx'],

  resolveArmorKey(equipment) {
    const name = equipment?.armor?.name || equipment?.chest?.name || '';
    if (!name) return null;
    const normalized = name.toLowerCase();
    if (normalized.includes('leather')) return 'armor_leather_vest';
    if (normalized.includes('warden')) return 'armor_warden_mail';
    return null;
  },

  resolveWeaponKey(equipment, fallbackKey) {
    const name = equipment?.weapon?.name || '';
    if (!name) return fallbackKey;
    const normalized = name.toLowerCase();
    if (normalized.includes('bow')) return 'weapon_bow_basic';
    if (normalized.includes('staff') || normalized.includes('tome') || normalized.includes('bone')) return 'weapon_staff_basic';
    if (normalized.includes('axe') || normalized.includes('hammer') || normalized.includes('mjolnir')) return 'weapon_axe_basic';
    return 'weapon_sword_basic';
  },

  getConfig(classId, equipment) {
    const base = {
      berserker: {
        shadow: { key: 'berserker_shadow', offsetY: 22 },
        body: { key: 'berserker_body' },
        armor: { key: CharacterLayers.resolveArmorKey(equipment) },
        weapon: { key: CharacterLayers.resolveWeaponKey(equipment, 'weapon_axe_basic') },
        vfx: { key: P.rage ? 'vfx_rage_berserker' : null }
      },
      ranger: {
        shadow: { key: 'ranger_shadow', offsetY: 22 },
        body: { key: 'ranger_body' },
        armor: { key: CharacterLayers.resolveArmorKey(equipment) },
        weapon: { key: CharacterLayers.resolveWeaponKey(equipment, 'weapon_bow_basic') },
        vfx: { key: null }
      },
      runecaster: {
        shadow: { key: 'runecaster_shadow', offsetY: 22 },
        body: { key: 'runecaster_body' },
        armor: { key: CharacterLayers.resolveArmorKey(equipment) },
        weapon: { key: CharacterLayers.resolveWeaponKey(equipment, 'weapon_staff_basic') },
        vfx: { key: 'vfx_rune_aura' }
      },
      guardian: {
        shadow: { key: 'guardian_shadow', offsetY: 22 },
        body: { key: 'guardian_body' },
        armor: { key: CharacterLayers.resolveArmorKey(equipment) },
        weapon: { key: CharacterLayers.resolveWeaponKey(equipment, 'weapon_sword_basic') },
        vfx: { key: null }
      }
    };

    const config = base[classId] || base.berserker;
    Object.values(config).forEach((layer) => {
      if (layer) layer.flipX = P.facing.x < 0;
    });
    return config;
  }
};

function drawLayeredPlayerSprite(sx, sy) {
  const spriteKey = `${P.classId || 'berserker'}_body`;
  if (!SpriteSystem.get(spriteKey)) {
    drawPlayerFigure(sx, sy);
    return;
  }

  const config = CharacterLayers.getConfig(P.classId, P.equip);
  const orderedLayers = CharacterLayers.layers.map((name) => config[name]).filter(Boolean);
  SpriteSystem.drawLayered(orderedLayers, sx, sy);
}

function syncSpriteSystemCache() {
  Object.entries(AssetLoader.images).forEach(([key, img]) => {
    SpriteSystem.cache[key] = img;
  });
  return SpriteSystem.cache;
}
