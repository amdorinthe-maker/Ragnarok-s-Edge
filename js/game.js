const C=document.getElementById('c'),ctx=C.getContext('2d');
const MM=document.getElementById('mm2'),mctx=MM.getContext('2d');
let W=C.width=window.innerWidth,H=C.height=window.innerHeight;
window.addEventListener('resize',()=>{W=C.width=window.innerWidth;H=C.height=window.innerHeight});

// ── TILE CONSTANTS ─────────────────────────────────────────
const T=40,WS=80;
const TILE={GRASS:0,STONE:1,WATER:2,SNOW:3,LAVA:4,WALL:5,TREE:6,RUNE:7,DUNGEON_ENTRY:8};
const DT={FLOOR:0,WALL:1,DOOR:2,CHEST:3,TRAP:4,TORCH:5,BOSS_DOOR:6,STAIRS:7,SPIKE:8,VENDOR:9,FORGE:10,
          SECRET_WALL:11,SHRINE:12,PUZZLE:13,POISON_VENT:14,ARROW_TRAP:15,RUNE_TILE:16,ELITE_MARKER:17,ARMORY:18,CRYPT:19,EVENT:20};
const MAX_FLOORS=25;
const BOSS_INTERVAL=10;

// ── ITEMS & POTIONS ────────────────────────────────────────
const POTIONS=[
  {id:'hp_sm',name:'Minor Heal',icon:'🧪',type:'potion',potionType:'hp',heal:40,rarity:'common',desc:'Restores 40 HP'},
  {id:'hp_md',name:'Healing Potion',icon:'🍶',type:'potion',potionType:'hp',heal:80,rarity:'rare',desc:'Restores 80 HP'},
  {id:'hp_lg',name:'Greater Heal',icon:'💊',type:'potion',potionType:'hp',heal:150,rarity:'epic',desc:'Restores 150 HP'},
  {id:'mp_sm',name:'Mana Vial',icon:'🫙',type:'potion',potionType:'mp',heal:40,rarity:'common',desc:'Restores 40 MP'},
  {id:'mp_md',name:'Mana Potion',icon:'💙',type:'potion',potionType:'mp',heal:80,rarity:'rare',desc:'Restores 80 MP'},
  {id:'full',name:'Elixir of Life',icon:'⚗️',type:'potion',potionType:'full',heal:999,rarity:'legendary',desc:'Fully restores HP & MP'},
];
const ITEM_BASES=[
  {id:0,name:'Iron Axe',icon:'🪓',type:'weapon',baseDmg:8,rarity:'common'},
  {id:1,name:'Draugr Sword',icon:'⚔️',type:'weapon',baseDmg:16,rarity:'rare'},
  {id:2,name:'Frost Blade',icon:'🗡️',type:'weapon',baseDmg:24,rarity:'epic',special:'slow'},
  {id:3,name:'Mjolnir Echo',icon:'🔨',type:'weapon',baseDmg:40,rarity:'legendary',special:'shockwave'},
  {id:4,name:'Leather Vest',icon:'🧥',type:'armor',baseDef:5,rarity:'common'},
  {id:5,name:'Chainmail',icon:'🛡️',type:'armor',baseDef:14,rarity:'rare'},
  {id:6,name:'Valkyrie Plate',icon:'🦾',type:'armor',baseDef:26,rarity:'epic'},
  {id:7,name:"Thor's Helm",icon:'⛑️',type:'helm',baseDef:10,rarity:'rare'},
  {id:8,name:'Odin Rune',icon:'🔮',type:'rune',mpBonus:35,rarity:'rare'},
  {id:9,name:'Blood Rune',icon:'💎',type:'rune',hpBonus:60,rarity:'epic'},
  {id:10,name:'Speed Rune',icon:'🌀',type:'rune',spdBonus:0.5,rarity:'rare'},
  {id:11,name:'Wolf Pelt',icon:'🐺',type:'helm',baseDef:6,rarity:'common'},
  {id:12,name:'Giant Bone',icon:'🦴',type:'weapon',baseDmg:12,rarity:'common'},
  {id:13,name:'Runic Sword',icon:'🗡️',type:'weapon',baseDmg:20,rarity:'rare',special:'lightning'},
  {id:14,name:'Shadow Dagger',icon:'🔪',type:'weapon',baseDmg:14,rarity:'rare',special:'crit'},
  {id:15,name:'Berserker Axe',icon:'🪓',type:'weapon',baseDmg:32,rarity:'epic',special:'rage'},
  {id:16,name:'Frost Shield',icon:'❄️',type:'armor',baseDef:20,rarity:'epic',special:'slow'},
  {id:17,name:'Death Helm',icon:'💀',type:'helm',baseDef:16,rarity:'epic'},
  {id:18,name:'Dragon Scale',icon:'🐉',type:'armor',baseDef:34,rarity:'legendary',special:'fire'},
  {id:19,name:'War Pike',icon:'🗡️',type:'weapon',baseDmg:18,rarity:'rare',special:'slow'},
  {id:20,name:'Hunter Longbow',icon:'🏹',type:'weapon',baseDmg:26,rarity:'epic',bonusCrit:10},
  {id:21,name:'Storm Staff',icon:'⚚',type:'weapon',baseDmg:22,rarity:'epic',special:'lightning',skillMult:0.12},
  {id:22,name:'Runecarved Tome',icon:'📘',type:'rune',mpBonus:28,rarity:'rare',manaRegen:0.4},
  {id:23,name:'Warden Mail',icon:'🥋',type:'armor',baseDef:18,rarity:'rare',hpBonus:28},
  {id:24,name:'Skald Hood',icon:'🎭',type:'helm',baseDef:9,rarity:'rare',mpBonus:18},
  {id:25,name:'Serpent Scale',icon:'🐍',type:'armor',baseDef:24,rarity:'epic',damageReduction:0.05},
  {id:26,name:'Vitality Rune',icon:'🩸',type:'rune',hpBonus:42,rarity:'epic',lifesteal:0.03},
  {id:27,name:'Tempest Rune',icon:'🌩️',type:'rune',spdBonus:0.35,rarity:'epic',bonusCrit:8},
  {id:28,name:'Ashen Cuirass',icon:'🛡',type:'armor',baseDef:16,rarity:'rare',damageReduction:0.03},
  {id:29,name:'Fenrir Fang',icon:'🐺',type:'weapon',baseDmg:46,rarity:'legendary',lifesteal:0.08,bonusCrit:14},
  {id:30,name:'Coil of Jormungandr',icon:'🐍',type:'rune',mpBonus:48,rarity:'legendary',manaRegen:0.9,damageReduction:0.06},
  {id:31,name:'Helwoven Shroud',icon:'🕸️',type:'armor',baseDef:32,rarity:'legendary',skillMult:0.2},
  {id:32,name:'Surtr Brand',icon:'🔥',type:'weapon',baseDmg:50,rarity:'legendary',special:'fire',bonusDmg:8},
  {id:33,name:"Allfather's Sigil",icon:'👁️',type:'helm',baseDef:22,rarity:'legendary',bonusCrit:18,manaRegen:0.5},
  {id:34,name:'Ravenguard Helm',icon:'🪖',type:'helm',baseDef:12,rarity:'rare',hpBonus:14},
  {id:35,name:'Runepiercer',icon:'🗡️',type:'weapon',baseDmg:22,rarity:'rare',bonusCrit:6},
  {id:36,name:'Seidr Mantle',icon:'🧥',type:'armor',baseDef:18,rarity:'rare',skillMult:0.08,mpBonus:16},
  {id:37,name:'Wyrmglass Band',icon:'💠',type:'rune',rarity:'rare',mpBonus:20,manaRegen:0.25,bonusCrit:4},
  {id:38,name:'Vanguard Pike',icon:'🗡️',type:'weapon',baseDmg:28,rarity:'epic',meleeMult:0.1,damageReduction:0.03},
  {id:39,name:'Barrow Plate',icon:'🛡️',type:'armor',baseDef:22,rarity:'epic',hpBonus:32,damageReduction:0.04},
  {id:40,name:'Moonveil Hood',icon:'🪶',type:'helm',baseDef:14,rarity:'epic',bonusCrit:10,mpBonus:22},
  {id:41,name:'Norn Thread',icon:'🧿',type:'rune',rarity:'epic',skillMult:0.12,spdBonus:0.18},
  {id:42,name:'Apprentice Staff',icon:'🪄',type:'weapon',baseDmg:10,rarity:'common',skillMult:0.05},
  {id:43,name:'Icebind Staff',icon:'🪄',type:'weapon',baseDmg:18,rarity:'rare',special:'slow',skillMult:0.08},
  {id:44,name:'Seer Tome',icon:'📘',type:'weapon',baseDmg:16,rarity:'rare',skillMult:0.1,mpBonus:12},
  {id:45,name:'Hunter Sigil',icon:'H',type:'rune',rarity:'rare',rangedMult:0.12,bonusCrit:6},
  {id:46,name:'Bulwark Rune',icon:'🛡️',type:'rune',rarity:'rare',hpBonus:24,damageReduction:0.04},
  {id:47,name:'Ember Sigil',icon:'🔥',type:'rune',rarity:'epic',bonusDmg:6,meleeMult:0.08},
  {id:48,name:'Glacier Knot',icon:'❄️',type:'rune',rarity:'epic',skillMult:0.1,manaRegen:0.25},
  {id:49,name:'Raven Charm',icon:'🐦',type:'rune',rarity:'rare',spdBonus:0.22,bonusCrit:6,rangedMult:0.06},
  {id:50,name:'Worldroot Rune',icon:'🌿',type:'rune',rarity:'epic',hpBonus:28,mpBonus:20,damageReduction:0.03}
];
const LOOT_PREFIXES=[
  {name:'Glacial',slots:['weapon','armor','helm'],apply:(item,p)=>{item.special=item.special||'slow';item.def&&(item.damageReduction=(item.damageReduction||0)+0.01*p);}},
  {name:'Stormforged',slots:['weapon','rune'],apply:(item,p)=>{item.special=item.special||'lightning';item.bonusCrit=(item.bonusCrit||0)+2*p;}},
  {name:'Bloodbound',slots:['weapon','armor','rune'],apply:(item,p)=>{item.lifesteal=(item.lifesteal||0)+0.01*Math.max(1,Math.floor(p/2));item.hpBonus=(item.hpBonus||0)+6*p;}},
  {name:'Swift',slots:['weapon','helm','rune'],apply:(item,p)=>{item.spdBonus=(item.spdBonus||0)+ +(0.05*p).toFixed(2);}},
  {name:'Warded',slots:['armor','helm','rune'],apply:(item,p)=>{item.damageReduction=(item.damageReduction||0)+0.008*p;}},
  {name:'Runespun',slots:['weapon','rune','helm'],apply:(item,p)=>{item.skillMult=(item.skillMult||0)+0.03*p;item.mpBonus=(item.mpBonus||0)+5*p;}},
  {name:'Hunter\'s',slots:['weapon','helm'],apply:(item,p)=>{item.bonusCrit=(item.bonusCrit||0)+3*p;item.rangedMult=(item.rangedMult||0)+0.03*p;}},
  {name:'Warlord\'s',slots:['weapon','armor'],apply:(item,p)=>{item.bonusDmg=(item.bonusDmg||0)+2*p;item.meleeMult=(item.meleeMult||0)+0.03*p;}}
];
const LOOT_SUFFIXES=[
  {name:'of Frost',slots:['weapon','armor'],apply:(item,p)=>{item.special='slow';item.hpBonus=(item.hpBonus||0)+4*p;}},
  {name:'of Storms',slots:['weapon','rune'],apply:(item,p)=>{item.special='lightning';item.manaRegen=(item.manaRegen||0)+0.08*p;}},
  {name:'of the Wolf',slots:['weapon','helm'],apply:(item,p)=>{item.bonusCrit=(item.bonusCrit||0)+2*p;item.lifesteal=(item.lifesteal||0)+0.01;}},
  {name:'of Embers',slots:['weapon','armor'],apply:(item,p)=>{item.special='fire';item.bonusDmg=(item.bonusDmg||0)+p;}},
  {name:'of Vigor',slots:['armor','helm','rune'],apply:(item,p)=>{item.hpBonus=(item.hpBonus||0)+8*p;}},
  {name:'of the Deep',slots:['rune','helm','armor'],apply:(item,p)=>{item.mpBonus=(item.mpBonus||0)+7*p;item.manaRegen=(item.manaRegen||0)+0.05*p;}},
  {name:'of Precision',slots:['weapon','rune'],apply:(item,p)=>{item.bonusCrit=(item.bonusCrit||0)+2*p;}},
  {name:'of the Colossus',slots:['armor','weapon'],apply:(item,p)=>{item.damageReduction=(item.damageReduction||0)+0.006*p;item.bonusDmg=(item.bonusDmg||0)+p;}}
];
const BOSS_REWARD_BASES={
  'GARMR':29,
  'THE BONE KING':31,
  'HEL':31,
  'FORGE GUARDIAN':32,
  'JORMUNGANDR':30,
  'SURTR':32,
  'VEILSCRIBE':41,
  "MIMIR'S ECHO":44,
  "ODIN'S SHADOW":33
};
const SELL_PRICE={common:4,rare:12,epic:32,legendary:90};
const UPGRADE_COST={common:55,rare:165,epic:460,legendary:1350};
function scaleFactor(floor,level){return 1+(floor-1)*.25+(level-1)*.12;}
function isBossFloor(floor=dungeonFloor){return floor>0&&floor%BOSS_INTERVAL===0;}
function bossFloorIndex(floor=dungeonFloor){return Math.max(0,Math.floor(floor/BOSS_INTERVAL)-1);}
function currentDungeonBossDef(floor=dungeonFloor){
  let idx=bossFloorIndex(floor);
  let route=currentDungeonRouteDef();
  let routeIds=ROUTE_BOSS_TABLE[route.id]||ROUTE_BOSS_TABLE.barrow;
  let bossId=routeIds[Math.min(routeIds.length-1,idx)]||routeIds[0];
  if(idx>=routeIds.length)bossId=routeIds[(idx-routeIds.length)%routeIds.length];
  return BOSSDEFS.find(b=>b.id===bossId)||BOSSDEFS[0];
}
function bossEscortBase(def){
  if(def?.family==='grave')return 'Skeleton';
  if(def?.family==='ember')return 'Fire Demon';
  if(def?.family==='seer'||def?.family==='shadow'||def?.family==='veil')return 'Dark Elf';
  if(def?.family==='serpent')return 'Wolf';
  return 'Wolf';
}
function currentDeepMutators(floor=dungeonFloor){
  if(floor<15)return [];
  let cycle=Math.floor((floor-15)/5);
  let picks=[DEEP_DUNGEON_MUTATORS[cycle%DEEP_DUNGEON_MUTATORS.length]];
  if(floor>=45)picks.push(DEEP_DUNGEON_MUTATORS[(cycle+2)%DEEP_DUNGEON_MUTATORS.length]);
  if(floor>=75)picks.push(DEEP_DUNGEON_MUTATORS[(cycle+4)%DEEP_DUNGEON_MUTATORS.length]);
  return picks.filter((m,i,a)=>m&&a.findIndex(x=>x.name===m.name)===i);
}
function activeDungeonMods(floor=dungeonFloor){
  let mods=[];
  if(dungeonModifier)mods.push(dungeonModifier);
  mods.push(...currentDeepMutators(floor));
  return mods;
}
function dungeonHasMod(name,floor=dungeonFloor){return activeDungeonMods(floor).some(m=>m.name===name);}
function dungeonModSummary(floor=dungeonFloor){
  return activeDungeonMods(floor).map(m=>m.name).join(' • ');
}
function currentLootBand(floor=dungeonFloor){
  if(floor>=80)return{name:'Mythic',affixMult:1.42,quality:1.24,epicBias:0.22};
  if(floor>=50)return{name:'Abyssal',affixMult:1.32,quality:1.18,epicBias:0.16};
  if(floor>=30)return{name:'Deep',affixMult:1.2,quality:1.1,epicBias:0.1};
  if(floor>=15)return{name:'Descending',affixMult:1.1,quality:1.04,epicBias:0.04};
  return{name:'Standard',affixMult:1,quality:1,epicBias:0};
}
function routeDef(routeId){
  return ROUTE_DEFS.find(r=>r.id===routeId)||ROUTE_DEFS[0];
}
function routeVisuals(route=currentDungeonRouteDef()){
  let base=ROUTE_VISUALS[route?.id]||ROUTE_VISUALS.barrow;
  return {id:route?.id||'barrow',...base};
}
function currentDungeonRouteDef(){
  return routeDef(activeDungeonRouteId||lastDungeonEntrance?.routeId||ROUTE_DEFS[0].id);
}
const AUDIO_PREF_KEY='ragnarok_edge_audio_v1';
let audioCtx=null,audioMasterGain=null,audioFxGain=null,audioAmbGain=null;
let audioPrefs={master:.7,effects:.78,ambience:.52,muted:false};
let audioCooldowns={};
let ambienceVoices=null;
let ambienceEventTimer=2200+Math.random()*2200;
let lastAmbientBossState='';
function saveExists(){
  try{return !!localStorage.getItem(SAVE_KEY);}catch{return false;}
}
function loadAudioPrefs(){
  try{
    let raw=localStorage.getItem(AUDIO_PREF_KEY);
    if(!raw)return;
    let next=JSON.parse(raw);
    if(typeof next?.master==='number')audioPrefs.master=Math.max(0,Math.min(1,next.master));
    if(typeof next?.effects==='number')audioPrefs.effects=Math.max(0,Math.min(1,next.effects));
    if(typeof next?.ambience==='number')audioPrefs.ambience=Math.max(0,Math.min(1,next.ambience));
    if(typeof next?.muted==='boolean')audioPrefs.muted=next.muted;
  }catch{}
}
function saveAudioPrefs(){
  try{localStorage.setItem(AUDIO_PREF_KEY,JSON.stringify(audioPrefs));}catch{}
}
function applyAudioGains(){
  if(audioMasterGain)audioMasterGain.gain.value=audioPrefs.muted?0:audioPrefs.master;
  if(audioFxGain)audioFxGain.gain.value=audioPrefs.effects;
  if(audioAmbGain)audioAmbGain.gain.value=audioPrefs.ambience;
}
function updateAudioUI(){
  let muteBtn=document.getElementById('audio-mute-btn');
  let master=document.getElementById('audio-master');
  let fx=document.getElementById('audio-effects');
  let amb=document.getElementById('audio-ambience');
  if(muteBtn){
    muteBtn.textContent=audioPrefs.muted?'SFX Off':'SFX On';
    muteBtn.classList.toggle('off',audioPrefs.muted);
  }
  if(master)master.value=Math.round(audioPrefs.master*100);
  if(fx)fx.value=Math.round(audioPrefs.effects*100);
  if(amb)amb.value=Math.round(audioPrefs.ambience*100);
}
function createNoiseBuffer(ac){
  let buffer=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);
  let data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*0.6;
  return buffer;
}
function initAmbienceVoices(){
  if(!audioCtx||ambienceVoices)return ambienceVoices;
  let droneOsc=audioCtx.createOscillator(),droneGain=audioCtx.createGain();
  droneOsc.type='triangle'; droneOsc.frequency.value=120; droneGain.gain.value=.0001;
  droneOsc.connect(droneGain); droneGain.connect(audioAmbGain);
  let shimmerOsc=audioCtx.createOscillator(),shimmerGain=audioCtx.createGain();
  shimmerOsc.type='sine'; shimmerOsc.frequency.value=240; shimmerGain.gain.value=.0001;
  shimmerOsc.connect(shimmerGain); shimmerGain.connect(audioAmbGain);
  let rumbleOsc=audioCtx.createOscillator(),rumbleGain=audioCtx.createGain();
  rumbleOsc.type='sawtooth'; rumbleOsc.frequency.value=70; rumbleGain.gain.value=.0001;
  rumbleOsc.connect(rumbleGain); rumbleGain.connect(audioAmbGain);
  let noiseSource=audioCtx.createBufferSource(),noiseFilter=audioCtx.createBiquadFilter(),noiseGain=audioCtx.createGain();
  noiseSource.buffer=createNoiseBuffer(audioCtx); noiseSource.loop=true;
  noiseFilter.type='lowpass'; noiseFilter.frequency.value=900; noiseGain.gain.value=.0001;
  noiseSource.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(audioAmbGain);
  droneOsc.start(); shimmerOsc.start(); rumbleOsc.start(); noiseSource.start();
  ambienceVoices={droneOsc,droneGain,shimmerOsc,shimmerGain,rumbleOsc,rumbleGain,noiseSource,noiseFilter,noiseGain};
  return ambienceVoices;
}
function ensureAudio(){
  let AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  if(!audioCtx){
    audioCtx=new AC();
    audioMasterGain=audioCtx.createGain();
    audioFxGain=audioCtx.createGain();
    audioAmbGain=audioCtx.createGain();
    audioFxGain.connect(audioMasterGain);
    audioAmbGain.connect(audioMasterGain);
    audioMasterGain.connect(audioCtx.destination);
    initAmbienceVoices();
    applyAudioGains();
  }
  if(audioCtx.state==='suspended')audioCtx.resume();
  applyAudioGains();
  return audioCtx;
}
function setAudioMaster(v){
  audioPrefs.master=Math.max(0,Math.min(1,Number(v)/100));
  ensureAudio();
  applyAudioGains();
  updateAudioUI();
  saveAudioPrefs();
}
function setAudioEffects(v){
  audioPrefs.effects=Math.max(0,Math.min(1,Number(v)/100));
  ensureAudio();
  applyAudioGains();
  updateAudioUI();
  saveAudioPrefs();
}
function setAudioAmbience(v){
  audioPrefs.ambience=Math.max(0,Math.min(1,Number(v)/100));
  ensureAudio();
  applyAudioGains();
  updateAudioUI();
  saveAudioPrefs();
}
function toggleAudioMute(){
  audioPrefs.muted=!audioPrefs.muted;
  ensureAudio();
  applyAudioGains();
  updateAudioUI();
  saveAudioPrefs();
}
function audioTone(freq,dur=.09,type='sine',gain=.08,when=0,slideTo=null){
  let ac=ensureAudio(); if(!ac||!audioFxGain)return;
  let t=ac.currentTime+when;
  let osc=ac.createOscillator(),g=ac.createGain();
  osc.type=type; osc.frequency.setValueAtTime(freq,t);
  if(slideTo)osc.frequency.exponentialRampToValueAtTime(Math.max(25,slideTo),t+dur);
  g.gain.setValueAtTime(.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+.01);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  osc.connect(g); g.connect(audioFxGain);
  osc.start(t); osc.stop(t+dur+.02);
}
function playSfx(name,scale=1){
  let ac=ensureAudio(); if(!ac||audioPrefs.muted)return;
  let now=performance.now();
  let gate={hurt:120,pickupGold:55,pickupItem:90,hit:60,arrow:70,arcane:70,melee:80,ui:70};
  let cd=gate[name]||0;
  if(cd&&audioCooldowns[name]&&now-audioCooldowns[name]<cd)return;
  audioCooldowns[name]=now;
  let s=Math.max(.2,scale);
  switch(name){
    case 'ui': audioTone(620,.04,'triangle',.03*s,0,540); audioTone(820,.05,'triangle',.02*s,.03,760); break;
    case 'uiClose': audioTone(520,.05,'triangle',.03*s,0,420); break;
    case 'melee': audioTone(150,.05,'square',.05*s,0,110); audioTone(92,.08,'triangle',.035*s,.01,70); break;
    case 'hit': audioTone(210,.04,'square',.035*s,0,140); break;
    case 'arrow': audioTone(900,.025,'square',.03*s,0,520); audioTone(420,.04,'triangle',.02*s,.015,300); break;
    case 'arcane': audioTone(420,.08,'sine',.032*s,0,720); audioTone(860,.08,'triangle',.022*s,.02,1120); break;
    case 'potion': audioTone(540,.05,'sine',.03*s,0,700); audioTone(760,.08,'triangle',.028*s,.03,1020); break;
    case 'pickupGold': audioTone(980,.04,'triangle',.025*s,0,1180); audioTone(1320,.05,'triangle',.02*s,.03,1500); break;
    case 'pickupItem': audioTone(620,.05,'triangle',.03*s,0,780); audioTone(930,.08,'sine',.025*s,.035,1200); break;
    case 'hurt': audioTone(180,.08,'sawtooth',.05*s,0,110); break;
    case 'skillAxes': audioTone(190,.07,'square',.05*s,0,130); audioTone(260,.07,'triangle',.025*s,.03,180); break;
    case 'skillWrath': audioTone(250,.12,'sawtooth',.04*s,0,520); audioTone(780,.1,'triangle',.03*s,.03,1120); break;
    case 'skillFrost': audioTone(720,.1,'sine',.03*s,0,340); audioTone(420,.11,'triangle',.028*s,.04,220); break;
    case 'skillRage': audioTone(140,.12,'sawtooth',.055*s,0,90); audioTone(210,.08,'square',.03*s,.04,150); break;
    case 'bossSpawn': audioTone(130,.18,'sawtooth',.06*s,0,80); audioTone(240,.16,'triangle',.04*s,.05,170); audioTone(420,.22,'sine',.03*s,.12,320); break;
    case 'bossDeath': audioTone(360,.12,'triangle',.05*s,0,220); audioTone(540,.15,'sine',.04*s,.08,760); audioTone(880,.2,'triangle',.03*s,.16,1180); break;
    case 'chest': audioTone(410,.05,'square',.03*s,0,510); audioTone(640,.06,'triangle',.028*s,.03,820); audioTone(920,.08,'sine',.024*s,.06,1250); break;
    case 'forge': audioTone(210,.04,'square',.04*s,0,180); audioTone(320,.05,'triangle',.03*s,.025,280); break;
    case 'shrine': audioTone(540,.12,'sine',.03*s,0,860); audioTone(810,.14,'triangle',.025*s,.05,1220); break;
  }
}
function initAudioUI(){
  loadAudioPrefs();
  updateAudioUI();
}
function currentBossFamily(){
  if(bossRef?.family)return bossRef.family;
  if(inDungeon&&(bossActive||bossReady))return currentDungeonBossDef()?.family||'grave';
  return '';
}
function currentAmbienceProfile(){
  if(!inDungeon){
    return{drone:136,shimmer:272,rumble:58,noise:820,droneGain:.028,shimmerGain:.012,rumbleGain:.004,noiseGain:.018};
  }
  let route=currentDungeonRouteDef()?.id||'barrow';
  let profile=route==='ember'
    ?{drone:82,shimmer:164,rumble:41,noise:620,droneGain:.03,shimmerGain:.01,rumbleGain:.012,noiseGain:.022}
    :route==='seer'
      ?{drone:174,shimmer:348,rumble:63,noise:980,droneGain:.022,shimmerGain:.02,rumbleGain:.003,noiseGain:.012}
      :{drone:98,shimmer:196,rumble:52,noise:720,droneGain:.026,shimmerGain:.009,rumbleGain:.006,noiseGain:.02};
  if(bossActive||bossReady){
    profile.drone*=route==='ember'?1.06:.97;
    profile.shimmer*=1.08;
    profile.rumbleGain*=2.1;
    profile.noiseGain*=1.45;
    profile.shimmerGain*=1.35;
  }
  return profile;
}
function playAmbientEvent(name,scale=1){
  let ac=ensureAudio(); if(!ac||audioPrefs.muted)return;
  let s=Math.max(.2,scale)*(audioPrefs.ambience>0?1:0);
  switch(name){
    case 'midgardRaven':
      audioTone(720,.05,'triangle',.012*s,0,610);
      audioTone(540,.08,'sine',.009*s,.04,470);
      break;
    case 'midgardWind':
      audioTone(196,.22,'sine',.009*s,0,156);
      audioTone(294,.18,'triangle',.006*s,.08,246);
      break;
    case 'barrowWhisper':
      audioTone(164,.18,'sine',.012*s,0,118);
      audioTone(248,.16,'triangle',.008*s,.06,190);
      break;
    case 'emberForge':
      audioTone(118,.09,'square',.014*s,0,96);
      audioTone(210,.07,'triangle',.01*s,.04,240);
      audioTone(420,.05,'sine',.008*s,.08,360);
      break;
    case 'seerChime':
      audioTone(612,.12,'sine',.012*s,0,880);
      audioTone(918,.1,'triangle',.01*s,.04,1210);
      break;
    case 'bossWolf':
      audioTone(144,.14,'sawtooth',.018*s,0,102);
      audioTone(228,.1,'triangle',.012*s,.06,170);
      break;
    case 'bossGrave':
      audioTone(176,.18,'sine',.015*s,0,124);
      audioTone(264,.14,'triangle',.011*s,.08,212);
      break;
    case 'bossEmber':
      audioTone(126,.11,'square',.018*s,0,98);
      audioTone(252,.1,'triangle',.012*s,.04,336);
      break;
    case 'bossSerpent':
      audioTone(208,.12,'sine',.014*s,0,182);
      audioTone(156,.16,'triangle',.011*s,.05,120);
      break;
    case 'bossSeer':
      audioTone(430,.14,'sine',.014*s,0,690);
      audioTone(688,.12,'triangle',.01*s,.05,1020);
      break;
    case 'bossShadow':
      audioTone(192,.16,'triangle',.013*s,0,138);
      audioTone(512,.12,'sine',.009*s,.07,420);
      break;
  }
}
function ambientEventName(){
  if(!inDungeon){
    return Math.random()<.58?'midgardWind':'midgardRaven';
  }
  if(bossActive||bossReady){
    let family=currentBossFamily();
    if(family==='wolf')return'bossWolf';
    if(family==='grave'||family==='veil')return'bossGrave';
    if(family==='ember')return'bossEmber';
    if(family==='serpent')return'bossSerpent';
    if(family==='seer')return'bossSeer';
    if(family==='shadow')return'bossShadow';
  }
  let route=currentDungeonRouteDef()?.id||'barrow';
  return route==='ember'?'emberForge':route==='seer'?'seerChime':'barrowWhisper';
}
function updateAmbientEvents(dt){
  if(audioPrefs.muted||!audioCtx||!audioAmbGain)return;
  let bossState=(bossActive||bossReady)?`${inDungeon?'d':'w'}:${currentBossFamily()}`:'';
  if(bossState&&bossState!==lastAmbientBossState){
    playAmbientEvent(ambientEventName(),1.2);
    ambienceEventTimer=3200+Math.random()*1800;
  }
  lastAmbientBossState=bossState;
  ambienceEventTimer-=dt;
  if(ambienceEventTimer>0)return;
  playAmbientEvent(ambientEventName(),bossState?1.05:.9);
  if(bossState)ambienceEventTimer=5200+Math.random()*2600;
  else if(!inDungeon)ambienceEventTimer=7000+Math.random()*5000;
  else{
    let route=currentDungeonRouteDef()?.id||'barrow';
    ambienceEventTimer=(route==='seer'?6200:route==='ember'?5600:6800)+Math.random()*4200;
  }
}
function updateAmbientAudio(){
  if(!audioCtx||!ambienceVoices)return;
  let t=audioCtx.currentTime;
  let p=currentAmbienceProfile();
  ambienceVoices.droneOsc.frequency.setTargetAtTime(p.drone,t,.8);
  ambienceVoices.shimmerOsc.frequency.setTargetAtTime(p.shimmer,t,.8);
  ambienceVoices.rumbleOsc.frequency.setTargetAtTime(p.rumble,t,.8);
  ambienceVoices.noiseFilter.frequency.setTargetAtTime(p.noise,t,.6);
  ambienceVoices.droneGain.gain.setTargetAtTime(p.droneGain,t,.8);
  ambienceVoices.shimmerGain.gain.setTargetAtTime(p.shimmerGain,t,.8);
  ambienceVoices.rumbleGain.gain.setTargetAtTime(p.rumbleGain,t,.8);
  ambienceVoices.noiseGain.gain.setTargetAtTime(p.noiseGain,t,.8);
}
function updateTitleScreen(){
  let btn=document.getElementById('title-continue-btn');
  if(!btn)return;
  let hasSave=saveExists();
  btn.disabled=!hasSave;
  btn.textContent=hasSave?'Continue Watch':'No Save Found';
}
function openTitleScreen(){
  let el=document.getElementById('title-screen');
  if(!el)return;
  paused=true;
  hideTip();
  clearTransientInput();
  openPanel(null);
  updateTitleScreen();
  el.style.display='flex';
}
function closeTitleScreen(){
  let el=document.getElementById('title-screen');
  if(el)el.style.display='none';
}
function startNewJourney(){
  closeTitleScreen();
  paused=true;
  saveLoaded=false;
  initClassPanel();
  openPanel('class');
}
function continueJourney(){
  if(!saveExists()){startNewJourney();return;}
  if(loadGame(false)){
    closeTitleScreen();
    paused=false;
    closePanel();
    msg('⟳ Save restored. Welcome back to Ravenwatch.',2200);
  }else startNewJourney();
}
function pickRouteDungeonModifier(route,floor){
  if(floor<=1)return null;
  let bias=(route?.modBias||[]).map(name=>DUNGEON_MODIFIERS.find(m=>m.name===name)).filter(Boolean);
  let pool=[...DUNGEON_MODIFIERS,...bias,...bias];
  return pool[Math.floor(Math.random()*pool.length)]||null;
}
function routeLootBiasPool(pool,route=currentDungeonRouteDef()){
  let biased=[...pool];
  if(route.id==='barrow'){
    let picks=pool.filter(b=>b.type==='armor'||b.type==='helm'||b.type==='rune'||/mail|shroud|pelt|helm|hood|plate/i.test(b.name));
    if(picks.length)biased=biased.concat(picks,picks);
  }else if(route.id==='ember'){
    let picks=pool.filter(b=>b.type==='weapon'||b.type==='armor'||/axe|hammer|blade|sword|pike|plate|cuirass/i.test(b.name));
    if(picks.length)biased=biased.concat(picks,picks);
  }else if(route.id==='seer'){
    let picks=pool.filter(b=>b.type==='rune'||(b.type==='weapon'&&/staff|tome/i.test(b.name))||/hood|sigil|thread/i.test(b.name));
    if(picks.length)biased=biased.concat(picks,picks,picks);
  }
  return biased;
}
function chooseBossAffixes(floor=dungeonFloor){
  if(floor<30)return [];
  let count=floor>=80?3:floor>=50?2:1;
  let pool=[...BOSS_AFFIXES],out=[];
  for(let i=0;i<count&&pool.length;i++)out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  return out;
}
function bossHasAffix(e,id){return !!e?.affixIds?.includes(id);}
function scaleAffixPower(floor,level,rarity){
  return Math.max(1,Math.round((floor+level)*({common:.45,rare:.7,epic:1,legendary:1.25}[rarity]||1)*currentLootBand(floor).affixMult));
}
function offensiveLootScale(floor,level){
  let progress=Math.max(floor,level);
  if(progress<=2)return 0.58;
  if(progress<=4)return 0.7;
  if(progress<=7)return 0.82;
  if(progress<=10)return 0.92;
  return +(1*currentLootBand(floor).quality).toFixed(2);
}
function utilityLootScale(floor,level){
  let progress=Math.max(floor,level);
  if(progress<=2)return 0.82;
  if(progress<=4)return 0.9;
  return +(1+(currentLootBand(floor).quality-1)*0.75).toFixed(2);
}
function lootEffectiveLevel(floor,level){
  let capped=Math.min(level,Math.max(1,floor+2));
  if(capped<=1)return 1;
  return 1+(capped-1)*0.55;
}
function floorLootRarityCap(floor,allowLegendary=false){
  if(allowLegendary&&floor>=5)return 'legendary';
  if(floor<=1)return 'rare';
  if(floor<=3)return 'epic';
  return allowLegendary?'legendary':'epic';
}
function clampRarity(rarity,cap){
  const order={common:0,rare:1,epic:2,legendary:3};
  return (order[rarity]||0)>(order[cap]||0)?cap:rarity;
}
function applyAffixPool(item,pool,count,power,used){
  let candidates=pool.filter(a=>a.slots.includes(item.type)&&!used.has(a.name));
  for(let i=0;i<count&&candidates.length;i++){
    let pick=candidates.splice(Math.floor(Math.random()*candidates.length),1)[0];
    if(!pick)break;
    used.add(pick.name);
    pick.apply(item,power);
    if(pool===LOOT_PREFIXES)item.name=`${pick.name} ${item.name}`;
    else item.name=`${item.name} ${pick.name}`;
  }
}
function affixCountsForRarity(rarity){
  if(rarity==='legendary')return{prefix:1,suffix:1+Math.floor(Math.random()*2)};
  if(rarity==='epic')return{prefix:Math.random()<.65?1:0,suffix:1+Math.floor(Math.random()*2)};
  if(rarity==='rare')return{prefix:Math.random()<.45?1:0,suffix:1};
  return{prefix:Math.random()<.18?1:0,suffix:0};
}
function chooseFloorEventForRoom(room){
  let weighted=[...FLOOR_EVENT_DEFS];
  let route=currentDungeonRouteDef();
  if(room.type==='ritual')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='warshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='font'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='reliquary'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='omenshrine')
  );
  if(room.type==='library')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='reliquary'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='gamble'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='font'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='omenshrine')
  );
  if(room.type==='prison')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='prisoner'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='ossuary'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='caravan')
  );
  if(room.type==='armory')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='forgecache'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='warshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='reliquary')
  );
  if(room.type==='treasury')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='caravan'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='gamble'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='reliquary')
  );
  if(room.type==='barracks'||room.type==='arena')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='warshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='forgecache'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='prisoner')
  );
  if(room.type==='champion')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='warshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='omenshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='forgecache')
  );
  if(route.id==='barrow')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='ossuary'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='reliquary'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='prisoner')
  );
  if(route.id==='ember')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='forgecache'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='warshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='caravan')
  );
  if(route.id==='seer')weighted.push(
    FLOOR_EVENT_DEFS.find(e=>e.type==='font'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='omenshrine'),
    FLOOR_EVENT_DEFS.find(e=>e.type==='gamble')
  );
  weighted=weighted.filter(Boolean);
  return weighted[Math.floor(Math.random()*weighted.length)]||FLOOR_EVENT_DEFS[0];
}
function makeItem(baseId,floor=1,level=1){
  let base=ITEM_BASES.find(b=>b.id===baseId)||ITEM_BASES[baseId];
  let item={...base,upg:0,uid:Math.random()};
  let effLevel=lootEffectiveLevel(floor,level);
  let sf=scaleFactor(floor,effLevel),rm={common:1,rare:1.5,epic:2.2,legendary:3.5}[base.rarity];
  let offScale=offensiveLootScale(floor,effLevel),utilScale=utilityLootScale(floor,effLevel);
  if(base.baseDmg){
    item.dmg=Math.floor(base.baseDmg*rm*sf*offScale);
    if(Math.random()<.32)item.bonusCrit=(item.bonusCrit||0)+Math.floor((3+Math.random()*10)*Math.sqrt(sf)*offScale);
    if(Math.random()<.22)item.spdBonus=(item.spdBonus||0)+ +(Math.random()*.28+.08).toFixed(2)*utilScale;
  }
  if(base.baseDef){
    item.def=Math.floor(base.baseDef*rm*sf);
    if(Math.random()<.34)item.hpBonus=(item.hpBonus||0)+Math.floor((10+Math.random()*24)*Math.sqrt(sf)*utilScale);
  }
  let affixPower=scaleAffixPower(floor,effLevel,base.rarity);
  let counts=affixCountsForRarity(base.rarity);
  let used=new Set();
  applyAffixPool(item,LOOT_PREFIXES,counts.prefix,affixPower,used);
  applyAffixPool(item,LOOT_SUFFIXES,counts.suffix,affixPower,used);
  if(item.bonusDmg)item.bonusDmg=Math.max(1,Math.floor(item.bonusDmg*offScale));
  if(item.bonusCrit)item.bonusCrit=Math.max(1,Math.floor(item.bonusCrit*offScale));
  if(item.meleeMult)item.meleeMult=+(item.meleeMult*offScale).toFixed(2);
  if(item.rangedMult)item.rangedMult=+(item.rangedMult*offScale).toFixed(2);
  if(item.skillMult)item.skillMult=+(item.skillMult*((offScale+utilScale)/2)).toFixed(2);
  if(item.lifesteal)item.lifesteal=+(item.lifesteal*utilScale).toFixed(2);
  if(item.manaRegen)item.manaRegen=+(item.manaRegen*utilScale).toFixed(2);
  item.rollDmg=item.dmg||0;
  item.rollDef=item.def||0;
  item.rollHpBonus=item.hpBonus||0;
  item.rollMpBonus=item.mpBonus||0;
  item.rollBonusCrit=item.bonusCrit||0;
  item.rollSpdBonus=item.spdBonus||0;
  item.rollBonusDmg=item.bonusDmg||0;
  item.rollManaRegen=item.manaRegen||0;
  item.rollSkillMult=item.skillMult||0;
  item.rollDamageReduction=item.damageReduction||0;
  item.rollLifesteal=item.lifesteal||0;
  item.rollMeleeMult=item.meleeMult||0;
  item.rollRangedMult=item.rangedMult||0;
  item.desc=buildItemDesc(item);return item;
}
function makeStarterItem(baseId,rarity='common'){
  let base=ITEM_BASES.find(b=>b.id===baseId)||ITEM_BASES[baseId];
  let item={...base,upg:0,uid:Math.random()};
  item.starterItem=true;
  item.rarity=rarity;
  let rm={common:1,rare:1.5,epic:2.2,legendary:3.5}[rarity]||1;
  if(item.baseDmg)item.dmg=Math.floor(item.baseDmg*rm*scaleFactor(1,1)*0.58);
  if(item.baseDef)item.def=Math.floor(item.baseDef*rm*scaleFactor(1,1)*0.82);
  item.rollDmg=item.dmg||0;
  item.rollDef=item.def||0;
  item.rollHpBonus=item.hpBonus||0;
  item.rollMpBonus=item.mpBonus||0;
  item.rollBonusCrit=item.bonusCrit||0;
  item.rollSpdBonus=item.spdBonus||0;
  item.rollBonusDmg=item.bonusDmg||0;
  item.rollManaRegen=item.manaRegen||0;
  item.rollSkillMult=item.skillMult||0;
  item.rollDamageReduction=item.damageReduction||0;
  item.rollLifesteal=item.lifesteal||0;
  item.rollMeleeMult=item.meleeMult||0;
  item.rollRangedMult=item.rangedMult||0;
  item.desc=buildItemDesc(item);
  return item;
}
function buildItemDesc(item){
  let p=[];
  if(item.dmg)p.push('+'+item.dmg+' dmg');if(item.def)p.push('+'+item.def+' def');
  if(item.hpBonus)p.push('+'+item.hpBonus+' HP');if(item.mpBonus)p.push('+'+item.mpBonus+' MP');
  if(item.spdBonus)p.push('+'+item.spdBonus+' spd');if(item.bonusCrit)p.push('+'+item.bonusCrit+'% crit');
  if(item.bonusSpd)p.push('+'+item.bonusSpd+' spd');
  if(item.bonusDmg)p.push('+'+item.bonusDmg+' atk');
  if(item.manaRegen)p.push('+'+item.manaRegen.toFixed(2)+'/s MP');
  if(item.skillMult)p.push('+'+Math.round(item.skillMult*100)+'% skill');
  if(item.damageReduction)p.push('-'+Math.round(item.damageReduction*100)+'% dmg taken');
  if(item.lifesteal)p.push(Math.round(item.lifesteal*100)+'% lifesteal');
  if(item.meleeMult)p.push('+'+Math.round(item.meleeMult*100)+'% melee');
  if(item.rangedMult)p.push('+'+Math.round(item.rangedMult*100)+'% ranged');
  if(item.special)p.push('['+item.special+']');if(item.upg>0)p.push('★'.repeat(item.upg));
  return p.join(', ');
}
function bossRewardSignature(item,bossName){
  if(bossName==='GARMR'){
    item.name='Fenrir Relic: '+item.name;
    item.lifesteal=(item.lifesteal||0)+0.04;
    item.bonusCrit=(item.bonusCrit||0)+6;
  }else if(bossName==='THE BONE KING'){
    item.name='Gravecrowned '+item.name;
    item.damageReduction=(item.damageReduction||0)+0.05;
    item.hpBonus=(item.hpBonus||0)+20;
  }else if(bossName==='JORMUNGANDR'){
    item.name='Worldcoil '+item.name;
    item.damageReduction=(item.damageReduction||0)+0.04;
    item.manaRegen=(item.manaRegen||0)+0.35;
  }else if(bossName==='HEL'){
    item.name='Helbound '+item.name;
    item.skillMult=(item.skillMult||0)+0.1;
    item.mpBonus=(item.mpBonus||0)+18;
  }else if(bossName==='SURTR'){
    item.name='Ashen '+item.name;
    item.special=item.special||'fire';
    item.bonusDmg=(item.bonusDmg||0)+5;
  }else if(bossName==='FORGE GUARDIAN'){
    item.name='Forgebound '+item.name;
    item.bonusDmg=(item.bonusDmg||0)+4;
    item.def=(item.def||0)+6;
  }else if(bossName==='VEILSCRIBE'){
    item.name='Veilscribed '+item.name;
    item.skillMult=(item.skillMult||0)+0.08;
    item.bonusCrit=(item.bonusCrit||0)+6;
  }else if(bossName==="MIMIR'S ECHO"){
    item.name='Echoing '+item.name;
    item.manaRegen=(item.manaRegen||0)+0.45;
    item.mpBonus=(item.mpBonus||0)+20;
  }else if(bossName==="ODIN'S SHADOW"){
    item.name='Shadowforged '+item.name;
    item.bonusCrit=(item.bonusCrit||0)+10;
    item.spdBonus=(item.spdBonus||0)+0.15;
  }
  item.desc=buildItemDesc(item);
  return item;
}
function upgradeItem(item){
  if(item.upg>=5)return false;
  if(item.rollDmg==null)item.rollDmg=item.dmg||0;
  if(item.rollDef==null)item.rollDef=item.def||0;
  if(item.rollHpBonus==null)item.rollHpBonus=item.hpBonus||0;
  if(item.rollMpBonus==null)item.rollMpBonus=item.mpBonus||0;
  if(item.rollBonusCrit==null)item.rollBonusCrit=item.bonusCrit||0;
  if(item.rollSpdBonus==null)item.rollSpdBonus=item.spdBonus||0;
  if(item.rollBonusDmg==null)item.rollBonusDmg=item.bonusDmg||0;
  if(item.rollManaRegen==null)item.rollManaRegen=item.manaRegen||0;
  if(item.rollSkillMult==null)item.rollSkillMult=item.skillMult||0;
  if(item.rollDamageReduction==null)item.rollDamageReduction=item.damageReduction||0;
  if(item.rollLifesteal==null)item.rollLifesteal=item.lifesteal||0;
  if(item.rollMeleeMult==null)item.rollMeleeMult=item.meleeMult||0;
  if(item.rollRangedMult==null)item.rollRangedMult=item.rangedMult||0;
  item.upg++;
  let mult=1+item.upg*.16;
  if(item.rollDmg!=null&&item.baseDmg)item.dmg=Math.max(1,Math.floor(item.rollDmg*mult));
  if(item.rollDef!=null&&item.baseDef)item.def=Math.max(1,Math.floor(item.rollDef*mult));
  if(item.rollHpBonus)item.hpBonus=Math.max(1,Math.floor(item.rollHpBonus*(1+item.upg*.14)));
  if(item.rollMpBonus)item.mpBonus=Math.max(1,Math.floor(item.rollMpBonus*(1+item.upg*.14)));
  if(item.rollBonusCrit)item.bonusCrit=Math.max(1,Math.floor(item.rollBonusCrit*(1+item.upg*.12)));
  if(item.rollSpdBonus)item.spdBonus=+(item.rollSpdBonus*(1+item.upg*.08)).toFixed(2);
  if(item.rollBonusDmg)item.bonusDmg=Math.max(1,Math.floor(item.rollBonusDmg*(1+item.upg*.14)));
  if(item.rollManaRegen)item.manaRegen=+(item.rollManaRegen*(1+item.upg*.12)).toFixed(2);
  if(item.rollSkillMult)item.skillMult=+(item.rollSkillMult*(1+item.upg*.12)).toFixed(2);
  if(item.rollDamageReduction)item.damageReduction=+(item.rollDamageReduction*(1+item.upg*.1)).toFixed(2);
  if(item.rollLifesteal)item.lifesteal=+(item.rollLifesteal*(1+item.upg*.1)).toFixed(2);
  if(item.rollMeleeMult)item.meleeMult=+(item.rollMeleeMult*(1+item.upg*.1)).toFixed(2);
  if(item.rollRangedMult)item.rangedMult=+(item.rollRangedMult*(1+item.upg*.1)).toFixed(2);
  item.desc=buildItemDesc(item);return true;
}
function getItemPower(item){
  return(item.dmg||0)+(item.def||0)+(item.hpBonus||0)/5+(item.mpBonus||0)/5+(item.bonusCrit||0)+((item.bonusSpd||item.spdBonus||0)*12)+((item.bonusDmg||0)*3)+((item.manaRegen||0)*20)+((item.skillMult||0)*90)+((item.damageReduction||0)*180)+((item.lifesteal||0)*200)+((item.meleeMult||0)*90)+((item.rangedMult||0)*90)+((item.upg||0)*15);
}
function classLootBiasPool(pool){
  if(!P.classId)return pool;
  let biased=[...pool];
  if(P.classId==='runecaster'){
    let caster=pool.filter(b=>b.type==='rune'||(b.type==='weapon'&&(/staff|tome|bone/i.test(b.name))));
    if(caster.length)biased=biased.concat(caster,caster,caster);
  }else if(P.classId==='ranger'){
    let ranger=pool.filter(b=>(b.type==='weapon'&&(/bow|dagger|pike/i.test(b.name)))||b.type==='helm');
    if(ranger.length)biased=biased.concat(ranger,ranger);
  }else if(P.classId==='berserker'){
    let bers=pool.filter(b=>(b.type==='weapon'&&(/axe|hammer|sword/i.test(b.name)))||b.type==='armor');
    if(bers.length)biased=biased.concat(bers,bers);
  }else if(P.classId==='guardian'){
    let guard=pool.filter(b=>b.type==='armor'||b.type==='helm'||(b.type==='weapon'&&(/sword|pike|hammer/i.test(b.name))));
    if(guard.length)biased=biased.concat(guard,guard);
  }
  return biased;
}
function rollLootItem(floor,level,allowLegendary=false){
  let band=currentLootBand(floor);
  let r=Math.random(),rarity=allowLegendary&&r<.04+floor*.012?'legendary':r<.14+floor*.025+band.epicBias?'epic':r<.38+floor*.03+band.epicBias*.7?'rare':'common';
  rarity=clampRarity(rarity,floorLootRarityCap(floor,allowLegendary));
  if(!allowLegendary&&floor>=30&&rarity==='common'&&Math.random()<.35)rarity='rare';
  let pool=ITEM_BASES.filter(b=>b.rarity===rarity);if(!pool.length)pool=ITEM_BASES;
  pool=classLootBiasPool(pool);
  pool=routeLootBiasPool(pool);
  return makeItem(pool[Math.floor(Math.random()*pool.length)].id,floor,level);
}
function rollBossReward(bossName,floor,level){
  let rewardId=BOSS_REWARD_BASES[bossName];
  let item=makeItem(rewardId!=null?rewardId:3,floor+1,level+1);
  item.rarity='legendary';
  return bossRewardSignature(item,bossName);
}
function rollPotion(floor){
  let r=Math.random();
  if(r<.08)return{...POTIONS[5]};
  if(r<.3)return{...POTIONS[Math.floor(Math.random()*2)+2]};
  return{...POTIONS[Math.floor(Math.random()*2)]};
}
function isStackable(item){return item?.type==='potion';}
function cloneInvItem(item){
  let c={...item};
  if(isStackable(c))c.qty=c.qty||1;
  else c.uid=c.uid||Math.random();
  return c;
}
function sanitizeItemForSave(item){
  let c={...item};
  delete c.x;delete c.y;delete c.id;delete c.isDungeon;delete c.pickupCooldown;
  return c;
}
function addItemToInventory(item){
  if(!item)return false;
  if(isStackable(item)){
    let existing=P.inv.find(i=>i.type==='potion'&&i.id===item.id);
    if(existing){existing.qty=(existing.qty||1)+(item.qty||1);return true;}
  }
  if(P.inv.length>=inventoryCap())return false;
  P.inv.push(cloneInvItem(item));
  return true;
}
function removeItemFromInventory(idx,amount=1){
  let item=P.inv[idx];if(!item)return null;
  if(isStackable(item)&&(item.qty||1)>amount){
    item.qty-=amount;
    return {...item,qty:amount};
  }
  return P.inv.splice(idx,1)[0];
}
function getInvEntries(){
  return P.inv.map((item,idx)=>({item,idx})).filter(({item})=>{
    if(invFilter==='all')return true;
    if(invFilter==='gear')return item.type==='weapon'||item.type==='armor'||item.type==='helm';
    if(invFilter==='potion')return item.type==='potion';
    if(invFilter==='rune')return item.type==='rune';
    return true;
  });
}

const PERKS=[
  {name:'Berserker Blood',eff:'maxHp+60, dmg+6'},
  {name:'Runic Mastery',eff:'mpRegen+2, skillDmg+25%'},
  {name:'Eagle Eyes',eff:'rangedDmg+30%, crit+10%, arrows pierce'},
  {name:'Iron Skin',eff:'def+15, dmgReduction12%'},
  {name:'Valhalla Chosen',eff:'revive once at 30% HP'},
  {name:'Storm Walker',eff:'speed+0.3, sprint cost-30%'},
  {name:'Blood Drain',eff:'melee lifesteal +5%'},
  {name:"Odin's Sight",eff:'XP gain +30%'},
  {name:'Frost Touch',eff:'attacks slow enemies, frost deals more damage'},
  {name:'Dual Wield',eff:'attack speed+35%'},
  {name:'Alchemist',eff:'potions heal 50% more'},
  {name:'Iron Stamina',eff:'sprint meter +50%, regen faster'},
  {name:'Battle Trance',eff:'kills grant a short burst of attack speed'},
  {name:'Grave Ward',eff:'debuff duration -35%, poison hits softened'},
  {name:'Executioner',eff:'+25% damage vs elites and bosses'},
  {name:'Arcane Wellspring',eff:'maxMp+35, skills refund a little mana'},
  {name:'Tempest Calling',eff:'Wrath chains farther and lashes extra targets'},
  {name:'Winter\'s Bite',eff:'+20% damage to frozen or slowed foes'},
  {name:'Relentless',eff:'melee hits trim cooldowns, rage lasts longer'},
  {name:'Seidr Surge',eff:'casting a skill empowers your attacks briefly'},
  {name:'Overdraw',eff:'bows hit harder and fire farther'},
  {name:'Spell Siphon',eff:'arcane hits restore mana'},
  {name:'Shatterstrike',eff:'melee blows burst chilled foes'},
  {name:'Runebound',eff:'equipped rune bonuses are amplified'},
  {name:'Bulwark',eff:'bashes and heavy blows grant a short ward'},
  {name:'Huntmaster',eff:'kills grant speed and crit briefly'}
];
const CLASS_DEFS=[
  {id:'berserker',name:'Berserker',icon:'🪓',desc:'Savage melee warrior who thrives in the thick of battle.',stats:{maxHp:140,maxMp:75,maxStamina:120,baseDmg:14,def:4,spd:2.15},equip:{weapon:()=>makeStarterItem(15,'common'),armor:()=>makeStarterItem(4,'common'),helm:null,rune:null},items:[()=>({...POTIONS[0]}),()=>({...POTIONS[0]})],mods:{meleeMult:1.18,rageDuration:1.4,rageCost:0.75}},
  {id:'ranger',name:'Ranger',icon:'🏹',desc:'Fast hunter with deadly arrows and sharper critical strikes.',stats:{maxHp:95,maxMp:95,maxStamina:115,baseDmg:11,def:1,spd:2.5},equip:{weapon:()=>makeStarterItem(20,'common'),armor:()=>makeStarterItem(4,'common'),helm:null,rune:null},items:[()=>({...POTIONS[0]}),()=>({...POTIONS[3]})],mods:{rangedMult:1.25,critBonus:0.08,sprintCost:0.82}},
  {id:'runecaster',name:'Runecaster',icon:'🔮',desc:'Mystic adept with stronger skills, richer mana, and arcane control.',stats:{maxHp:90,maxMp:145,maxStamina:95,baseDmg:9,def:0,spd:2.2},equip:{weapon:()=>makeStarterItem(21,'common'),armor:null,helm:null,rune:()=>makeStarterItem(22,'common')},items:[()=>({...POTIONS[3]}),()=>({...POTIONS[3]}),()=>({...POTIONS[0]})],mods:{skillMult:1.25,skillCost:0.8,skillCooldown:0.88}},
  {id:'guardian',name:'Guardian',icon:'🛡️',desc:'Stoic defender who shrugs off punishment and endures the dungeon.',stats:{maxHp:125,maxMp:85,maxStamina:105,baseDmg:10,def:8,spd:2.0},equip:{weapon:()=>makeStarterItem(1,'common'),armor:()=>makeStarterItem(23,'common'),helm:()=>makeStarterItem(7,'common'),rune:null},items:[()=>({...POTIONS[0]}),()=>({...POTIONS[0]})],mods:{damageReduction:0.1,trapReduction:0.45}}
];
const SKILL_INFO=[
  {icon:'🪓',name:'Valkyrie Axes',base:'Throw 3 spinning axes in a spread.',mana:30,cd:4},
  {icon:'⚡',name:'Odin\'s Wrath',base:'Strike nearby enemies with chain lightning.',mana:40,cd:7},
  {icon:'❄️',name:'Frost Nova',base:'Freeze and slow nearby enemies.',mana:35,cd:9},
  {icon:'🔥',name:'Berserker Rage',base:'Temporarily double your damage.',mana:50,cd:16}
];
const EDEFS=[
  {name:'Draugr',hp:30,dmg:5,spd:0.9,xp:20,gold:3,col:'#4a6741',sz:11,range:26},
  {name:'Dark Elf',hp:22,dmg:8,spd:1.3,xp:25,gold:5,col:'#6b4fa0',sz:9,range:65},
  {name:'Frost Giant',hp:90,dmg:16,spd:0.5,xp:65,gold:12,col:'#7fb3cc',sz:18,range:32},
  {name:'Fire Demon',hp:55,dmg:13,spd:1.0,xp:48,gold:8,col:'#cc4400',sz:13,range:48},
  {name:'Wolf',hp:28,dmg:7,spd:1.5,xp:18,gold:2,col:'#886655',sz:10,range:26},
  {name:'Skeleton',hp:20,dmg:6,spd:1.1,xp:15,gold:2,col:'#ccccaa',sz:10,range:30},
  {name:'Troll',hp:120,dmg:20,spd:0.4,xp:90,gold:18,col:'#557755',sz:20,range:35},
];
const BOSSDEFS=[
  {id:'garmr',route:'barrow',name:'GARMR',maxHp:920,dmg:28,spd:0.95,col:'#7b6a64',sz:30,xp:520,gold:130,phase2hp:460,family:'wolf'},
  {id:'bone_king',route:'barrow',name:'THE BONE KING',maxHp:1380,dmg:34,spd:0.72,col:'#c7c0ad',sz:34,xp:920,gold:220,phase2hp:690,family:'grave'},
  {id:'hel',route:'barrow',name:'HEL',maxHp:1880,dmg:42,spd:0.82,col:'#7755aa',sz:36,xp:1500,gold:360,phase2hp:940,family:'veil'},
  {id:'forge_guardian',route:'ember',name:'FORGE GUARDIAN',maxHp:980,dmg:30,spd:0.82,col:'#b16a42',sz:31,xp:540,gold:140,phase2hp:490,family:'ember'},
  {id:'jormungandr',route:'ember',name:'JORMUNGANDR',maxHp:1500,dmg:36,spd:0.62,col:'#2d8b2d',sz:38,xp:980,gold:240,phase2hp:750,family:'serpent'},
  {id:'surtr',route:'ember',name:'SURTR',maxHp:2140,dmg:48,spd:0.72,col:'#cc4400',sz:38,xp:1650,gold:420,phase2hp:1070,family:'ember'},
  {id:'veilscribe',route:'seer',name:'VEILSCRIBE',maxHp:930,dmg:29,spd:0.88,col:'#5d73b0',sz:31,xp:530,gold:135,phase2hp:465,family:'seer'},
  {id:'mimir_echo',route:'seer',name:"MIMIR'S ECHO",maxHp:1440,dmg:35,spd:0.78,col:'#86b8f0',sz:35,xp:960,gold:230,phase2hp:720,family:'seer'},
  {id:'odin_shadow',route:'seer',name:"ODIN'S SHADOW",maxHp:2280,dmg:50,spd:1.02,col:'#8888ff',sz:38,xp:1850,gold:460,phase2hp:1140,family:'shadow'},
];
const ROUTE_BOSS_TABLE={
  barrow:['garmr','bone_king','hel'],
  ember:['forge_guardian','jormungandr','surtr'],
  seer:['veilscribe','mimir_echo','odin_shadow']
};
const WORLD_BOSSES=[...BOSSDEFS];
let worldBossIndex=0;
const DUNGEON_MODIFIERS=[
  {name:'Cursed',desc:'Enemies regen HP',col:'#aa22aa'},
  {name:'Enraged',desc:'Enemies +50% dmg',col:'#cc2200'},
  {name:'Frozen',desc:'You move 20% slower',col:'#5599cc'},
  {name:'Blessed',desc:'2x XP and gold',col:'#ccaa00'},
  {name:'Dark',desc:'Reduced visibility',col:'#444488'},
];
const DEEP_DUNGEON_MUTATORS=[
  {name:'Predatory',desc:'Enemies move and strike faster',col:'#c75454'},
  {name:'Ironbound',desc:'Enemies gain extra durability',col:'#8f7f6a'},
  {name:'Fortune-Touched',desc:'Richer drops and stronger loot bands',col:'#d7b15c'},
  {name:'Spellblight',desc:'Mana recovery slows in the deep',col:'#7e69c7'},
  {name:'Stormfront',desc:'Enemy projectiles travel faster in the deep',col:'#6aa5d9'},
  {name:'Withering',desc:'Healing and lifesteal are reduced',col:'#8d6f5a'},
  {name:'Hexed',desc:'Debuffs linger longer on you',col:'#8b5ec9'},
  {name:'Gravewake',desc:'Champion threats gather more often',col:'#6f8a74'},
];
const BOSS_AFFIXES=[
  {id:'swift',name:'Swift',hpMult:1,dmgMult:1,spdMult:1.14,timeRate:1.18,desc:'Acts faster and repositions aggressively.'},
  {id:'bulwark',name:'Bulwark',hpMult:1.24,dmgMult:1,spdMult:1,timeRate:1,desc:'Much harder to bring down.'},
  {id:'venomous',name:'Venomous',hpMult:1,dmgMult:1.06,spdMult:1,timeRate:1,desc:'Hits inflict poison.'},
  {id:'stormbound',name:'Stormbound',hpMult:1.08,dmgMult:1.08,spdMult:1,timeRate:1.08,desc:'Attacks split into extra bolts.'},
  {id:'ravenous',name:'Ravenous',hpMult:1.1,dmgMult:1.1,spdMult:1,timeRate:1,desc:'Heals when it wounds you.'},
  {id:'hexed',name:'Hexed',hpMult:1.05,dmgMult:1.08,spdMult:1,timeRate:1.06,desc:'Strikes can weaken or silence you.'},
  {id:'warcaller',name:'Warcaller',hpMult:1.1,dmgMult:1.04,spdMult:1,timeRate:1,desc:'Summons stronger reinforcements.'},
  {id:'voidstep',name:'Voidstep',hpMult:1.06,dmgMult:1.06,spdMult:1.08,timeRate:1.08,desc:'Blinks and erupts with shadow bursts.'},
];
const ROUTE_DEFS=[
  {id:'barrow',name:'Barrow Descent',theme:'Graves, reliquaries, and armored relics',col:'#c9b6ff',modBias:['Dark','Cursed','Frozen'],lootHint:'Armor • Helms • Runes'},
  {id:'ember',name:'Ember Gate',theme:'Forge halls, war rooms, and brutal steel',col:'#e39a57',modBias:['Enraged','Cursed','Blessed'],lootHint:'Weapons • Armor • Power'},
  {id:'seer',name:'Seer Hollow',theme:'Runic libraries, fonts, and omen chambers',col:'#7ab8ff',modBias:['Frozen','Blessed','Dark'],lootHint:'Runes • Staves • Skill gear'}
];
const ROUTE_VISUALS={
  barrow:{bgTop:'#17131f',bgMid:'#100d17',bgBot:'#06070b',floorA:'#2c2534',floorB:'#221d2a',wall:'#17121e',wallHi:'#241d2c',wallLo:'#0c0b12',glow:'#c9b6ff'},
  ember:{bgTop:'#23130f',bgMid:'#170c0a',bgBot:'#080607',floorA:'#33231c',floorB:'#271a15',wall:'#1e1310',wallHi:'#352019',wallLo:'#0f0908',glow:'#e39a57'},
  seer:{bgTop:'#111a24',bgMid:'#0d121b',bgBot:'#06070c',floorA:'#202a36',floorB:'#19222d',wall:'#101822',wallHi:'#1b2a3a',wallLo:'#081018',glow:'#7ab8ff'}
};const BIOMES=[{name:'Midgard'}];
const RUNE_SYMBOLS=['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ'];
const SHRINE_BLESSINGS=[
  {name:'Odin\'s Mercy',desc:'Fully restore HP & MP',icon:'✨',fn:()=>{P.hp=P.maxHp;P.mp=P.maxMp;msg('✨ Odin\'s Mercy — Fully restored!',3000);}},
  {name:'Warrior\'s Blessing',desc:'+20% damage for this floor',icon:'⚔️',fn:()=>{P._shrineAtk=Math.floor(P.baseDmg*.2);P.baseDmg+=P._shrineAtk;msg('⚔️ Warrior\'s Blessing — +20% damage!',3000);}},
  {name:'Guardian\'s Ward',desc:'+15 defense for this floor',icon:'🛡️',fn:()=>{P.def+=15;msg('🛡️ Guardian\'s Ward — +15 defense!',3000);}},
  {name:'Thor\'s Gift',desc:'Gain 3 random potions',icon:'🧪',fn:()=>{for(let i=0;i<3;i++)addItemToInventory({...rollPotion(dungeonFloor)});msg('🧪 Thor\'s Gift — 3 potions received!',3000);}},
  {name:'Loki\'s Trick',desc:'Gain epic loot but lose 20 HP',icon:'🃏',fn:()=>{P.hp=Math.max(1,P.hp-20);addItemToInventory(rollLootItem(dungeonFloor+2,P.level));msg('🃏 Loki\'s Trick — Epic loot gained, -20 HP!',3000);}},
  {name:'Freya\'s Kiss',desc:'Gain 200 gold',icon:'💰',fn:()=>{P.gold+=200;msg('💰 Freya\'s Kiss — +200 gold!',3000);}},
];
const SHRINE_CURSES=[
  {name:'Hel\'s Mark',desc:'-25 max HP until next floor',icon:'💀',fn:()=>{P.maxHp=Math.max(30,P.maxHp-25);P.hp=Math.min(P.hp,P.maxHp);msg('💀 Hel\'s Mark — -25 max HP!',3000);}},
  {name:'Loki\'s Prank',desc:'Skills on 10s cooldown',icon:'😈',fn:()=>{for(let i=0;i<4;i++)skillCD[i]=10000;msg('😈 Loki\'s Prank — Skills on cooldown!',3000);}},
];
const FLOOR_EVENT_DEFS=[
  {type:'caravan',name:'Fallen Caravan',icon:'🪙',prompt:'[F] Search',desc:'A shattered caravan lies in the dark. Something valuable survived the raid.',col:'#d7b15c',roomText:'Loot, coin, or a raider ambush waits among the wreckage.',rewardText:'Salvage and ambush loot'},
  {type:'font',name:'Runic Font',icon:'💧',prompt:'[F] Commune',desc:'Ancient runes shimmer over a cold spring of power.',col:'#7ab8ff',roomText:'A warding font hums with healing and arcane power.',rewardText:'Recovery and temporary ward'},
  {type:'ossuary',name:'Sealed Ossuary',icon:'⚰️',prompt:'[F] Unseal',desc:'Bone dust swirls around a sealed tomb. Disturbing it may wake the dead.',col:'#c9b6ff',roomText:'The dead are restless here. Unseal it for a harder fight and richer spoils.',rewardText:'Undead battle and relic reward'},
  {type:'gamble',name:'Norn Cache',icon:'🎲',prompt:'[F] Invoke Fate',desc:'A hidden cache asks for faith. Fortune and ruin both linger here.',col:'#b89cff',roomText:'A veiled cache offers a sharp risk for an outsized prize.',rewardText:'High-risk fate reward'},
  {type:'reliquary',name:'Bound Reliquary',icon:'🕯️',prompt:'[F] Break Seal',desc:'A rune-locked reliquary hums with old power and hungry guardians.',col:'#f0c987',roomText:'A relic chamber promises stronger gear if you dare crack its seal.',rewardText:'Rune gear or a relic ambush'},
  {type:'prisoner',name:'Forsaken Cell',icon:'⛓️',prompt:'[F] Open Cell',desc:'A locked cell rattles in the dark. Something inside still lives.',col:'#8ecfb7',roomText:'A prisoner\'s call may lead to aid, or a desperate ambush.',rewardText:'Supplies, escort cache, or hostile jailbreak'},
  {type:'warshrine',name:'War Banner',icon:'⚔️',prompt:'[F] Claim Banner',desc:'A bloodstained banner still carries the fury of a forgotten warband.',col:'#d66c5c',roomText:'A martial shrine can empower your next rooms if you seize it.',rewardText:'Temporary battle boon and tribute'},
  {type:'forgecache',name:'Collapsed Forge',icon:'⚒️',prompt:'[F] Temper Steel',desc:'A ruined forge still holds a whisper of heat and a smith\'s hidden stash.',col:'#e39a57',roomText:'A collapsed forge can sharpen your edge if you brave the embers.',rewardText:'Temporary tempering and gear salvage'},
  {type:'omenshrine',name:'Raven Omen',icon:'🐦',prompt:'[F] Read Omen',desc:'Black feathers and candle wax mark a small altar to restless prophecy.',col:'#9ec0ff',roomText:'A raven shrine promises foresight and a sharper eye for the floor ahead.',rewardText:'Temporary omen boon and seer loot'},
];
const DIALOGS=[
  {lines:["Hail warrior! I am Bjorn the Smith. Need gear, potions, or looking to sell?","Fine weapons forged from dragon iron. I also buy back what you no longer need.","Arm yourself well. The dungeons grow darker with each floor."],opts:['Browse & Sell','Upgrade Gear','Farewell']},
  {lines:["The Norns have whispered your name. Ragnarok draws near.","Seek the sacred shrines within dungeons — they offer great power, or great peril.","Your destiny is written in the stars."],opts:['Browse & Sell','What must I do?','Farewell']},
  {lines:["Midgard is wider than it first appears — the old roads lead to ruins, groves, and the deeper gates below.","Dungeon portals glow blue — walk into them! Look for secret walls and shrines.","The rune puzzles unlock vaults of great treasure — study the sequence carefully."],opts:['Browse & Sell','Tell me more','Farewell']},
  {lines:["The World Tree trembles. Use skills wisely.","Beware the elite enemies — marked with a skull. They hit hard but drop rare loot.","Secret rooms hide behind walls that look slightly different — walk into them!"],opts:['Browse & Sell','Tell me of skills','Farewell']},
  {lines:["I have wandered every road in Midgard. Beautiful and deadly.","The poison gas vents, the arrow traps, the rune tiles — learn them, or perish.","Pick up everything. Gold, runes, equipment — it all matters."],opts:['Tell me more','Farewell']},
  {lines:["Never stop moving. Sprint to escape danger — but watch your stamina!","Berserker Rage doubles damage. Use it when surrounded.","Buy potions before entering dungeons. Always."],opts:['Teach me','Farewell']},
  {lines:["*Merchant grins* Lost in the dark? I've got what you need.","Better deals down here. Dangerous business, better margins.","Need potions? Got 'em. Need better gear? Got that too."],opts:['Browse & Sell','Farewell']},
  {lines:["The forge burns hot even here in the deep dark.","Bring me your best gear and I'll make it stronger.","Nothing like the ring of hammer on steel."],opts:['Upgrade Gear','Farewell']},
];

// ── WORLD GEN ──────────────────────────────────────────────
let world=[],biome=[],dungeonEntrances=[],npcList=[],worldLandmarks=[];
function carveCircle(cx,cy,r,t){
  for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(Math.hypot(dx,dy)<=r)setTile(cx+dx,cy+dy,t);
}
function carveRoad(ax,ay,bx,by,t=TILE.STONE,width=1){
  let x=ax,y=ay;
  while(x!==bx){for(let w=-width;w<=width;w++)setTile(x,y+w,t);x+=Math.sign(bx-x);}
  while(y!==by){for(let w=-width;w<=width;w++)setTile(x+w,y,t);y+=Math.sign(by-y);}
  for(let w=-width;w<=width;w++)for(let h=-width;h<=width;h++)setTile(bx+w,by+h,t);
}
function addLandmark(name,x,y,icon,kind='site',extra={}){
  let id=(name||'site').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  worldLandmarks.push({id,name,x,y,icon,kind,used:false,pending:false,actionLabel:'Investigate',...extra});
}
function isReusableLandmarkKind(kind){
  return ['hall','sanctum','council','meadhall','memorial','watcher','portal'].includes(kind);
}
function genWorld(){
  worldLandmarks=[];
  for(let y=0;y<WS;y++){world[y]=[];biome[y]=[];
    for(let x=0;x<WS;x++){
      let bi=0;biome[y][x]=bi;
      let r=Math.random();
      world[y][x]=r<.17?TILE.TREE:r<.032?TILE.STONE:r<.043?TILE.RUNE:TILE.GRASS;
    }
  }
  let hubCx=Math.floor(WS*.5),hubCy=Math.floor(WS*.48),hubR=16;
  for(let y=0;y<WS;y++)for(let x=0;x<WS;x++)if(Math.hypot(x-hubCx,y-hubCy)>hubR+4){
    world[y][x]=Math.random()<.78?TILE.TREE:Math.random()<.5?TILE.STONE:TILE.GRASS;
  }
  for(let x=hubCx-10;x<=hubCx+11;x++){
    let ry=Math.floor(hubCy+8+Math.sin(x/4)*2);
    for(let w=-1;w<=1;w++)setTile(x,ry+w,TILE.WATER);
  }
  [{x:hubCx-6,y:hubCy+10,r:2},{x:hubCx+11,y:hubCy-7,r:2},{x:hubCx+4,y:hubCy+12,r:2}].forEach(p=>carveCircle(p.x,p.y,p.r,TILE.WATER));
  let sx=hubCx,sy=hubCy;
  carveCircle(sx,sy,6,TILE.GRASS);
  carveCircle(sx+6,sy-1,3,TILE.GRASS);
  carveCircle(sx-6,sy+3,3,TILE.GRASS);
  for(let dy=-4;dy<=4;dy++)for(let dx=-6;dx<=6;dx++)if(Math.abs(dx)===6||Math.abs(dy)===4)setTile(sx+dx,sy+dy,TILE.STONE);
  const DPOS=[
    {x:sx+10,y:sy-3,name:'Barrow Descent',routeId:'barrow'},
    {x:sx+11,y:sy+9,name:'Ember Gate',routeId:'ember'},
    {x:sx-10,y:sy+8,name:'Seer Hollow',routeId:'seer'}
  ];
  dungeonEntrances=[];
  DPOS.forEach((p,i)=>{
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)setTile(p.x+dx,p.y+dy,TILE.GRASS);
    setTile(p.x,p.y,TILE.DUNGEON_ENTRY);
    let route=routeDef(p.routeId);
    dungeonEntrances.push({wx:p.x*T+T/2,wy:p.y*T+T/2,id:i,name:p.name,routeId:p.routeId,routeTheme:route.theme,routeLootHint:route.lootHint});
    addLandmark(p.name,p.x,p.y,'V','dungeon',{actionLabel:'Descend',routeId:p.routeId,routeTheme:route.theme,routeLootHint:route.lootHint});
  });
const MIDGARD_SITES=[
    {name:'Broken Bifrost Gate',x:sx,y:sy-11,icon:'◊',kind:'portal',actionLabel:'Inspect'},
    {name:'Ravenwatch',x:sx,y:sy,icon:'🏘',kind:'village'},
    {name:'Jarl\'s Lodge',x:sx-7,y:sy-4,icon:'J',kind:'council',actionLabel:'Invest'},
    {name:'War Hall',x:sx+7,y:sy-4,icon:'⚒',kind:'hall',actionLabel:'Provision'},
    {name:'Skald\'s Hearth',x:sx,y:sy+5,icon:'🍺',kind:'meadhall',actionLabel:'Hear Tale'},
    {name:'Huginn\'s Perch',x:sx-4,y:sy-11,icon:'🐦‍⬛',kind:'watcher',actionLabel:'Contemplate',watcherId:'huginn',facing:'right'},
    {name:'Muninn\'s Roost',x:sx+4,y:sy-11,icon:'🐦‍⬛',kind:'watcher',actionLabel:'Remember',watcherId:'muninn',facing:'left'},
    {name:'Stone Circle',x:sx+9,y:sy+2,icon:'ᚱ',kind:'ruin',actionLabel:'Commune'},
    {name:'Sacred Grove',x:sx-7,y:sy+8,icon:'🌲',kind:'grove',actionLabel:'Gather'},
    {name:'Broken Bridge',x:sx+10,y:sy+8,icon:'╬',kind:'bridge',actionLabel:'Search'},
    {name:'Whispering Barrows',x:sx+11,y:sy+1,icon:'☠',kind:'grave',actionLabel:'Disturb'},
    {name:'Old Watchtower',x:sx+10,y:sy-7,icon:'🕯',kind:'tower',actionLabel:'Climb'}
  ];
  carveCircle(sx+9,sy+2,4,TILE.STONE);
  carveCircle(sx-7,sy-4,4,TILE.STONE);
  carveCircle(sx+7,sy-4,4,TILE.STONE);
  carveCircle(sx,sy+5,4,TILE.STONE);
  carveCircle(sx,sy-11,4,TILE.STONE);
  carveCircle(sx-7,sy+8,4,TILE.GRASS);
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<4)setTile(sx+11+dx,sy+1+dy,TILE.STONE);
  for(let dy=-3;dy<=3;dy++)for(let dx=-1;dx<=1;dx++)setTile(sx+10+dx,sy-7+dy,TILE.STONE);
  for(let dx=-3;dx<=3;dx++)setTile(sx+10+dx,sy+8,TILE.STONE);
  carveRoad(sx,sy,sx+9,sy+2,TILE.STONE,1);
  carveRoad(sx,sy,sx-7,sy-4,TILE.STONE,1);
  carveRoad(sx,sy,sx+7,sy-4,TILE.STONE,1);
  carveRoad(sx,sy,sx,sy+5,TILE.STONE,1);
  carveRoad(sx,sy,sx,sy-11,TILE.STONE,1);
  carveRoad(sx+9,sy+2,sx+10,sy-3,TILE.STONE,1);
  carveRoad(sx,sy,sx-7,sy+8,TILE.STONE,1);
  carveRoad(sx,sy,sx+10,sy+8,TILE.STONE,1);
  carveRoad(sx+10,sy+8,sx+11,sy+9,TILE.STONE,1);
  carveRoad(sx,sy,sx-10,sy+8,TILE.STONE,1);
  carveRoad(sx+10,sy+8,sx+11,sy+1,TILE.STONE,1);
  carveCircle(sx-11,sy+3,4,TILE.STONE);
  carveRoad(sx,sy,sx-11,sy+3,TILE.STONE,1);
  MIDGARD_SITES.forEach(site=>addLandmark(site.name,site.x,site.y,site.icon,site.kind,site));
  addLandmark('Hall of Echoes',sx-11,sy+3,'ðŸ””','sanctum',{name:'Hall of Echoes',x:sx-11,y:sy+3,icon:'ðŸ””',kind:'sanctum',actionLabel:'Consecrate'});
  npcList=[
    {wx:(sx-3)*T,wy:(sy+6)*T+6,name:'Bjorn the Smith',icon:'⚒️',col:'#c8a000',dialog:0,role:'Forgekeeper',location:'Skald\'s Hearth',shopTitle:'Forge Wares',shopFlavor:'Weapons, armor, and sturdy supplies for delving below Midgard.',shopItems:[makeItem(5,1,1),makeItem(7,1,1),makeItem(1,1,1),makeItem(11,1,1)],isDungeon:false},
    {wx:(sx-9)*T,wy:(sy-3)*T+10,name:'Freya the Seer',icon:'🔮',col:'#9b30ff',dialog:1,role:'Runespeaker',location:'Jarl\'s Lodge',shopTitle:'Runes & Elixirs',shopFlavor:'Runic charms, mana tonics, and relics for mystics and risk-takers.',shopItems:[makeItem(8,1,1),makeItem(10,1,1),{...POTIONS[3]},{...POTIONS[4]}],isDungeon:false},
    {wx:(sx+5)*T,wy:(sy-5)*T+12,name:'Leif the Scout',icon:'🏹',col:'#4a8b4a',dialog:2,role:'Pathfinder',location:'War Hall',shopTitle:'Trail Provisions',shopFlavor:'Field gear, light blades, and survivability tools for the roads of Midgard.',shopItems:[makeItem(14,1,1),makeItem(4,1,1),{...POTIONS[0]},{...POTIONS[1]}],isDungeon:false},
    {wx:(sx+9)*T,wy:(sy-3)*T+10,name:'Sigrid the Elder',icon:'📜',col:'#c8a000',dialog:3,role:'Lorekeeper',location:'War Hall',shopTitle:'Relics & Remedies',shopFlavor:'Old wisdom, rare draughts, and relics gathered from sacred sites.',shopItems:[makeItem(8,1,1),makeItem(12,1,1),{...POTIONS[1]},{...POTIONS[3]}],isDungeon:false},
    {wx:(sx-5)*T,wy:(sy-5)*T+12,name:'Ivar the Wanderer',icon:'🗺️',col:'#8b6900',dialog:4,role:'Road Merchant',location:'Jarl\'s Lodge',shopTitle:'Traveler\'s Cache',shopFlavor:'A small but useful stash of wares for long walks and bad odds.',shopItems:[makeItem(4,1,1),makeItem(11,1,1),{...POTIONS[0]},{...POTIONS[3]}],isDungeon:false},
    {wx:(sx+3)*T,wy:(sy+6)*T+6,name:'Gunnar the Berserker',icon:'⚔️',col:'#cc2200',dialog:5,role:'War-Trainer',location:'Skald\'s Hearth',shopTitle:'Battle Stock',shopFlavor:'Heavy steel, bruiser gear, and extra healing before the deeper fights.',shopItems:[makeItem(0,1,1),makeItem(15,1,1),{...POTIONS[0]},{...POTIONS[1]}],isDungeon:false},
  ];
}
function setTile(x,y,t){if(x>=0&&x<WS&&y>=0&&y<WS)world[y][x]=t;}
function getTile(wx,wy){let tx=Math.floor(wx/T),ty=Math.floor(wy/T);if(tx<0||ty<0||tx>=WS||ty>=WS)return TILE.WALL;return world[ty][tx];}
function isBlockedWorld(wx,wy){let t=getTile(wx,wy);return t===TILE.WALL||t===TILE.WATER||t===TILE.TREE;}
function findMidgardSpawn(name='Ravenwatch'){
  let site=worldLandmarks.find(s=>s.name===name)||worldLandmarks.find(s=>s.kind==='village')||{x:Math.floor(WS*.5),y:Math.floor(WS*.48)};
  let offsets=[
    [0,0],[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],
    [0,2],[2,0],[-2,0],[0,-2],[2,1],[-2,1],[1,2],[-1,2]
  ];
  for(let [ox,oy] of offsets){
    let tx=site.x+ox,ty=site.y+oy;
    if(tx<0||ty<0||tx>=WS||ty>=WS)continue;
    let t=world[ty][tx];
    if(t!==TILE.TREE&&t!==TILE.WATER&&t!==TILE.WALL)return{x:tx*T+T/2,y:ty*T+T/2};
  }
  return{x:site.x*T+T/2,y:site.y*T+T/2};
}
genWorld();

// ── DUNGEON GENERATOR ──────────────────────────────────────
const DW=64,DH=64,DTILE=32;
let dmap=[],drooms=[],dtorches=[],dtraps=[],dchests=[],dspikes=[],dVendors=[],dForges=[];
let dShrines=[],dPuzzles=[],dPoisonVents=[],dArrowTraps=[],dRuneTiles=[],dElites=[],dSecretRooms=[],dFloorEvents=[];
let dbossRoom=null,dstairsPos=null,dungeonModifier=null,dungeonRevealed=[];
let activePuzzle=null,puzzleUserSeq=[],puzzleCorrectSeq=[],puzzlePhase='show',puzzleTimer=0,puzzleIdx=0;

function initDMap(){
  dmap=[];dungeonRevealed=[];
  for(let y=0;y<DH;y++){dmap[y]=[];dungeonRevealed[y]=[];for(let x=0;x<DW;x++){dmap[y][x]=DT.WALL;dungeonRevealed[y][x]=false;}}
}
function carveRoom(r){for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)if(y>=0&&y<DH&&x>=0&&x<DW)dmap[y][x]=DT.FLOOR;}
function carveCorridor(x1,y1,x2,y2){let x=x1,y=y1;while(x!==x2){if(x>=0&&x<DW&&y>=0&&y<DH)dmap[y][x]=DT.FLOOR;x+=x<x2?1:-1;}while(y!==y2){if(x>=0&&x<DW&&y>=0&&y<DH)dmap[y][x]=DT.FLOOR;y+=y<y2?1:-1;}}
function safeFloorPos(room,exclude=[]){
  for(let attempt=0;attempt<60;attempt++){
    let tx=room.x+1+Math.floor(Math.random()*(room.w-2));
    let ty=room.y+1+Math.floor(Math.random()*(room.h-2));
    if(dmap[ty]?.[tx]===DT.FLOOR&&!exclude.some(p=>Math.hypot(p.x-tx,p.y-ty)<2))return{x:tx,y:ty};
  }
  return{x:room.x+1,y:room.y+1};
}

function generateDungeon(floor){
  initDMap();
  drooms=[];dtorches=[];dtraps=[];dchests=[];dspikes=[];dVendors=[];dForges=[];
  dShrines=[];dPuzzles=[];dPoisonVents=[];dArrowTraps=[];dRuneTiles=[];dElites=[];dSecretRooms=[];dFloorEvents=[];
  shrineDrafts={};
  dbossRoom=null;dstairsPos=null;
  let route=currentDungeonRouteDef();
  dungeonModifier=pickRouteDungeonModifier(route,floor);

  let attempts=0,target=7+Math.min(floor,5);
  while(drooms.length<target&&attempts<300){
    attempts++;
    let rw=8+Math.floor(Math.random()*9),rh=7+Math.floor(Math.random()*8);
    let rx=2+Math.floor(Math.random()*(DW-rw-4)),ry=2+Math.floor(Math.random()*(DH-rh-4));
    if(!drooms.some(r=>rx<r.x+r.w+2&&rx+rw+2>r.x&&ry<r.y+r.h+2&&ry+rh+2>r.y))
      drooms.push({x:rx,y:ry,w:rw,h:rh,cleared:false,id:drooms.length,type:'normal'});
  }
  // Designate special rooms
  if(drooms.length>4)drooms[Math.floor(drooms.length/3)].type='shrine';
  if(drooms.length>5)drooms[Math.floor(drooms.length*2/3)].type='armory';
  if(drooms.length>6)drooms[Math.floor(drooms.length/2)].type='crypt';
  if(drooms.length>7)drooms[Math.floor(drooms.length*.42)].type='ritual';
  if(drooms.length>8)drooms[Math.floor(drooms.length*.58)].type='library';
  if(drooms.length>9)drooms[Math.floor(drooms.length*.76)].type='prison';
  if(drooms.length>7)drooms[Math.floor(drooms.length*.18)].type='treasury';
  if(drooms.length>8)drooms[Math.floor(drooms.length*.84)].type='barracks';
  if(drooms.length>9&&!isBossFloor(floor))drooms[Math.floor(drooms.length*.5)].type='arena';
  if(drooms.length>10&&!isBossFloor(floor))drooms[Math.floor(drooms.length*.67)].type='champion';
  if(route.id==='barrow'){
    if(drooms.length>6)drooms[Math.floor(drooms.length*.27)].type='crypt';
    if(drooms.length>8)drooms[Math.floor(drooms.length*.61)].type='prison';
  }else if(route.id==='ember'){
    if(drooms.length>6)drooms[Math.floor(drooms.length*.31)].type='armory';
    if(drooms.length>8)drooms[Math.floor(drooms.length*.72)].type='barracks';
    if(drooms.length>9&&!isBossFloor(floor))drooms[Math.floor(drooms.length*.54)].type='arena';
  }else if(route.id==='seer'){
    if(drooms.length>6)drooms[Math.floor(drooms.length*.29)].type='library';
    if(drooms.length>8)drooms[Math.floor(drooms.length*.57)].type='ritual';
    if(drooms.length>9)drooms[Math.floor(drooms.length*.18)].type='shrine';
  }

  drooms.forEach(r=>carveRoom(r));
  for(let i=1;i<drooms.length;i++){
    let a=drooms[i-1],b=drooms[i];
    let ax=Math.floor(a.x+a.w/2),ay=Math.floor(a.y+a.h/2),bx=Math.floor(b.x+b.w/2),by=Math.floor(b.y+b.h/2);
    carveCorridor(ax,ay,bx,by);
    carveCorridor(ax+1,ay,bx+1,by);
    carveCorridor(ax-1,ay,bx-1,by);
    carveCorridor(ax,ay+1,bx,by+1);
    carveCorridor(ax,ay-1,bx,by-1);
  }
  for(let i=1;i<drooms.length;i++){
    let a=drooms[i-1],b=drooms[i];
    let mx=Math.floor((Math.floor(a.x+a.w/2)+Math.floor(b.x+b.w/2))/2);
    let my=Math.floor((Math.floor(a.y+a.h/2)+Math.floor(b.y+b.h/2))/2);
    if(my>=0&&my<DH&&mx>=0&&mx<DW&&dmap[my][mx]===DT.FLOOR){dmap[my][mx]=DT.DOOR;drooms[i].doorX=mx;drooms[i].doorY=my;}
  }
  let boss=drooms[drooms.length-1];
  let sp;
  if(isBossFloor(floor)){
    boss={...boss,x:Math.max(2,Math.floor(DW/2)-10),y:Math.max(2,Math.floor(DH/2)-8),w:20,h:16,isBossRoom:true,type:'boss',id:boss.id,cleared:false};
    drooms[drooms.length-1]=boss;
    carveRoom(boss);
    let oldBossDoorX=boss.doorX,oldBossDoorY=boss.doorY;
    let prev=drooms[drooms.length-2];
    let bx=Math.floor(boss.x+boss.w/2),by=Math.floor(boss.y+boss.h/2);
    let px=Math.floor(prev.x+prev.w/2),py=Math.floor(prev.y+prev.h/2);
    let doorX=bx,doorY=by;
    if(Math.abs(px-bx)>Math.abs(py-by)){
      doorX=px<bx?boss.x:boss.x+boss.w-1;
      doorY=Math.max(boss.y+1,Math.min(boss.y+boss.h-2,by));
    }else{
      doorY=py<by?boss.y:boss.y+boss.h-1;
      doorX=Math.max(boss.x+1,Math.min(boss.x+boss.w-2,bx));
    }
    carveCorridor(px,py,doorX,doorY);
    boss.doorX=doorX;boss.doorY=doorY;
    if(oldBossDoorX!=null&&oldBossDoorY!=null&&!(oldBossDoorX===doorX&&oldBossDoorY===doorY)&&dmap[oldBossDoorY]?.[oldBossDoorX]===DT.DOOR)dmap[oldBossDoorY][oldBossDoorX]=DT.FLOOR;
    if(boss.doorX!=null)dmap[boss.doorY][boss.doorX]=DT.DOOR;
    dbossRoom=boss;
    sp=safeFloorPos(boss,[]);
  }else{
    boss.isBossRoom=false;boss.type='final';dbossRoom=null;
    sp=safeFloorPos(boss,[]);
  }
  dstairsPos=sp;dmap[sp.y][sp.x]=DT.WALL;

  // Secret rooms — carved off the side of existing rooms
  for(let i=1;i<drooms.length-1;i++){
    if(Math.random()<.35){
      let r=drooms[i];
      let srw=4+Math.floor(Math.random()*4),srh=4+Math.floor(Math.random()*3);
      let sx=r.x+r.w+1,sy=r.y;
      if(sx+srw<DW-1&&sy+srh<DH-1){
        let secretRoom={x:sx,y:sy,w:srw,h:srh,cleared:true,id:drooms.length+i,type:'secret',isSecret:true};
        carveRoom(secretRoom);
        // Secret wall connecting them — looks like a wall but can be passed through
        let swx=r.x+r.w,swy=Math.floor(r.y+r.h/2);
        if(swy>=0&&swy<DH&&swx>=0&&swx<DW){dmap[swy][swx]=DT.SECRET_WALL;}
        dSecretRooms.push({room:secretRoom,wallX:swx,wallY:swy,revealed:false});
        // Put guaranteed epic+ loot in secret room
        let p=safeFloorPos(secretRoom,[]);
        if(dmap[p.y][p.x]===DT.FLOOR){
          dmap[p.y][p.x]=DT.CHEST;
          let item=rollLootItem(floor+1,P.level);
      dchests.push({x:p.x,y:p.y,opened:false,rarity:'epic',items:[item,rollPotion(floor),{isGold:true,val:scaledGoldValue(36+floor*16,floor)}]});
        }
      }
    }
  }

  // Torches
  drooms.forEach(r=>[[r.x+1,r.y+1],[r.x+r.w-2,r.y+1],[r.x+1,r.y+r.h-2],[r.x+r.w-2,r.y+r.h-2]].forEach(([tx,ty])=>{if(Math.random()<.7&&tx>=0&&tx<DW&&ty>=0&&ty<DH)dtorches.push({x:tx,y:ty,flicker:Math.random()*Math.PI*2});}));

  let occupied=[];

  // Chests in most rooms
  drooms.forEach((r,i)=>{
    if(i===0||r.type==='crypt'||r.isBossRoom)return;
    let isLast=false;
    let rarity=r.type==='armory'?'epic':r.type==='treasury'?'epic':i>drooms.length/2?(Math.random()<.5?'epic':'rare'):'rare';
    rarity=clampRarity(rarity,floorLootRarityCap(floor,false));
    let p=safeFloorPos(r,occupied);occupied.push(p);dmap[p.y][p.x]=DT.CHEST;
    let numItems=isLast?3:r.type==='armory'?3:r.type==='treasury'?4:1+Math.floor(Math.random()*2);
    let items=[];
    for(let k=0;k<numItems;k++){
      let pool=ITEM_BASES.filter(b=>b.rarity===rarity);
      items.push(makeItem((pool[Math.floor(Math.random()*pool.length)]||ITEM_BASES[0]).id,floor,P.level));
    }
    items.push(rollPotion(floor));
    if(isLast){items.push(rollPotion(floor));items.push(rollPotion(floor));}
      items.push({isGold:true,val:scaledGoldValue((14+floor*10)*(isLast?2.1:r.type==='treasury'?2.8:1),floor)});
    dchests.push({x:p.x,y:p.y,opened:false,items,rarity});
  });

  // Shrines in shrine room + chance in others
  drooms.forEach((r,i)=>{
    if(r.isBossRoom||r.isSecret)return;
    let isShrine=r.type==='shrine'||(i>0&&Math.random()<.2);
    if(isShrine){
      let p=safeFloorPos(r,occupied);
      if(dmap[p.y][p.x]===DT.FLOOR){occupied.push(p);dmap[p.y][p.x]=DT.SHRINE;dShrines.push({x:p.x,y:p.y,used:false});}
    }
  });

  // Rune puzzles (unlock a vault chest)
  drooms.slice(2,-1).forEach((r,i)=>{
    if(r.isSecret||r.type==='shrine'||r.isBossRoom)return;
    if(Math.random()<.35){
      let p=safeFloorPos(r,occupied);
      if(dmap[p.y][p.x]===DT.FLOOR){
        occupied.push(p);dmap[p.y][p.x]=DT.PUZZLE;
        let seqLen=3+Math.min(floor,2);
        let seq=Array.from({length:seqLen},()=>Math.floor(Math.random()*RUNE_SYMBOLS.length));
        // Place vault chest nearby
        let vp=safeFloorPos(r,occupied);occupied.push(vp);
        let vaultItem=rollLootItem(floor+1,P.level);
        dPuzzles.push({x:p.x,y:p.y,solved:false,seq,vaultX:vp.x,vaultY:vp.y,vaultItem});
      }
    }
  });

  // New trap types
  drooms.slice(1,-1).forEach(r=>{
    if(r.isSecret||r.type==='shrine')return;
    // Pressure traps
    if(Math.random()<.5){
      let p=safeFloorPos(r,occupied);
      if(dmap[p.y][p.x]===DT.FLOOR){occupied.push(p);dmap[p.y][p.x]=DT.TRAP;dtraps.push({x:p.x,y:p.y,active:false,timer:0,armTimer:3000});}
    }
    // Spike traps
    for(let k=0;k<3;k++){
      if(Math.random()<.4){
        let p=safeFloorPos(r,occupied);
        if(dmap[p.y][p.x]===DT.FLOOR)dspikes.push({x:p.x,y:p.y,active:false,timer:Math.random()*3000,period:1800+Math.random()*800});
      }
    }
    // Poison gas vents
    if(Math.random()<.4){
      let p=safeFloorPos(r,occupied);
      if(dmap[p.y][p.x]===DT.FLOOR){occupied.push(p);dmap[p.y][p.x]=DT.POISON_VENT;dPoisonVents.push({x:p.x,y:p.y,active:false,timer:Math.random()*3200,period:3600,dmgTimer:0});}
    }
    // Arrow wall traps — only in corridors between rooms; place on room edge
    if(Math.random()<.3){
      let edgeX=r.x+Math.floor(Math.random()*r.w);
      let edgeY=r.y;
      if(dmap[edgeY]?.[edgeX]===DT.FLOOR){dmap[edgeY][edgeX]=DT.ARROW_TRAP;dArrowTraps.push({x:edgeX,y:edgeY,lastFired:0,dir:{vx:0,vy:1},cooldown:3500});}
    }
    // Rune curse tiles
    for(let k=0;k<2;k++){
      if(Math.random()<.3){
        let p=safeFloorPos(r,occupied);
        if(dmap[p.y][p.x]===DT.FLOOR){dmap[p.y][p.x]=DT.RUNE_TILE;
          let debuffTypes=['slow','silence','weaken'];
          dRuneTiles.push({x:p.x,y:p.y,triggered:false,debuff:debuffTypes[Math.floor(Math.random()*debuffTypes.length)]});}
      }
    }
    if(r.type==='arena'){
      for(let k=0;k<3;k++){
        let p=safeFloorPos(r,occupied);
        if(dmap[p.y][p.x]===DT.FLOOR)dspikes.push({x:p.x,y:p.y,active:false,timer:Math.random()*2200,period:1500+Math.random()*700});
      }
    }
  });

  // Elite enemy marker (one per dungeon, mid-dungeon rooms)
  if(drooms.length>4){
    let eliteRoom=drooms[Math.floor(drooms.length/2)];
    let ep=safeFloorPos(eliteRoom,occupied);occupied.push(ep);
    let def=EDEFS[Math.floor(Math.random()*EDEFS.length)];
    let sf=scaleFactor(floor,P.level);
    dElites.push({...def,name:'Elite '+def.name,maxHp:Math.floor(def.hp*sf*4.4),hp:Math.floor(def.hp*sf*4.4),
      dmg:Math.floor(def.dmg*sf*2.2),xp:Math.floor(def.xp*sf*3.2),gold:Math.floor(def.gold*sf*4.4),sz:def.sz+6,
      shotTimer:0,froze:0,slow:0,id:Math.random(),x:ep.x*DTILE+DTILE/2,y:ep.y*DTILE+DTILE/2,
      roomId:eliteRoom.id,isDungeon:true,isElite:true,col:def.col});
  }

  // Vendor floor 2+, Forge floor 3+
  if(floor>=2&&drooms.length>=3){
    let vRoom=drooms[2];let p=safeFloorPos(vRoom,occupied);occupied.push(p);dmap[p.y][p.x]=DT.VENDOR;
    let shopItems=[rollLootItem(floor,P.level),rollLootItem(floor,P.level),rollLootItem(floor,P.level),rollPotion(floor),rollPotion(floor)];
    dVendors.push({x:p.x,y:p.y,name:'Wandering Merchant',icon:'🧙',shopItems,dialog:6});
  }
  if(floor>=3&&drooms.length>=4){
    let fRoom=drooms[3];let p=safeFloorPos(fRoom,occupied);occupied.push(p);dmap[p.y][p.x]=DT.FORGE;
    dForges.push({x:p.x,y:p.y,name:'Ancient Forge',icon:'🔥',dialog:7});
  }

  // Floor events
  let eventRooms=drooms.filter((r,i)=>!r.isBossRoom&&!r.isSecret&&r.type!=='shrine'&&r.type!=='armory'&&i>0);
  let eventCount=isBossFloor(floor)?1+Math.floor(Math.random()*2):Math.min(3,1+Math.floor(floor/3)+Math.floor(Math.random()*2));
  if(dungeonHasMod('Fortune-Touched',floor)&&!isBossFloor(floor))eventCount=Math.min(4,eventCount+1);
  eventRooms.sort(()=>Math.random()-.5).slice(0,Math.min(eventCount,eventRooms.length)).forEach((room,idx)=>{
    let p=safeFloorPos(room,occupied);
    if(dmap[p.y][p.x]!==DT.FLOOR)return;
    occupied.push(p);
    dmap[p.y][p.x]=DT.EVENT;
    let base=chooseFloorEventForRoom(room);
    dFloorEvents.push({...base,x:p.x,y:p.y,id:`${floor}-${room.id}-${idx}`,used:false,pending:false,rewarded:false,noticed:false,roomId:room.id});
  });

  revealEntireDungeon();
  return drooms;
}

function isDBlocked(tx,ty){
  if(tx<0||ty<0||tx>=DW||ty>=DH)return true;
  let t=dmap[ty][tx];
  return t===DT.WALL||t===DT.DOOR||t===DT.BOSS_DOOR;
}
function revealAround(tx,ty,radius){
  let r2=radius*(dungeonHasMod('Dark')?0.6:1);
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    let nx=tx+dx,ny=ty+dy;
    if(nx>=0&&nx<DW&&ny>=0&&ny<DH&&Math.hypot(dx,dy)<=r2)dungeonRevealed[ny][nx]=true;
  }
}
function revealEntireDungeon(){
  for(let y=0;y<DH;y++)for(let x=0;x<DW;x++)dungeonRevealed[y][x]=true;
}

// ── PLAYER ─────────────────────────────────────────────────
const worldSpawn=findMidgardSpawn();
let P={
  x:worldSpawn.x,y:worldSpawn.y,
  hp:100,maxHp:100,mp:100,maxMp:100,
  stamina:100,maxStamina:100,
  xp:0,xpNext:100,level:1,
  baseDmg:10,def:0,spd:2.2,gold:0,
  classId:null,className:'',classMods:{},
  inv:[],perks:[],
  equip:{weapon:makeItem(0,1,1),armor:makeItem(4,1,1),helm:null,rune:null},
  blink:0,attackTimer:0,attackPoseTimer:0,atkMode:0,
  facing:{x:1,y:0},rage:false,rageTimer:0,revived:false,
  sprinting:false,staminaRegenTimer:0,
  debuffs:{}, // {slow:timer, silence:timer, weaken:timer, poison:timer}
};
let stash=[],stashMode=false,shrineDrafts={},saveLoaded=false;
const SAVE_KEY='ragnarok_edge_save_v1';
function ensureMidgardProgress(){
  if(!P.meta)P.meta={};
  if(!P.meta.midgard)P.meta.midgard={satchel:0,forge:0,provisions:0};
  return P.meta.midgard;
}
function ensureRunHistory(){
  if(!P.meta)P.meta={};
  if(!P.meta.history)P.meta.history={deepestFloor:1,bossesSlain:0,descents:0,returns:0};
  return P.meta.history;
}
function ensureRouteProgress(){
  if(!P.meta)P.meta={};
  if(!P.meta.routeProgress)P.meta.routeProgress={barrow:1,ember:1,seer:1};
  ['barrow','ember','seer'].forEach(id=>{if(!P.meta.routeProgress[id])P.meta.routeProgress[id]=1;});
  return P.meta.routeProgress;
}
function ensureBifrostState(){
  if(!P.meta)P.meta={};
  if(!P.meta.bifrost)P.meta.bifrost={barrow:false,ember:false,seer:false,repairs:0,introShown:false};
  ['barrow','ember','seer'].forEach(id=>{if(P.meta.bifrost[id]==null)P.meta.bifrost[id]=false;});
  if(P.meta.bifrost.introShown==null)P.meta.bifrost.introShown=false;
  P.meta.bifrost.repairs=['barrow','ember','seer'].filter(id=>P.meta.bifrost[id]).length;
  return P.meta.bifrost;
}
function bifrostShardLabel(routeId){
  return routeId==='ember'?'Ember Shard':routeId==='seer'?'Seer Shard':'Barrow Shard';
}
function createBifrostShard(routeId){
  let route=routeDef(routeId);
  let shardName=bifrostShardLabel(routeId);
  return {
    id:`bifrost_shard_${routeId}`,
    uid:Math.random(),
    name:`${shardName} of the Broken Bridge`,
    icon:'◈',
    type:'quest',
    rarity:'legendary',
    locked:true,
    routeId,
    desc:`A fractured Bifrost shard recovered from floor 100 of ${route.name}. It resonates with the ruined gate in Ravenwatch.`
  };
}
function grantBifrostShardReward(routeId,x,y){
  let state=ensureBifrostState();
  if(state[routeId])return null;
  state[routeId]=true;
  state.repairs=['barrow','ember','seer'].filter(id=>state[id]).length;
  let shard=createBifrostShard(routeId);
  if(!addItemToInventory(shard)){
    loot.push({...shard,x:x+28,y:y-10,id:Math.random(),isDungeon:true,pickupCooldown:800});
  }
  return shard;
}
function getDungeonCheckpointFloor(routeId=activeDungeonRouteId||lastDungeonEntrance?.routeId||'barrow'){
  if(!P.meta)P.meta={};
  let routes=ensureRouteProgress();
  if(P.meta.dungeonCheckpointFloor&&!P.meta.routeProgress){
    routes[routeId]=Math.max(1,P.meta.dungeonCheckpointFloor||1);
    delete P.meta.dungeonCheckpointFloor;
  }
  return Math.max(1,routes[routeId]||1);
}
function setDungeonCheckpointFloor(floor,routeId=activeDungeonRouteId||lastDungeonEntrance?.routeId||'barrow'){
  if(!P.meta)P.meta={};
  let routes=ensureRouteProgress();
  routes[routeId]=Math.max(1,Math.floor(floor||1));
}
function inventoryCap(){
  let prog=ensureMidgardProgress();
  return 50+prog.satchel*10;
}
function forgeDiscountMult(){
  let prog=ensureMidgardProgress();
  return 1-Math.min(.3,prog.forge*.15);
}
function forgeUpgradeCost(item){
  let powerTax=1+Math.min(3.5,getItemPower(item)/220);
  return Math.max(20,Math.floor(UPGRADE_COST[item.rarity]*(1+(item.upg||0)*1.05)*forgeDiscountMult()*powerTax));
}
function effectiveDamageReduction(){
  return Math.min(0.45,playerDamageReduction());
}
function directGoldFactor(enemy){
  if(enemy?.isBoss)return 0.55;
  if(enemy?.isMiniBoss)return 0.3;
  if(enemy?.isElite)return 0.18;
  return 0.06;
}
function scaledGoldValue(base,floor=dungeonFloor){
  let depth=Math.max(1,floor);
  let mult=depth>=100?0.22:depth>=60?0.28:depth>=30?0.34:depth>=15?0.42:0.55;
  return Math.max(1,Math.floor(base*mult*(dungeonHasMod('Blessed',floor)?2:1)*(dungeonHasMod('Fortune-Touched',floor)?1.15:1)));
}
const MIDGARD_UPGRADES=[
  {id:'satchel',name:'Trail Satchel',max:2,cost:[320,720],desc:['Increase bag space by 10.','Increase bag space by another 10.'],summary:'More inventory room for longer descents.'},
  {id:'forge',name:'Forge Charter',max:2,cost:[420,980],desc:['Reduce forge costs by 15%.','Reduce forge costs by another 15%.'],summary:'Permanent forge discounts in Ravenwatch.'},
  {id:'provisions',name:'Quartermaster Seal',max:2,cost:[220,520],desc:['Start each descent with a healing potion.','Start each descent with a healing potion and mana tonic.'],summary:'Steady starting supplies for each new floor run.'}
];
function clearSkaldBuff(){
  P._skaldBuff=null;
}
function skaldBuffLabel(){
  return P._skaldBuff?.label||'None';
}
function grantMidgardProvisions(){
  let prog=ensureMidgardProgress();
  let granted=[];
  if(prog.provisions>=1&&addItemToInventory({...POTIONS[0]}))granted.push(POTIONS[0].name);
  if(prog.provisions>=2&&addItemToInventory({...POTIONS[3]}))granted.push(POTIONS[3].name);
  if(granted.length)msg(`🏘️ Ravenwatch sends you off with ${granted.join(' and ')}.`,2200);
}
function openMidgardCouncil(){
  let prog=ensureMidgardProgress();
  document.getElementById('npc-portrait').textContent='👑';
  document.getElementById('npc-name').textContent='Jarl\'s Lodge';
  document.getElementById('npc-sub').textContent='Ravenwatch • Town Progression';
  document.getElementById('npc-text').innerHTML='<b>Invest in Ravenwatch</b><br><small>Permanent improvements that strengthen every descent.</small>';
  let opts=document.getElementById('npc-opts');
  opts.innerHTML='';
  MIDGARD_UPGRADES.forEach(upg=>{
    let rank=prog[upg.id]||0;
    let maxed=rank>=upg.max;
    let cost=maxed?0:upg.cost[rank];
    let b=document.createElement('button');
    b.className='npc-btn';
    b.disabled=maxed||P.gold<cost;
    b.innerHTML=`<span><b>${upg.name}</b> <span style="color:#d7b15c">Rank ${rank}/${upg.max}</span><br><small style="color:#8d8574">${upg.summary}<br>${maxed?'Maxed':upg.desc[rank]}</small></span><span style="color:${maxed?'#666':'#ffd700'};float:right;margin-left:8px">${maxed?'MAX':cost+'g'}</span>`;
    b.onclick=()=>{
      if(maxed||P.gold<cost)return;
      P.gold-=cost;
      prog[upg.id]=rank+1;
      ensureMidgardProgress();
      renderInv();
      saveGame(false);
      msg(`🏘️ ${upg.name} improved to Rank ${prog[upg.id]}.`,2200);
      openMidgardCouncil();
    };
    opts.appendChild(b);
  });
  openPanel('npc');
}
function openMemorialStone(){
  let hist=ensureRunHistory();
  let routes=ensureRouteProgress();
  let checkpointText=`Barrow ${routes.barrow} • Ember ${routes.ember} • Seer ${routes.seer}`;
  document.getElementById('npc-portrait').textContent='🪦';
  document.getElementById('npc-name').textContent='Stone of Names';
  document.getElementById('npc-sub').textContent='Ravenwatch • Memory of the Fallen and Victorious';
  document.getElementById('npc-text').innerHTML=`<b>Ravenwatch remembers.</b><br><small>Deepest floor: <b>${hist.deepestFloor}</b> • Bosses slain: <b>${hist.bossesSlain}</b><br>Descents: <b>${hist.descents}</b> • Returns: <b>${hist.returns}</b><br>Route progress: <b>${checkpointText}</b></small>`;
  let opts=document.getElementById('npc-opts');
  opts.innerHTML='';
  let b=document.createElement('button');
  b.className='npc-btn';
  b.innerHTML=`<span><b>Current Path</b><br><small style="color:#8d8574">${P.className||'Unchosen'} • Level ${P.level} • ${skaldBuffLabel()==='None'?'No skald blessing':'Skald: '+skaldBuffLabel()}</small></span>`;
  b.disabled=true;
  opts.appendChild(b);
  openPanel('npc');
}
function openBifrostGate(site){
  let state=ensureBifrostState();
  let repairs=state.repairs||0;
  let missing=['barrow','ember','seer'].filter(id=>!state[id]).map(id=>bifrostShardLabel(id));
  document.getElementById('npc-portrait').textContent='◈';
  document.getElementById('npc-name').textContent='Broken Bifrost Gate';
  document.getElementById('npc-sub').textContent='Ravenwatch • Dormant Multiverse Anchor';
  document.getElementById('npc-text').innerHTML=repairs>=3
    ? `<b>The gate is almost ready.</b><br><small>The three fracture shards are locked into the ruined arch. The path to the Bifrost has not opened yet, but Ravenwatch now hums with the shape of a road between worlds.</small>`
    : `<b>The arch is dead stone and sleeping light.</b><br><small>This ruined portal once touched the Bifrost itself. To mend it, Ravenwatch needs three recovered fracture shards: one from the depths of Barrow, Ember, and Seer. Floor <b>100</b> of each route now carries that promise.</small>`;
  let opts=document.getElementById('npc-opts');
  opts.innerHTML='';
  let prog=document.createElement('button');
  prog.className='npc-btn';
  prog.disabled=true;
  prog.innerHTML=`<span><b>Repairs</b><br><small style="color:#8d8574">${repairs}/3 shards restored • ${repairs>=3?'The gate can soon be awakened':'Missing: '+missing.join(', ')}</small></span>`;
  opts.appendChild(prog);
  if(site){
    let note=document.createElement('button');
    note.className='npc-btn';
    note.disabled=true;
    note.innerHTML=`<span><b>Watcher Note</b><br><small style="color:#8d8574">Muninn remembers what is brought home. Huginn will measure what worlds demand next.</small></span>`;
    opts.appendChild(note);
  }
  openPanel('npc');
}
function openBifrostDiscovery(site){
  let state=ensureBifrostState();
  state.introShown=true;
  document.getElementById('npc-portrait').textContent='◈';
  document.getElementById('npc-name').textContent='The Broken Gate';
  document.getElementById('npc-sub').textContent='A Fracture Beneath Ravenwatch';
  document.getElementById('npc-text').innerHTML=`<b>The stone arch hums with a dead kind of light.</b><br><small>For a breath, the ruin remembers what it used to be: a road into the Bifrost itself. Huginn and Muninn keep watch because this is no ordinary relic. It is the torn mouth of the bridge between worlds.<br><br>The gate is broken, but not gone. Three fracture shards, one from the hundredth floor of <b>Barrow</b>, <b>Ember</b>, and <b>Seer</b>, may be enough to wake it again.</small>`;
  let opts=document.getElementById('npc-opts');
  opts.innerHTML='';
  let b=document.createElement('button');
  b.className='npc-btn';
  b.innerHTML=`<span><b>What It Needs</b><br><small style="color:#8d8574">Recover one shard from floor 100 of each route to begin repairing the gate.</small></span>`;
  b.onclick=()=>openBifrostGate(site);
  opts.appendChild(b);
  openPanel('npc');
}
function maybeTriggerBifrostDiscovery(){
  if(inDungeon||panel||dead||paused)return;
  let state=ensureBifrostState();
  if(state.introShown)return;
  let site=worldLandmarks.find(s=>s.kind==='portal');
  if(!site)return;
  let d=Math.hypot(site.x*T+T/2-P.x,site.y*T+T/2-P.y);
  if(d>92)return;
  spawnParticle(site.x*T+T/2,site.y*T+T/2,'#8ecaf4',16,true,'rune');
  spawnTrail(site.x*T+T/2,site.y*T+T/2,'#b9a4ff',true,12,24);
  msg('◈ The ruin answers your presence.',2200);
  openBifrostDiscovery(site);
}
function watcherPortraitMarkup(isThought){
  let eye=isThought?'#8ecaf4':'#d86c2f';
  return `<svg width="74" height="58" viewBox="0 0 74 58" aria-hidden="true" style="display:block">
    <ellipse cx="36" cy="46" rx="18" ry="5" fill="rgba(0,0,0,.22)"/>
    <rect x="34" y="31" width="3" height="14" rx="1.5" fill="#171a22"/>
    <rect x="39" y="32" width="3" height="13" rx="1.5" fill="#171a22"/>
    <path d="M28 27 L18 14 L31 20 Z" fill="#090b0e"/>
    <path d="M27 30 L14 35 L27 36 Z" fill="#0f1116"/>
    <ellipse cx="38" cy="26" rx="14" ry="9" fill="#06080a"/>
    <circle cx="48" cy="22" r="6" fill="#06080a"/>
    <path d="M52 22 L62 25 L52 27 Z" fill="#06080a"/>
    <circle cx="50" cy="21" r="1.8" fill="${eye}"/>
    <path d="M28 33 Q37 38 47 32" stroke="rgba(255,255,255,.06)" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;
}
function openWatcher(site){
  let isThought=site.watcherId==='huginn';
  document.getElementById('npc-portrait').innerHTML=watcherPortraitMarkup(isThought);
  document.getElementById('npc-name').textContent=isThought?'Huginn':'Muninn';
  document.getElementById('npc-sub').textContent=isThought?'Watcher of Thought • The field is being measured':'Watcher of Memory • The lodge remembers what survives';
  document.getElementById('npc-text').innerHTML=isThought
    ? `<b>A pale eye tracks your stance.</b><br><small>Huginn weighs your boons, your class path, and the logic of your fight. A croak from the perch is all the approval you get.</small>`
    : `<b>A charcoal silhouette cocks its head.</b><br><small>Muninn keeps the lodge, the stash, and the remembered climb of each fracture. What you bring back to Ravenwatch is noted.</small>`;
  let opts=document.getElementById('npc-opts');
  opts.innerHTML='';
  let b=document.createElement('button');
  b.className='npc-btn';
  if(isThought){
    b.innerHTML=`<span><b>Watched Build</b><br><small style="color:#8d8574">${P.className||'Unchosen'} • ${P.perks.length} blessings claimed • Echo: ${echoBlessingLabel()}</small></span>`;
    b.disabled=true;
  }else{
    b.innerHTML=`<span><b>Remembered Hoard</b><br><small style="color:#8d8574">${stash.length} stash items • Route memory ${getDungeonCheckpointFloor('barrow')}/${getDungeonCheckpointFloor('ember')}/${getDungeonCheckpointFloor('seer')}</small></span>`;
    b.onclick=()=>{closePanel();openInventory(true);stashMode=true;renderInv();};
  }
  opts.appendChild(b);
  openPanel('npc');
}
addItemToInventory({...POTIONS[0]});
addItemToInventory({...POTIONS[0]});
addItemToInventory({...POTIONS[0]});

let enemies=[],projectiles=[],particles=[],loot=[],floaters=[];
let cam={x:0,y:0},keys={},mouse={x:W/2,y:H/2},screenShake={time:0,power:0,x:0,y:0};
let skillCD=[0,0,0,0];
let manaRegen=0.8,mpRegenBonus=0;
let panel=null;
let invFilter='all';
let debugGodMode=false;
let bossRef=null,bossActive=false,bossReady=false,bossRoomAnnounced=false,bossSpawned=false,bossDefeated=false,bossSealPending=false,pendingBossChoice=false;
let waveTimer=6000,waveDuration=6000,wave=0;
let dead=false,paused=false;
let inDungeon=false,dungeonFloor=1,lastDungeonEntrance=null;
let activeDungeonRouteId='barrow';
let worldEntryPromptCooldown=0;
let currentRoomIdx=0,lastT=0,dt=0,dungeonStartRoomId=null,dungeonStartSafeTimer=0;
let dPlayer={x:0,y:0},dCam={x:0,y:0};
let pendingChest=null,lootPickupCooldown=0;
let transitioning=false;
const SPRINT_COST=22,SPRINT_REGEN=14,SPRINT_REGEN_DELAY=1800;
function clearBossUI(){
  document.getElementById('bossbar').style.display='none';
  document.getElementById('bossname').textContent='BOSS';
  document.getElementById('bossf').style.width='100%';
}
function isEnemyInActiveMode(e){return inDungeon?e.isDungeon===true:!e.isDungeon;}
function isProjectileInActiveMode(p){return inDungeon?p.isDungeon===true:!p.isDungeon;}
function syncBossStateToMode(){
  if(bossRef&&!isEnemyInActiveMode(bossRef)){
    bossRef=null;
    bossActive=false;
    clearBossUI();
  }
}
function dungeonThreatScale(floor){
  if(floor<=2)return 1+Math.max(0,floor-1)*.05;
  if(floor<=5)return 1.05+(floor-2)*.09;
  if(floor<=10)return 1.32+(floor-5)*.11;
  return 1.87+(floor-10)*.12;
}
function dungeonMobDurability(floor){
  if(floor<=2)return 2.15;
  if(floor<=5)return 1.62;
  if(floor<=10)return 1.28;
  return 1.18;
}
function dungeonMobDamage(floor){
  if(floor<=2)return 1.18;
  if(floor<=5)return 1.1;
  if(floor<=10)return 1.08;
  return 1.06;
}
function enemyDefenseFactor(e){
  if(!e?.isDungeon||e.isBoss)return .4;
  return e.isElite?.18:.1;
}
function fireEnemyProjectile(x,y,a,speed,dmg,col,opts={}){
  let speedMult=(opts.isDungeon??inDungeon)&&dungeonHasMod('Stormfront')?1.18:1;
  projectiles.push({x,y,vx:Math.cos(a)*speed*speedMult,vy:Math.sin(a)*speed*speedMult,dmg,col,sz:opts.sz||5,life:opts.life||1,owner:'enemy',isDungeon:opts.isDungeon??inDungeon,type:opts.type||'orb',debuff:opts.debuff,debuffDur:opts.debuffDur,ignoreDefense:opts.ignoreDefense,defenseFactor:opts.defenseFactor,bossAffixes:opts.bossAffixes});
}
function clampLootPos(x,y,isDungeonDrop){
  if(!isDungeonDrop)return{x,y};
  let tx=Math.floor(x/DTILE),ty=Math.floor(y/DTILE);
  for(let r=0;r<=3;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    let nx=tx+dx,ny=ty+dy;
    if(dmap[ny]?.[nx]===DT.FLOOR)return{x:nx*DTILE+DTILE/2,y:ny*DTILE+DTILE/2};
  }
  return{x,y};
}
function summonBossMinion(boss,defName,count=1,hpMult=1.1,dmgMult=1){
  if(!dbossRoom)return;
  for(let n=0;n<count;n++){
    let def=EDEFS.find(d=>d.name===defName)||EDEFS[0];
    let spawned=false;
    for(let tries=0;tries<16&&!spawned;tries++){
      let a=Math.random()*Math.PI*2,dist=42+Math.random()*70;
      let sx=boss.x+Math.cos(a)*dist,sy=boss.y+Math.sin(a)*dist;
      let tx=Math.floor(sx/DTILE),ty=Math.floor(sy/DTILE);
      if(tx<=dbossRoom.x||tx>=dbossRoom.x+dbossRoom.w-1||ty<=dbossRoom.y||ty>=dbossRoom.y+dbossRoom.h-1||isDBlocked(tx,ty))continue;
      let sf=scaleFactor(dungeonFloor,P.level)*.92;
      enemies.push({...def,maxHp:Math.floor(def.hp*sf*hpMult),hp:Math.floor(def.hp*sf*hpMult),dmg:Math.floor(def.dmg*sf*dmgMult),xp:Math.floor(def.xp*sf*.7),gold:Math.floor(def.gold*sf*.7),shotTimer:300,froze:0,slow:0,id:Math.random(),x:sx,y:sy,roomId:boss.roomId,isDungeon:true,isSummon:true,col:def.col});
      spawned=true;
    }
  }
}
function summonThreatEscort(room,tier='deep'){
  if(!room)return;
  let defNames=tier==='abyssal'?['Dark Elf','Fire Demon','Skeleton']:['Wolf','Skeleton','Dark Elf'];
  let def=EDEFS.find(d=>d.name===defNames[Math.floor(Math.random()*defNames.length)])||EDEFS[0];
  for(let n=0;n<(tier==='abyssal'?2:1);n++){
    let ep=safeFloorPos(room,[]);
    let sf=scaleFactor(dungeonFloor,dungeonEnemyScaleLevel(P.level))*(tier==='abyssal'?1.3:1.18);
    enemies.push({...def,name:tier==='abyssal'?'Abyss Guard':def.name,maxHp:Math.floor(def.hp*sf*1.65),hp:Math.floor(def.hp*sf*1.65),dmg:Math.floor(def.dmg*sf*1.2),xp:Math.floor(def.xp*sf*1.35),gold:Math.floor(def.gold*sf*1.5),shotTimer:250,froze:0,slow:0,id:Math.random(),x:ep.x*DTILE+DTILE/2,y:ep.y*DTILE+DTILE/2,roomId:room.id,isDungeon:true,col:def.col});
  }
}
function spawnBossEscort(boss,defName,count=2,hpMult=1.2,dmgMult=1.05){
  summonBossMinion(boss,defName,count,hpMult,dmgMult);
  floatText('MINIONS',boss.x,boss.y-30,'#f3deb0',13);
}
function bossDepthMod(){
  if(dungeonFloor>=50)return 1.2;
  if(dungeonFloor>=30)return 1.14;
  if(dungeonFloor>=20)return 1.08;
  return 1;
}
function handleBossMechanics(e,dt,px,py,dist,a){
  let timeRate=e.affixTimeRate||1;
  e.abilityTimer=(e.abilityTimer||2200)-dt*timeRate;
  e.auraTimer=(e.auraTimer||0)-dt*timeRate;
  e.volleyTimer=(e.volleyTimer||0)-dt*timeRate;
  e.voidstepTimer=(e.voidstepTimer||0)-dt*timeRate;
  let family=e.family||'';
  if(e.abilityTimer>0&&e.abilityTimer<700&&!e._abilityTelegraph){
    if(family==='wolf')telegraphBossAttack(px,py,family,'POUNCE');
    else if(family==='serpent')telegraphBossAttack(e.x,e.y,family,'VENOM');
    else if(family==='grave')telegraphBossAttack(e.x,e.y,family,e.name==='THE BONE KING'?'RAISE':'VEIL');
    else if(family==='ember')telegraphBossAttack(e.x,e.y,family,e.name==='FORGE GUARDIAN'?'HAMMERFALL':'ERUPTION');
    else telegraphBossAttack(px,py,family,e.name==="MIMIR'S ECHO"?'OMEN':'BLINK');
    e._abilityTelegraph=true;
  }
  if(e.auraTimer>0&&e.auraTimer<520&&!e._auraTelegraph){
    telegraphBossAttack(family==='ember'||family==='serpent'?px:e.x,family==='ember'||family==='serpent'?py:e.y,family,family==='serpent'?'TOXIC FIELD':family==='grave'?'SIPHON':family==='ember'?'HEAT':'HEX');
    e._auraTelegraph=true;
  }
  if(e.volleyTimer>0&&e.volleyTimer<520&&!e._volleyTelegraph){
    telegraphBossAttack(e.x,e.y,family,'BURST');
    e._volleyTelegraph=true;
  }
  if(e.chargeTimer>0){
    e.chargeTimer-=dt;
    let nx=e.x+e.chargeVX*(dt/16),ny=e.y+e.chargeVY*(dt/16);
    if(inDungeon){if(!isDBlocked(Math.floor(nx/DTILE),Math.floor(e.y/DTILE)))e.x=nx;if(!isDBlocked(Math.floor(e.x/DTILE),Math.floor(ny/DTILE)))e.y=ny;}
    if(e.chargeTimer<=0){
      spawnRing(e.x,e.y,e.col,22,26,false);
      spawnTrail(e.x,e.y,e.col,false,12,28);
      if(Math.hypot(px-e.x,py-e.y)<e.sz+46){takeDamage(e.dmg*1.35,true);addDebuff('slow',1200);}
    }
    return;
  }
  if(bossHasAffix(e,'voidstep')&&e.voidstepTimer<=0&&dist<220){
    e.voidstepTimer=e.phase===2?2400:3400;
    let ta=a+Math.PI+(Math.random()-.5)*1.1,range=e.phase===2?64:82;
    let tx=px+Math.cos(ta)*range,ty=py+Math.sin(ta)*range;
    if(!isDBlocked(Math.floor(tx/DTILE),Math.floor(ty/DTILE))){e.x=tx;e.y=ty;}
    [-0.3,0,0.3].forEach(s=>fireEnemyProjectile(e.x,e.y,Math.atan2(py-e.y,px-e.x)+s,6.1,Math.ceil(e.dmg*.34),'#a08cff',{sz:5,type:'veil',bossAffixes:e.affixIds}));
    spawnRing(e.x,e.y,'#9f8cff',18,20,false);
    floatText('VOIDSTEP',e.x,e.y-26,'#c9bcff',13);
  }
  if(e.name==='GARMR'||family==='wolf'){
    if(e.abilityTimer<=0&&dist>110){
      e.abilityTimer=e.phase===2?2400:3400;
      e._abilityTelegraph=false;
      e.chargeTimer=e.phase===2?320:240;
      e.chargeVX=Math.cos(a)*(e.phase===2?14:12);
      e.chargeVY=Math.sin(a)*(e.phase===2?14:12);
      spawnTrail(e.x,e.y,'#c79b72',false,10,30);
      if(e.phase===2&&Math.random()<.55)spawnBossEscort(e,'Wolf',2,1.18,1.05);
      floatText('POUNCE',e.x,e.y-28,'#f3deb0',14);
    }else if(e.phase===2&&e.volleyTimer<=0&&dist<170){
      e.volleyTimer=2600;
      e._volleyTelegraph=false;
      spawnRing(e.x,e.y,'#c79b72',14,18,false);
      addDebuff('slow',900);
    }
  }else if(e.name==='JORMUNGANDR'||family==='serpent'){
    if(e.auraTimer<=0&&dist<110){
      e.auraTimer=1200;
      e._auraTelegraph=false;
      addDebuff('poison',1400);
      takeDamage(e.phase===2?4:2,true);
    }
    if(e.abilityTimer<=0){
      e.abilityTimer=e.phase===2?2500:3600;
      e._abilityTelegraph=false;
      let shots=e.phase===2?10:7;
      for(let i=0;i<shots;i++){
        let ba=(Math.PI*2/shots)*i+Date.now()/700;
        fireEnemyProjectile(e.x,e.y,ba,e.phase===2?6.2:5.2,Math.ceil(e.dmg*.38),'#55cc55',{sz:5,debuff:'poison',debuffDur:e.phase===2?2200:1500,type:'venom',bossAffixes:e.affixIds});
      }
      if(e.phase===2){
        [-0.22,0,0.22].forEach(s=>fireEnemyProjectile(e.x,e.y,a+s,6.5,Math.ceil(e.dmg*.45),'#88ee66',{sz:5,debuff:'poison',debuffDur:2200,type:'venom',bossAffixes:e.affixIds}));
      }
      spawnTrail(e.x,e.y,'#61d36d',false,14,34);
      floatText('VENOM',e.x,e.y-26,'#7df08b',14);
    }
  }else if(e.name==='HEL'||e.name==='THE BONE KING'||family==='grave'){
    if(e.abilityTimer<=0){
      let summonType=e.name==='THE BONE KING'?'Skeleton':e.phase===2?'Dark Elf':'Skeleton';
      let summonCount=e.name==='THE BONE KING'?(e.phase===2?4:3):(e.phase===2?3:2);
      e.abilityTimer=e.phase===2?3000:4200;
      e._abilityTelegraph=false;
      summonBossMinion(e,summonType,summonCount,1.2,1.05);
      spawnRing(e.x,e.y,'#b190ff',18,22,false);
      floatText(e.name==='THE BONE KING'?'BONE HOST':'RAISE',e.x,e.y-26,'#d0b6ff',14);
    }
    if(e.phase===2&&e.auraTimer<=0&&dist<180){
      e.auraTimer=3200;
      e._auraTelegraph=false;
      addDebuff(e.name==='THE BONE KING'?'weaken':'silence',2200);
      let summons=enemies.filter(en=>en.hp>0&&en.isSummon&&en.roomId===e.roomId).length;
      if(summons>0){e.hp=Math.min(e.maxHp,e.hp+summons*(e.name==='THE BONE KING'?22:18));floatText(e.name==='THE BONE KING'?'REASSEMBLE':'SIPHON',e.x,e.y-18,'#d0b6ff',13);}
      spawnRing(px,py,'#8f63ff',10,14,false);
      msg(e.name==='THE BONE KING'?'💀 BONE KING! Your guard falters beneath the crypt-host.':'🔇 HEL VEIL! Skills falter.',1500);
    }
  }else if(e.name==='SURTR'||e.name==='FORGE GUARDIAN'||family==='ember'){
    if(e.auraTimer<=0&&dist<95){
      e.auraTimer=900;
      e._auraTelegraph=false;
      takeDamage(e.phase===2?(e.name==='FORGE GUARDIAN'?10:8):(e.name==='FORGE GUARDIAN'?6:5),true);
      spawnParticle(px,py,'#ff7a2f',8,false,'spark');
    }
    if(e.abilityTimer<=0){
      e.abilityTimer=e.phase===2?2400:3300;
      e._abilityTelegraph=false;
      let shots=e.name==='FORGE GUARDIAN'?(e.phase===2?10:6):(e.phase===2?12:8);
      for(let i=0;i<shots;i++){
        let ba=(Math.PI*2/shots)*i;
        fireEnemyProjectile(e.x,e.y,ba,e.phase===2?6.5:5.6,Math.ceil(e.dmg*.42),'#ff7a2f',{sz:5,type:'ember',ignoreDefense:true,bossAffixes:e.affixIds});
      }
      spawnTrail(e.x,e.y,'#ff7a2f',false,18,36);
      floatText(e.name==='FORGE GUARDIAN'?'HAMMERFALL':'ERUPTION',e.x,e.y-26,'#ffb37a',14);
    }
  }else if(e.name==="ODIN'S SHADOW"||e.name==='VEILSCRIBE'||e.name==="MIMIR'S ECHO"||family==='seer'||family==='shadow'||family==='veil'){
    if(e.abilityTimer<=0){
      e.abilityTimer=e.phase===2?2200:3200;
      e._abilityTelegraph=false;
      let ta=a+Math.PI+(Math.random()-.5)*.7,range=e.phase===2?78:92;
      let tx=px+Math.cos(ta)*range,ty=py+Math.sin(ta)*range;
      if(!isDBlocked(Math.floor(tx/DTILE),Math.floor(ty/DTILE))){e.x=tx;e.y=ty;}
      let debuff=e.name==="MIMIR'S ECHO"?'slow':e.phase===2?'weaken':null;
      let debuffDur=e.name==="MIMIR'S ECHO"?1800:1800;
      [-0.28,0,0.28].forEach(s=>fireEnemyProjectile(e.x,e.y,Math.atan2(py-e.y,px-e.x)+s,7,Math.ceil(e.dmg*.46),e.name==='VEILSCRIBE'?'#7ab8ff':'#b9b9ff',{sz:5,type:e.name==='VEILSCRIBE'?'arcane':'veil',debuff,debuffDur,bossAffixes:e.affixIds}));
      if(e.phase===2&&Math.random()<.45)spawnBossEscort(e,'Dark Elf',2,1.22,1.08);
      spawnRing(e.x,e.y,'#a7a7ff',20,26,false);
      floatText(e.name==="MIMIR'S ECHO"?'OMEN':'BLINK',e.x,e.y-28,'#cfd3ff',14);
    }
    if(e.phase===2&&e.auraTimer<=0&&dist<150){
      e.auraTimer=3600;
      e._auraTelegraph=false;
      addDebuff(e.name==='VEILSCRIBE'?'silence':'weaken',2200);
      spawnRing(px,py,'#9da4ff',10,16,false);
      msg(e.name==='VEILSCRIBE'?'👁️ VEILSCRIPT! Your skills are disrupted.':'💀 SHADOW MARK! Your strikes weaken.',1500);
    }
  }
}

// ── HELPERS ────────────────────────────────────────────────
function msg(txt,dur=2500){const el=document.getElementById('msg');el.innerHTML=txt;el.style.opacity=1;clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity=0,dur);}
function spawnParticle(x,y,col,n=7,isW=true,style='spark'){
  for(let i=0;i<n;i++){
    let a=Math.random()*Math.PI*2,s=1+Math.random()*3;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,col,life:1,sz:2+Math.random()*3,isW,style,rot:Math.random()*Math.PI*2});
  }
}
function spawnRing(x,y,col,count=14,r=10,isW=true){
  for(let i=0;i<count;i++){
    let a=(Math.PI*2/count)*i;
    particles.push({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,vx:Math.cos(a)*(1.5+Math.random()*1.8),vy:Math.sin(a)*(1.5+Math.random()*1.8),col,life:1,sz:2.2+Math.random()*1.8,isW,style:'rune',rot:a});
  }
}
function spawnTrail(x,y,col,isW=true,count=5,spread=10){
  for(let i=0;i<count;i++)particles.push({x:x+(Math.random()-.5)*spread,y:y+(Math.random()-.5)*spread,vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.8,col,life:.75,sz:2+Math.random()*2,isW,style:'mist',rot:0});
}
function bossFamilySigColor(family){
  return family==='grave'?'#d0b6ff':family==='ember'?'#ff7a2f':family==='serpent'?'#61d36d':family==='wolf'?'#f3deb0':'#a7a7ff';
}
function telegraphBossAttack(x,y,family,label='WARNING',size=18){
  let col=bossFamilySigColor(family);
  spawnRing(x,y,col,family==='ember'?20:16,size,false);
  spawnTrail(x,y,col,false,family==='serpent'?16:12,family==='wolf'?22:18);
  if(family==='ember')spawnParticle(x,y,'#ffb37a',10,false,'spark');
  if(family==='seer'||family==='shadow'||family==='veil')spawnParticle(x,y,'#cfd3ff',8,false,'rune');
  if(family==='grave')spawnParticle(x,y,'#d0b6ff',8,false,'mist');
  floatText(label,x,y-22,col,12);
}
function spawnKillEffect(e,isDungeonKill){
  let boss=e===bossRef||e.isBoss;
  let elite=e.isElite;
  let baseCol=boss?'#ff5a3c':elite?'#f8da82':e.col;
  spawnParticle(e.x,e.y,baseCol,boss?28:elite?18:10,!isDungeonKill,boss?'rune':'spark');
  spawnRing(e.x,e.y,baseCol,boss?28:elite?18:10,boss?30:elite?20:12,!isDungeonKill);
  if(boss){
    spawnTrail(e.x,e.y,'#ff8a5b',!isDungeonKill,20,42);
    floatText('FINISH',e.x,e.y-28,'#ffd7a8',20);
  }else if(elite){
    spawnTrail(e.x,e.y,'#f8da82',!isDungeonKill,12,24);
    floatText('ELITE',e.x,e.y-22,'#f8da82',16);
  }
}
function applyEnemyHitFeedback(e,dirX=0,dirY=0,col='#ffffff',heavy=false){
  if(!e)return;
  e.hitFlash=Math.max(e.hitFlash||0,heavy?220:150);
  e.hitColor=col;
  let push=heavy?7:4;
  e.hitKickX=(e.hitKickX||0)+dirX*push;
  e.hitKickY=(e.hitKickY||0)+dirY*push;
}
function addScreenShake(power=1,duration=90){
  screenShake.time=Math.max(screenShake.time,duration);
  screenShake.power=Math.max(screenShake.power,power);
}
function floatText(txt,x,y,col='#ffd700',sz=13){floaters.push({txt,x,y,col,sz,life:1,vy:-0.9});}
function normKey(key){return key.length===1?key.toLowerCase():key.toLowerCase();}
function classMod(name,fallback=0){return P.classMods?.[name]??fallback;}
function getSkillInfo(i){
  let info={...SKILL_INFO[i]};
  if(P.classId==='berserker'&&i===3)info.base+=' Berserker bonus: longer rage, lower mana cost.';
  if(P.classId==='ranger'&&i===0)info.base+=' Ranger bonus: the fan pattern works well for opening volleys and repositioning.';
  if(P.classId==='runecaster'&&i<4)info.base+=' Runecaster bonus: skills hit harder and recover faster.';
  if(P.classId==='guardian'&&i===2)info.base+=' Guardian bonus: Frost Nova becomes a strong zone-control tool.';
  if(P.perks.some(p=>p.name==='Tempest Calling')&&i===1)info.base+=' Perk bonus: Wrath reaches farther and lashes extra targets.';
  if(P.perks.some(p=>p.name==='Winter\'s Bite')&&i===2)info.base+=' Perk bonus: already chilled enemies burst harder.';
  if(P.perks.some(p=>p.name==='Seidr Surge'))info.base+=' Perk bonus: casting this empowers your attacks briefly.';
  return info;
}
function showHtmlTip(html,e){
  let tip=document.getElementById('tooltip');tip.innerHTML=html;tip.style.display='block';
  tip.style.left=(e.clientX+16)+'px';tip.style.top=(e.clientY-10)+'px';
  requestAnimationFrame(()=>{let r=tip.getBoundingClientRect();if(r.right>window.innerWidth)tip.style.left=(e.clientX-r.width-8)+'px';if(r.bottom>window.innerHeight)tip.style.top=(e.clientY-r.height+10)+'px';});
}
function showSkillTip(i,e){
  if(i===4){showHtmlTip(`<div class="tip-title">🧪 Healing Potion</div><div class="tip-rarity" style="color:#ff4488">CONSUMABLE</div><hr class="tip-divider"><div class="tip-stat"><span>Quick use</span><span>${countPotions()} ready</span></div><hr class="tip-divider"><div style="color:#555;font-size:11px">Uses the first healing potion in your bag.</div>`,e);return;}
  let info=getSkillInfo(i),costMult=i===3?classMod('rageCost',1):classMod('skillCost',1);
  let cdMult=classMod('skillCooldown',1);
  showHtmlTip(`<div class="tip-title">${info.icon} ${info.name}</div><div class="tip-rarity" style="color:#c8a000">${P.className||'Warrior'} Skill</div><hr class="tip-divider"><div class="tip-stat"><span>Mana</span><span>${Math.ceil(info.mana*costMult)}</span></div><div class="tip-stat"><span>Cooldown</span><span>${(info.cd*cdMult).toFixed(1)}s</span></div><hr class="tip-divider"><div style="color:#aaa;line-height:1.5">${info.base}</div>`,e);
}
function initSkillbarTooltips(){
  let nodes=document.querySelectorAll('#skillbar .sk');
  nodes.forEach((node,i)=>{node.onmouseenter=e=>showSkillTip(i,e);node.onmouseleave=hideTip;});
}
const ART={
  gold:'#d7b15c',
  goldHot:'#f8da82',
  steel:'#7f8aa8',
  ember:'#d86c2f',
  frost:'#8ecaf4',
  rune:'#9f8cff',
  poison:'#61d36d',
  shadow:'rgba(0,0,0,.34)'
};
function pulse(speed=800,offset=0,min=.75,max=1){
  let t=(Math.sin(Date.now()/speed+offset)+1)/2;
  return min+(max-min)*t;
}
function drawGlow(x,y,r,col,a=.25){
  let g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,col.replace('rgb','rgba').replace(')',`,`+a+')'));
  g.addColorStop(.45,col.replace('rgb','rgba').replace(')',`,`+(a*.42)+')'));
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;
  ctx.fillRect(x-r,y-r,r*2,r*2);
}
function drawShadow(x,y,rx,ry,alpha=.28){
  ctx.fillStyle=`rgba(0,0,0,${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);
  ctx.fill();
}
function drawLootSprite(l,sx,sy){
  let bob=Math.sin(Date.now()/260+l.x*.05+l.y*.05)*2.5;
  ctx.save();
  drawShadow(sx,sy+12,10,4,.22);
  if(l.isGold){
    drawGlow(sx,sy+3+bob,20,'rgb(248,218,130)',.18);
    ctx.font='16px sans-serif';
    ctx.textAlign='center';
    ctx.fillText('💰',sx,sy+5+bob);
  }else{
    let glow={legendary:'rgb(255,140,0)',epic:'rgb(159,140,255)',rare:'rgb(80,136,255)',common:'rgb(190,194,210)'}[l.rarity]||'rgb(190,194,210)';
    if(l.type==='potion')glow='rgb(255,94,170)';
    drawGlow(sx,sy+3+bob,22,glow,.16);
    ctx.shadowColor=glow;
    ctx.shadowBlur=l.type==='potion'?10:12;
    ctx.font='17px sans-serif';
    ctx.textAlign='center';
    ctx.fillText(l.icon,sx,sy+5+bob);
  }
  ctx.restore();
}
function drawEnemyFigure(e,sx,sy){
  // Use sprite-based rendering if assets are loaded
  if (AssetLoader && AssetLoader.isLoaded) {
    drawEnemySprite(e, sx, sy);
    return;
  }
  
  // Fallback to old procedural method if assets not loaded
  ctx.save();
  let hitAmt=Math.max(0,Math.min(1,(e.hitFlash||0)/220));
  sx+=(e.hitKickX||0);
  sy+=(e.hitKickY||0);
  let frozen=e.froze>0;
  let elite=e.isElite;
  let boss=e===bossRef;
  let stepSeed=(e.id||1)*0.37;
  let walkPhase=Date.now()/(boss?180:140)+stepSeed;
  let stride=Math.sin(walkPhase)*(boss?4.5:3.2);
  let bob=Math.cos(walkPhase*2)*(boss?1.8:1.1);
  let toPlayerX=((inDungeon?dPlayer.x:P.x)-e.x)||1;
  let facing=toPlayerX>=0?1:-1;
  sy+=bob;
  let px=(inDungeon?dPlayer.x:P.x)-((e.isDungeon?dCam.x:cam.x)||0);
  let py=(inDungeon?dPlayer.y:P.y)-((e.isDungeon?dCam.y:cam.y)||0);
  let distToPlayer=Math.hypot((inDungeon?dPlayer.x:P.x)-e.x,(inDungeon?dPlayer.y:P.y)-e.y);
  let rangedWindup=e.range>40&&e.shotTimer>0&&e.shotTimer<520&&distToPlayer<e.range+180;
  let meleeWindup=e.range<=40&&e.shotTimer>0&&e.shotTimer<360&&distToPlayer<e.range+70;
  if(frozen){ctx.shadowColor=ART.frost;ctx.shadowBlur=12;}
  if(boss&&e.phase===2){ctx.shadowColor='#ff2200';ctx.shadowBlur=20;}
  if(elite){ctx.shadowColor=ART.goldHot;ctx.shadowBlur=14;}
  if(hitAmt>0){ctx.shadowColor=e.hitColor||'#ffffff';ctx.shadowBlur=Math.max(ctx.shadowBlur||0,10+hitAmt*10);}
  if(boss){
    drawGlow(sx,sy,e.sz*2.2,e.phase===2?'rgb(216,48,36)':'rgb(215,177,92)',e.phase===2 ? .14 : .08);
    ctx.strokeStyle=e.phase===2?'rgba(255,80,60,.22)':'rgba(248,218,130,.16)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(sx,sy,e.sz+10+pulse(220,e.id,0,4),0,Math.PI*2);
    ctx.stroke();
  }
  if(rangedWindup){
    let amt=1-e.shotTimer/520;
    ctx.strokeStyle=boss?`rgba(255,90,60,${.22+amt*.35})`:`rgba(255,210,120,${.18+amt*.22})`;
    ctx.lineWidth=boss?4:2;
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.lineTo(px,py);
    ctx.stroke();
    ctx.fillStyle=boss?`rgba(255,70,50,${.12+amt*.14})`:`rgba(255,210,120,${.08+amt*.1})`;
    ctx.beginPath();
    ctx.arc(px,py,boss?18+amt*16:10+amt*8,0,Math.PI*2);
    ctx.fill();
  }
  if(meleeWindup){
    let amt=1-e.shotTimer/360;
    ctx.strokeStyle=boss?`rgba(255,90,60,${.2+amt*.32})`:`rgba(255,170,120,${.14+amt*.18})`;
    ctx.lineWidth=boss?5:3;
    ctx.beginPath();
    ctx.arc(sx,sy,e.range+10+amt*14,0,Math.PI*2);
    ctx.stroke();
  }
  drawShadow(sx,sy+e.sz*.82,e.sz*.95,e.sz*.34,.28);
  let name=(e.name||'').toLowerCase();
  if(name.includes('wolf')||name.includes('fenrir')){
    let bodyLen=e.sz*1.45;
    let headX=sx+facing*e.sz*.85;
    ctx.strokeStyle='#2f2219';
    ctx.lineWidth=3.2;
    ctx.lineCap='round';
    [-0.55,-0.12,0.22,0.6].forEach((off,i)=>{
      let legStride=(i%2===0?stride:-stride)*0.7;
      let lx=sx+e.sz*off;
      ctx.beginPath();
      ctx.moveTo(lx,sy+e.sz*.2);
      ctx.lineTo(lx-legStride*.18,sy+e.sz*.72);
      ctx.stroke();
    });
    ctx.strokeStyle='rgba(255,255,255,.12)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(sx-bodyLen*.48,sy-e.sz*.02);
    ctx.quadraticCurveTo(sx,sy-e.sz*.48,sx+bodyLen*.38,sy-e.sz*.08);
    ctx.stroke();
    ctx.fillStyle=e.col;
    ctx.beginPath();ctx.ellipse(sx,sy,e.sz*.98,e.sz*.54,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(headX,sy-e.sz*.18,e.sz*.44,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#241511';
    ctx.beginPath();ctx.moveTo(headX+facing*e.sz*.04,sy-e.sz*.48);ctx.lineTo(headX+facing*e.sz*.26,sy-e.sz*.94);ctx.lineTo(headX-facing*e.sz*.05,sy-e.sz*.62);ctx.fill();
    ctx.beginPath();ctx.moveTo(headX-facing*e.sz*.22,sy-e.sz*.42);ctx.lineTo(headX-facing*e.sz*.02,sy-e.sz*.86);ctx.lineTo(headX-facing*e.sz*.34,sy-e.sz*.58);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.2)';
    ctx.beginPath();ctx.arc(headX+facing*e.sz*.16,sy-e.sz*.2,e.sz*.09,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(15,10,10,.8)';
    ctx.beginPath();ctx.arc(headX+facing*e.sz*.13,sy-e.sz*.2,e.sz*.05,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(18,12,10,.72)';
    ctx.beginPath();
    ctx.moveTo(headX+facing*e.sz*.2,sy-e.sz*.02);
    ctx.lineTo(headX+facing*e.sz*.38,sy+e.sz*.06);
    ctx.lineTo(headX+facing*e.sz*.16,sy+e.sz*.12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='rgba(245,234,212,.16)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(headX-facing*e.sz*.02,sy-e.sz*.22);
    ctx.lineTo(headX+facing*e.sz*.22,sy-e.sz*.12);
    ctx.stroke();
    ctx.strokeStyle='rgba(34,20,16,.6)';
    ctx.beginPath();
    ctx.moveTo(headX+facing*e.sz*.18,sy+e.sz*.02);
    ctx.lineTo(headX+facing*e.sz*.3,sy+e.sz*.08);
    ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.beginPath();ctx.ellipse(sx-e.sz*.1,sy-e.sz*.32,e.sz*.34,e.sz*.12,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.1)';
    ctx.beginPath();ctx.ellipse(sx+e.sz*.08,sy-e.sz*.02,e.sz*.42,e.sz*.18,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(245,235,215,.14)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(sx-e.sz*.36,sy-e.sz*.14);
    ctx.lineTo(sx-e.sz*.06,sy-e.sz*.04);
    ctx.lineTo(sx+e.sz*.24,sy-e.sz*.12);
    ctx.stroke();
    ctx.fillStyle='rgba(255,120,90,.18)';
    ctx.beginPath();ctx.arc(headX+facing*e.sz*.22,sy-e.sz*.18,e.sz*.16,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(38,18,14,.75)';
    ctx.lineWidth=1.3;
    ctx.beginPath();
    ctx.moveTo(headX+facing*e.sz*.18,sy-e.sz*.04);
    ctx.lineTo(headX+facing*e.sz*.32,sy+e.sz*.04);
    ctx.stroke();
    ctx.strokeStyle='#2a1a14';
    ctx.lineWidth=2.4;
    ctx.beginPath();
    ctx.moveTo(sx-bodyLen*.82,sy-e.sz*.12);
    ctx.quadraticCurveTo(sx-bodyLen*.96,sy-e.sz*.45,sx-bodyLen*.7,sy-e.sz*.6+stride*.08);
    ctx.stroke();
    if(boss){
      ctx.strokeStyle='rgba(255,244,214,.24)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.arc(sx,sy,e.sz*1.18,Math.PI*.15,Math.PI*.85);
      ctx.stroke();
      ctx.fillStyle='rgba(255,244,214,.08)';
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.14,sy-e.sz*.82);
      ctx.lineTo(sx,sy-e.sz*1.02);
      ctx.lineTo(sx+e.sz*.14,sy-e.sz*.82);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle='rgba(255,244,214,.18)';
      ctx.lineWidth=1.2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.42,sy-e.sz*.44);
      ctx.lineTo(sx-e.sz*.12,sy-e.sz*.7);
      ctx.moveTo(sx+e.sz*.12,sy-e.sz*.7);
      ctx.lineTo(sx+e.sz*.42,sy-e.sz*.44);
      ctx.stroke();
      ctx.strokeStyle='rgba(255,228,180,.18)';
      ctx.lineWidth=2.4;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.72,sy-e.sz*.16);
      ctx.lineTo(sx-e.sz*.34,sy-e.sz*.56);
      ctx.lineTo(sx+e.sz*.04,sy-e.sz*.42);
      ctx.lineTo(sx+e.sz*.42,sy-e.sz*.56);
      ctx.lineTo(sx+e.sz*.76,sy-e.sz*.14);
      ctx.stroke();
      ctx.fillStyle='rgba(255,235,200,.1)';
      ctx.beginPath();
      ctx.arc(headX+facing*e.sz*.2,sy-e.sz*.18,e.sz*.22,0,Math.PI*2);
      ctx.fill();
    }
  }else if(name.includes('jormungandr')){
    drawGlow(sx,sy,e.sz*1.7,'rgb(97,211,109)',.08);
    ctx.strokeStyle=e.col;
    ctx.lineWidth=e.sz*.42;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(sx-e.sz*.95,sy+e.sz*.35);
    ctx.quadraticCurveTo(sx-e.sz*.4,sy-e.sz*.85,sx+e.sz*.4,sy-e.sz*.1);
    ctx.quadraticCurveTo(sx+e.sz*.92,sy+e.sz*.4,sx+e.sz*.15,sy+e.sz*.8);
    ctx.stroke();
    ctx.fillStyle=e.col;
    ctx.beginPath();ctx.ellipse(sx+e.sz*.48,sy-e.sz*.18,e.sz*.42,e.sz*.3,-.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#d9f8d9';
    ctx.beginPath();ctx.arc(sx+e.sz*.62,sy-e.sz*.22,e.sz*.06,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#14351a';
    ctx.beginPath();ctx.arc(sx+e.sz*.62,sy-e.sz*.22,e.sz*.03,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(18,42,22,.7)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx+e.sz*.58,sy-e.sz*.1);ctx.lineTo(sx+e.sz*.74,sy-e.sz*.04);ctx.stroke();
    ctx.strokeStyle='rgba(185,255,185,.24)';
    ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(sx+e.sz*.08,sy+e.sz*.08,e.sz*.92,Math.PI*.8,Math.PI*1.9);ctx.stroke();
    if(boss){
      ctx.strokeStyle='rgba(214,255,214,.2)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.42,sy+e.sz*.44);
      ctx.lineTo(sx-e.sz*.12,sy+e.sz*.66);
      ctx.lineTo(sx+e.sz*.3,sy+e.sz*.54);
      ctx.stroke();
      ctx.strokeStyle='rgba(214,255,214,.16)';
      ctx.lineWidth=2.2;
      ctx.beginPath();
      ctx.moveTo(sx+e.sz*.34,sy-e.sz*.44);
      ctx.lineTo(sx+e.sz*.52,sy-e.sz*.72);
      ctx.lineTo(sx+e.sz*.68,sy-e.sz*.42);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx+e.sz*.18,sy-e.sz*.36);
      ctx.lineTo(sx+e.sz*.3,sy-e.sz*.6);
      ctx.lineTo(sx+e.sz*.44,sy-e.sz*.34);
      ctx.stroke();
      ctx.fillStyle='rgba(190,255,190,.08)';
      ctx.beginPath();
      ctx.arc(sx+e.sz*.08,sy+e.sz*.2,e.sz*.2,0,Math.PI*2);
      ctx.fill();
    }
  }else if(name.includes('dark elf')||name.includes('hel')){
    drawGlow(sx,sy-e.sz*.18,e.sz*1.5,'rgb(159,140,255)',.08);
    ctx.fillStyle='rgba(34,20,46,.56)';
    ctx.beginPath();
    ctx.moveTo(sx,sy-e.sz*1.02);
    ctx.lineTo(sx-e.sz*.92,sy+e.sz*.8);
    ctx.lineTo(sx+e.sz*.92,sy+e.sz*.8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='#22141f';
    ctx.lineWidth=3;
    ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(sx-e.sz*.26,sy+e.sz*.1);ctx.lineTo(sx-e.sz*.34-stride*.08,sy+e.sz*.78);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+e.sz*.26,sy+e.sz*.1);ctx.lineTo(sx+e.sz*.34+stride*.08,sy+e.sz*.78);ctx.stroke();
    ctx.fillStyle=e.col;
    ctx.beginPath();
    ctx.moveTo(sx,sy-e.sz*.98);
    ctx.lineTo(sx-e.sz*.76,sy+e.sz*.68);
    ctx.lineTo(sx+e.sz*.76,sy+e.sz*.68);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(sx-e.sz*.34,sy-e.sz*.26,e.sz*.68,e.sz*.58);
    ctx.fillStyle='rgba(58,34,78,.36)';
    ctx.fillRect(sx-e.sz*.22,sy-e.sz*.08,e.sz*.44,e.sz*.56);
    ctx.beginPath();
    ctx.moveTo(sx-e.sz*.72,sy-e.sz*.3);
    ctx.lineTo(sx-e.sz*.26,sy-e.sz*.06);
    ctx.lineTo(sx-e.sz*.28,sy+e.sz*.18);
    ctx.lineTo(sx-e.sz*.78,sy+e.sz*.04);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(sx+e.sz*.72,sy-e.sz*.3);
    ctx.lineTo(sx+e.sz*.26,sy-e.sz*.06);
    ctx.lineTo(sx+e.sz*.28,sy+e.sz*.18);
    ctx.lineTo(sx+e.sz*.78,sy+e.sz*.04);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.14)';
    ctx.fillRect(sx-e.sz*.15,sy-e.sz*.02,e.sz*.3,e.sz*.3);
    ctx.fillStyle='rgba(255,255,255,.07)';
    ctx.fillRect(sx-e.sz*.34,sy-e.sz*.34,e.sz*.68,3);
    ctx.fillStyle='rgba(95,72,122,.22)';
    ctx.fillRect(sx-e.sz*.24,sy-e.sz*.16,e.sz*.48,e.sz*.48);
    ctx.fillStyle='#d8c39c';
    ctx.beginPath();ctx.arc(sx,sy-e.sz*.5,e.sz*.24,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(52,24,62,.9)';
    ctx.beginPath();
    ctx.moveTo(sx-e.sz*.32,sy-e.sz*.54);
    ctx.lineTo(sx,sy-e.sz*.9);
    ctx.lineTo(sx+e.sz*.32,sy-e.sz*.54);
    ctx.quadraticCurveTo(sx,sy-e.sz*.28,sx-e.sz*.32,sy-e.sz*.54);
    ctx.fill();
    ctx.fillStyle='rgba(255,236,220,.12)';
    ctx.fillRect(sx-e.sz*.13,sy-e.sz*.66,e.sz*.26,3);
    ctx.fillStyle='#100d14';
    ctx.beginPath();ctx.arc(sx-e.sz*.08,sy-e.sz*.5,e.sz*.045,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(sx+e.sz*.08,sy-e.sz*.5,e.sz*.045,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(110,74,62,.24)';
    ctx.beginPath();ctx.arc(sx,sy-e.sz*.45,e.sz*.026,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(20,16,22,.7)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(sx-e.sz*.08,sy-e.sz*.36);ctx.lineTo(sx+e.sz*.08,sy-e.sz*.36);ctx.stroke();
    ctx.strokeStyle='rgba(74,44,88,.58)';
    ctx.beginPath();
    ctx.moveTo(sx-e.sz*.12,sy-e.sz*.58);ctx.lineTo(sx-e.sz*.01,sy-e.sz*.55);
    ctx.moveTo(sx+e.sz*.01,sy-e.sz*.55);ctx.lineTo(sx+e.sz*.12,sy-e.sz*.58);
    ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.08)';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(sx,sy-e.sz*.7);ctx.lineTo(sx+facing*e.sz*.54,sy-e.sz*.38);ctx.stroke();
    ctx.strokeStyle='rgba(95,72,122,.42)';
    ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(sx-e.sz*.42,sy-e.sz*.12);ctx.lineTo(sx-e.sz*.8,sy+e.sz*.24);ctx.moveTo(sx+e.sz*.42,sy-e.sz*.12);ctx.lineTo(sx+e.sz*.8,sy+e.sz*.24);ctx.stroke();
    ctx.fillStyle='#d8c39c';
    ctx.beginPath();ctx.arc(sx-e.sz*.54,sy+e.sz*.04,e.sz*.06,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(sx+e.sz*.54,sy+e.sz*.04,e.sz*.06,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(184,160,255,.5)';
    ctx.lineWidth=2.4;
    ctx.beginPath();
    ctx.moveTo(sx+facing*e.sz*.62,sy-e.sz*.18);
    ctx.lineTo(sx+facing*e.sz*1.02,sy+e.sz*.5);
    ctx.stroke();
    ctx.fillStyle='rgba(24,18,34,.9)';
    ctx.fillRect(sx+facing*e.sz*.98-2,sy-e.sz*.28,4,e.sz*.8);
    ctx.fillStyle='rgba(185,164,255,.24)';
    ctx.beginPath();ctx.arc(sx+facing*e.sz*.98,sy-e.sz*.34,e.sz*.14,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.18)';
    ctx.beginPath();ctx.arc(sx+facing*e.sz*.98,sy-e.sz*.34,e.sz*.06,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(122,184,255,.16)';
    ctx.beginPath();ctx.arc(sx,sy-e.sz*.36,e.sz*.08,0,Math.PI*2);ctx.fill();
    if(boss){
      ctx.strokeStyle='rgba(210,190,255,.22)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.82,sy+e.sz*.46);
      ctx.lineTo(sx-e.sz*.42,sy+e.sz*.22);
      ctx.lineTo(sx,sy+e.sz*.52);
      ctx.lineTo(sx+e.sz*.42,sy+e.sz*.22);
      ctx.lineTo(sx+e.sz*.82,sy+e.sz*.46);
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.05)';
      ctx.beginPath();
      ctx.moveTo(sx,sy-e.sz*.9);
      ctx.lineTo(sx-e.sz*.14,sy-e.sz*.66);
      ctx.lineTo(sx+e.sz*.14,sy-e.sz*.66);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle='rgba(220,210,255,.16)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.34,sy-e.sz*.78);
      ctx.lineTo(sx-e.sz*.12,sy-e.sz*1.12);
      ctx.lineTo(sx+e.sz*.04,sy-e.sz*.8);
      ctx.moveTo(sx+e.sz*.34,sy-e.sz*.78);
      ctx.lineTo(sx+e.sz*.12,sy-e.sz*1.12);
      ctx.lineTo(sx-e.sz*.04,sy-e.sz*.8);
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.08)';
      ctx.fillRect(sx-e.sz*.18,sy+e.sz*.36,e.sz*.36,6);
    }
    }else{
      let torsoTilt=facing*e.sz*.06;
      let humanoidScale=boss?1.08:1;
      let shoulder=e.sz*.62*humanoidScale;
      let heavyTarget=elite||boss;
      let casterTarget=e.range>40&&(name.includes('dark')||name.includes('veil')||name.includes('scribe')||name.includes('echo'));
      ctx.fillStyle=e.col;
    ctx.beginPath();
    ctx.moveTo(sx-torsoTilt,sy-e.sz*.82);
    ctx.lineTo(sx-shoulder,sy-e.sz*.12);
    ctx.lineTo(sx-e.sz*.48,sy+e.sz*.8);
    ctx.lineTo(sx+e.sz*.48,sy+e.sz*.8);
    ctx.lineTo(sx+shoulder,sy-e.sz*.12);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(sx-e.sz*.38,sy-e.sz*.08,e.sz*.76,e.sz*.62);
    ctx.beginPath();ctx.arc(sx,sy-e.sz*.62,e.sz*.38,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(68,52,44,.28)';
    ctx.beginPath();ctx.arc(sx,sy-e.sz*.71,e.sz*.34,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-e.sz*.18,sy-e.sz*.12,e.sz*.36,e.sz*.42);
    ctx.fillStyle='rgba(255,255,255,.05)';
    ctx.fillRect(sx-e.sz*.3,sy-e.sz*.02,e.sz*.6,3);
    ctx.fillStyle='rgba(45,30,24,.7)';
    ctx.fillRect(sx-e.sz*.29,sy+e.sz*.06,e.sz*.58,3);
    ctx.fillStyle='rgba(0,0,0,.12)';
    ctx.fillRect(sx-e.sz*.24,sy+e.sz*.3,e.sz*.48,e.sz*.3);
    ctx.fillStyle='rgba(255,255,255,.05)';
    ctx.fillRect(sx-e.sz*.42,sy-e.sz*.18,e.sz*.84,3);
    ctx.fillStyle='rgba(255,255,255,.04)';
    ctx.fillRect(sx-e.sz*.14,sy-e.sz*.08,e.sz*.28,3);
    ctx.fillStyle='rgba(255,255,255,.03)';
    ctx.fillRect(sx-e.sz*.44,sy-e.sz*.14,e.sz*.2,12);
    ctx.fillRect(sx+e.sz*.24,sy-e.sz*.14,e.sz*.2,12);
    ctx.fillStyle='rgba(0,0,0,.08)';
    ctx.fillRect(sx-e.sz*.2,sy+e.sz*.16,e.sz*.4,5);
    if(name.includes('skeleton')){
      ctx.fillStyle='rgba(230,225,205,.12)';
      ctx.fillRect(sx-e.sz*.12,sy-e.sz*.04,e.sz*.24,e.sz*.32);
    }else if(e.range>40){
      ctx.fillStyle='rgba(90,65,42,.16)';
      ctx.fillRect(sx-e.sz*.28,sy-e.sz*.04,e.sz*.18,e.sz*.46);
      ctx.fillStyle='rgba(181,139,82,.16)';
      ctx.fillRect(sx+e.sz*.08,sy-e.sz*.02,e.sz*.14,e.sz*.38);
    }else{
      ctx.fillStyle='rgba(110,118,136,.12)';
      ctx.fillRect(sx+e.sz*.1,sy-e.sz*.04,e.sz*.16,e.sz*.42);
      ctx.fillStyle='rgba(160,166,180,.08)';
      ctx.fillRect(sx-e.sz*.3,sy-e.sz*.02,e.sz*.12,e.sz*.3);
    }
    ctx.strokeStyle='rgba(25,15,10,.55)';
    ctx.lineWidth=4;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(sx-e.sz*.18,sy+e.sz*.12);
    ctx.lineTo(sx-e.sz*.36+stride*.18,sy+e.sz*.8);
    ctx.moveTo(sx+e.sz*.18,sy+e.sz*.12);
    ctx.lineTo(sx+e.sz*.36-stride*.18,sy+e.sz*.8);
    ctx.moveTo(sx-e.sz*.34,sy-e.sz*.02);
    ctx.lineTo(sx-e.sz*.7-stride*.02,sy+e.sz*.3);
    ctx.moveTo(sx+e.sz*.34,sy-e.sz*.02);
    ctx.lineTo(sx+e.sz*.7+stride*.02,sy+e.sz*.3);
    ctx.stroke();
    if(e.range>40){
      if(casterTarget){
        ctx.fillStyle='rgba(60,36,82,.52)';
        ctx.beginPath();
        ctx.moveTo(sx-e.sz*.36,sy-e.sz*.64);
        ctx.lineTo(sx,sy-e.sz*.98);
        ctx.lineTo(sx+e.sz*.36,sy-e.sz*.64);
        ctx.lineTo(sx+e.sz*.18,sy-e.sz*.32);
        ctx.lineTo(sx-e.sz*.18,sy-e.sz*.32);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle='rgba(210,195,255,.08)';
        ctx.fillRect(sx-e.sz*.12,sy-e.sz*.3,e.sz*.24,8);
        ctx.strokeStyle='rgba(178,154,255,.62)';
        ctx.lineWidth=2.2;
        ctx.beginPath();
        ctx.moveTo(sx+facing*e.sz*.48,sy-e.sz*.2);
        ctx.lineTo(sx+facing*e.sz*.88,sy+e.sz*.44);
        ctx.stroke();
        ctx.fillStyle='rgba(185,164,255,.28)';
        ctx.beginPath();ctx.arc(sx+facing*e.sz*.9,sy-e.sz*.28,e.sz*.12,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.16)';
        ctx.beginPath();ctx.arc(sx+facing*e.sz*.9,sy-e.sz*.28,e.sz*.05,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(215,195,255,.18)';
        ctx.fillRect(sx+facing*e.sz*.16,sy-e.sz*.14,6,14);
        ctx.fillStyle='rgba(52,34,74,.34)';
        ctx.fillRect(sx-facing*e.sz*.22,sy-e.sz*.16,6,14);
      }else{
        ctx.strokeStyle='#b18b52';
        ctx.lineWidth=2.2;
        ctx.beginPath();
        ctx.arc(sx+facing*e.sz*.52,sy-e.sz*.02,e.sz*.22,Math.PI/2,Math.PI*1.5);
        ctx.stroke();
        ctx.strokeStyle='rgba(255,244,214,.5)';
        ctx.lineWidth=1.2;
        ctx.beginPath();
        ctx.moveTo(sx+facing*e.sz*.52,sy-e.sz*.24);
        ctx.lineTo(sx+facing*e.sz*.52,sy+e.sz*.2);
        ctx.stroke();
        ctx.fillStyle='rgba(240,220,170,.18)';
        ctx.fillRect(sx+facing*e.sz*.18,sy-e.sz*.12,5,12);
        ctx.fillStyle='rgba(255,255,255,.07)';
        ctx.fillRect(sx+facing*e.sz*.3,sy-e.sz*.22,6,4);
      }
    }else{
      ctx.fillStyle='rgba(155,162,178,.08)';
      ctx.fillRect(sx-e.sz*.38,sy-e.sz*.18,e.sz*.18,10);
      ctx.fillRect(sx+e.sz*.2,sy-e.sz*.18,e.sz*.18,10);
      ctx.strokeStyle='rgba(190,190,205,.65)';
      ctx.lineWidth=2.2;
      ctx.beginPath();
      ctx.moveTo(sx+facing*e.sz*.42,sy-e.sz*.02);
      ctx.lineTo(sx+facing*e.sz*.78,sy+e.sz*.12);
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.08)';
      ctx.fillRect(sx+facing*e.sz*.28,sy-e.sz*.08,5,10);
      ctx.fillStyle='rgba(0,0,0,.14)';
      ctx.fillRect(sx-facing*e.sz*.18,sy-e.sz*.18,4,14);
    }
    if(name.includes('fire')||name.includes('surtr')){
      drawGlow(sx,sy-e.sz*.2,e.sz*1.35,'rgb(216,108,47)',.16);
      ctx.fillStyle='#2a0f0b';
      ctx.beginPath();ctx.moveTo(sx-e.sz*.24,sy-e.sz*.96);ctx.lineTo(sx-e.sz*.06,sy-e.sz*1.34);ctx.lineTo(sx+e.sz*.08,sy-e.sz*.86);ctx.fill();
      ctx.beginPath();ctx.moveTo(sx+e.sz*.18,sy-e.sz*.96);ctx.lineTo(sx+e.sz*.38,sy-e.sz*1.28);ctx.lineTo(sx+e.sz*.45,sy-e.sz*.78);ctx.fill();
      ctx.strokeStyle='rgba(255,170,90,.28)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.46,sy+e.sz*.26);
      ctx.lineTo(sx,sy+e.sz*.58);
      ctx.lineTo(sx+e.sz*.46,sy+e.sz*.26);
      ctx.stroke();
      if(boss){
        ctx.fillStyle='rgba(255,170,90,.12)';
        ctx.fillRect(sx-e.sz*.18,sy-e.sz*.76,e.sz*.36,8);
      }
    }
    if(name.includes('skeleton')){
      ctx.fillStyle='#e8e1ca';
      ctx.beginPath();ctx.arc(sx,sy-e.sz*.55,e.sz*.24,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#261f1f';
      ctx.beginPath();ctx.arc(sx-e.sz*.08,sy-e.sz*.58,e.sz*.05,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+e.sz*.08,sy-e.sz*.58,e.sz*.05,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(235,229,208,.3)';
      ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(sx,sy-e.sz*.3);ctx.lineTo(sx,sy+e.sz*.18);ctx.moveTo(sx-e.sz*.14,sy-e.sz*.12);ctx.lineTo(sx+e.sz*.14,sy-e.sz*.12);ctx.stroke();
    }else{
      ctx.fillStyle='rgba(230,210,188,.88)';
      ctx.beginPath();ctx.arc(sx,sy-e.sz*.57,e.sz*.17,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,232,214,.14)';
      ctx.fillRect(sx-e.sz*.08,sy-e.sz*.72,e.sz*.16,3);
      ctx.fillStyle='rgba(255,255,255,.14)';
      ctx.fillRect(sx-e.sz*.08,sy-e.sz*.71,e.sz*.16,2);
      ctx.fillStyle='#151117';
      ctx.beginPath();ctx.arc(sx-e.sz*.06,sy-e.sz*.6,e.sz*.03,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+e.sz*.06,sy-e.sz*.6,e.sz*.03,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(110,74,62,.22)';
      ctx.beginPath();ctx.arc(sx,sy-e.sz*.54,e.sz*.026,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(42,26,24,.7)';
      ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.06,sy-e.sz*.48);
      ctx.quadraticCurveTo(sx,sy-e.sz*.44,sx+e.sz*.06,sy-e.sz*.48);
      ctx.stroke();
      ctx.strokeStyle='rgba(56,34,28,.52)';
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.11,sy-e.sz*.64);
      ctx.lineTo(sx-e.sz*.01,sy-e.sz*.61);
      ctx.moveTo(sx+e.sz*.01,sy-e.sz*.61);
      ctx.lineTo(sx+e.sz*.11,sy-e.sz*.64);
      ctx.stroke();
      if(name.includes('surtr')||name.includes('fire')){
        ctx.fillStyle='rgba(255,130,75,.28)';
        ctx.beginPath();ctx.arc(sx,sy-e.sz*.66,e.sz*.08,0,Math.PI*2);ctx.fill();
      }
      if(name.includes('odin')){
        ctx.fillStyle='rgba(122,184,255,.22)';
        ctx.beginPath();ctx.arc(sx+e.sz*.14*facing,sy-e.sz*.62,e.sz*.05,0,Math.PI*2);ctx.fill();
      }
      if(name.includes('dark')||name.includes('shadow')){
        ctx.fillStyle='rgba(159,140,255,.12)';
        ctx.fillRect(sx-e.sz*.18,sy-e.sz*.08,e.sz*.36,4);
      }
      if(heavyTarget){
        ctx.fillStyle='rgba(255,240,210,.05)';
        ctx.fillRect(sx-e.sz*.22,sy-e.sz*.2,e.sz*.44,4);
        ctx.fillStyle='rgba(0,0,0,.12)';
        ctx.fillRect(sx-e.sz*.24,sy+e.sz*.24,e.sz*.48,4);
        ctx.fillStyle='rgba(255,255,255,.05)';
        ctx.fillRect(sx-e.sz*.18,sy+e.sz*.03,e.sz*.36,3);
        ctx.fillStyle='rgba(20,14,14,.18)';
        ctx.fillRect(sx-e.sz*.1,sy+e.sz*.18,e.sz*.2,8);
      }
    }
    if(name.includes('odin')){
      drawGlow(sx,sy-e.sz*.2,e.sz*1.45,'rgb(142,202,244)',.08);
      ctx.strokeStyle='rgba(142,202,244,.26)';
      ctx.lineWidth=1.8;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.48,sy-e.sz*.92);
      ctx.lineTo(sx,sy-e.sz*1.18);
      ctx.lineTo(sx+e.sz*.48,sy-e.sz*.92);
      ctx.stroke();
      if(boss){
        ctx.fillStyle='rgba(142,202,244,.08)';
        ctx.fillRect(sx-e.sz*.26,sy-e.sz*.7,e.sz*.52,6);
      }
    }
    if(elite||boss){
      ctx.strokeStyle=boss?'rgba(255,214,130,.45)':'rgba(255,220,140,.28)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.44,sy-e.sz*.18);
      ctx.lineTo(sx+e.sz*.44,sy-e.sz*.18);
      ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.06)';
      ctx.fillRect(sx-e.sz*.22,sy-e.sz*.26,e.sz*.44,4);
      ctx.fillStyle=boss?'rgba(255,214,130,.08)':'rgba(255,220,140,.05)';
      ctx.fillRect(sx-e.sz*.34,sy-e.sz*.34,e.sz*.68,3);
      ctx.fillStyle='rgba(255,255,255,.04)';
      ctx.fillRect(sx-e.sz*.18,sy+e.sz*.08,e.sz*.36,3);
      ctx.fillStyle='rgba(255,225,160,.06)';
      ctx.fillRect(sx-e.sz*.22,sy-e.sz*.5,e.sz*.44,6);
      ctx.fillRect(sx-e.sz*.08,sy-e.sz*.64,e.sz*.16,5);
    }
    if(boss && !name.includes('fenrir') && !name.includes('jormungandr') && !name.includes('hel')){
      ctx.strokeStyle='rgba(255,230,180,.14)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx-e.sz*.56,sy-e.sz*.18);
      ctx.lineTo(sx-e.sz*.22,sy-e.sz*.54);
      ctx.lineTo(sx,sy-e.sz*.34);
      ctx.lineTo(sx+e.sz*.22,sy-e.sz*.54);
      ctx.lineTo(sx+e.sz*.56,sy-e.sz*.18);
      ctx.stroke();
      ctx.fillStyle='rgba(255,240,200,.08)';
      ctx.fillRect(sx-e.sz*.14,sy-e.sz*.82,e.sz*.28,8);
    }
  }
  if(hitAmt>0){
    ctx.fillStyle=`rgba(255,255,255,${0.08+hitAmt*0.16})`;
    ctx.beginPath();
    ctx.arc(sx,sy,e.sz*1.05,0,Math.PI*2);
    ctx.fill();
  }
  let bw=e.sz*2+6;
  ctx.fillStyle='#220000';
  ctx.fillRect(sx-bw/2,sy-e.sz-12,bw,6);
  ctx.fillStyle=elite?ART.goldHot:e.hp>e.maxHp*.5?'#5fde80':'#d6634b';
  ctx.fillRect(sx-bw/2,sy-e.sz-12,bw*(e.hp/e.maxHp),6);
  if(boss){
    ctx.strokeStyle=ART.goldHot;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(sx,sy,e.sz+5,0,Math.PI*2);
    ctx.stroke();
  }
  if(elite){
    ctx.strokeStyle='rgba(215,177,92,.45)';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.arc(sx,sy,e.sz+2.5,Math.PI*.2,Math.PI*.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sx,sy,e.sz+2.5,Math.PI*1.2,Math.PI*1.8);
    ctx.stroke();
    ctx.fillStyle='rgba(255,240,190,.18)';
    ctx.beginPath();
    ctx.arc(sx,sy-e.sz-7,5,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle=ART.goldHot;
    ctx.font='12px sans-serif';
    ctx.textAlign='center';
    ctx.fillText('✦',sx,sy-e.sz-13);
  }
  ctx.restore();
}
function drawPlayerFigure(sx,sy){
  let style={
    berserker:{body:'#9d4638',trim:'#e3b36d',glow:'rgb(216,108,47)'},
    ranger:{body:'#355541',trim:'#9fd27d',glow:'rgb(132,204,110)'},
    runecaster:{body:'#433768',trim:'#b9a4ff',glow:'rgb(159,140,255)'},
    guardian:{body:'#415264',trim:'#adc0d0',glow:'rgb(142,202,244)'}
  }[P.classId]||{body:'#7b6232',trim:'#f1d16a',glow:'rgb(215,177,92)'};
  ctx.save();
  let ws=getWeaponStyle();
  let fx=P.facing.x||1,fy=P.facing.y||0;
  let aimAng=Math.atan2(fy,fx);
  let isMelee=ws.id!=='bow'&&ws.id!=='arcane';
  let attackPose=Math.min(1,(P.attackPoseTimer||0)/170);
  let attackEase=1-Math.pow(1-attackPose,2);
  let side=P.facing.x>=0?1:-1;
  let moving=!!(keys['w']||keys['ArrowUp']||keys['s']||keys['ArrowDown']||keys['a']||keys['ArrowLeft']||keys['d']||keys['ArrowRight']);
  let runFactor=P.sprinting?1.5:1;
  let gaitTime=Date.now()/(moving?(P.sprinting?85:130):320);
  let stride=moving?Math.sin(gaitTime)*4*runFactor:0;
  let bob=moving?Math.abs(Math.cos(gaitTime*2))*1.8*runFactor:0;
  sy+=bob;
  let profile={
    blade:{rest:1.7,swing:-.5,reachIdle:6,reachAtk:18,bodyLean:3,carrySide:10},
    axe:{rest:2.05,swing:-.72,reachIdle:5,reachAtk:17,bodyLean:4,carrySide:12},
    hammer:{rest:2.2,swing:-.84,reachIdle:4,reachAtk:16,bodyLean:5,carrySide:12},
    dagger:{rest:1.15,swing:-.18,reachIdle:8,reachAtk:14,bodyLean:2,carrySide:8},
    pike:{rest:1.35,swing:-.06,reachIdle:10,reachAtk:22,bodyLean:2,carrySide:9},
    bow:{rest:.55,swing:.08,reachIdle:9,reachAtk:14,bodyLean:1,carrySide:6},
    arcane:{rest:.85,swing:.2,reachIdle:8,reachAtk:12,bodyLean:1,carrySide:5}
  }[ws.id]||{rest:1.6,swing:-.35,reachIdle:7,reachAtk:16,bodyLean:3,carrySide:10};
  let carryBase=side>0?.92:Math.PI-.92;
  let restAng=isMelee?carryBase+(profile.rest-1.7)*.45:aimAng+profile.rest;
  let swingAng=aimAng+profile.swing;
  let ang=restAng+(swingAng-restAng)*attackEase;
  let armReach=profile.reachIdle+(profile.reachAtk-profile.reachIdle)*attackEase;
  let handX=sx+Math.cos(ang)*armReach,handY=sy+Math.sin(ang)*armReach;
  let dirX=Math.cos(ang),dirY=Math.sin(ang);
  let offX=-dirY,offY=dirX;
  let leftHandX=sx-16-stride*.28,leftHandY=sy+7;
  let rightHandX=sx+14+stride*.18,rightHandY=sy+6;
  let bodyLean=profile.bodyLean*attackEase;
  let lunge=isMelee?attackEase*5:attackEase*2.5;
  let classScale=P.classId==='guardian'?1.08:P.classId==='berserker'?1.05:P.classId==='runecaster'?.98:1;
  sx+=fx*lunge;
  sy+=fy*lunge*.6;
  handX+=fx*lunge;
  handY+=fy*lunge*.6;
  if(P.rage)drawGlow(sx,sy,44,'rgb(216,108,47)',.18);
  if(P.debuffs.poison>0)drawGlow(sx,sy,34,'rgb(97,211,109)',.12);
  drawShadow(sx+fx*bodyLean*.6,sy+15,14+(moving?1.5:0),5+(moving?0.6:0),.3);
  ctx.fillStyle='rgba(22,17,22,.42)';
  ctx.beginPath();
  ctx.moveTo(sx-12,sy-8);
  ctx.lineTo(sx-19-side*2,sy+10);
  ctx.lineTo(sx-6,sy+12);
  ctx.closePath();
  ctx.fill();
  if(P.classId==='ranger'){
    ctx.fillStyle='rgba(24,34,22,.36)';
    ctx.beginPath();
    ctx.moveTo(sx+2,sy-10);
    ctx.lineTo(sx+12,sy+6);
    ctx.lineTo(sx+4,sy+12);
    ctx.closePath();
    ctx.fill();
  }
  if(P.classId==='runecaster'){
    ctx.fillStyle='rgba(185,164,255,.14)';
    ctx.beginPath();
    ctx.moveTo(sx,sy-18);
    ctx.lineTo(sx-14,sy+12);
    ctx.lineTo(sx+14,sy+12);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle='#241b18';
  ctx.lineWidth=4;
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(sx-5,sy+10);
  ctx.lineTo(sx-6-stride*.4,sy+21);
  ctx.moveTo(sx+5,sy+10);
  ctx.lineTo(sx+6+stride*.4,sy+21);
  ctx.stroke();
  ctx.strokeStyle='rgba(30,22,18,.75)';
  ctx.lineWidth=3.2;
  ctx.beginPath();
  ctx.moveTo(sx-8,sy-2);
  ctx.lineTo(leftHandX,leftHandY);
  ctx.moveTo(sx+8,sy-2);
  ctx.lineTo(rightHandX,rightHandY);
  ctx.stroke();
  ctx.fillStyle=style.body;
  ctx.beginPath();
  ctx.moveTo(sx+fx*bodyLean*.4,sy-18);
  ctx.lineTo(sx-13*classScale+fx*bodyLean*.2,sy+10);
  ctx.lineTo(sx+13*classScale+fx*bodyLean*.2,sy+10);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(sx-9*classScale+fx*bodyLean*.25,sy-5,18*classScale,16);
  ctx.fillStyle='rgba(255,255,255,.08)';
  ctx.beginPath();
  ctx.moveTo(sx+fx*bodyLean*.3,sy-16);
  ctx.lineTo(sx-4+fx*bodyLean*.15,sy+6);
  ctx.lineTo(sx+5+fx*bodyLean*.1,sy+6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.1)';
  ctx.fillRect(sx-7*classScale,sy+2,14*classScale,6);
  ctx.fillStyle='rgba(255,255,255,.04)';
  ctx.fillRect(sx-6*classScale,sy-2,12*classScale,2);
  ctx.fillStyle='rgba(0,0,0,.12)';
  ctx.fillRect(sx-8*classScale,sy+8,16*classScale,4);
  ctx.fillStyle='rgba(255,255,255,.05)';
  ctx.fillRect(sx-7*classScale,sy+4,14*classScale,2);
  ctx.fillStyle='rgba(28,20,18,.18)';
  ctx.fillRect(sx-3.5*classScale,sy+1,7*classScale,11);
  ctx.fillStyle='rgba(255,255,255,.04)';
  ctx.fillRect(sx-10*classScale,sy-1,5,11);
  ctx.fillRect(sx+5*classScale,sy-1,5,11);
  ctx.fillStyle=style.trim;
  ctx.beginPath();ctx.arc(sx+fx*bodyLean*.45,sy-17,8.4*classScale,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(72,55,42,.28)';
  ctx.beginPath();ctx.arc(sx+fx*bodyLean*.45,sy-19,7.5*classScale,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,236,220,.12)';
  ctx.fillRect(sx-5+fx*bodyLean*.2,sy-21.5,10,2.6);
  ctx.fillStyle='rgba(255,255,255,.16)';
  ctx.fillRect(sx-4+fx*bodyLean*.2,sy-21,8,2);
  ctx.fillStyle='#0f0f16';
  ctx.fillRect(sx-7+fx*bodyLean*.2,sy+11,4,9);
  ctx.fillRect(sx+3+fx*bodyLean*.2,sy+11,4,9);
    ctx.fillStyle='#161116';
    ctx.beginPath();ctx.arc(sx-3+fx*bodyLean*.45,sy-18,1.4,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(sx+3+fx*bodyLean*.45,sy-18,1.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(168,92,78,.25)';
    ctx.beginPath();ctx.arc(sx+fx*bodyLean*.45,sy-15.2,1.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(110,74,62,.2)';
    ctx.beginPath();ctx.arc(sx+fx*bodyLean*.45,sy-16.5,.55,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.14)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(sx-5+fx*bodyLean*.45,sy-20);
    ctx.lineTo(sx-1+fx*bodyLean*.45,sy-21);
    ctx.moveTo(sx+1+fx*bodyLean*.45,sy-21);
    ctx.lineTo(sx+5+fx*bodyLean*.45,sy-20);
    ctx.stroke();
    ctx.strokeStyle='rgba(24,18,18,.72)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(sx-3+fx*bodyLean*.45,sy-13);
    ctx.quadraticCurveTo(sx+fx*bodyLean*.45,sy-11,sx+3+fx*bodyLean*.45,sy-13);
    ctx.stroke();
    ctx.strokeStyle='rgba(66,40,34,.48)';
    ctx.beginPath();
    ctx.moveTo(sx-4.5+fx*bodyLean*.45,sy-19.3);
    ctx.lineTo(sx-.8+fx*bodyLean*.45,sy-18.5);
    ctx.moveTo(sx+.8+fx*bodyLean*.45,sy-18.5);
    ctx.lineTo(sx+4.5+fx*bodyLean*.45,sy-19.3);
    ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-5,sy-1,10,2);
  let hairCol=P.classId==='berserker'?'rgba(84,38,24,.55)':P.classId==='ranger'?'rgba(58,68,34,.46)':P.classId==='runecaster'?'rgba(96,78,132,.48)':'rgba(82,90,104,.42)';
  ctx.fillStyle=hairCol;
  ctx.beginPath();
  ctx.moveTo(sx-7+fx*bodyLean*.4,sy-20);
  ctx.lineTo(sx+fx*bodyLean*.45,sy-24.5);
  ctx.lineTo(sx+7+fx*bodyLean*.45,sy-20);
  ctx.lineTo(sx+4+fx*bodyLean*.45,sy-15.5);
  ctx.lineTo(sx-4+fx*bodyLean*.45,sy-15.5);
  ctx.closePath();
  ctx.fill();
  if(P.classId==='guardian'){
    ctx.fillStyle='rgba(188,205,220,.18)';
    ctx.fillRect(sx-8,sy-22,16,3);
  }else if(P.classId==='runecaster'){
    ctx.strokeStyle='rgba(210,195,255,.24)';
    ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.arc(sx+fx*bodyLean*.45,sy-18,11,Math.PI*.15,Math.PI*.85);
    ctx.stroke();
  }else if(P.classId==='ranger'){
    ctx.fillStyle='rgba(34,54,28,.42)';
    ctx.beginPath();
    ctx.moveTo(sx-7,sy-19);
    ctx.lineTo(sx,sy-24);
    ctx.lineTo(sx+6,sy-19);
    ctx.lineTo(sx+2,sy-15);
    ctx.lineTo(sx-2,sy-15);
    ctx.closePath();
    ctx.fill();
  }
  let gloveCol=P.classId==='guardian'?'#9fb6c8':P.classId==='runecaster'?'#b9a4ff':P.classId==='ranger'?'#9fd27d':'#e3b36d';
  ctx.fillStyle=gloveCol;
  ctx.beginPath();ctx.arc(leftHandX,leftHandY,2.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(rightHandX,rightHandY,2.4,0,Math.PI*2);ctx.fill();
  if(P.classId==='guardian'){
    ctx.fillStyle='rgba(173,192,208,.12)';
    ctx.fillRect(sx-10,sy+1,20,5);
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-8,sy-2,16,2);
  }else if(P.classId==='berserker'){
    ctx.fillStyle='rgba(216,108,47,.12)';
    ctx.fillRect(sx-9,sy+2,18,5);
    ctx.strokeStyle='rgba(255,180,120,.14)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(sx-6,sy+6);
    ctx.lineTo(sx+6,sy+2);
    ctx.stroke();
  }else if(P.classId==='runecaster'){
    ctx.fillStyle='rgba(185,164,255,.1)';
    ctx.fillRect(sx-8,sy+1,16,5);
    ctx.fillStyle='rgba(210,195,255,.08)';
    ctx.fillRect(sx-2,sy+1,4,10);
  }else if(P.classId==='ranger'){
    ctx.fillStyle='rgba(159,210,125,.09)';
    ctx.fillRect(sx-8,sy+1,16,5);
    ctx.strokeStyle='rgba(180,220,150,.12)';
    ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(sx-5,sy+6);
    ctx.lineTo(sx+5,sy+3);
    ctx.stroke();
  }
  if(P.classId==='guardian'){
    ctx.fillStyle='rgba(173,192,208,.16)';
    ctx.beginPath();
    ctx.moveTo(sx-10,sy-22);
    ctx.lineTo(sx-5,sy-27);
    ctx.lineTo(sx+5,sy-27);
    ctx.lineTo(sx+10,sy-22);
    ctx.closePath();
    ctx.fill();
  }else if(P.classId==='berserker'){
    ctx.fillStyle='rgba(92,48,30,.5)';
    ctx.beginPath();
    ctx.moveTo(sx-8,sy-24);
    ctx.lineTo(sx,sy-28);
    ctx.lineTo(sx+8,sy-24);
    ctx.lineTo(sx+4,sy-20);
    ctx.lineTo(sx-4,sy-20);
    ctx.closePath();
    ctx.fill();
  }else if(P.classId==='runecaster'){
    ctx.fillStyle='rgba(185,164,255,.16)';
    ctx.beginPath();
    ctx.moveTo(sx-6,sy-25);
    ctx.lineTo(sx,sy-29);
    ctx.lineTo(sx+6,sy-25);
    ctx.lineTo(sx+3,sy-20);
    ctx.lineTo(sx-3,sy-20);
    ctx.closePath();
    ctx.fill();
  }else if(P.classId==='ranger'){
    ctx.fillStyle='rgba(70,96,54,.44)';
    ctx.beginPath();
    ctx.moveTo(sx-9,sy-23);
    ctx.lineTo(sx-2,sy-27);
    ctx.lineTo(sx+8,sy-24);
    ctx.lineTo(sx+3,sy-20);
    ctx.lineTo(sx-6,sy-20);
    ctx.closePath();
    ctx.fill();
  }
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(sx+fx*bodyLean*.3,sy-1);
  ctx.lineTo(handX,handY);
  ctx.stroke();
  ctx.strokeStyle='rgba(30,22,18,.7)';
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(sx-fx*2,sy-1);
  ctx.lineTo(sx-12-side*2+stride*.12,sy+4);
  ctx.stroke();
  ctx.strokeStyle='#2c2118';
  ctx.fillStyle=ws.color||'#d7b15c';
  ctx.lineWidth=3;
  if(isMelee&&attackPose<.08){
    let sheathX=sx-dirX*6+offX*profile.carrySide,sheathY=sy+8-dirY*6+offY*profile.carrySide;
    ctx.globalAlpha=.9;
    if(ws.id==='hammer'){
      ctx.fillStyle='#7f889b';
      ctx.fillRect(sheathX-4,sheathY-6,8,12);
      ctx.fillStyle='rgba(255,255,255,.14)';
      ctx.fillRect(sheathX-2,sheathY-5,2,10);
    }else if(ws.id==='axe'){
      ctx.fillStyle='#8f9488';
      ctx.beginPath();ctx.ellipse(sheathX+offX*2,sheathY+offY*2,5,4,ang+.7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.14)';
      ctx.fillRect(sheathX+offX*1.5,sheathY+offY*1.5,2,6);
    }else if(ws.id==='pike'){
      ctx.strokeStyle='#8b7355';
      ctx.beginPath();ctx.moveTo(sheathX-dirX*10,sheathY-dirY*10);ctx.lineTo(sheathX+dirX*10,sheathY+dirY*10);ctx.stroke();
      ctx.strokeStyle='#c8d2da';
      ctx.beginPath();ctx.moveTo(sheathX+dirX*8,sheathY+dirY*8);ctx.lineTo(sheathX+dirX*11,sheathY+dirY*11);ctx.stroke();
    }else{
      ctx.strokeStyle=ws.id==='dagger'?'#cfd4dd':'#b9a786';
      ctx.beginPath();ctx.moveTo(sheathX-dirX*6,sheathY-dirY*6);ctx.lineTo(sheathX+dirX*8,sheathY+dirY*8);ctx.stroke();
      if(ws.id==='dagger'){
        ctx.strokeStyle='rgba(255,255,255,.18)';
        ctx.beginPath();ctx.moveTo(sheathX+dirX*1,sheathY+dirY*1);ctx.lineTo(sheathX+dirX*7,sheathY+dirY*7);ctx.stroke();
      }
    }
  }else if(ws.id==='bow'){
    ctx.strokeStyle='#7f5a34';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.arc(handX+dirX*5,handY+dirY*5,8,ang-1,ang+1);
    ctx.stroke();
    ctx.strokeStyle='rgba(255,244,214,.82)';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(handX+offX*6,handY+offY*6);
    ctx.lineTo(handX-offX*6,handY-offY*6);
    ctx.stroke();
    ctx.fillStyle='rgba(210,170,112,.2)';
    ctx.fillRect(handX+dirX*2-1,handY+dirY*2-1,3,6);
  }else if(ws.id==='arcane'){
    ctx.strokeStyle='#7d79a8';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(handX-dirX*2,handY-dirY*2);
    ctx.lineTo(handX+dirX*14,handY+dirY*14);
    ctx.stroke();
    drawGlow(handX+dirX*16,handY+dirY*16,10,style.glow,.1);
    ctx.fillStyle=style.trim;
    ctx.beginPath();ctx.arc(handX+dirX*16,handY+dirY*16,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.18)';
    ctx.fillRect(handX+dirX*6-1,handY+dirY*6-1,2,8);
  }else if(ws.id==='hammer'){
    ctx.strokeStyle='#7f664c';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(handX-dirX*2,handY-dirY*2);
    ctx.lineTo(handX+dirX*10,handY+dirY*10);
    ctx.stroke();
    ctx.save();
    ctx.translate(handX+dirX*12,handY+dirY*12);
    ctx.rotate(ang);
    ctx.fillStyle='#7e8898';
    ctx.fillRect(-3,-6,10,12);
    ctx.fillStyle='rgba(255,255,255,.14)';
    ctx.fillRect(-1,-5,2,10);
    ctx.restore();
  }else if(ws.id==='axe'){
    ctx.strokeStyle='#7b6246';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(handX-dirX*2,handY-dirY*2);
    ctx.lineTo(handX+dirX*12,handY+dirY*12);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle='#8d9186';
    ctx.ellipse(handX+dirX*13+offX*2,handY+dirY*13+offY*2,6,4,ang,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.14)';
    ctx.fillRect(handX+dirX*11+offX,handY+dirY*11+offY,2,6);
  }else if(ws.id==='pike'){
    ctx.strokeStyle='#8a7356';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(handX-dirX*4,handY-dirY*4);
    ctx.lineTo(handX+dirX*19,handY+dirY*19);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle='#cad4dc';
    ctx.moveTo(handX+dirX*22,handY+dirY*22);
    ctx.lineTo(handX+dirX*15+offX*3,handY+dirY*15+offY*3);
    ctx.lineTo(handX+dirX*15-offX*3,handY+dirY*15-offY*3);
    ctx.closePath();
    ctx.fill();
  }else if(ws.id==='dagger'){
    ctx.strokeStyle='#c7d0da';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(handX,handY);
    ctx.lineTo(handX+dirX*8,handY+dirY*8);
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle='#d9dfe8';
    ctx.moveTo(handX+dirX*10,handY+dirY*10);
    ctx.lineTo(handX+dirX*6+offX*2,handY+dirY*6+offY*2);
    ctx.lineTo(handX+dirX*6-offX*2,handY+dirY*6-offY*2);
    ctx.closePath();
    ctx.fill();
  }else{
    ctx.strokeStyle='#c0b08e';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(handX-dirX*2,handY-dirY*2);
    ctx.lineTo(handX+dirX*13,handY+dirY*13);
    ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.28)';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(handX+dirX*6+offX*2,handY+dirY*6+offY*2);
    ctx.lineTo(handX+dirX*13+offX,handY+dirY*13+offY);
    ctx.stroke();
  }
  if(P.classId==='guardian'){
    let shX=sx+offX*9+dirX*4,shY=sy+offY*9+dirY*4,shA=Math.atan2(offY,offX)+Math.PI/2;
    ctx.save();
    ctx.translate(shX,shY);
    ctx.rotate(shA);
    ctx.fillStyle='rgba(102,126,148,.95)';
    ctx.beginPath();
    ctx.moveTo(0,-10);
    ctx.lineTo(7,-4);
    ctx.lineTo(6,6);
    ctx.lineTo(0,11);
    ctx.lineTo(-6,6);
    ctx.lineTo(-7,-4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='rgba(214,228,240,.8)';
    ctx.lineWidth=1.5;
    ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.18)';
    ctx.beginPath();
    ctx.moveTo(-2,-6);ctx.lineTo(3,-1);ctx.lineTo(2,6);
    ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(-1,-8,2,14);
    ctx.restore();
  }else if(P.classId==='ranger'){
    ctx.strokeStyle='#9fd27d';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(sx+P.facing.x*10,sy+P.facing.y*10,7,Math.atan2(P.facing.y,P.facing.x)-1,Math.atan2(P.facing.y,P.facing.x)+1);
    ctx.stroke();
    ctx.strokeStyle='rgba(159,210,125,.28)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(sx-10,sy-10);ctx.lineTo(sx-16,sy+3);ctx.lineTo(sx-11,sy+12);
    ctx.stroke();
  }else if(P.classId==='runecaster'){
    drawGlow(sx,sy-8,16,style.glow,.07);
    ctx.fillStyle=style.trim;
    [-6,6].forEach(off=>ctx.fillRect(sx+off-1,sy-27,2,4));
  }
  if(P.equip.helm){
    ctx.strokeStyle='#b7bcc6';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(sx,sy-17,8,Math.PI,0);ctx.stroke();
  }
  if(P.classId==='berserker'){
    ctx.strokeStyle='rgba(227,179,109,.45)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(sx-7,sy-23);ctx.lineTo(sx-3,sy-29);
    ctx.moveTo(sx+7,sy-23);ctx.lineTo(sx+3,sy-29);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draw player using sprite assets instead of procedural drawing
 * Uses AssetLoader images for body, weapons, armor, and VFX
 */
function drawPlayerSprite(sx, sy) {
  if (!AssetLoader || !AssetLoader.isLoaded) {
    // Fallback to old method if assets not loaded
    drawPlayerFigure(sx, sy);
    return;
  }
  
  let classId = P.classId || 'berserker';
  let ws = getWeaponStyle();
  let fx = P.facing.x || 1;
  let fy = P.facing.y || 0;
  let aimAng = Math.atan2(fy, fx);
  let side = fx >= 0 ? 1 : -1;
  let attackPose = Math.min(1, (P.attackPoseTimer || 0) / 170);
  let attackEase = 1 - Math.pow(1 - attackPose, 2);
  let moving = !!(keys['w'] || keys['ArrowUp'] || keys['s'] || keys['ArrowDown'] || keys['a'] || keys['ArrowLeft'] || keys['d'] || keys['ArrowRight']);
  let runFactor = P.sprinting ? 1.5 : 1;
  let gaitTime = Date.now() / (moving ? (P.sprinting ? 85 : 130) : 320);
  let stride = moving ? Math.sin(gaitTime) * 4 * runFactor : 0;
  let bob = moving ? Math.abs(Math.cos(gaitTime * 2)) * 1.8 * runFactor : 0;
  
  sy += bob;
  
  ctx.save();
  
  // Draw shadow
  let shadowKey = `${classId}_shadow`;
  let shadowImg = AssetLoader.getImage(shadowKey);
  if (shadowImg && shadowImg.complete && shadowImg.naturalWidth > 0) {
    ctx.globalAlpha = 0.35;
    ctx.drawImage(shadowImg, sx - 16, sy + 12, 32, 10);
    ctx.globalAlpha = 1.0;
  } else {
    drawShadow(sx + fx * 3, sy + 15, 14, 5, 0.3);
  }
  
  // Draw character body
  let bodyKey = `${classId}_body`;
  let bodyImg = AssetLoader.getImage(bodyKey);
  if (bodyImg && bodyImg.complete && bodyImg.naturalWidth > 0) {
    let bodyHeight = 48;
    let bodyWidth = 32;
    let drawX = sx - bodyWidth / 2 + fx * (attackEase * 5);
    let drawY = sy - bodyHeight + 10;
    
    // Flip sprite if facing left
    ctx.save();
    if (fx < 0) {
      ctx.translate(sx, drawY + bodyHeight / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(bodyImg, -bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    } else {
      ctx.translate(sx, drawY + bodyHeight / 2);
      ctx.drawImage(bodyImg, -bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    }
    ctx.restore();
  } else {
    // Fallback to procedural drawing
    drawPlayerFigure(sx, sy);
    ctx.restore();
    return;
  }
  
  // Draw weapon
  let weaponKey = `weapon_${ws.id}`;
  let weaponImg = AssetLoader.getImage(weaponKey);
  if (weaponImg && weaponImg.complete && weaponImg.naturalWidth > 0) {
    let isMelee = ws.id !== 'bow' && ws.id !== 'arcane';
    let ang = aimAng + (isMelee ? (side > 0 ? 0.92 : Math.PI - 0.92) : aimAng);
    ang += (Math.PI / 4 + (Math.PI / 4 - Math.PI / 4) * attackEase) * (isMelee ? 1 : 0);
    
    let armReach = isMelee ? 7 + 9 * attackEase : 9 + 5 * attackEase;
    let handX = sx + Math.cos(ang) * armReach;
    let handY = sy + Math.sin(ang) * armReach;
    
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(ang);
    
    let weaponSize = 24;
    if (fx < 0) {
      ctx.scale(-1, 1);
    }
    
    if (ws.id === 'bow') {
      ctx.drawImage(weaponImg, -weaponSize / 2, -weaponSize / 2, weaponSize, weaponSize);
    } else if (ws.id === 'arcane') {
      ctx.drawImage(weaponImg, -weaponSize / 2, -weaponSize / 2, weaponSize, weaponSize);
      // Add arcane glow
      if (P.rage || P.classId === 'runecaster') {
        drawGlow(handX + Math.cos(ang) * 16, handY + Math.sin(ang) * 16, 10, 'rgb(159,140,255)', 0.15);
      }
    } else {
      // Melee weapons - adjust position based on attack pose
      let offset = isMelee && attackPose > 0.5 ? 8 : 0;
      ctx.drawImage(weaponImg, offset - weaponSize / 2, -weaponSize / 2, weaponSize, weaponSize);
    }
    
    ctx.restore();
  }
  
  // Draw armor overlay if equipped
  if (P.equip && P.equip.chest) {
    let armorKey = `armor_${P.equip.chest}`;
    let armorImg = AssetLoader.getImage(armorKey);
    if (armorImg && armorImg.complete && armorImg.naturalWidth > 0) {
      let armorHeight = 48;
      let armorWidth = 32;
      let drawX = sx - armorWidth / 2 + fx * (attackEase * 5);
      let drawY = sy - armorHeight + 10;
      
      ctx.globalAlpha = 0.7;
      ctx.drawImage(armorImg, drawX, drawY, armorWidth, armorHeight);
      ctx.globalAlpha = 1.0;
    }
  }
  
  // Draw VFX for special states
  if (P.rage && P.classId === 'berserker') {
    let vfxKey = 'vfx_rage_berserker';
    let vfxImg = AssetLoader.getImage(vfxKey);
    if (vfxImg && vfxImg.complete && vfxImg.naturalWidth > 0) {
      let vfxSize = 64;
      let pulse = Math.sin(Date.now() / 100) * 0.1 + 0.9;
      ctx.globalAlpha = 0.6 * pulse;
      ctx.drawImage(vfxImg, sx - vfxSize / 2, sy - vfxSize / 2, vfxSize, vfxSize);
      ctx.globalAlpha = 1.0;
    } else {
      drawGlow(sx, sy, 44, 'rgb(216,108,47)', 0.18);
    }
  }
  
  if (P.classId === 'runecaster') {
    let vfxKey = 'vfx_rune_aura';
    let vfxImg = AssetLoader.getImage(vfxKey);
    if (vfxImg && vfxImg.complete && vfxImg.naturalWidth > 0) {
      let vfxSize = 56;
      let rotation = Date.now() / 1000;
      ctx.save();
      ctx.translate(sx, sy - 20);
      ctx.rotate(rotation);
      ctx.globalAlpha = 0.4;
      ctx.drawImage(vfxImg, -vfxSize / 2, -vfxSize / 2, vfxSize, vfxSize);
      ctx.globalAlpha = 1.0;
      ctx.restore();
    } else {
      drawGlow(sx, sy - 8, 16, 'rgb(159,140,255)', 0.07);
    }
  }
  
  // Draw poison debuff effect
  if (P.debuffs && P.debuffs.poison > 0) {
    drawGlow(sx, sy, 34, 'rgb(97,211,109)', 0.12);
  }
  
  ctx.restore();
}

function drawEnemySprite(e, sx, sy) {
  if (!AssetLoader || !AssetLoader.isLoaded) {
    drawEnemyFigure(sx, sy);
    return;
  }
  
  ctx.save();
  let hitAmt = Math.max(0, Math.min(1, (e.hitFlash || 0) / 220));
  sx += (e.hitKickX || 0);
  sy += (e.hitKickY || 0);
  let frozen = e.froze > 0;
  let elite = e.isElite;
  let boss = e === bossRef;
  let stepSeed = (e.id || 1) * 0.37;
  let walkPhase = Date.now() / (boss ? 180 : 140) + stepSeed;
  let stride = Math.sin(walkPhase) * (boss ? 4.5 : 3.2);
  let bob = Math.cos(walkPhase * 2) * (boss ? 1.8 : 1.1);
  let toPlayerX = ((inDungeon ? dPlayer.x : P.x) - e.x) || 1;
  let facing = toPlayerX >= 0 ? 1 : -1;
  sy += bob;
  
  let name = (e.name || '').toLowerCase();
  let spriteKey = '';
  
  // Determine sprite key based on enemy type
  if (name.includes('wolf') || name.includes('fenrir')) {
    spriteKey = boss ? 'enemy_boss_wolf' : 'enemy_wolf';
  } else if (name.includes('draugr')) {
    spriteKey = 'enemy_draugr';
  } else if (name.includes('golem')) {
    spriteKey = 'enemy_boss_golem';
  } else {
    // Default fallback
    spriteKey = 'enemy_draugr';
  }
  
  // Try to load enemy sprite
  let enemyImg = AssetLoader.getImage(spriteKey);
  let shadowImg = AssetLoader.getImage('enemy_shadow');
  
  // Draw shadow
  if (shadowImg && shadowImg.complete && shadowImg.naturalWidth > 0) {
    ctx.globalAlpha = 0.35;
    ctx.drawImage(shadowImg, sx - 16, sy + 12, 32, 10);
    ctx.globalAlpha = 1.0;
  } else {
    drawShadow(sx, sy + 15, 14, 5, 0.3);
  }
  
  // Draw effects (frozen, elite, boss, hit flash)
  if (frozen) {
    ctx.shadowColor = ART.frost;
    ctx.shadowBlur = 12;
  }
  if (boss && e.phase === 2) {
    ctx.shadowColor = '#ff2200';
    ctx.shadowBlur = 20;
    drawGlow(sx, sy, e.sz * 2.2, 'rgb(216,48,36)', 0.14);
  } else if (boss) {
    ctx.shadowColor = '#d7b15c';
    ctx.shadowBlur = 14;
    drawGlow(sx, sy, e.sz * 2.2, 'rgb(215,177,92)', 0.08);
  } else if (elite) {
    ctx.shadowColor = ART.goldHot;
    ctx.shadowBlur = 14;
  }
  if (hitAmt > 0) {
    ctx.shadowColor = e.hitColor || '#ffffff';
    ctx.shadowBlur = Math.max(ctx.shadowBlur || 0, 10 + hitAmt * 10);
  }
  
  // Draw boss aura ring
  if (boss) {
    let px = (inDungeon ? dPlayer.x : P.x) - ((e.isDungeon ? dCam.x : cam.x) || 0);
    let py = (inDungeon ? dPlayer.y : P.y) - ((e.isDungeon ? dCam.y : cam.y) || 0);
    let distToPlayer = Math.hypot((inDungeon ? dPlayer.x : P.x) - e.x, (inDungeon ? dPlayer.y : P.y) - e.y);
    let rangedWindup = e.range > 40 && e.shotTimer > 0 && e.shotTimer < 520 && distToPlayer < e.range + 180;
    let meleeWindup = e.range <= 40 && e.shotTimer > 0 && e.shotTimer < 360 && distToPlayer < e.range + 70;
    
    ctx.strokeStyle = e.phase === 2 ? 'rgba(255,80,60,.22)' : 'rgba(248,218,130,.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, e.sz + 10 + pulse(220, e.id, 0, 4), 0, Math.PI * 2);
    ctx.stroke();
    
    if (rangedWindup) {
      let amt = 1 - e.shotTimer / 520;
      ctx.strokeStyle = `rgba(255,90,60,${0.22 + amt * 0.35})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(px, py);
      ctx.stroke();
    }
    if (meleeWindup) {
      let amt = 1 - e.shotTimer / 360;
      ctx.strokeStyle = `rgba(255,90,60,${0.2 + amt * 0.32})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(sx, sy, e.range + 10 + amt * 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  // Draw enemy sprite
  if (enemyImg && enemyImg.complete && enemyImg.naturalWidth > 0) {
    let spriteSize = boss ? 64 : 48;
    let drawX = sx - spriteSize / 2;
    let drawY = sy - spriteSize / 2;
    
    ctx.save();
    if (facing < 0) {
      ctx.translate(sx, sy);
      ctx.scale(-1, 1);
      ctx.drawImage(enemyImg, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
    } else {
      ctx.drawImage(enemyImg, drawX, drawY, spriteSize, spriteSize);
    }
    ctx.restore();
  } else {
    // Fallback to procedural drawing if sprite not found
    ctx.restore();
    drawEnemyFigure(e, sx - (e.hitKickX || 0), sy - (e.hitKickY || 0) - bob);
    return;
  }
  
  ctx.restore();
}

/**
 * Draw Projectile with Sprite
 * @param {Object} p - Projectile object
 * @param {number} sx - Screen X position
 * @param {number} sy - Screen Y position
 */
function drawProjectileSprite(p, sx, sy) {
  ctx.save();
  
  // Map projectile types to sprite keys
  const spriteMap = {
    'arrow': 'projectile_arrow',
    'axe': 'projectile_axe',
    'arcane': 'projectile_arcane_orb',
    'fireball': 'projectile_fireball',
    'ice': 'projectile_ice_shard',
    'venom': 'projectile_poison',
    'ember': 'projectile_fireball',
    'veil': 'projectile_arcane_orb',
    'swipe': null, // Handled procedurally
    'slash': null  // Handled procedurally
  };
  
  const spriteKey = spriteMap[p.type];
  
  // Handle special procedural projectiles (swipe, slash)
  if (!spriteKey) {
    if (p.type === 'swipe') {
      let a = p.ang || 0;
      let dirX = Math.cos(a), dirY = Math.sin(a);
      let fade = Math.max(0, p.life / (p.maxLife || p.life || 1));
      let len = (p.swipeLen || 20) * (0.8 + fade * 0.35);
      let wid = (p.swipeWidth || 6) * (0.75 + fade * 0.35);
      ctx.globalAlpha = 0.2 + 0.45 * fade;
      ctx.strokeStyle = p.col;
      ctx.lineCap = 'round';
      ctx.lineWidth = wid;
      ctx.beginPath();
      ctx.moveTo(sx - dirX * 4, sy - dirY * 4);
      ctx.lineTo(sx + dirX * len, sy + dirY * len);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.35)';
      ctx.lineWidth = Math.max(1, wid * 0.35);
      ctx.beginPath();
      ctx.moveTo(sx + dirX * 2, sy + dirY * 2);
      ctx.lineTo(sx + dirX * (len - 2), sy + dirY * (len - 2));
      ctx.stroke();
    } else if (p.type === 'slash') {
      let a = p.ang || 0;
      let fade = Math.max(0, p.life / 0.15);
      drawGlow(sx, sy, 24, p.col, 0.05 + 0.08 * fade);
      ctx.strokeStyle = p.col;
      ctx.globalAlpha = 0.18 + 0.3 * fade;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(sx, sy, 16, a - 0.38, a + 0.38);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.2)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 12, a - 0.3, a + 0.3);
      ctx.stroke();
    } else {
      // Default fallback for unknown types
      if (p.owner === 'enemy' && (p.bossAffixes?.length || bossActive)) {
        drawGlow(sx, sy, 16, 'rgb(255,90,90)', 0.12);
      }
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }
  
  // Try to get sprite from AssetLoader
  let projImg = null;
  if (AssetLoader && AssetLoader.isLoaded) {
    projImg = AssetLoader.getImage(spriteKey);
  }
  
  // If sprite available, draw it
  if (projImg && projImg.complete && projImg.naturalWidth > 0) {
    let spriteSize = 24;
    
    // Flip sprite based on velocity direction
    ctx.translate(sx, sy);
    if (p.vx < 0) {
      ctx.scale(-1, 1);
    }
    
    // Add glow effects based on type
    if (p.type === 'arcane' || p.type === 'veil') {
      let bossShot = p.owner === 'enemy' && (p.bossAffixes?.length || bossActive);
      drawGlow(0, 0, bossShot ? 22 : 18, bossShot ? 'rgb(255,110,110)' : 'rgb(159,140,255)', bossShot ? 0.18 : 0.14);
      ctx.shadowColor = bossShot ? '#ff6666' : '#c9b8ff';
      ctx.shadowBlur = bossShot ? 14 : 10;
    } else if (p.type === 'fireball' || p.type === 'ember') {
      drawGlow(0, 0, 22, 'rgb(255,122,47)', 0.18);
      ctx.shadowColor = '#ff7a2f';
      ctx.shadowBlur = 10;
    } else if (p.type === 'axe') {
      drawGlow(0, 0, 16, 'rgb(215,177,92)', 0.08);
      ctx.shadowColor = '#d7b15c';
      ctx.shadowBlur = 10;
    }
    
    ctx.drawImage(projImg, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
  } else {
    // Fallback to procedural drawing
    if (p.type === 'arrow') {
      let enemyShot = p.owner === 'enemy';
      if (enemyShot) {
        ctx.strokeStyle = 'rgba(255,120,90,.24)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx - p.vx * 1.6, sy - p.vy * 1.6);
        ctx.lineTo(sx + p.vx * 0.5, sy + p.vy * 0.5);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,245,214,.38)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx - p.vx * 1.3, sy - p.vy * 1.3);
      ctx.lineTo(sx + p.vx * 0.8, sy + p.vy * 0.8);
      ctx.stroke();
      ctx.strokeStyle = enemyShot ? '#ff9f7a' : '#f1d795';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx - p.vx * 0.7, sy - p.vy * 0.7);
      ctx.lineTo(sx + p.vx * 1.6, sy + p.vy * 1.6);
      ctx.stroke();
      ctx.strokeStyle = p.col;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + p.vx * 2.8, sy + p.vy * 2.8);
      ctx.stroke();
      ctx.fillStyle = enemyShot ? 'rgba(255,170,120,.8)' : 'rgba(255,230,180,.75)';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'axe') {
      ctx.strokeStyle = 'rgba(215,177,92,.26)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - p.vx * 1.4, sy - p.vy * 1.4);
      ctx.lineTo(sx + p.vx * 0.7, sy + p.vy * 0.7);
      ctx.stroke();
      drawGlow(sx, sy, 16, 'rgb(215,177,92)', 0.08);
      ctx.shadowColor = '#d7b15c';
      ctx.shadowBlur = 10;
      ctx.font = '13px sans-serif';
      ctx.fillText('🪓', sx - 6, sy + 5);
    } else if (p.type === 'arcane') {
      let bossShot = p.owner === 'enemy' && (p.bossAffixes?.length || bossActive);
      drawGlow(sx, sy, bossShot ? 22 : 18, bossShot ? 'rgb(255,110,110)' : 'rgb(159,140,255)', bossShot ? 0.18 : 0.14);
      ctx.fillStyle = 'rgba(255,255,255,.22)';
      ctx.beginPath();
      ctx.arc(sx - p.vx * 0.8, sy - p.vy * 0.8, p.sz + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.col;
      ctx.shadowColor = bossShot ? '#ff6666' : '#c9b8ff';
      ctx.shadowBlur = bossShot ? 14 : 10;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = bossShot ? 'rgba(255,170,170,.55)' : 'rgba(210,195,255,.5)';
      ctx.lineWidth = bossShot ? 2 : 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + (bossShot ? 4 : 3), 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'venom') {
      drawGlow(sx, sy, 20, 'rgb(97,211,109)', 0.16);
      ctx.fillStyle = 'rgba(220,255,220,.2)';
      ctx.beginPath();
      ctx.arc(sx - p.vx * 0.7, sy - p.vy * 0.7, p.sz + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,255,180,.45)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(120,255,150,.18)';
      ctx.beginPath();
      ctx.arc(sx + p.vx * 0.35, sy + p.vy * 0.35, 2.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'ember') {
      drawGlow(sx, sy, 22, 'rgb(255,122,47)', 0.18);
      ctx.fillStyle = 'rgba(255,245,220,.18)';
      ctx.beginPath();
      ctx.arc(sx - p.vx * 0.8, sy - p.vy * 0.8, p.sz, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,200,130,.42)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sx - p.vx * 0.9, sy - p.vy * 0.9);
      ctx.lineTo(sx + p.vx * 0.9, sy + p.vy * 0.9);
      ctx.stroke();
    } else if (p.type === 'veil') {
      drawGlow(sx, sy, 22, 'rgb(185,185,255)', 0.15);
      ctx.strokeStyle = 'rgba(200,210,255,.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - p.vx * 1.1, sy - p.vy * 1.1);
      ctx.lineTo(sx + p.vx * 0.6, sy + p.vy * 0.6);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.16)';
      ctx.beginPath();
      ctx.arc(sx - p.vx * 0.45, sy - p.vy * 0.45, p.sz, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(210,195,255,.4)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz + 4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      if (p.owner === 'enemy' && (p.bossAffixes?.length || bossActive)) {
        drawGlow(sx, sy, 16, 'rgb(255,90,90)', 0.12);
      }
      ctx.fillStyle = p.col;
      ctx.beginPath();
      ctx.arc(sx, sy, p.sz, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.restore();
}

function nearestLandmark(tx,ty,maxDist=8){
  let best=null,bestD=maxDist+1;
  worldLandmarks.forEach(site=>{
    let d=Math.hypot(site.x-tx,site.y-ty);
    if(d<bestD){best=site;bestD=d;}
  });
  return best;
}
function tileNoise(tx,ty){
  let v=Math.sin(tx*12.9898+ty*78.233)*43758.5453;
  return v-Math.floor(v);
}
function drawWorldProp(tx,ty,sx,sy){
  let site=nearestLandmark(tx,ty,5);
  if(!site)return;
  let d=Math.hypot(site.x-tx,site.y-ty);
  let n=tileNoise(tx,ty);
  if(site.kind==='watcher'||site.kind==='bridge'||site.kind==='portal')return;
  ctx.save();
  if(site.kind==='village'&&d<4.6&&n>.935){
    if(n>.972){
      drawShadow(sx+16,sy+26,10,3,.16);
      ctx.fillStyle='#5a3922';
      ctx.fillRect(sx+7,sy+11,10,14);
      ctx.fillStyle='#77533b';
      ctx.fillRect(sx+8,sy+12,8,5);
      ctx.fillStyle='#7f1f28';
      ctx.beginPath();ctx.moveTo(sx+5,sy+12);ctx.lineTo(sx+12,sy+6);ctx.lineTo(sx+20,sy+12);ctx.closePath();ctx.fill();
      ctx.fillStyle='#e8c88d';
      ctx.fillRect(sx+10,sy+18,3,4);
    }else if(n>.952){
      let fl=pulse(210,tx+ty,.7,1);
      ctx.fillStyle='#523723';
      ctx.fillRect(sx+17,sy+8,6,16);
      ctx.fillStyle='#2f2317';
      ctx.fillRect(sx+18,sy+15,2,9);
      ctx.fillStyle=`rgba(255,${Math.floor(145*fl)},40,${.75*fl})`;
      ctx.beginPath();ctx.ellipse(sx+20,sy+7,4*fl,6*fl,0,0,Math.PI*2);ctx.fill();
      drawGlow(sx+20,sy+7,16,'rgb(216,108,47)',.1);
    }
  }else if(site.kind==='ruin'&&d<4.1&&n>.955){
    ctx.fillStyle='#696864';
    ctx.fillRect(sx+8,sy+7,6,17);
    ctx.fillRect(sx+19,sy+10,7,13);
    ctx.fillStyle='#918b72';
    ctx.fillRect(sx+7,sy+6,8,3);
    ctx.fillRect(sx+18,sy+9,9,2);
    ctx.fillStyle='rgba(159,140,255,.3)';
    ctx.fillRect(sx+14,sy+11,2,10);
    ctx.fillText('ᚱ',sx+18,sy+22);
  }else if(site.kind==='grove'&&d<4&&n>.96){
    ctx.strokeStyle='#2d2619';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(sx+20,sy+8);ctx.lineTo(sx+10,sy+26);ctx.moveTo(sx+20,sy+8);ctx.lineTo(sx+30,sy+26);
    ctx.stroke();
    ctx.fillStyle='#d7b15c';
    ctx.beginPath();ctx.arc(sx+20,sy+8,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(120,180,120,.2)';
    ctx.beginPath();ctx.arc(sx+20,sy+18,10,0,Math.PI*2);ctx.fill();
  }else if(site.kind==='grave'&&d<4.2&&n>.948){
    ctx.fillStyle='#57535f';
    ctx.fillRect(sx+10,sy+9,12,15);
    ctx.fillStyle='#76707d';
    ctx.fillRect(sx+13,sy+6,6,4);
    ctx.fillStyle='rgba(159,140,255,.2)';
    ctx.fillRect(sx+9,sy+8,14,2);
  }else if(site.kind==='tower'&&d<3.6&&n>.955){
    drawShadow(sx+19,sy+27,10,3,.18);
    ctx.fillStyle='#5a5563';
    ctx.fillRect(sx+13,sy+5,12,20);
    ctx.fillStyle='#736f7d';
    ctx.fillRect(sx+12,sy+4,14,3);
    ctx.fillStyle='#2c1e17';
    ctx.fillRect(sx+17,sy+11,4,9);
    ctx.fillStyle='#f8da82';
    ctx.fillRect(sx+18,sy+12,2,2);
  }else if(site.kind==='dungeon'&&d<3.6&&n>.965){
    ctx.fillStyle='#443c52';
    ctx.fillRect(sx+6,sy+9,8,16);
    ctx.fillRect(sx+24,sy+9,8,16);
    ctx.fillStyle='#625872';
    ctx.beginPath();ctx.moveTo(sx+6,sy+9);ctx.lineTo(sx+19,sy+3);ctx.lineTo(sx+32,sy+9);ctx.closePath();ctx.fill();
    ctx.fillStyle='#9f8cff';
    ctx.fillText('ᚦ',sx+19,sy+23);
    drawGlow(sx+19,sy+18,16,'rgb(159,140,255)',.09);
  }else if(site.kind==='meadhall'&&d<4.3&&n>.95){
    ctx.fillStyle='#6b4a2f';
    ctx.fillRect(sx+8,sy+10,11,14);
    ctx.fillRect(sx+21,sy+12,9,12);
    ctx.fillStyle='#d7b15c';
    ctx.fillRect(sx+13,sy+6,3,6);
    let fl=pulse(240,tx+ty,.72,1);
    ctx.fillStyle=`rgba(255,${Math.floor(136*fl)},40,${.65*fl})`;
    ctx.beginPath();ctx.ellipse(sx+26,sy+10,3.5*fl,5*fl,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,245,215,.08)';
    ctx.fillRect(sx+10,sy+12,8,2);
  }else if(site.kind==='memorial'&&d<4.2&&n>.958){
    ctx.fillStyle='#726b79';
    ctx.fillRect(sx+15,sy+8,10,18);
    ctx.fillStyle='rgba(159,140,255,.18)';
    ctx.fillRect(sx+13,sy+7,14,2);
    ctx.fillStyle='#8ecaf4';
    ctx.fillRect(sx+19,sy+11,2,10);
  }else if(site.kind==='council'&&d<4.1&&n>.955){
    ctx.fillStyle='#5a4034';
    ctx.fillRect(sx+8,sy+13,24,8);
    ctx.fillStyle='#7d5e49';
    ctx.fillRect(sx+11,sy+9,18,5);
    ctx.fillStyle='#d7b15c';
    ctx.fillRect(sx+18,sy+4,3,7);
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx+12,sy+11,16,2);
  }else if(site.kind==='sanctum'&&d<4.2&&n>.958){
    ctx.strokeStyle='rgba(159,140,255,.34)';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(sx+20,sy+17,9,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='rgba(122,184,255,.12)';
    ctx.fillRect(sx+16,sy+7,8,20);
    drawGlow(sx+20,sy+14,14,'rgb(159,140,255)',.08);
  }else if(site.kind==='hall'&&d<4.1&&n>.952){
    drawShadow(sx+20,sy+28,10,3,.18);
    ctx.fillStyle='#6e4b2a';
    ctx.fillRect(sx+10,sy+10,20,16);
    ctx.fillStyle='#8e653d';
    ctx.beginPath();ctx.moveTo(sx+8,sy+10);ctx.lineTo(sx+20,sy+4);ctx.lineTo(sx+32,sy+10);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx+13,sy+12,14,2);
    ctx.fillStyle='#2b1d16';
    ctx.fillRect(sx+17,sy+16,6,10);
    ctx.fillStyle='#f1d08a';
    ctx.fillRect(sx+18,sy+18,4,4);
  }else if(site.kind==='watcher'&&d<4.3&&n>.955){
    ctx.fillStyle='#2a2d35';
    ctx.fillRect(sx+18,sy+14,4,11);
    ctx.fillStyle='#1a1b20';
    ctx.fillRect(sx+15,sy+24,10,2);
    drawGlow(sx+20,sy+12,10,site.watcherId==='huginn'?'rgb(142,202,244)':'rgb(216,108,47)',.05);
  }
  ctx.restore();
}
function drawWorldNPCFigure(n,sx,sy){
  // Try to use sprite-based rendering if assets are loaded
  if (AssetLoader && AssetLoader.isLoaded) {
    const npcSpriteKey = `npc_${n.role?.toLowerCase().replace(/\s+/g, '_') || 'merchant'}`;
    const npcImg = AssetLoader.getImage(npcSpriteKey);
    const shadowImg = AssetLoader.getImage('enemy_shadow');
    
    // Draw shadow
    if (shadowImg && shadowImg.complete && shadowImg.naturalWidth > 0) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(shadowImg, sx - 16, sy + 12, 32, 10);
      ctx.globalAlpha = 1.0;
    } else {
      drawShadow(sx, sy+14, 13, 5, .28);
    }
    
    // Draw NPC sprite if available
    if (npcImg && npcImg.complete && npcImg.naturalWidth > 0) {
      ctx.save();
      let spriteSize = 48;
      let drawX = sx - spriteSize / 2;
      let drawY = sy - spriteSize / 2;
      
      // Apply effects based on NPC type
      let scholar = n.icon === '🔮' || n.icon === '📜';
      let trade = n.icon === '💰' || n.icon === '⚒' || n.icon === 'J';
      
      if (scholar) {
        ctx.shadowColor = '#b9a4ff';
        ctx.shadowBlur = 12;
      } else if (trade) {
        ctx.shadowColor = '#d7b15c';
        ctx.shadowBlur = 10;
      }
      
      ctx.drawImage(npcImg, drawX, drawY, spriteSize, spriteSize);
      
      // Draw merchant glow
      if ((n.shopItems || []).length > 0) {
        drawGlow(sx, sy, 22, 'rgb(215,177,92)', 0.09);
      }
      
      ctx.restore();
      return;
    }
  }
  
  // Fallback to procedural drawing
  ctx.save();
  drawShadow(sx,sy+14,13,5,.28);
  let robe=n.col||'#7b6232';
  let scholar=n.icon==='🔮'||n.icon==='📜';
  let trade=n.icon==='💰'||n.icon==='⚒'||n.icon==='J';
  ctx.fillStyle=robe;
  ctx.beginPath();ctx.moveTo(sx,sy-15);ctx.lineTo(sx-13,sy+12);ctx.lineTo(sx+13,sy+12);ctx.closePath();ctx.fill();
  ctx.fillRect(sx-9,sy-2,18,14);
  ctx.fillStyle='rgba(0,0,0,.14)';
  ctx.fillRect(sx-8,sy+2,16,8);
  ctx.fillStyle='rgba(255,255,255,.08)';
  ctx.fillRect(sx-6,sy-4,12,5);
  ctx.fillStyle='#d8c39c';
  ctx.beginPath();ctx.arc(sx,sy-16,8.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(78,52,36,.22)';
  ctx.beginPath();ctx.arc(sx,sy-19,7.5,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillStyle=scholar?'rgba(185,164,255,.16)':'rgba(255,230,175,.12)';
  ctx.beginPath();
  ctx.moveTo(sx-6,sy-22);
  ctx.lineTo(sx,sy-26);
  ctx.lineTo(sx+6,sy-22);
  ctx.lineTo(sx+3,sy-18);
  ctx.lineTo(sx-3,sy-18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle='rgba(255,236,220,.12)';
  ctx.fillRect(sx-5,sy-20.5,10,2.5);
  ctx.fillStyle='rgba(255,255,255,.18)';
  ctx.fillRect(sx-4,sy-21,8,2);
  ctx.fillStyle='#1a1617';
  ctx.beginPath();ctx.arc(sx-3,sy-17,1.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(sx+3,sy-17,1.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(168,92,78,.28)';
  ctx.beginPath();ctx.arc(sx,sy-15,1.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(110,74,62,.2)';
  ctx.beginPath();ctx.arc(sx,sy-16.2,.55,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(42,22,20,.65)';
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(sx-3,sy-13);ctx.quadraticCurveTo(sx,sy-11,sx+3,sy-13);
  ctx.stroke();
  ctx.strokeStyle='rgba(66,40,34,.48)';
  ctx.beginPath();
  ctx.moveTo(sx-4.5,sy-18.3);ctx.lineTo(sx-1.1,sy-17.6);
  ctx.moveTo(sx+1.1,sy-17.6);ctx.lineTo(sx+4.5,sy-18.3);
  ctx.stroke();
  ctx.strokeStyle='rgba(30,22,18,.4)';
  ctx.lineWidth=2.1;
  ctx.beginPath();
  ctx.moveTo(sx-8,sy-1);ctx.lineTo(sx-13,sy+5);
  ctx.moveTo(sx+8,sy-1);ctx.lineTo(sx+13,sy+5);
  ctx.stroke();
  ctx.fillStyle=trade?'#d7b15c':scholar?'#b9a4ff':'#d8c39c';
  ctx.beginPath();ctx.arc(sx-13,sy+5,2.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(sx+13,sy+5,2.1,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.09)';
  ctx.fillRect(sx-14,sy+3,3,2);
  ctx.fillRect(sx+11,sy+3,3,2);
  ctx.fillStyle='rgba(255,255,255,.14)';
  ctx.fillRect(sx-4,sy-7,8,6);
  ctx.fillStyle=scholar?'rgba(98,76,138,.5)':trade?'rgba(94,56,26,.46)':'rgba(74,52,38,.38)';
  ctx.beginPath();
  ctx.moveTo(sx-6,sy-20);
  ctx.lineTo(sx,sy-24);
  ctx.lineTo(sx+6,sy-20);
  ctx.lineTo(sx+3,sy-16.5);
  ctx.lineTo(sx-3,sy-16.5);
  ctx.closePath();
  ctx.fill();
  if(scholar){
    ctx.fillStyle='rgba(185,164,255,.2)';
    ctx.fillRect(sx-11,sy-7,4,12);
    ctx.strokeStyle='rgba(210,195,255,.22)';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(sx,sy-16,10,Math.PI*.12,Math.PI*.88);ctx.stroke();
  }else if(trade){
    ctx.fillStyle='rgba(215,177,92,.14)';
    ctx.fillRect(sx-6,sy-6,12,3);
  }
  ctx.fillStyle='rgba(60,44,30,.12)';
  ctx.fillRect(sx-8,sy-1,16,10);
  ctx.fillStyle='rgba(255,255,255,.06)';
  ctx.fillRect(sx-6,sy+1,12,3);
  ctx.fillStyle='rgba(22,18,18,.14)';
  ctx.fillRect(sx-3,sy+1,6,10);
  ctx.fillStyle='rgba(255,255,255,.05)';
  ctx.fillRect(sx-10,sy+9,20,2);
  ctx.strokeStyle='rgba(30,22,18,.38)';
  ctx.lineWidth=1.2;
  ctx.beginPath();
  ctx.moveTo(sx-8,sy+3);ctx.lineTo(sx-13,sy+10);
  ctx.moveTo(sx+8,sy+3);ctx.lineTo(sx+13,sy+10);
  ctx.stroke();
  if((n.shopItems||[]).length>0)drawGlow(sx,sy,22,'rgb(215,177,92)',.09);
  ctx.restore();
}
function playerAtk(){
  let base=P.baseDmg+(P._skaldBuff?.atk||0)+(P.equip.weapon?.dmg||0)+equippedTotal('bonusDmg');
  if(P.debuffs.weaken>0)base=Math.floor(base*.7);
  if(P._warBannerBonus>0)base+=P._warBannerBonus;
  if(P._temperBonus>0)base+=P._temperBonus;
  if(P._seidrSurgeTimer>0)base=Math.floor(base*1.18);
  return Math.floor(base*(P.rage?2:1));
}
function earlyGameAttackTempo(){
  if(P.level<=3)return 1.34;
  if(P.level<=6)return 1.24;
  if(P.level<=10)return 1.13;
  return 1;
}
function dungeonEnemyScaleLevel(level=P.level){
  if(level<=1)return 1;
  return 1+(level-1)*1.35;
}
function getWeaponStyle(item=P.equip.weapon){
  let name=(item?.name||'').toLowerCase();
  if(name.includes('dagger'))return{id:'dagger',attackSpeed:0.72,meleeMult:0.82,reach:34,arc:20,critBonus:0.14,color:'#d6d6dc'};
  if(name.includes('pike')||name.includes('spear'))return{id:'pike',attackSpeed:0.92,meleeMult:1.06,reach:62,arc:18,pierce:1,color:'#c9d6df'};
  if(name.includes('hammer')||name.includes('mjolnir'))return{id:'hammer',attackSpeed:1.2,meleeMult:1.45,reach:38,arc:36,shock:true,color:'#f0c56f'};
  if(name.includes('bow'))return{id:'bow',attackSpeed:0.88,rangedMult:1.18,spread:.06,projectileRange:300,color:'#b18b52'};
  if(name.includes('staff')||name.includes('tome')||name.includes('bone'))return{id:'arcane',attackSpeed:0.94,skillMult:0.12,projectileRange:220,color:'#b9a4ff'};
  if(name.includes('axe'))return{id:'axe',attackSpeed:1.04,meleeMult:1.22,reach:52,arc:38,cleave:.18,color:'#d86c2f'};
  return{id:'blade',attackSpeed:0.86,meleeMult:1,reach:44,arc:26,color:'#d7b15c'};
}
function equippedItems(){return Object.values(P.equip||{}).filter(Boolean);}
function equippedTotal(stat){return equippedItems().reduce((n,item)=>{ let v=(+item?.[stat]||0); if(item?.type==='rune'&&P.perks.some(p=>p.name==='Runebound'))v*=1.35; return n+v; },0);}
function hasEquippedSpecial(name){return equippedItems().some(item=>item.special===name);}
function equippedHpBonus(item){return(item?.hpBonus||0)+(item?.bonusHp||0);}
function playerMoveSpeed(){return P.spd+equippedTotal('spdBonus')+equippedTotal('bonusSpd')+(P._huntmasterTimer>0?0.22:0);}
function playerManaRegen(){let mult=dungeonHasMod('Spellblight')?0.8:1;return (manaRegen+mpRegenBonus+equippedTotal('manaRegen')+(P._skaldBuff?.manaRegen||0))*mult;}
function playerSkillMult(){return(P.perks.some(p=>p.name==='Runic Mastery')?1.25:1)*classMod('skillMult',1)*(1+equippedTotal('skillMult'));}
function playerRangedMult(){return(P.perks.some(p=>p.name==='Eagle Eyes')?1.3:1)*classMod('rangedMult',1)*(1+equippedTotal('rangedMult'));}
function playerMeleeMult(){return classMod('meleeMult',1)*(1+equippedTotal('meleeMult'));}
function playerAttackTempoMult(){return P._battleTranceTimer>0?0.88:1;}
function frostDamageMult(){return(P.perks.some(p=>p.name==='Frost Touch')?1.25:1)*playerSkillMult();}
function playerLifeSteal(){return (equippedTotal('lifesteal')+(P.perks.some(p=>p.name==='Blood Drain')?0.05:0))*(inDungeon&&dungeonHasMod('Withering')?0.7:1);}
function playerDamageReduction(){return classMod('damageReduction',0)+equippedTotal('damageReduction')+(P._bulwarkWardTimer>0?0.12:0);}
function playerDef(){return P.def+(P.equip.armor?.def||0)+(P.equip.helm?.def||0)+(P._skaldBuff?.def||0);}
function playerCrit(){return .12+P.level*.01+(equippedTotal('bonusCrit')*.01)+(P.perks.some(p=>p.name==='Eagle Eyes')?0.1:0)+classMod('critBonus',0)+(hasEquippedSpecial('crit')?0.08:0)+(P._omenCritBonus||0)+(P._skaldBuff?.crit||0)+(P._huntmasterTimer>0?0.08:0);}
function playerVsEliteMult(target){return target&&(target.isElite||target.isBoss)&&P.perks.some(p=>p.name==='Executioner')?1.25:1;}
function playerVsControlMult(target){return target&&(target.froze>0||target.slow>0)&&P.perks.some(p=>p.name==='Winter\'s Bite')?1.2:1;}
function reduceOtherCooldowns(ms,except=-1){
  for(let i=0;i<skillCD.length;i++)if(i!==except)skillCD[i]=Math.max(0,skillCD[i]-ms);
}
function clearEchoBlessing(){
  if(!P._echoBlessing)return;
  if(P._echoBlessing.hp){P.maxHp=Math.max(1,P.maxHp-P._echoBlessing.hp);P.hp=Math.min(P.hp,P.maxHp);}
  if(P._echoBlessing.mp){P.maxMp=Math.max(1,P.maxMp-P._echoBlessing.mp);P.mp=Math.min(P.mp,P.maxMp);}
  if(P._echoBlessing.baseDmg)P.baseDmg=Math.max(1,P.baseDmg-P._echoBlessing.baseDmg);
  if(P._echoBlessing.def)P.def=Math.max(0,P.def-P._echoBlessing.def);
  if(P._echoBlessing.spd)P.spd=Math.max(1,P.spd-P._echoBlessing.spd);
  P._echoBlessing=null;
}
function echoBlessingLabel(){
  if(!P._echoBlessing)return 'None';
  let boon=P._echoBlessing;
  if(boon.label)return boon.label;
  if(boon.name&&boon.summary)return `${boon.name} (${boon.summary})`;
  return boon.name||'Active';
}
function countPotions(){return P.inv.reduce((n,i)=>n+(i.type==='potion'&&(i.potionType==='hp'||i.potionType==='full')?(i.qty||1):0),0);}

function usePotion(idx=null){
  if(idx==null)idx=P.inv.findIndex(i=>i.type==='potion'&&(i.potionType==='hp'||i.potionType==='full'));
  if(idx<0){msg('⚠️ No healing potions!');return;}
  let pot=P.inv[idx],mult=P.perks.some(p=>p.name==='Alchemist')?1.5:1;
  if(inDungeon&&dungeonHasMod('Withering'))mult*=0.72;
  if(!pot||pot.type!=='potion')return;
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  if(pot.potionType==='hp'){P.hp=Math.min(P.maxHp,P.hp+Math.floor(pot.heal*mult));floatText('+'+Math.floor(pot.heal*mult)+' HP',px,py-30,'#ff4488',16);}
  else if(pot.potionType==='mp'){P.mp=Math.min(P.maxMp,P.mp+Math.floor(pot.heal*mult));floatText('+'+Math.floor(pot.heal*mult)+' MP',px,py-30,'#44aaff',16);}
  else{P.hp=P.maxHp;P.mp=P.maxMp;floatText('FULLY RESTORED!',px,py-30,'#ffd700',16);}
  removeItemFromInventory(idx,1);spawnParticle(px,py,'#ff4488',10,!inDungeon);playSfx('potion',pot.potionType==='full'?1.2:1);msg(pot.icon+' '+pot.name+' used!',1200);renderInv();
}

function addDebuff(type,duration){
  if(P.perks.some(p=>p.name==='Grave Ward'))duration*=0.65;
  if(inDungeon&&dungeonHasMod('Hexed'))duration*=1.3;
  P.debuffs[type]=Math.max(P.debuffs[type]||0,duration);
  const msgs={slow:'❄️ SLOWED!',silence:'🔇 SILENCED! Skills disabled.',weaken:'💀 WEAKENED! -30% damage.',poison:'☠️ POISONED!'};
  msg(msgs[type]||'Debuffed!',2000);
  updateDebuffDisplay();
}

function updateDebuffDisplay(){
  let div=document.getElementById('debuff-display');div.innerHTML='';
  Object.entries(P.debuffs).forEach(([type,t])=>{
    if(t>0){
      let d=document.createElement('div');d.className='debuff-tag';
      const icons={slow:'❄️',silence:'🔇',weaken:'💀',poison:'☠️'};
      d.textContent=(icons[type]||'!')+' '+type.toUpperCase()+' '+Math.ceil(t/1000)+'s';
      div.appendChild(d);
    }
  });
}

function takeDamage(amt,ignoreDefense=false,defenseFactor=.4){
  if(debugGodMode)return;
  if(P.blink>0)return;
  let armor=Math.max(0,playerDef()*defenseFactor);
  let d=ignoreDefense?Math.max(1,Math.floor(amt)):Math.max(1,Math.floor(amt*(85/(85+armor))));
  if(P.perks.some(p=>p.name==='Iron Skin'))d=Math.floor(d*.88);
  if(P.perks.some(p=>p.name==='Grave Ward')&&P.debuffs.poison>0)d=Math.floor(d*.8);
  if(ignoreDefense)d=Math.max(1,Math.floor(d*(1-classMod('trapReduction',0))));
  d=Math.max(1,Math.floor(d*(1-effectiveDamageReduction())));
  P.hp=Math.max(0,P.hp-d);P.blink=180;playSfx('hurt',Math.min(1.35,.7+d/18));
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  floatText(d,px,py-20,'#ff4444');
}

function gainXP(amt){
  let b=P.perks.some(p=>p.name==="Odin's Sight")?1.3:1;
  let bonus=dungeonHasMod('Blessed')?2:1;
  P.xp+=Math.floor(amt*b*bonus);
  while(P.xp>=P.xpNext)levelUp();
}

function levelUp(){
  P.xp-=P.xpNext;P.level++;P.xpNext=Math.floor(P.xpNext*1.6);
  P.maxHp+=16;P.hp=P.maxHp;P.maxMp+=8;P.mp=P.maxMp;P.baseDmg+=2;
  document.getElementById('lvl').textContent='LV '+P.level;
  showLevelUp();
}

function showLevelUp(){
  let owned=new Set(P.perks.map(p=>p.name));
  let available=PERKS.filter(p=>!owned.has(p.name));
  let pool=(available.length?available:[...PERKS]).sort(()=>Math.random()-.5).slice(0,3);
  let div=document.getElementById('perk-list');div.innerHTML='';
  pool.forEach(pk=>{
    let b=document.createElement('button');b.className='pk';
    b.innerHTML=`<b>${pk.name}</b> — <span style="color:#888">${pk.eff}</span>`;
    b.onclick=()=>{applyPerk(pk);openPanel(null);msg('⭐ Blessing unlocked: '+pk.name,2500);};
    div.appendChild(b);
  });
  openPanel('lu');
}

function applyPerk(pk){
  if(P.perks.some(p=>p.name===pk.name))return;
  P.perks.push(pk);
  if(pk.name==='Berserker Blood'){P.maxHp+=60;P.hp=Math.min(P.hp+60,P.maxHp);P.baseDmg+=6;}
  if(pk.name==='Runic Mastery')mpRegenBonus+=2;
  if(pk.name==='Iron Skin')P.def+=15;
  if(pk.name==='Storm Walker')P.spd+=.3;
  if(pk.name==='Iron Stamina'){P.maxStamina+=50;P.stamina=P.maxStamina;}
  if(pk.name==='Arcane Wellspring'){P.maxMp+=35;P.mp=Math.min(P.maxMp,P.mp+35);} 
  if(pk.name==='Bulwark')P._bulwarkWardTimer=Math.max(P._bulwarkWardTimer||0,2500);
}
function initClassPanel(){
  let wrap=document.getElementById('class-list');if(!wrap)return;
  wrap.innerHTML='';
  CLASS_DEFS.forEach(cls=>{
    let d=document.createElement('div');d.className='class-card';
    d.innerHTML=`<div class="class-name">${cls.icon} ${cls.name}</div><div class="class-desc">${cls.desc}</div><div class="class-stats">HP ${cls.stats.maxHp} · MP ${cls.stats.maxMp} · RUN ${cls.stats.maxStamina}<br>ATK ${cls.stats.baseDmg} · DEF ${cls.stats.def} · SPD ${cls.stats.spd.toFixed(2)}</div>`;
    d.onclick=()=>startClass(cls.id);
    wrap.appendChild(d);
  });
}
function classPresentation(cls){
  if(cls.id==='berserker')return{accent:'#d36c45',role:'Frontline Reaver',passive:'Thrives in close combat with stronger melee damage and longer rage windows.',loadout:'Berserker Axe, Leather Vest, and two Minor Heals.',signature:'Best when you stay on top of enemies and force momentum.',focus:[['HP',cls.stats.maxHp],['ATK',cls.stats.baseDmg],['RUN',cls.stats.maxStamina]]};
  if(cls.id==='ranger')return{accent:'#8fbf65',role:'Mobile Hunter',passive:'Excels with ranged power, bonus crit, and efficient sprint control.',loadout:'Hunter Longbow, Leather Vest, one heal, and one mana vial.',signature:'Strongest when kiting, piercing lanes, and punishing openings.',focus:[['SPD',cls.stats.spd.toFixed(2)],['CRIT','High'],['RUN',cls.stats.maxStamina]]};
  if(cls.id==='runecaster')return{accent:'#7ab8ff',role:'Arcane Conduit',passive:'Higher skill power, better mana economy, and shorter cooldown cycles.',loadout:'Storm Staff, Runecarved Tome, two mana vials, and one heal.',signature:'Controls space with spells and scales hard with runes and mana.',focus:[['MP',cls.stats.maxMp],['ATK',cls.stats.baseDmg],['SPELL','Boosted']]};
  return{accent:'#d7b15c',role:'Bulwark Warden',passive:'Natural damage reduction and trap resistance make every floor steadier.',loadout:'Draugr Sword, Warden Mail, Thor\'s Helm, and two Minor Heals.',signature:'Absorbs pressure, holds corridors, and outlasts brutal rooms.',focus:[['DEF',cls.stats.def],['HP',cls.stats.maxHp],['WARD','Heavy']]};
}
function updateClassPanelPresentation(){
  let title=document.getElementById('class-panel-title');
  let copy=document.getElementById('class-panel-copy');
  let reclassing=!!(saveLoaded||P.classId);
  if(title)title.textContent=reclassing?'Reforge Your Echo':'Choose Your Incarnation';
  if(copy)copy.textContent=reclassing
    ?'Ravenwatch can realign your soul with another surviving self. Your stash and lodge memory remain, but your fighting form and starter kit are rewritten.'
    :'The fracture is still unstable. Choose which version of the Echo-Warrior answers the call, and Ravenwatch will arm that self for the descent ahead.';
}
function initClassPanel(){
  let wrap=document.getElementById('class-list');if(!wrap)return;
  updateClassPanelPresentation();
  wrap.innerHTML='';
  CLASS_DEFS.forEach(cls=>{
    let d=document.createElement('div');d.className='class-card';
    let view=classPresentation(cls);
    d.style.setProperty('--class-accent',view.accent);
    d.innerHTML=`<div class="class-card-head"><div class="class-name-wrap"><div class="class-name"><span class="class-icon">${cls.icon}</span> ${cls.name}</div><div class="class-role">${view.role}</div></div><div class="class-pillar"><b>${cls.stats.maxHp}</b><span>Vitality</span></div></div><div class="class-desc">${cls.desc}</div><div class="class-grid"><div class="class-box"><h4>Starting Loadout</h4><div class="class-loadout">${view.loadout}</div></div><div class="class-box"><h4>Passive Edge</h4><div class="class-passive">${view.passive}</div></div></div><div class="class-box" style="margin-top:10px"><h4>Combat Signature</h4><div class="class-skillsig">${view.signature}</div></div><div class="class-stats">${view.focus.map(stat=>`<div class="class-stat"><b>${stat[1]}</b><span>${stat[0]}</span></div>`).join('')}</div><div class="class-select">${(saveLoaded||P.classId)?'Take This Form':'Begin As '+cls.name}</div>`;
    d.onclick=()=>startClass(cls.id);
    wrap.appendChild(d);
  });
}
function applyClass(classId){
  let cls=CLASS_DEFS.find(c=>c.id===classId);if(!cls)return;
  P.classId=cls.id;P.className=cls.name;P.classMods={...(cls.mods||{})};
  clearEchoBlessing();
  P.meta.routeProgress={barrow:1,ember:1,seer:1};
  dungeonFloor=1;
  activeDungeonRouteId='barrow';
  P.maxHp=cls.stats.maxHp;P.hp=P.maxHp;
  P.maxMp=cls.stats.maxMp;P.mp=P.maxMp;
  P.maxStamina=cls.stats.maxStamina;P.stamina=P.maxStamina;
  P.baseDmg=cls.stats.baseDmg;P.def=cls.stats.def;P.spd=cls.stats.spd;
  P.inv=[];P.perks=[];P.gold=0;P.level=1;P.xp=0;P.xpNext=100;P.revived=false;P.rage=false;P.rageTimer=0;
  P._echoBlessing=null;P._echoBlessingUsed=false;P._warHallUsed=false;P._temperBonus=0;P._seidrSurgeTimer=0;P._omenTimer=0;P._omenCritBonus=0;P._bulwarkWardTimer=0;P._huntmasterTimer=0;
  P.equip={
    weapon:cls.equip.weapon?cls.equip.weapon():null,
    armor:cls.equip.armor?cls.equip.armor():null,
    helm:cls.equip.helm?cls.equip.helm():null,
    rune:cls.equip.rune?cls.equip.rune():null
  };
  document.getElementById('lvl').textContent='LV 1';
}
function saveGame(manual=false){
  try{
    let data={
      version:2,
      P:{
        ...P,
        inv:P.inv.map(sanitizeItemForSave),
        equip:{
          weapon:P.equip.weapon?sanitizeItemForSave(P.equip.weapon):null,
          armor:P.equip.armor?sanitizeItemForSave(P.equip.armor):null,
          helm:P.equip.helm?sanitizeItemForSave(P.equip.helm):null,
          rune:P.equip.rune?sanitizeItemForSave(P.equip.rune):null
        }
      },
      stash:stash.map(sanitizeItemForSave),
      dungeonFloor,
      activeDungeonRouteId,
      lastDungeonEntranceId:lastDungeonEntrance?.id??null
    };
    localStorage.setItem(SAVE_KEY,JSON.stringify(data));
    if(manual)msg('💾 Game saved in Ravenwatch.',1400);
    return true;
  }catch(err){
    if(manual)msg('⚠️ Save failed.',1400);
    return false;
  }
}
function loadGame(manual=false){
  try{
    let raw=localStorage.getItem(SAVE_KEY);
    if(!raw){if(manual)msg('⚠️ No save found.',1400);return false;}
    let data=JSON.parse(raw);
    if(!data?.P)return false;
    P={...P,...data.P,inv:(data.P.inv||[]).map(cloneInvItem),equip:{
      weapon:data.P.equip?.weapon?cloneInvItem(data.P.equip.weapon):null,
      armor:data.P.equip?.armor?cloneInvItem(data.P.equip.armor):null,
      helm:data.P.equip?.helm?cloneInvItem(data.P.equip.helm):null,
      rune:data.P.equip?.rune?cloneInvItem(data.P.equip.rune):null
    }};
    stash=(data.stash||[]).map(cloneInvItem);
    dungeonFloor=data.dungeonFloor||1;
    activeDungeonRouteId=data.activeDungeonRouteId||'barrow';
    lastDungeonEntrance=typeof data.lastDungeonEntranceId==='number'?dungeonEntrances.find(e=>e.id===data.lastDungeonEntranceId)||null:null;
    inDungeon=false;dead=false;paused=false;panel=null;bossRef=null;bossActive=false;bossReady=false;bossSpawned=false;bossDefeated=false;bossSealPending=false;pendingBossChoice=false;
    worldEntryPromptCooldown=1200;
    enemies=[];projectiles=[];loot=[];particles=[];floaters=[];
    document.getElementById('death-screen').style.display='none';
    document.getElementById('dungeon-hud').style.display='none';
    document.getElementById('wave-hud').style.display='none';
    clearBossUI();
    document.getElementById('lvl').textContent='LV '+P.level;
    renderInv();
    saveLoaded=true;
    if(manual)msg('⟳ Save loaded.',1400);
    return true;
  }catch(err){
    if(manual)msg('⚠️ Load failed.',1400);
    return false;
  }
}
function confirmSaveGame(){
  if(inDungeon){msg('⚠️ Manual saves are only available in Ravenwatch.',1400);return;}
  if(confirm('Save your current Ravenwatch state?'))saveGame(true);
}
function confirmLoadGame(){
  if(inDungeon){msg('⚠️ Manual loads are only available in Ravenwatch.',1400);return;}
  if(confirm('Load your last save? Any unsaved progress from this run will be lost.'))loadGame(true);
}
function reclassTo(classId){
  let cls=CLASS_DEFS.find(c=>c.id===classId);if(!cls)return;
  Object.values(P.equip).filter(Boolean).forEach(item=>{if(!item.starterItem)addItemToInventory(item);});
  let hpRatio=P.maxHp>0?P.hp/P.maxHp:1,mpRatio=P.maxMp>0?P.mp/P.maxMp:1;
  P.classId=cls.id;P.className=cls.name;P.classMods={...(cls.mods||{})};
  P.baseDmg=cls.stats.baseDmg+Math.max(0,P.level-1)*2;
  P.def=cls.stats.def+(P.perks.some(p=>p.name==='Iron Skin')?15:0);
  P.spd=cls.stats.spd+(P.perks.some(p=>p.name==='Storm Walker')?0.3:0);
  P.maxHp=cls.stats.maxHp+Math.max(0,P.level-1)*20+(P.perks.some(p=>p.name==='Berserker Blood')?60:0);
  P.maxMp=cls.stats.maxMp+Math.max(0,P.level-1)*10;
  P.maxStamina=cls.stats.maxStamina+(P.perks.some(p=>p.name==='Iron Stamina')?50:0);
  P.hp=Math.max(1,Math.min(P.maxHp,Math.floor(P.maxHp*hpRatio)));
  P.mp=Math.max(0,Math.min(P.maxMp,Math.floor(P.maxMp*mpRatio)));
  P.stamina=Math.min(P.maxStamina,P.stamina||P.maxStamina);
  P.equip={
    weapon:cls.equip.weapon?cls.equip.weapon():null,
    armor:cls.equip.armor?cls.equip.armor():null,
    helm:cls.equip.helm?cls.equip.helm():null,
    rune:cls.equip.rune?cls.equip.rune():null
  };
  saveGame(false);
  msg(`🜂 Reclassed as ${cls.name}.`,2200);
}
function openReclass(){
  if(inDungeon){msg('?????? Reclassing is only possible in Midgard.',1400);return;}
  initClassPanel();
  openPanel('class');
}
function debugGrantLevel(){
  P.xp+=P.xpNext;
  while(P.xp>=P.xpNext)levelUp();
  renderInv();
  msg(`???? Advanced to level ${P.level}.`,1600);
}
function spawnDebugEpicGear(){
  let epics=ITEM_BASES.filter(i=>i.type!=='potion'&&i.rarity==='epic');
  let base=epics[Math.floor(Math.random()*epics.length)]||ITEM_BASES[0];
  let item=makeItem(base.id,Math.max(1,dungeonFloor+2),Math.max(1,P.level+1));
  item.rarity='epic';
  item.locked=true;
  if(!addItemToInventory(item)){msg('?????? Inventory full!',1400);return;}
  renderInv();
  msg(`???? Epic test gear added: ${item.name}.`,1600);
}
function debugJumpToFloor(){
  let input=document.getElementById('debug-floor-input');
  let floor=Math.max(1,Math.floor(Number(input?.value||1)||1));
  dungeonFloor=floor;
  if(inDungeon){
    doTransition(()=>{
      generateDungeon(dungeonFloor);
      spawnDungeonContents();
      revealAround(Math.floor(dPlayer.x/DTILE),Math.floor(dPlayer.y/DTILE),5);
      updateDungeonHUD();
    });
  }else{
    if(!lastDungeonEntrance&&dungeonEntrances[0])lastDungeonEntrance=dungeonEntrances[0];
    enterDungeon();
  }
  msg(`???? Jumped to floor ${dungeonFloor}.`,1800);
  closePanel();
}
function toggleDebugGodMode(){
  debugGodMode=!debugGodMode;
  if(debugGodMode){
    P.hp=P.maxHp;
    P.mp=P.maxMp;
    P.stamina=P.maxStamina;
    msg('✨ God Mode enabled.',1400);
  }else{
    msg('God Mode disabled.',1400);
  }
  buildDebugMenu();
  renderInv();
}
function buildDebugMenu(){
  let wrap=document.getElementById('debug-actions');
  if(!wrap)return;
  wrap.innerHTML='';
  const entries=[
    {label:'Load Blade',baseId:1},
    {label:'Load Axe',baseId:0},
    {label:'Load Dagger',baseId:14},
    {label:'Load Pike',baseId:19},
    {label:'Load Bow',baseId:20},
    {label:'Load Staff',baseId:21},
    {label:'Load Hammer',baseId:3},
  ];
  entries.forEach(entry=>{
    let b=document.createElement('button');
    b.className='npc-btn';
    b.textContent=entry.label;
    b.onclick=()=>spawnDebugWeapon(entry.baseId,entry.label.replace('Load ',''));
    wrap.appendChild(b);
  });
  let epic=document.createElement('button');
  epic.className='npc-btn';
  epic.style.gridColumn='1 / -1';
  epic.textContent='Generate Epic Gear';
  epic.onclick=spawnDebugEpicGear;
  wrap.appendChild(epic);
  let lvl=document.createElement('button');
  lvl.className='npc-btn';
  lvl.style.gridColumn='1 / -1';
  lvl.textContent='Gain One Level';
  lvl.onclick=debugGrantLevel;
  wrap.appendChild(lvl);
  let god=document.createElement('button');
  god.className='npc-btn';
  god.style.gridColumn='1 / -1';
  god.style.borderColor=debugGodMode?'#5ccf88':'#4d4d4d';
  god.style.color=debugGodMode?'#baf5cf':'#ddd';
  god.textContent=debugGodMode?'God Mode: ON':'God Mode: OFF';
  god.onclick=toggleDebugGodMode;
  wrap.appendChild(god);
  let floorRow=document.createElement('div');
  floorRow.style.cssText='grid-column:1 / -1;display:flex;gap:8px;align-items:center;flex-wrap:wrap';
  let floorInput=document.createElement('input');
  floorInput.type='number';
  floorInput.min='1';
  floorInput.step='1';
  floorInput.id='debug-floor-input';
  floorInput.value=String(Math.max(1,dungeonFloor));
  floorInput.style.cssText='flex:1;min-width:110px;background:#111;border:1px solid #444;color:#ddd;padding:8px 10px;border-radius:4px';
  let floorBtn=document.createElement('button');
  floorBtn.className='npc-btn';
  floorBtn.textContent='Jump To Floor';
  floorBtn.onclick=debugJumpToFloor;
  floorRow.appendChild(floorInput);
  floorRow.appendChild(floorBtn);
  wrap.appendChild(floorRow);
  let reset=document.createElement('button');
  reset.className='npc-btn';
  reset.style.borderColor='#aa3333';
  reset.style.color='#ff8a8a';
  reset.style.gridColumn='1 / -1';
  reset.textContent='Hard Reset Game';
  reset.onclick=hardResetGame;
  wrap.appendChild(reset);
}
function openDebugMenu(){
  buildDebugMenu();
  openPanel('debug');
}
function spawnDebugWeapon(baseId,label){
  let item=makeStarterItem(baseId,'rare');
  item.locked=true;
  if(!addItemToInventory(item)){msg('?????? Inventory full!',1400);return;}
  renderInv();
  msg(`???? ${label} added to your bag.`,1400);
}
function hardResetGame(){
  if(!confirm('Hard reset the game? This will delete your save, stash, and current progress.'))return;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}
function startClass(classId){
  if(saveLoaded||P.classId)reclassTo(classId);
  else applyClass(classId);
  paused=false;
  closePanel();
  beginRun();
  saveGame(false);
  msg(`Chosen class: <b>${P.className}</b><br><small>${CLASS_DEFS.find(c=>c.id===classId).desc}</small>`,3000);
}

// ── PANELS ─────────────────────────────────────────────────
function clearTransientInput(){
  keys['mouse']=false;
}

function openPanel(name){
  clearTransientInput();
  hideTip();
  ['inv','npc','lu','class','chest','upgrade','shrine','puzzle','descent','checkpoint','debug'].forEach(n=>document.getElementById(n+'-panel').style.display='none');
  if(name==='class')initClassPanel();
  if(name)playSfx('ui',.85);
  panel=name;if(name)document.getElementById(name+'-panel').style.display='block';
}
function closePanel(){hideTip();clearTransientInput();if(pendingChest){collectChest(pendingChest);pendingChest=null;}playSfx('uiClose',.75);openPanel(null);}
function beginRun(){
  if(beginRun.done)return;
  beginRun.done=true;
  enemies=[];projectiles=[];loot=[];
  msg('⚔️ <b>Ragnarok\'s Edge</b><br><small>Midgard is now a safe hub: prepare in Ravenwatch, visit merchants, then choose a dungeon route and descend.<br>WASD=Move | Shift=Sprint | Click/E=Attack | 1-4=Skills | Q=Potion | I=Inventory | F=Interact | P=Pause</small>',8000);
}

// ── INVENTORY ──────────────────────────────────────────────
function openInv(){renderInv();openPanel('inv');}
function toggleStashMode(){if(inDungeon){msg('⚠️ The stash is only accessible in Ravenwatch.',1400);return;}stashMode=!stashMode;renderInv();}
function moveToStash(idx){
  let item=P.inv[idx];if(!item||isStackable(item))return;
  if(stash.length>=60){msg('⚠️ Stash is full.',1200);return;}
  stash.push(cloneInvItem(item));
  removeItemFromInventory(idx,1);
  renderInv();
}
function moveFromStash(idx){
  let item=stash[idx];if(!item)return;
  if(!addItemToInventory(item)){msg('⚠️ Inventory full!',1200);return;}
  stash.splice(idx,1);
  renderInv();
}
function setInvFilter(next){
  invFilter=next;
  ['all','gear','potion','rune'].forEach(name=>{
    let el=document.getElementById('tab-'+name);
    if(el)el.classList.toggle('active',name===next);
  });
  renderInv();
}
function rarityColor(r){return{common:'#aaa',rare:'#4169e1',epic:'#9b30ff',legendary:'#ff8c00',potion:'#ff4488'}[r]||'#aaa';}
function itemSlotLabel(item){
  if(!item)return '';
  if(item.type==='potion')return 'Potion';
  if(item.type==='quest')return 'Quest';
  return item.type==='weapon'?'Weapon':item.type==='armor'?'Armor':item.type==='helm'?'Helm':'Rune';
}
function itemSlotShort(item){
  if(!item)return '';
  if(item.type==='potion')return 'POT';
  if(item.type==='quest')return 'QST';
  return item.type==='weapon'?'WPN':item.type==='armor'?'ARM':item.type==='helm'?'HLM':'RUN';
}
function equippedLabel(item){
  if(!item)return '<span style="color:#444">— none —</span>';
  let rc=rarityColor(item.rarity);
  return `${item.icon} ${item.name}${item.upg>0?` <span style="color:#ffd700">${'★'.repeat(item.upg)}</span>`:''} <span style="color:${rc};font-size:11px">[${item.rarity.toUpperCase()}]</span>`;
}
function equippedLabel(item){
  if(!item)return '<span style="color:#444">â€” none â€”</span>';
  let rc=rarityColor(item.rarity);
  let stars=item.upg>0?` <span style="color:#ffd700">${'*'.repeat(item.upg)}</span>`:'';
  return `${item.icon} ${item.name}${stars} <span style="color:${rc};font-size:11px">[${itemSlotLabel(item).toUpperCase()} · ${item.rarity.toUpperCase()}]</span>`;
}
function bindEquippedSlotTip(slotId,item){
  let node=document.getElementById(slotId);
  if(!node)return;
  node.onmouseenter=item?(e)=>showTip(item,e):null;
  node.onmousemove=item?(e)=>showTip(item,e):null;
  node.onmouseleave=hideTip;
}
function sortInv(){
  let mode=document.getElementById('sort-select').value;
  const RO={legendary:0,epic:1,rare:2,common:3};const TO={weapon:0,armor:1,helm:2,rune:3,potion:4};
  if(mode==='rarity')P.inv.sort((a,b)=>(RO[a.rarity]??99)-(RO[b.rarity]??99)||getItemPower(b)-getItemPower(a)||a.name.localeCompare(b.name));
  else if(mode==='type')P.inv.sort((a,b)=>(TO[a.type]??99)-(TO[b.type]??99)||(RO[a.rarity]??99)-(RO[b.rarity]??99)||a.name.localeCompare(b.name));
  else if(mode==='power')P.inv.sort((a,b)=>getItemPower(b)-getItemPower(a)||(RO[a.rarity]??99)-(RO[b.rarity]??99)||a.name.localeCompare(b.name));
  else P.inv.sort((a,b)=>a.name.localeCompare(b.name));
  renderInv();
}
function renderInv(){
  hideTip();
  let eq=P.equip,hubOnly=!inDungeon;
  document.getElementById('eq-wv').innerHTML=equippedLabel(eq.weapon);
  document.getElementById('eq-av').innerHTML=equippedLabel(eq.armor);
  document.getElementById('eq-hv').innerHTML=equippedLabel(eq.helm);
  document.getElementById('eq-rv').innerHTML=equippedLabel(eq.rune);
  bindEquippedSlotTip('eq-wv',eq.weapon);
  bindEquippedSlotTip('eq-av',eq.armor);
  bindEquippedSlotTip('eq-hv',eq.helm);
  bindEquippedSlotTip('eq-rv',eq.rune);
  document.getElementById('stat-atk').textContent=playerAtk();
  document.getElementById('stat-def').textContent=playerDef();
  document.getElementById('stat-hp').textContent=P.maxHp;
  document.getElementById('stat-mp').textContent=P.maxMp;
  document.getElementById('stat-pot').textContent=countPotions();
  let bagStat=document.getElementById('stat-bag');if(bagStat)bagStat.textContent=`${P.inv.length}/${inventoryCap()}`;
  let echoStat=document.getElementById('stat-echo');if(echoStat){let blessings=[];if(P._echoBlessing)blessings.push(echoBlessingLabel());if(P._skaldBuff)blessings.push(skaldBuffLabel());echoStat.textContent=blessings.length?blessings.join(' • '):'None';}
  let stashLabelHub=document.getElementById('stash-toggle-label');if(stashLabelHub)stashLabelHub.textContent=inDungeon?'?? Stash (Ravenwatch)':stashMode?'?? Hide Stash':'?? Open Stash';
  let stashBtn=document.getElementById('inv-stash-btn');if(stashBtn){stashBtn.disabled=!hubOnly;stashBtn.title=hubOnly?'Open the Ravenwatch stash.':'The stash is only available in Ravenwatch.';}
  let saveBtn=document.querySelector('button.inv-btn[onclick="confirmSaveGame()"]');if(saveBtn){saveBtn.disabled=!hubOnly;saveBtn.title=hubOnly?'Save your Ravenwatch state.':'Manual saves are only available in Ravenwatch.';}
  let loadBtn=document.querySelector('button.inv-btn[onclick="confirmLoadGame()"]');if(loadBtn){loadBtn.disabled=!hubOnly;loadBtn.title=hubOnly?'Load your last Ravenwatch save.':'Manual loads are only available in Ravenwatch.';}
  let reclassBtn=document.getElementById('inv-reclass-btn');if(reclassBtn){reclassBtn.disabled=!hubOnly;reclassBtn.title=hubOnly?'Change class in Ravenwatch.':'Reclassing is only available in Ravenwatch.';}
  let stashLabel=document.getElementById('stash-toggle-label');if(stashLabel)stashLabel.textContent=stashMode?'📦 Hide Stash':'📦 Open Stash';
  let stashWrap=document.getElementById('stash-wrap');if(stashWrap)stashWrap.style.display=!inDungeon&&stashMode?'block':'none';
  if(stashLabel)stashLabel.textContent=inDungeon?'📦 Stash (Ravenwatch)':stashMode?'📦 Hide Stash':'📦 Open Stash';
  ['all','gear','potion','rune'].forEach(name=>{let el=document.getElementById('tab-'+name);if(el)el.classList.toggle('active',name===invFilter);});
  let g=document.getElementById('inv-grid');g.innerHTML='';
  let entries=getInvEntries();
  for(let i=0;i<inventoryCap();i++){
    let item=entries[i]?.item,idx=entries[i]?.idx;
    let d=document.createElement('div');
    d.className='isl'+(item?(' c-'+(item.type==='potion'?'potion':item.rarity)):'');
    if(item){
      let rc=item.type==='potion'?'rc':{common:'rc',rare:'rr',epic:'re',legendary:'rl'}[item.rarity];
      d.innerHTML=`${item.icon}<span class="isl-r ${rc}">${item.type==='potion'?'POT':item.rarity[0].toUpperCase()}</span>${item.upg>0?`<span style="position:absolute;top:1px;left:2px;font-size:9px;color:#ffd700">${'★'.repeat(item.upg)}</span>`:''}`;
      if(item.locked){let lk=document.createElement('span');lk.className='isl-lock';lk.textContent='★';d.appendChild(lk);}
      let slot=document.createElement('span');slot.style.cssText='position:absolute;bottom:11px;left:2px;font-size:8px;color:#e5d4a1;background:rgba(0,0,0,.55);padding:0 2px;border-radius:3px;';slot.textContent=itemSlotShort(item);d.appendChild(slot);
      if((item.qty||1)>1){let qt=document.createElement('span');qt.style.cssText='position:absolute;top:2px;right:3px;font-size:10px;color:#ffd700';qt.textContent=item.qty;d.appendChild(qt);}
      d.onclick=(e)=>{if(stashMode&&!item.locked&&item.type!=='potion'){moveToStash(idx);return;}if(e.shiftKey){toggleItemLock(idx);return;}if(item.type==='potion'){usePotion(idx);closePanel();openInv();}else equipFromInv(idx);};
      d.oncontextmenu=(e)=>{e.preventDefault();dropItem(idx);};
      d.onmouseenter=(e)=>showTip(item,e);d.onmouseleave=hideTip;
    }
    g.appendChild(d);
  }
  document.getElementById('potion-count').textContent=countPotions();
  let sg=document.getElementById('stash-grid');
  if(sg){
    sg.innerHTML='';
    for(let i=0;i<60;i++){
      let item=stash[i];
      let d=document.createElement('div');
      d.className='isl'+(item?(' c-'+(item.type==='potion'?'potion':item.rarity)):'');
      if(item){
        let rc=item.type==='potion'?'rc':{common:'rc',rare:'rr',epic:'re',legendary:'rl'}[item.rarity];
        d.innerHTML=`${item.icon}<span class="isl-r ${rc}">${item.type==='potion'?'POT':item.rarity[0].toUpperCase()}</span>${item.upg>0?`<span style="position:absolute;top:1px;left:2px;font-size:9px;color:#ffd700">${'★'.repeat(item.upg)}</span>`:''}`;
        let slot=document.createElement('span');slot.style.cssText='position:absolute;bottom:11px;left:2px;font-size:8px;color:#e5d4a1;background:rgba(0,0,0,.55);padding:0 2px;border-radius:3px;';slot.textContent=itemSlotShort(item);d.appendChild(slot);
        d.onclick=()=>moveFromStash(i);
        d.onmouseenter=(e)=>showTip(item,e);
        d.onmouseleave=hideTip;
      }
      sg.appendChild(d);
    }
  }
}
function toggleItemLock(idx){
  let item=P.inv[idx];if(!item||item.type==='potion')return;
  item.locked=!item.locked;
  msg(item.locked?'★ Locked '+item.name:'Unlocked '+item.name,1200);
  renderInv();
}
function equipFromInv(idx){
  let item=P.inv[idx];if(!item)return;
  if(item.type==='potion'){usePotion(idx);return;}
  if(item.type==='quest'){msg('◈ This relic belongs to the Bifrost Gate, not an equipment slot.',1600);return;}
  let slot=item.type==='weapon'?'weapon':item.type==='armor'?'armor':item.type==='helm'?'helm':'rune';
  let old=P.equip[slot];P.equip[slot]=item;removeItemFromInventory(idx,1);
  if(old)addItemToInventory(old);
  let hpDelta=equippedHpBonus(item)-equippedHpBonus(old);
  let mpDelta=(item.mpBonus||0)-(old?.mpBonus||0);
  if(hpDelta){P.maxHp+=hpDelta;P.hp=hpDelta>0?Math.min(P.hp+hpDelta,P.maxHp):Math.min(P.hp,P.maxHp);}
  if(mpDelta){P.maxMp+=mpDelta;P.mp=mpDelta>0?Math.min(P.mp+mpDelta,P.maxMp):Math.min(P.mp,P.maxMp);}
  msg('✅ Equipped: '+item.icon+' '+item.name);renderInv();
}
function unequip(slot){
  let item=P.equip[slot];if(!item)return;
  if(!addItemToInventory(item)){msg('⚠️ Inventory full!');return;}
  if(equippedHpBonus(item)){P.maxHp-=equippedHpBonus(item);P.hp=Math.min(P.hp,P.maxHp);}
  if(item.mpBonus){P.maxMp-=item.mpBonus;P.mp=Math.min(P.mp,P.maxMp);}
  P.equip[slot]=null;renderInv();
}
function dropItem(idx){
  let item=P.inv[idx];if(!item)return;
  if(item.locked){msg('⚠️ Item is locked.',1200);return;}
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  let a=Math.random()*Math.PI*2,dist=80+Math.random()*40;
  let dropped=isStackable(item)?{...item,qty:1}:item;
  loot.push({...dropped,qty:undefined,x:px+Math.cos(a)*dist,y:py+Math.sin(a)*dist,id:Math.random(),isDungeon:inDungeon,pickupCooldown:4000});
  removeItemFromInventory(idx,1);lootPickupCooldown=600;msg('🗑️ Dropped: '+item.icon+' '+item.name);renderInv();
}
function dropAll(){if(!confirm('Drop ALL unlocked items?'))return;for(let i=P.inv.length-1;i>=0;i--)if(!P.inv[i].locked)dropItem(i);}
function sellItem(idx){
  let item=P.inv[idx];if(!item)return;
  if(item.locked){msg('⚠️ Item is locked.',1200);return;}
  let price=item.type==='potion'?5:Math.floor((SELL_PRICE[item.rarity]||5)*(1+(item.upg||0)*.5));
  P.gold+=price;removeItemFromInventory(idx,1);msg('💰 Sold '+item.icon+' '+item.name+' for '+price+'g');renderInv();
}
function sellAllCommon(){
  let sold=0,total=0;
  for(let i=P.inv.length-1;i>=0;i--){if(!P.inv[i].locked&&P.inv[i].rarity==='common'&&P.inv[i].type!=='potion'){total+=SELL_PRICE.common;P.inv.splice(i,1);sold++;}}
  P.gold+=total;
  msg(sold>0?'💰 Sold '+sold+' common items for '+total+'g':'No common items.');renderInv();
}
function sellAllBag(){
  let sold=0,total=0;
  for(let i=P.inv.length-1;i>=0;i--){let it=P.inv[i];if(it.type==='potion'||it.locked)continue;let p=Math.floor((SELL_PRICE[it.rarity]||5)*(1+(it.upg||0)*.5));total+=p;P.inv.splice(i,1);sold++;}
  P.gold+=total;
  msg(sold>0?'💰 Sold '+sold+' items for '+total+'g':'Nothing to sell.');renderInv();
}

// ── TOOLTIP ────────────────────────────────────────────────
function getEquippedForSlot(item){
  if(!item||item.type==='potion'||item.type==='quest')return null;
  let s=item.type==='weapon'?'weapon':item.type==='armor'?'armor':item.type==='helm'?'helm':'rune';
  return P.equip[s];
}
function statDiff(nv,ov){let d=nv-ov;if(d>0)return`<span class="tip-up">▲ +${d}</span>`;if(d<0)return`<span class="tip-down">▼ ${d}</span>`;return`<span class="tip-same">= same</span>`;}
function buildTooltip(item){
  if(item.type==='quest')return`<div class="tip-title">${item.icon} ${item.name}</div><div class="tip-rarity" style="color:#ff8c00">${itemSlotLabel(item).toUpperCase()} · LEGENDARY</div><hr class="tip-divider"><div class="tip-stat"><span>Route</span><span>${routeDef(item.routeId||'barrow').name}</span></div><div class="tip-stat"><span>Purpose</span><span>Repair Bifrost Gate</span></div><hr class="tip-divider"><div style="color:#c7b98a;font-size:11px">${item.desc||'A shard of the broken bridge.'}</div><hr class="tip-divider"><div style="color:#555;font-size:11px">Locked relic - cannot be sold or equipped</div>`;
  if(item.type==='potion')return`<div class="tip-title">${item.icon} ${item.name}</div><div class="tip-rarity" style="color:#ff4488">POTION</div><hr class="tip-divider"><div class="tip-stat"><span>${item.potionType==='hp'?'❤️ Heals':item.potionType==='mp'?'💧 Restores':'⚗️ Effect'}</span><span>${item.heal>=999?'FULL':item.heal+(item.potionType==='mp'?' MP':' HP')}</span></div><hr class="tip-divider"><div style="color:#555;font-size:11px">Click to use</div>`;
  let eq=getEquippedForSlot(item),rc={common:'#aaa',rare:'#4169e1',epic:'#9b30ff',legendary:'#ff8c00'}[item.rarity];
  let upgCost=forgeUpgradeCost(item);
  let h=`<div class="tip-title">${item.icon} ${item.name}${item.upg>0?' '+'★'.repeat(item.upg):''}</div>`;
  h+=`<div class="tip-rarity" style="color:${rc}">${item.rarity.toUpperCase()} · ★${item.upg||0}/5 · Next: ${(item.upg||0)<5?upgCost+'g':'MAX'}</div><hr class="tip-divider">`;
  if(item.dmg!=null)h+=`<div class="tip-stat"><span>⚔️ Damage</span><span>${item.dmg}</span></div>`;
  if(item.def!=null)h+=`<div class="tip-stat"><span>🛡️ Defense</span><span>${item.def}</span></div>`;
  if(item.hpBonus)h+=`<div class="tip-stat"><span>❤️ Max HP</span><span>+${item.hpBonus}</span></div>`;
  if(item.mpBonus)h+=`<div class="tip-stat"><span>💧 Max MP</span><span>+${item.mpBonus}</span></div>`;
  if(item.bonusCrit)h+=`<div class="tip-stat"><span>🎯 Crit</span><span>+${item.bonusCrit}%</span></div>`;
  if(item.bonusSpd||item.spdBonus)h+=`<div class="tip-stat"><span>💨 Speed</span><span>+${item.bonusSpd||item.spdBonus}</span></div>`;
  if(item.bonusDmg)h+=`<div class="tip-stat"><span>⚔️ Attack</span><span>+${item.bonusDmg}</span></div>`;
  if(item.manaRegen)h+=`<div class="tip-stat"><span>🔹 Mana Regen</span><span>+${item.manaRegen.toFixed(2)}/s</span></div>`;
  if(item.skillMult)h+=`<div class="tip-stat"><span>✨ Skill Power</span><span>+${Math.round(item.skillMult*100)}%</span></div>`;
  if(item.damageReduction)h+=`<div class="tip-stat"><span>🛡️ Damage Taken</span><span>-${Math.round(item.damageReduction*100)}%</span></div>`;
  if(item.lifesteal)h+=`<div class="tip-stat"><span>🩸 Lifesteal</span><span>${Math.round(item.lifesteal*100)}%</span></div>`;
  if(item.meleeMult)h+=`<div class="tip-stat"><span>🪓 Melee Power</span><span>+${Math.round(item.meleeMult*100)}%</span></div>`;
  if(item.rangedMult)h+=`<div class="tip-stat"><span>🏹 Ranged Power</span><span>+${Math.round(item.rangedMult*100)}%</span></div>`;
  if(item.special)h+=`<div class="tip-stat"><span>✨ Special</span><span style="color:#ffd700">${item.special}</span></div>`;
  if(eq&&eq!==item){h+=`<hr class="tip-divider"><div class="tip-section">vs. ${eq.icon} ${eq.name}</div>`;if(item.dmg!=null||eq.dmg!=null)h+=`<div class="tip-stat"><span>⚔️</span>${statDiff(item.dmg||0,eq.dmg||0)}</div>`;if(item.def!=null||eq.def!=null)h+=`<div class="tip-stat"><span>🛡️</span>${statDiff(item.def||0,eq.def||0)}</div>`;}
  else h+=`<div style="color:#555;font-size:11px;margin-top:6px">Nothing equipped in slot</div>`;
  h+=`<hr class="tip-divider"><div style="color:#555;font-size:11px">Click=equip · Right-click=drop</div>`;
  return h;
}
function buildTooltip(item){
  if(item.type==='quest')return`<div class="tip-title">${item.icon} ${item.name}</div><div class="tip-rarity" style="color:#ff8c00">${itemSlotLabel(item).toUpperCase()} · LEGENDARY</div><hr class="tip-divider"><div class="tip-stat"><span>Route</span><span>${routeDef(item.routeId||'barrow').name}</span></div><div class="tip-stat"><span>Purpose</span><span>Repair Bifrost Gate</span></div><hr class="tip-divider"><div style="color:#c7b98a;font-size:11px">${item.desc||'A shard of the broken bridge.'}</div><hr class="tip-divider"><div style="color:#555;font-size:11px">Locked relic - cannot be sold or equipped</div>`;
  if(item.type==='potion')return`<div class="tip-title">${item.icon} ${item.name}</div><div class="tip-rarity" style="color:#ff4488">${itemSlotLabel(item).toUpperCase()}</div><hr class="tip-divider"><div class="tip-stat"><span>${item.potionType==='hp'?'❤ Heals':item.potionType==='mp'?'💧 Restores':'⚗️ Effect'}</span><span>${item.heal>=999?'FULL':item.heal+(item.potionType==='mp'?' MP':' HP')}</span></div><hr class="tip-divider"><div style="color:#555;font-size:11px">Click to use</div>`;
  let eq=getEquippedForSlot(item),rc={common:'#aaa',rare:'#4169e1',epic:'#9b30ff',legendary:'#ff8c00'}[item.rarity];
  let upgCost=forgeUpgradeCost(item);
  let h=`<div class="tip-title">${item.icon} ${item.name}${item.upg>0?' '+'★'.repeat(item.upg):''}</div>`;
  h+=`<div class="tip-rarity" style="color:${rc}">${itemSlotLabel(item).toUpperCase()} · ${item.rarity.toUpperCase()} · ★${item.upg||0}/5 · Next: ${(item.upg||0)<5?upgCost+'g':'MAX'}</div><hr class="tip-divider">`;
  if(item.dmg!=null)h+=`<div class="tip-stat"><span>⚔️ Damage</span><span>${item.dmg}</span></div>`;
  if(item.def!=null)h+=`<div class="tip-stat"><span>🛡️ Defense</span><span>${item.def}</span></div>`;
  if(item.hpBonus)h+=`<div class="tip-stat"><span>❤ Max HP</span><span>+${item.hpBonus}</span></div>`;
  if(item.mpBonus)h+=`<div class="tip-stat"><span>💧 Max MP</span><span>+${item.mpBonus}</span></div>`;
  if(item.bonusCrit)h+=`<div class="tip-stat"><span>🎯 Crit</span><span>+${item.bonusCrit}%</span></div>`;
  if(item.bonusSpd||item.spdBonus)h+=`<div class="tip-stat"><span>💨 Speed</span><span>+${item.bonusSpd||item.spdBonus}</span></div>`;
  if(item.bonusDmg)h+=`<div class="tip-stat"><span>⚔️ Attack</span><span>+${item.bonusDmg}</span></div>`;
  if(item.manaRegen)h+=`<div class="tip-stat"><span>🔹 Mana Regen</span><span>+${item.manaRegen.toFixed(2)}/s</span></div>`;
  if(item.skillMult)h+=`<div class="tip-stat"><span>✨ Skill Power</span><span>+${Math.round(item.skillMult*100)}%</span></div>`;
  if(item.damageReduction)h+=`<div class="tip-stat"><span>🛡️ Damage Taken</span><span>-${Math.round(item.damageReduction*100)}%</span></div>`;
  if(item.lifesteal)h+=`<div class="tip-stat"><span>🩸 Lifesteal</span><span>${Math.round(item.lifesteal*100)}%</span></div>`;
  if(item.meleeMult)h+=`<div class="tip-stat"><span>🪓 Melee Power</span><span>+${Math.round(item.meleeMult*100)}%</span></div>`;
  if(item.rangedMult)h+=`<div class="tip-stat"><span>🏹 Ranged Power</span><span>+${Math.round(item.rangedMult*100)}%</span></div>`;
  if(item.special)h+=`<div class="tip-stat"><span>✨ Special</span><span style="color:#ffd700">${item.special}</span></div>`;
  if(eq&&eq!==item){h+=`<hr class="tip-divider"><div class="tip-section">vs. ${eq.icon} ${eq.name}</div>`;if(item.dmg!=null||eq.dmg!=null)h+=`<div class="tip-stat"><span>⚔️</span>${statDiff(item.dmg||0,eq.dmg||0)}</div>`;if(item.def!=null||eq.def!=null)h+=`<div class="tip-stat"><span>🛡️</span>${statDiff(item.def||0,eq.def||0)}</div>`;}
  else h+=`<div style="color:#555;font-size:11px;margin-top:6px">Nothing equipped in ${itemSlotLabel(item).toLowerCase()} slot</div>`;
  h+=`<hr class="tip-divider"><div style="color:#555;font-size:11px">Click=equip · Right-click=drop</div>`;
  return h;
}
function showTip(item,e){
  let tip=document.getElementById('tooltip');tip.innerHTML=buildTooltip(item);tip.style.display='block';
  tip.style.left=(e.clientX+16)+'px';tip.style.top=(e.clientY-10)+'px';
  requestAnimationFrame(()=>{let r=tip.getBoundingClientRect();if(r.right>window.innerWidth)tip.style.left=(e.clientX-r.width-8)+'px';if(r.bottom>window.innerHeight)tip.style.top=(e.clientY-r.height+10)+'px';});
}
function hideTip(){document.getElementById('tooltip').style.display='none';}

// ── SHRINE ─────────────────────────────────────────────────
function openShrine(shrine){
  if(shrine.used){msg('🔮 This shrine has already been used.',2000);return;}
  let draft=shrineDrafts[`${shrine.x},${shrine.y}`];
  if(!draft){
    draft={blessings:[...SHRINE_BLESSINGS].sort(()=>Math.random()-.5).slice(0,2),curse:Math.random()<.5?SHRINE_CURSES[Math.floor(Math.random()*SHRINE_CURSES.length)]:null};
    shrineDrafts[`${shrine.x},${shrine.y}`]=draft;
  }
  let opts=document.getElementById('shrine-opts');opts.innerHTML='';
  document.getElementById('shrine-text').textContent='Ancient power gathers here. Two blessings are known, but one sigil is veiled.';
  // Offer 2 random blessings
  draft.blessings.forEach(b=>{
    let btn=document.createElement('button');btn.className='shrine-btn';
    btn.innerHTML=`${b.icon} <b>${b.name}</b> — ${b.desc}`;
    btn.onclick=()=>{shrine.used=true;delete shrineDrafts[`${shrine.x},${shrine.y}`];b.fn();closePanel();};
    opts.appendChild(btn);
  });
  // Hidden fate option
  if(draft.curse){
    let curse=draft.curse;
    let btn=document.createElement('button');btn.className='shrine-btn';btn.style.borderColor='#cc1122';btn.style.color='#ff6644';
    btn.innerHTML=`❔ <b>Veiled Fate</b> — Accept the shrine's hidden will.`;
    btn.onclick=()=>{shrine.used=true;delete shrineDrafts[`${shrine.x},${shrine.y}`];(Math.random()<.45?[...SHRINE_BLESSINGS][Math.floor(Math.random()*SHRINE_BLESSINGS.length)]:curse).fn();closePanel();};
    opts.appendChild(btn);
  }
  openPanel('shrine');
}

function resolveFloorEvent(ev){
  if(!ev||ev.used)return;
  let ex=ev.x*DTILE+DTILE/2,ey=ev.y*DTILE+DTILE/2;
  let classId=P.classId||'';
  ev.used=true;
  if(ev.type==='caravan'){
    if(Math.random()<.6){
      ev.pending=true;ev.used=false;ev.rewardKind='caravan';
      let ambushers=[
        EDEFS.find(e=>e.name==='Wolf')||EDEFS[0],
        EDEFS.find(e=>e.name==='Draugr')||EDEFS[0],
        EDEFS.find(e=>e.name==='Dark Elf')||EDEFS[0]
      ];
      let sf=scaleFactor(dungeonFloor,P.level)*1.18;
      for(let k=0;k<4;k++){
        let def=ambushers[k%ambushers.length],ang=(Math.PI*2/4)*k,isLeader=k===3;
        enemies.push({...def,name:isLeader?'Caravan Marauder':'Starved Scavenger',col:isLeader?'#c68a52':def.col,isElite:isLeader,maxHp:Math.floor(def.hp*sf*(isLeader?1.9:1.2)),hp:Math.floor(def.hp*sf*(isLeader?1.9:1.2)),dmg:Math.floor(def.dmg*sf*(isLeader?1.45:1.05)),xp:Math.floor(def.xp*sf*(isLeader?2.4:1.25)),gold:Math.floor(def.gold*sf*(isLeader?3:1.25)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ex+Math.cos(ang)*58,y:ey+Math.sin(ang)*58,roomId:ev.roomId,isDungeon:true,floorEventId:ev.id});
      }
      spawnParticle(ex,ey,'#d7b15c',18,false);
      spawnRing(ex,ey,'#d7b15c',10,12,false);
      msg('🪙 The wreck stirs. Caravan raiders spring from the shadows!',2800);
      return;
    }
    let rewardGold=scaledGoldValue(22+dungeonFloor*9,dungeonFloor);
    P.gold+=rewardGold;
      let itemReward=rollLootItem(dungeonFloor+1,P.level),potReward={...rollPotion(dungeonFloor)},extraSupplies=Math.random()<.55?rollPotion(dungeonFloor+1):null;
    if(classId==='ranger')itemReward=makeItem([20,14,40][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(classId==='guardian')itemReward=makeItem([23,39,7][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(!addItemToInventory(itemReward))loot.push({...itemReward,x:ex+14,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    if(!addItemToInventory(potReward))loot.push({...potReward,x:ex-14,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    if(extraSupplies&&!addItemToInventory(extraSupplies))loot.push({...extraSupplies,x:ex,y:ey+14,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    floatText('+'+rewardGold+'g',ex,ey-18,'#ffd700',15);
    spawnParticle(ex,ey,'#d7b15c',16,false);
    msg(classId==='ranger'?'🪙 The caravan yields trail gear and mobile supplies suited to a scout.':'🪙 The caravan yields hard coin, salvage, and trail supplies.',2600);
  }else if(ev.type==='font'){
    P.hp=Math.min(P.maxHp,P.hp+40+dungeonFloor*6);
    P.mp=Math.min(P.maxMp,P.mp+55+dungeonFloor*8);
    P._eventWard=(P._eventWard||0)+8;
    P.def+=8;
      let fontReward=Math.random()<.6?rollPotion(dungeonFloor+1):makeItem(8,dungeonFloor,Math.max(1,P.level-1));
    if(classId==='runecaster'){P.mp=Math.min(P.maxMp,P.mp+35);P._seidrSurgeTimer=Math.max(P._seidrSurgeTimer||0,7000);fontReward=makeItem([22,41,44][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);}
    else if(classId==='guardian')P.def+=4;
    else if(classId==='ranger'){P._omenCritBonus=Math.max(P._omenCritBonus||0,.05);P._omenTimer=Math.max(P._omenTimer||0,45000);}
    else if(classId==='berserker'){P._warBannerBonus=Math.max(P._warBannerBonus||0,3+dungeonFloor);P._warBannerTimer=Math.max(P._warBannerTimer||0,45000);}
    if(!addItemToInventory(fontReward))loot.push({...fontReward,x:ex,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    spawnRing(ex,ey,'#7ab8ff',12,20,false);
    spawnTrail(ex,ey,'#7ab8ff',false,10,18);
    msg(classId==='runecaster'?'💧 The runic font floods your sigils with power. Arcane reserves surge.':'💧 The runic font restores body and mind. A warded boon rises from the spring.',2800);
  }else if(ev.type==='gamble'){
    if(Math.random()<.65){
      let gambleReward=rollLootItem(dungeonFloor+2,P.level);
      if(!addItemToInventory(gambleReward))loot.push({...gambleReward,x:ex,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
      let fateGold=scaledGoldValue(34+dungeonFloor*10,dungeonFloor);
      P.gold+=fateGold;
      if(Math.random()<.4){let bonusPotion={...rollPotion(dungeonFloor+1)};if(!addItemToInventory(bonusPotion))loot.push({...bonusPotion,x:ex+16,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});}
      msg('🎲 Fate smiled. The cache cracks open with a rich omen and bright treasure.',2400);
    }else{
      takeDamage(18,true);
      addDebuff(['slow','weaken','silence'][Math.floor(Math.random()*3)],5000);
      msg('🎲 Fate turned. The cache lashes back with a cruel omen.',2400);
    }
    spawnParticle(ex,ey,'#b89cff',15,false);
  }else if(ev.type==='ossuary'){
    ev.pending=true;ev.used=false;
    let def=EDEFS.find(e=>e.name==='Skeleton')||EDEFS[0];
    let sf=scaleFactor(dungeonFloor,P.level)*1.4;
    for(let k=0;k<6;k++){
      let ang=(Math.PI*2/6)*k,isWarden=k===5;
      enemies.push({...def,name:isWarden?'Ossuary Warden':'Restless Boneguard',col:isWarden?'#c9b6ff':'#d3d0bf',isElite:isWarden,maxHp:Math.floor(def.hp*sf*(isWarden?2.6:1.55)),hp:Math.floor(def.hp*sf*(isWarden?2.6:1.55)),dmg:Math.floor(def.dmg*sf*(isWarden?1.9:1.28)),xp:Math.floor(def.xp*sf*(isWarden?3.2:1.65)),gold:Math.floor(def.gold*sf*(isWarden?4.2:1.65)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ex+Math.cos(ang)*64,y:ey+Math.sin(ang)*64,roomId:ev.roomId,isDungeon:true,floorEventId:ev.id});
    }
    spawnParticle(ex,ey,'#c9b6ff',22,false);
    spawnRing(ex,ey,'#c9b6ff',12,16,false);
    msg('⚰️ The ossuary cracks open. Boneguard rise and the chamber turns hostile!',2800);
    return;
  }else if(ev.type==='reliquary'){
    if(Math.random()<.45){
      ev.pending=true;ev.used=false;ev.rewardKind='reliquary';
      let def=EDEFS.find(e=>e.name==='Dark Elf')||EDEFS[0];
      let sf=scaleFactor(dungeonFloor,P.level)*1.2;
      for(let k=0;k<3;k++){
        let ang=(Math.PI*2/3)*k,isKeeper=k===2;
        enemies.push({...def,name:isKeeper?'Reliquary Keeper':'Sealbound Watcher',col:isKeeper?'#f0c987':'#d7b784',isElite:isKeeper,maxHp:Math.floor(def.hp*sf*(isKeeper?2.3:1.4)),hp:Math.floor(def.hp*sf*(isKeeper?2.3:1.4)),dmg:Math.floor(def.dmg*sf*(isKeeper?1.7:1.15)),xp:Math.floor(def.xp*sf*(isKeeper?3:1.5)),gold:Math.floor(def.gold*sf*(isKeeper?3.8:1.6)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ex+Math.cos(ang)*56,y:ey+Math.sin(ang)*56,roomId:ev.roomId,isDungeon:true,floorEventId:ev.id});
      }
      spawnParticle(ex,ey,'#f0c987',18,false);
      msg('🕯️ The reliquary seal breaks. Guardians awaken around the relic!',2600);
      return;
    }
    let relic=Math.random()<.5?makeItem([22,37,41][Math.floor(Math.random()*3)],dungeonFloor+1,P.level):rollLootItem(dungeonFloor+1,P.level);
    if(classId==='runecaster')relic=makeItem([22,41,44][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(!addItemToInventory(relic))loot.push({...relic,x:ex,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    P.gold+=scaledGoldValue(16+dungeonFloor*5,dungeonFloor);
    spawnRing(ex,ey,'#f0c987',10,16,false);
    msg(classId==='runecaster'?'🕯️ The reliquary yields a rune-laden relic that answers your craft.':'🕯️ The reliquary yields a relic fit for a deeper descent.',2400);
  }else if(ev.type==='prisoner'){
    if(Math.random()<.55){
      ev.pending=true;ev.used=false;ev.rewardKind='prisoner';
      let defs=[EDEFS.find(e=>e.name==='Wolf')||EDEFS[0],EDEFS.find(e=>e.name==='Draugr')||EDEFS[0]];
      let sf=scaleFactor(dungeonFloor,P.level)*1.12;
      for(let k=0;k<4;k++){
        let def=defs[k%defs.length],isLeader=k===3;
        enemies.push({...def,name:isLeader?'Jailbreaker':'Escaped Ravager',col:isLeader?'#8ecfb7':def.col,isElite:isLeader,maxHp:Math.floor(def.hp*sf*(isLeader?2.2:1.3)),hp:Math.floor(def.hp*sf*(isLeader?2.2:1.3)),dmg:Math.floor(def.dmg*sf*(isLeader?1.6:1.1)),xp:Math.floor(def.xp*sf*(isLeader?2.6:1.3)),gold:Math.floor(def.gold*sf*(isLeader?3.2:1.2)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ex+(Math.random()-.5)*72,y:ey+(Math.random()-.5)*72,roomId:ev.roomId,isDungeon:true,floorEventId:ev.id});
      }
      spawnParticle(ex,ey,'#8ecfb7',16,false);
      msg('⛓️ The cell bursts wide. A jailbreak turns the room hostile!',2600);
      return;
    }
    let aid=[{...POTIONS[0]},{...POTIONS[3]},rollPotion(dungeonFloor)];
    aid.forEach(item=>{if(!addItemToInventory(item))loot.push({...item,x:ex+(Math.random()-.5)*24,y:ey+(Math.random()-.5)*24,id:Math.random(),isDungeon:true,pickupCooldown:1200});});
    P.gold+=scaledGoldValue(12+dungeonFloor*4,dungeonFloor);
    msg('⛓️ A grateful survivor leaves supplies, coin, and hurried thanks.',2400);
  }else if(ev.type==='warshrine'){
    P._warBannerTimer=Math.max(P._warBannerTimer||0,90000);
    P._warBannerBonus=Math.max(P._warBannerBonus||0,5+dungeonFloor);
    if(classId==='berserker')P._warBannerBonus+=4;
    if(classId==='guardian')P.def+=3;
    spawnRing(ex,ey,'#d66c5c',12,18,false);
    spawnTrail(ex,ey,'#d66c5c',false,10,20);
    msg(classId==='berserker'?'⚔️ The war banner answers your fury. Your blows hit even harder.':'⚔️ You claim the war banner. For a while, your strikes carry old fury.',2400);
  }
  if(ev.type==='forgecache'){
    P._temperBonus=Math.max(P._temperBonus||0,4+Math.ceil(dungeonFloor*.8));
    let forgeLoot=Math.random()<.5?rollLootItem(dungeonFloor+1,Math.max(1,P.level-1)):makeItem([1,4,23,35][Math.floor(Math.random()*4)],dungeonFloor,Math.max(1,P.level-1));
    if(classId==='guardian')forgeLoot=makeItem([23,39,7][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(classId==='berserker')forgeLoot=makeItem([15,35,38][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(classId==='ranger')forgeLoot=makeItem([20,14,40][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(classId==='runecaster')forgeLoot=makeItem([21,22,44][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);
    if(!addItemToInventory(forgeLoot))loot.push({...forgeLoot,x:ex,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    spawnRing(ex,ey,'#e39a57',10,14,false);
    msg('⚒️ The forge ember tempers your path with gear suited to your style.',2600);
  }else if(ev.type==='omenshrine'){
    P._omenTimer=Math.max(P._omenTimer||0,90000);
    P._omenCritBonus=Math.max(P._omenCritBonus||0,.08);
      let omenLoot=Math.random()<.5?makeItem([22,37,41,44][Math.floor(Math.random()*4)],dungeonFloor+1,P.level):rollPotion(dungeonFloor+1);
    if(classId==='ranger'){P._omenCritBonus=Math.max(P._omenCritBonus||0,.14);omenLoot=makeItem([20,40,37][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);}
    if(classId==='runecaster'){P._seidrSurgeTimer=Math.max(P._seidrSurgeTimer||0,8000);omenLoot=makeItem([22,41,44][Math.floor(Math.random()*3)],dungeonFloor+1,P.level);}
    if(!addItemToInventory(omenLoot))loot.push({...omenLoot,x:ex,y:ey,id:Math.random(),isDungeon:true,pickupCooldown:1200});
    spawnRing(ex,ey,'#9ec0ff',10,16,false);
    msg(classId==='ranger'?'🐦 The raven omen settles on your aim. Critical shots come easier now.':'🐦 A raven omen sharpens your eye. Crits come easier for a while.',2600);
  }
  dmap[ev.y][ev.x]=DT.FLOOR;
}
function roomNoise(tx,ty,scale=1){
  let v=Math.sin((tx*17.13+ty*9.27)*scale)*43758.5453;
  return v-Math.floor(v);
}

// ── RUNE PUZZLE ────────────────────────────────────────────
function openPuzzle(puzzle){
  if(puzzle.solved){msg('🔑 This puzzle is already solved.',1500);return;}
  activePuzzle=puzzle;puzzleUserSeq=[];puzzlePhase='show';puzzleIdx=0;puzzleTimer=0;
  puzzleCorrectSeq=puzzle.seq;
  let seqDiv=document.getElementById('rune-sequence');seqDiv.innerHTML='';
  puzzleCorrectSeq.forEach(ri=>{
    let btn=document.createElement('button');btn.className='rune-btn';btn.textContent=RUNE_SYMBOLS[ri];
    seqDiv.appendChild(btn);
  });
  let inputDiv=document.getElementById('puzzle-input');inputDiv.innerHTML='';
  RUNE_SYMBOLS.forEach((sym,i)=>{
    let btn=document.createElement('button');btn.className='rune-btn';btn.textContent=sym;
    btn.onclick=()=>puzzleInput(i);
    inputDiv.appendChild(btn);
  });
  document.getElementById('puzzle-msg').textContent='Watch the top sequence, then click the matching runes below.';
  openPanel('puzzle');
  // Flash the sequence
  setTimeout(()=>flashPuzzleSequence(),500);
}

function concealPuzzleSequence(){
  let btns=document.getElementById('rune-sequence').querySelectorAll('.rune-btn');
  btns.forEach(b=>{b.className='rune-btn';b.textContent='?';});
}

function flashPuzzleSequence(){
  let btns=document.getElementById('rune-sequence').querySelectorAll('.rune-btn');
  puzzlePhase='show';
  let i=0;
  function flash(){
    if(panel!=='puzzle')return;
    if(i>0){btns[i-1].className='rune-btn';btns[i-1].textContent=RUNE_SYMBOLS[puzzleCorrectSeq[i-1]];}
    if(i>=puzzleCorrectSeq.length){concealPuzzleSequence();puzzlePhase='input';document.getElementById('puzzle-msg').textContent='Now repeat the hidden sequence from memory.';return;}
    btns[i].className='rune-btn selected';
    btns[i].textContent=RUNE_SYMBOLS[puzzleCorrectSeq[i]];
    i++;setTimeout(flash,700);
  }
  flash();
}

function puzzleInput(runeIdx){
  if(panel!=='puzzle'||puzzlePhase!=='input')return;
  let expected=puzzleCorrectSeq[puzzleUserSeq.length];
  puzzleUserSeq.push(runeIdx);
  let btns=document.getElementById('rune-sequence').querySelectorAll('.rune-btn');
  if(runeIdx===expected){
    if(btns[puzzleUserSeq.length-1]){btns[puzzleUserSeq.length-1].className='rune-btn correct';btns[puzzleUserSeq.length-1].textContent=RUNE_SYMBOLS[runeIdx];}
    if(puzzleUserSeq.length===puzzleCorrectSeq.length){
      // Solved!
      activePuzzle.solved=true;
      document.getElementById('puzzle-msg').textContent='✅ CORRECT! Vault unlocked!';
      setTimeout(()=>{
        closePanel();
        // Place vault chest
        let vp=activePuzzle;
        dmap[vp.vaultY][vp.vaultX]=DT.CHEST;
        let vaultChest={x:vp.vaultX,y:vp.vaultY,opened:false,isVault:true,rarity:'epic',items:[vp.vaultItem,rollPotion(dungeonFloor),{isGold:true,val:scaledGoldValue(55+dungeonFloor*14,dungeonFloor)}]};
        dchests.push(vaultChest);
        openChest(vaultChest);
        msg('🔑 RUNE VAULT UNLOCKED!',2800);
      },1200);
    }
  }else{
    if(btns[puzzleUserSeq.length-1]){btns[puzzleUserSeq.length-1].className='rune-btn wrong';btns[puzzleUserSeq.length-1].textContent=RUNE_SYMBOLS[runeIdx];}
    document.getElementById('puzzle-msg').textContent='❌ Wrong! Try again...';
    takeDamage(20);
    setTimeout(()=>{
      puzzleUserSeq=[];
      puzzlePhase='show';
      concealPuzzleSequence();
      document.getElementById('puzzle-msg').textContent='Watch again...';
      setTimeout(()=>flashPuzzleSequence(),600);
    },800);
  }
}

// ── NPC ────────────────────────────────────────────────────
function openNPC(npc){
  document.getElementById('npc-portrait').textContent=npc.icon;
  document.getElementById('npc-name').textContent=npc.name;
  document.getElementById('npc-sub').textContent=[npc.role,npc.location].filter(Boolean).join(' • ');
  let d=DIALOGS[npc.dialog];
  document.getElementById('npc-text').textContent=d.lines[Math.floor(Math.random()*d.lines.length)];
  buildNPCOpts(npc);openPanel('npc');
}
function buildNPCOpts(npc){
  let d=DIALOGS[npc.dialog],opts=document.getElementById('npc-opts');opts.innerHTML='';
  d.opts.forEach((o,i)=>{let b=document.createElement('button');b.className='npc-btn';b.textContent=o;b.onclick=()=>npcAction(npc,i);opts.appendChild(b);});
}
function npcAction(npc,idx){
  let d=DIALOGS[npc.dialog];
  if(idx===d.opts.length-1){closePanel();return;}
  if(d.opts[idx]==='Browse & Sell'){buildShopUI(npc);return;}
  if(d.opts[idx]==='Upgrade Gear'){buildUpgradeUI();return;}
  document.getElementById('npc-text').textContent=d.lines[Math.floor(Math.random()*d.lines.length)];
}
function buildShopUI(npc){
  document.getElementById('npc-text').innerHTML=`<b>${npc.shopTitle||'Merchant Stock'}</b><br><small>${npc.shopFlavor||'Buy gear, potions, and sell your loot.'}</small>`;
  let opts=document.getElementById('npc-opts');opts.innerHTML='';
  let bh=document.createElement('div');bh.style.cssText='color:#ffd700;font-size:12px;margin:4px 0 2px';bh.textContent='— BUY —';opts.appendChild(bh);
  let allShop=[...(npc.shopItems||[]),...POTIONS.slice(0,3)];
  allShop.forEach(item=>{
    let isP=item.type==='potion';
    let price=isP?{common:15,rare:40,epic:100,legendary:300}[item.rarity]||15:Math.floor((SELL_PRICE[item.rarity]||8)*3.5);
    let b=document.createElement('button');b.className='npc-btn';
    let rc=isP?'#ff4488':rarityColor(item.rarity);
    b.innerHTML=`<span>${item.icon} ${item.name} <span style="color:${rc};font-size:11px">[${isP?'POT':item.rarity[0].toUpperCase()}]</span> <span style="color:#555;font-size:11px">${item.desc||''}</span></span><span style="color:#ffd700;float:right;margin-left:8px">${price}g</span>`;
    b.onclick=()=>{if(P.gold<price){msg('⚠️ Not enough gold!');return;}if(!addItemToInventory({...item})){msg('⚠️ Inventory full!');return;}P.gold-=price;msg('✅ Purchased: '+item.name);};
    b.addEventListener('click',()=>{renderInv();buildShopUI(npc);});
    opts.appendChild(b);
  });
  let sh=document.createElement('div');sh.style.cssText='color:#ffd700;font-size:12px;margin:8px 0 2px';sh.textContent='— SELL —';opts.appendChild(sh);
  let row=document.createElement('div');row.style.cssText='display:flex;gap:6px;margin-bottom:4px';
  let sa=document.createElement('button');sa.className='npc-btn';sa.style.flex='1';
  sa.innerHTML=`💰 Sell Commons (${P.inv.filter(i=>i.rarity==='common'&&i.type!=='potion').length*SELL_PRICE.common}g)`;
  sa.onclick=()=>{sellAllCommon();buildShopUI(npc);};row.appendChild(sa);
  let sb=document.createElement('button');sb.className='npc-btn';sb.style.flex='1';
  let bv=P.inv.filter(i=>i.type!=='potion').reduce((t,i)=>t+Math.floor((SELL_PRICE[i.rarity]||5)*(1+(i.upg||0)*.5)),0);
  sb.innerHTML=`💰 Sell All Gear (${bv}g)`;
  sb.onclick=()=>{sellAllBag();buildShopUI(npc);};row.appendChild(sb);
  opts.appendChild(row);
  if(P.inv.length===0){let e=document.createElement('div');e.style.cssText='color:#555;font-size:12px;padding:4px';e.textContent='Bag empty.';opts.appendChild(e);}
  else P.inv.forEach((item,i)=>{
    let isP=item.type==='potion',price=isP?5:Math.floor((SELL_PRICE[item.rarity]||5)*(1+(item.upg||0)*.5));
    let rc=isP?'#ff4488':rarityColor(item.rarity);
    let b=document.createElement('button');b.className='npc-btn';
    b.innerHTML=`<span>${item.icon} ${item.name}${item.upg>0?' '+'★'.repeat(item.upg):''} <span style="color:${rc};font-size:11px">[${isP?'POT':item.rarity[0].toUpperCase()}]</span></span><span style="color:#ffd700;float:right;margin-left:8px">${price}g</span>`;
    b.onclick=()=>{sellItem(i);buildShopUI(npc);};opts.appendChild(b);
  });
  let back=document.createElement('button');back.className='npc-btn';back.textContent='← Back';back.onclick=()=>openNPC(npc);opts.appendChild(back);
}
function buildUpgradeUI(){
  let allItems=[P.equip.weapon,P.equip.armor,P.equip.helm,P.equip.rune,...P.inv.filter(i=>i.type!=='potion')].filter(Boolean);
  let div=document.getElementById('upgrade-list');div.innerHTML='';
  if(!allItems.length){div.innerHTML='<div style="color:#555;padding:8px">No items to upgrade.</div>';}
  allItems.forEach(item=>{
    let cost=forgeUpgradeCost(item),maxed=item.upg>=5;
    let d=document.createElement('div');d.className='upg-item';
    let rc=rarityColor(item.rarity);
    d.innerHTML=`<div style="flex:1"><span style="color:${rc}">${item.icon} ${item.name}</span> <span style="color:#ffd700;font-size:12px">${'★'.repeat(item.upg||0)}</span><br><span style="color:#666;font-size:11px">${item.desc||''}</span></div>`;
    let btn=document.createElement('button');btn.className='upg-btn';btn.textContent=maxed?'MAX':cost+'g ★';btn.disabled=maxed||P.gold<cost;
    btn.onclick=()=>{if(P.gold<cost||maxed)return;P.gold-=cost;upgradeItem(item);msg('⚒️ '+item.icon+' '+item.name+' → ★'+item.upg);buildUpgradeUI();renderInv();};
    d.appendChild(btn);div.appendChild(d);
  });
  openPanel('upgrade');
}
function getNearbyWorldLandmark(range=70){
  let best=null,bd=range;
  worldLandmarks.forEach(site=>{
    if(site.kind==='village'||site.kind==='dungeon'||(site.used&&!isReusableLandmarkKind(site.kind)))return;
    let d=Math.hypot(site.x*T+T/2-P.x,site.y*T+T/2-P.y);
    if(d<bd){bd=d;best=site;}
  });
  return best;
}
function rewardLandmark(site,rewards={},headline=''){
  let lx=site.x*T+T/2,ly=site.y*T+T/2;
  playSfx('shrine',1);
  if(rewards.gold){P.gold+=rewards.gold;floatText('+'+rewards.gold+'g',lx,ly-18,'#ffd700',15);}
  (rewards.items||[]).forEach(item=>{
    if(!addItemToInventory({...item}))loot.push({...item,x:lx+Math.random()*40-20,y:ly+Math.random()*40-20,id:Math.random(),isDungeon:false,pickupCooldown:1200});
  });
  if(rewards.hp){P.hp=Math.min(P.maxHp,P.hp+rewards.hp);floatText('+'+rewards.hp+' HP',lx,ly-32,'#ff7a9c',14);}
  if(rewards.mp){P.mp=Math.min(P.maxMp,P.mp+rewards.mp);floatText('+'+rewards.mp+' MP',lx,ly-32,'#7ab8ff',14);}
  if(rewards.maxMp){P.maxMp+=rewards.maxMp;P.mp=Math.min(P.maxMp,P.mp+rewards.maxMp);floatText('+'+rewards.maxMp+' MAX MP',lx,ly-46,'#b9a4ff',13);}
  if(rewards.maxStamina){P.maxStamina+=rewards.maxStamina;P.stamina=Math.min(P.maxStamina,P.stamina+rewards.maxStamina);floatText('+'+rewards.maxStamina+' RUN',lx,ly-46,'#9fd27d',13);}
  spawnParticle(lx,ly,site.kind==='grave'?'#9f8cff':'#d7b15c',18,true);
  if(headline)msg(headline,2800);
}
function interactWorldLandmark(site){
  if(!site||(site.used&&!isReusableLandmarkKind(site.kind)))return;
  if(site.kind==='ruin'){
    site.used=true;
    rewardLandmark(site,{mp:35,maxMp:10,items:[{...POTIONS[3]}]},'ᚱ Stone Circle answered your call. Mana and a runic vial restored.');
  }else if(site.kind==='grove'){
    site.used=true;
    rewardLandmark(site,{hp:55,items:[rollPotion(1)]},'🌲 Sacred Grove soothed your wounds and yielded fresh supplies.');
  }else if(site.kind==='bridge'){
    site.used=true;
    rewardLandmark(site,{gold:45+Math.floor(P.level*12),items:[{...POTIONS[0]}]},'╬ You found a traveler\'s cache beneath the broken bridge.');
  }else if(site.kind==='tower'){
    site.used=true;
    rewardLandmark(site,{gold:30,items:[makeItem(14,1,P.level)],maxStamina:12},'🕯 From the watchtower you recover scout gear and a better sense of the roads ahead.');
  }else if(site.kind==='grave'){
    if(site.pending){msg('☠ The barrows are already stirring. Survive the ambush first.',1800);return;}
    site.pending=true;
    let def=EDEFS.find(e=>e.name==='Skeleton')||EDEFS[0];
    let sf=scaleFactor(1,P.level)*1.8;
    for(let k=0;k<3;k++){
      let ang=(Math.PI*2/3)*k;
      enemies.push({...def,name:k===2?'Barrow Warden':'Restless Dead',col:k===2?'#9b7cff':'#b4b09d',isElite:k===2,maxHp:Math.floor(def.hp*sf*(k===2?2.1:1.2)),hp:Math.floor(def.hp*sf*(k===2?2.1:1.2)),dmg:Math.floor(def.dmg*sf*(k===2?1.5:1.05)),xp:Math.floor(def.xp*sf*(k===2?2.4:1.2)),gold:Math.floor(def.gold*sf*(k===2?3:1.3)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:site.x*T+T/2+Math.cos(ang)*70,y:site.y*T+T/2+Math.sin(ang)*70,isDungeon:false,landmarkSiteId:site.id});
    }
    spawnParticle(site.x*T+T/2,site.y*T+T/2,'#9f8cff',24,true);
    msg('☠ Whispering Barrows awakened! Defeat the restless dead.',2600);
  }
}
function drawWorldSiteSprite(site,sx,sy){
  ctx.save();
  ctx.textAlign='center';
  if(site.kind==='village'){
    drawShadow(sx,sy+20,36,9,.24);
    ctx.fillStyle='#493120';
    ctx.fillRect(sx-30,sy-1,60,25);
    ctx.fillStyle='#725039';
    ctx.fillRect(sx-26,sy+2,52,9);
    ctx.fillStyle='#5d402d';
    ctx.fillRect(sx-21,sy-8,42,8);
    ctx.fillStyle='#7f1f28';
    ctx.beginPath();ctx.moveTo(sx-37,sy-1);ctx.lineTo(sx,sy-33);ctx.lineTo(sx+37,sy-1);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-24,sy+4,48,2);
    ctx.fillStyle='rgba(60,38,22,.18)';
    ctx.fillRect(sx-30,sy+20,60,4);
    ctx.fillStyle='#f0d29a';
    ctx.fillRect(sx-5,sy+8,10,14);
    ctx.fillRect(sx-18,sy+5,7,7);
    ctx.fillRect(sx+11,sy+5,7,7);
  }else if(site.kind==='tower'){
    drawShadow(sx,sy+20,18,6,.22);
    ctx.fillStyle='#57525f';
    ctx.fillRect(sx-14,sy-38,28,54);
    ctx.fillStyle='#736d7b';
    ctx.fillRect(sx-17,sy-40,34,6);
    ctx.fillStyle='rgba(255,255,255,.06)';
    ctx.fillRect(sx-11,sy-34,4,46);
    ctx.fillRect(sx+3,sy-31,3,39);
    ctx.fillStyle='#2f241d';
    ctx.fillRect(sx-4,sy-12,8,20);
    ctx.fillStyle='#f8da82';
    ctx.fillRect(sx-3,sy-24,6,7);
    ctx.fillStyle='#8d1730';
    ctx.fillRect(sx-2,sy-35,4,12);
    ctx.fillStyle='rgba(255,255,255,.04)';
    ctx.fillRect(sx-12,sy-17,24,3);
  }else if(site.kind==='dungeon'){
    drawShadow(sx,sy+18,28,8,.22);
    ctx.fillStyle='#463d56';
    ctx.fillRect(sx-20,sy-4,13,26);
    ctx.fillRect(sx+7,sy-4,13,26);
    ctx.fillStyle='#625872';
    ctx.beginPath();ctx.moveTo(sx-21,sy-4);ctx.lineTo(sx,sy-22);ctx.lineTo(sx+21,sy-4);ctx.closePath();ctx.fill();
    ctx.fillStyle='#0d0916';
    ctx.fillRect(sx-8,sy+2,16,20);
    ctx.fillStyle='rgba(255,255,255,.06)';
    ctx.fillRect(sx-15,sy+1,4,18);
    ctx.fillRect(sx+11,sy+1,4,18);
    ctx.fillStyle='rgba(0,0,0,.2)';
    ctx.fillRect(sx-8,sy+18,16,4);
    ctx.strokeStyle='rgba(185,164,255,.3)';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(sx,sy+8,20,Math.PI*.12,Math.PI*.88);ctx.stroke();
    drawGlow(sx,sy+8,26,'rgb(159,140,255)',.13);
    ctx.fillStyle='#b9a4ff';
    ctx.fillText('V',sx,sy+14);
  }else if(site.kind==='hall'){
    drawShadow(sx,sy+18,28,8,.22);
    ctx.fillStyle='#503523';
    ctx.fillRect(sx-24,sy-3,48,27);
    ctx.fillStyle='#7a5534';
    ctx.beginPath();ctx.moveTo(sx-31,sy-3);ctx.lineTo(sx,sy-27);ctx.lineTo(sx+31,sy-3);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-20,sy+2,40,2);
    ctx.fillStyle='#2c1e17';
    ctx.fillRect(sx-7,sy+6,14,18);
    ctx.fillStyle='#d7b15c';
    ctx.fillRect(sx-14,sy-10,5,10);
    ctx.fillRect(sx+9,sy-10,5,10);
  }else if(site.kind==='meadhall'){
    drawShadow(sx,sy+19,30,8,.22);
    ctx.fillStyle='#5a3926';
    ctx.fillRect(sx-26,sy-1,52,25);
    ctx.fillStyle='#835834';
    ctx.beginPath();ctx.moveTo(sx-33,sy-1);ctx.lineTo(sx,sy-29);ctx.lineTo(sx+33,sy-1);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-20,sy+1,40,2);
    ctx.fillStyle='rgba(63,36,18,.18)';
    ctx.fillRect(sx-24,sy+18,48,4);
    ctx.fillStyle='#f1d08a';
    ctx.fillRect(sx-5,sy+4,10,18);
    ctx.fillStyle='#d7b15c';
    ctx.fillRect(sx+10,sy-12,6,12);
    let fl=pulse(180,site.x+site.y,.76,1);
    ctx.fillStyle='rgba(255,145,45,.78)';
    ctx.beginPath();ctx.ellipse(sx+13,sy-13,4*fl,6*fl,0,0,Math.PI*2);ctx.fill();
  }else if(site.kind==='memorial'){
    drawShadow(sx,sy+14,17,5,.18);
    ctx.fillStyle='#66616d';
    ctx.fillRect(sx-9,sy-8,18,28);
    ctx.fillStyle='#8a8394';
    ctx.fillRect(sx-12,sy-10,24,4);
    ctx.fillStyle='rgba(255,255,255,.06)';
    ctx.fillRect(sx-7,sy-5,14,2);
    ctx.fillStyle='rgba(159,140,255,.18)';
    ctx.fillRect(sx-8,sy-1,16,2);
    ctx.fillStyle='#d7b15c';
    ctx.fillRect(sx-1,sy-4,2,14);
    drawGlow(sx,sy+1,18,'rgb(159,140,255)',.08);
  }else if(site.kind==='council'){
    drawShadow(sx,sy+19,30,8,.22);
    ctx.fillStyle='#43302a';
    ctx.fillRect(sx-26,sy-1,52,25);
    ctx.fillStyle='#6c4f42';
    ctx.beginPath();ctx.moveTo(sx-32,sy-1);ctx.lineTo(sx,sy-29);ctx.lineTo(sx+32,sy-1);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-18,sy+1,36,2);
    ctx.fillStyle='rgba(63,36,18,.18)';
    ctx.fillRect(sx-24,sy+18,48,4);
    ctx.fillStyle='#d7b15c';
    ctx.fillRect(sx-3,sy-18,6,12);
    ctx.fillRect(sx-14,sy+6,7,12);
    ctx.fillRect(sx+7,sy+6,7,12);
    ctx.fillStyle='#2a1a12';
    ctx.fillRect(sx-7,sy+4,14,18);
    ctx.fillStyle='rgba(215,177,92,.16)';
    ctx.fillRect(sx-20,sy+2,40,2);
  }else if(site.kind==='sanctum'){
    drawShadow(sx,sy+17,24,7,.2);
    ctx.fillStyle='#32404e';
    ctx.beginPath();ctx.moveTo(sx,sy-28);ctx.lineTo(sx-18,sy-4);ctx.lineTo(sx-14,sy+19);ctx.lineTo(sx+14,sy+19);ctx.lineTo(sx+18,sy-4);ctx.closePath();ctx.fill();
    ctx.fillStyle='#8ecaf4';
    ctx.fillRect(sx-2,sy-16,4,26);
    ctx.fillRect(sx-12,sy+1,24,4);
    ctx.fillStyle='rgba(255,255,255,.08)';
    ctx.fillRect(sx-9,sy+6,18,2);
    ctx.fillStyle='rgba(12,18,28,.2)';
    ctx.fillRect(sx-7,sy+10,14,5);
    drawGlow(sx,sy+4,24,'rgb(142,202,244)',.12);
  }else if(site.kind==='grave'){
    drawShadow(sx,sy+14,18,5,.18);
    ctx.fillStyle='#5b5662';
    ctx.fillRect(sx-10,sy-2,20,20);
    ctx.fillStyle='#746f7b';
    ctx.fillRect(sx-6,sy-7,12,6);
    ctx.fillStyle='rgba(255,255,255,.05)';
    ctx.fillRect(sx-4,sy-1,8,2);
    ctx.fillStyle='rgba(159,140,255,.18)';
    ctx.fillRect(sx-11,sy-1,22,2);
  }else if(site.kind==='ruin'){
    drawShadow(sx,sy+13,18,4,.18);
    ctx.fillStyle='#6f716f';
    ctx.fillRect(sx-14,sy-6,9,24);
    ctx.fillRect(sx+4,sy-2,8,20);
    ctx.fillStyle='#8f8870';
    ctx.fillRect(sx-15,sy-8,11,4);
    ctx.fillRect(sx+3,sy-4,10,3);
    ctx.fillStyle='rgba(255,255,255,.05)';
    ctx.fillRect(sx-12,sy-2,5,12);
    ctx.fillRect(sx+6,sy+1,4,9);
    ctx.fillStyle='rgba(159,140,255,.26)';
    ctx.fillText('R',sx,sy+15);
  }else if(site.kind==='watcher'){
    let dir=site.facing==='left'?-1:1;
    drawShadow(sx,sy+13,12,3,.22);
    ctx.fillStyle='#1b1e27';
    ctx.fillRect(sx-1,sy+2,2,14);
    ctx.fillStyle='#050607';
    ctx.beginPath();ctx.ellipse(sx-dir,sy+4,8,5.2,-.08*dir,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(sx+5*dir,sy+1,3.6,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(sx+7*dir,sy+2);ctx.lineTo(sx+13*dir,sy+4);ctx.lineTo(sx+7*dir,sy+5);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(sx-5*dir,sy+1);ctx.lineTo(sx-10*dir,sy-8);ctx.lineTo(sx-2*dir,sy-2);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(sx-4*dir,sy+7);ctx.lineTo(sx-14*dir,sy+12);ctx.lineTo(sx-5*dir,sy+10);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(sx+2*dir,sy+7);ctx.lineTo(sx+12*dir,sy+11);ctx.lineTo(sx+3*dir,sy+9);ctx.closePath();ctx.fill();
    ctx.fillStyle=site.watcherId==='huginn'?'#8ecaf4':'#d86c2f';
    ctx.beginPath();ctx.arc(sx+6*dir,sy+1,1.5,0,Math.PI*2);ctx.fill();
    drawGlow(sx+5*dir,sy+1,8,site.watcherId==='huginn'?'rgb(142,202,244)':'rgb(216,108,47)',.08);
  }else if(site.kind==='portal'){
    drawShadow(sx,sy+18,28,8,.24);
    ctx.fillStyle='#363244';
    ctx.fillRect(sx-24,sy+12,48,8);
    ctx.fillStyle='#4f495f';
    ctx.fillRect(sx-27,sy+18,54,4);
    ctx.fillStyle='#5d566f';
    ctx.fillRect(sx-20,sy-16,9,30);
    ctx.fillRect(sx+11,sy-16,9,30);
    ctx.fillStyle='#4a4558';
    ctx.fillRect(sx-19,sy-12,7,22);
    ctx.fillRect(sx+12,sy-12,7,22);
    ctx.fillStyle='#726a83';
    ctx.beginPath();ctx.moveTo(sx-16,sy-16);ctx.lineTo(sx-4,sy-32);ctx.lineTo(sx+4,sy-32);ctx.lineTo(sx+16,sy-16);ctx.lineTo(sx+8,sy-15);ctx.lineTo(sx,sy-26);ctx.lineTo(sx-8,sy-15);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(185,164,255,.15)';
    ctx.beginPath();ctx.arc(sx,sy-2,16,Math.PI*.15,Math.PI*.85);ctx.strokeStyle='rgba(185,164,255,.22)';ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle='rgba(142,202,244,.14)';
    ctx.beginPath();ctx.arc(sx-5,sy-3,2.8,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(sx+6,sy+2,2.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8ecaf4';
    ctx.fillRect(sx-2,sy-10,4,4);
    ctx.fillStyle='rgba(215,177,92,.3)';
    ctx.fillRect(sx-10,sy+13,4,4);
    ctx.fillRect(sx+6,sy+13,4,4);
    drawGlow(sx,sy-3,24,'rgb(142,202,244)',.08);
  }
  ctx.textAlign='left';
  ctx.restore();
}
function worldSiteLabelAnchor(site,sx,sy){
  let cfg={
    village:{dx:0,dy:-52},
    dungeon:{dx:0,dy:-46},
    hall:{dx:0,dy:-50},
    meadhall:{dx:0,dy:-53},
    council:{dx:0,dy:-55},
    tower:{dx:0,dy:-60},
    memorial:{dx:0,dy:-38},
    sanctum:{dx:0,dy:-43},
    grave:{dx:0,dy:-34},
    ruin:{dx:0,dy:-34},
    watcher:{dx:-4,dy:-30},
    portal:{dx:0,dy:-48}
  }[site.kind]||{dx:0,dy:-36};
  return {x:sx+cfg.dx,y:sy+cfg.dy};
}
function interactWorldLandmark(site){
  if(!site||(site.used&&!isReusableLandmarkKind(site.kind)))return;
  if(site.kind==='ruin'){
    site.used=true;
    rewardLandmark(site,{mp:35,maxMp:10,items:[{...POTIONS[3]}]},'ᚱ Stone Circle answered your call. Mana and a runic vial restored.');
  }else if(site.kind==='grove'){
    site.used=true;
    rewardLandmark(site,{hp:55,items:[rollPotion(1)]},'Sacred Grove soothed your wounds and yielded fresh supplies.');
  }else if(site.kind==='bridge'){
    site.used=true;
    rewardLandmark(site,{gold:45+Math.floor(P.level*12),items:[{...POTIONS[0]}]},'You found a traveler\'s cache beneath the broken bridge.');
  }else if(site.kind==='tower'){
    site.used=true;
    rewardLandmark(site,{gold:30,items:[makeItem(14,1,P.level)],maxStamina:12},'From the watchtower you recover scout gear and a better sense of the roads ahead.');
  }else if(site.kind==='hall'){
    let tithe=Math.max(1,Math.ceil(P.gold*0.2));
    if(P._warHallUsed){msg('Ravenwatch already provisioned your next descent.',1800);return;}
    if(P.gold<=0){msg('The quartermaster asks for 20% of your gold for provisions.',1800);return;}
    P.gold-=tithe;P._warHallUsed=true;
    [{...POTIONS[0]},{...POTIONS[3]},rollPotion(Math.max(1,dungeonFloor))].forEach(item=>{
      if(!addItemToInventory(item))loot.push({...item,x:site.x*T+T/2+(Math.random()-.5)*24,y:site.y*T+T/2+(Math.random()-.5)*24,id:Math.random(),isDungeon:false,pickupCooldown:1200});
    });
    msg(`Ravenwatch provisions you for ${tithe}g.`,2600);
  }else if(site.kind==='meadhall'){
    if(P._skaldUsed){msg('The skald has already shared a hall-toast for this descent.',1800);return;}
    P._skaldUsed=true;
    P.hp=Math.min(P.maxHp,P.hp+35);
    P.mp=Math.min(P.maxMp,P.mp+25);
    let tales=[
      {name:'Toast of Iron',label:'Toast of Iron (+4 DEF)',def:4,text:'The skald sings of shield-walls that did not break.'},
      {name:'Toast of Cinders',label:'Toast of Cinders (+3 ATK)',atk:3,text:'The hearth flares as old victories are named aloud.'},
      {name:'Toast of Ravens',label:'Toast of Ravens (+6% Crit)',crit:0.06,text:'A sharp-eyed tale leaves your hands steadier and your aim keener.'},
      {name:'Toast of Breath',label:'Toast of Breath (+0.20 MP Regen)',manaRegen:0.2,text:'The hall roars, and your pulse steadies for the road below.'}
    ];
    P._skaldBuff=tales[Math.floor(Math.random()*tales.length)];
    spawnParticle(site.x*T+T/2,site.y*T+T/2,'#d7b15c',18,true);
    msg(`<b>${P._skaldBuff.name}</b><br><small>${P._skaldBuff.label}</small><br>${P._skaldBuff.text}`,3200);
  }else if(site.kind==='portal'){
    spawnParticle(site.x*T+T/2,site.y*T+T/2,'#8ecaf4',10,true,'rune');
    spawnTrail(site.x*T+T/2,site.y*T+T/2,'#b9a4ff',true,8,18);
    openBifrostGate(site);
  }else if(site.kind==='memorial'){
    openMemorialStone();
  }else if(site.kind==='watcher'){
    spawnParticle(site.x*T+T/2,site.y*T+T/2,site.watcherId==='huginn'?'#8ecaf4':'#d86c2f',14,true,'feather');
    msg(site.watcherId==='huginn'?'<i>The watcher tilts its head. Your choices are being weighed.</i>':'<i>The watcher takes flight. What Ravenwatch remembers, it keeps.</i>',2400);
    openWatcher(site);
  }else if(site.kind==='council'){
    openMidgardCouncil();
  }else if(site.kind==='sanctum'){
    let tithe=Math.max(1,Math.ceil(P.gold*0.15));
    if(P._echoBlessingUsed){msg('The Hall of Echoes has already answered you for this descent.',1800);return;}
    if(P.gold<=0){msg('The bell-keeper asks for 15% of your gold to consecrate your path.',1800);return;}
    clearEchoBlessing();
    P.gold-=tithe;
    P._echoBlessingUsed=true;
    let boons=[
      {name:'Echo of Iron',def:6,msg:'Echo of Iron settles over you. Defense rises for the next descent.'},
      {name:'Echo of Embers',baseDmg:4,msg:'Echo of Embers sharpens your will. Attack rises for the next descent.'},
      {name:'Echo of Breath',spd:0.18,msg:'Echo of Breath lightens your step. Speed rises for the next descent.'},
      {name:'Echo of Insight',mp:24,msg:'Echo of Insight fills your reserves. Max MP rises for the next descent.'}
    ];
    let boon=boons[Math.floor(Math.random()*boons.length)];
    boon.summary=boon.def?`+${boon.def} DEF`:boon.baseDmg?`+${boon.baseDmg} ATK`:boon.spd?`+${boon.spd.toFixed(2)} SPD`:boon.mp?`+${boon.mp} MP`:'Blessed';
    boon.label=`${boon.name} (${boon.summary})`;
    P._echoBlessing=boon;
    if(boon.def)P.def+=boon.def;
    if(boon.baseDmg)P.baseDmg+=boon.baseDmg;
    if(boon.spd)P.spd+=boon.spd;
    if(boon.mp){P.maxMp+=boon.mp;P.mp=Math.min(P.maxMp,P.mp+boon.mp);}
    msg(`<b>${boon.name}</b><br><small>${boon.summary} • ${tithe}g tithe</small><br>${boon.msg}`,3200);
    renderInv();
  }else if(site.kind==='grave'){
    if(site.pending){msg('The barrows are already stirring. Survive the ambush first.',1800);return;}
    site.pending=true;
    let def=EDEFS.find(e=>e.name==='Skeleton')||EDEFS[0];
    let sf=scaleFactor(1,P.level)*1.8;
    for(let k=0;k<3;k++){
      let ang=(Math.PI*2/3)*k;
      enemies.push({...def,name:k===2?'Barrow Warden':'Restless Dead',col:k===2?'#9b7cff':'#b4b09d',isElite:k===2,maxHp:Math.floor(def.hp*sf*(k===2?2.1:1.2)),hp:Math.floor(def.hp*sf*(k===2?2.1:1.2)),dmg:Math.floor(def.dmg*sf*(k===2?1.5:1.05)),xp:Math.floor(def.xp*sf*(k===2?2.4:1.2)),gold:Math.floor(def.gold*sf*(k===2?3:1.3)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:site.x*T+T/2+Math.cos(ang)*70,y:site.y*T+T/2+Math.sin(ang)*70,isDungeon:false,landmarkSiteId:site.id});
    }
    spawnParticle(site.x*T+T/2,site.y*T+T/2,'#9f8cff',24,true);
    msg('Whispering Barrows awakened! Defeat the restless dead.',2600);
  }
}
function puzzleInput(runeIdx){
  if(panel!=='puzzle'||puzzlePhase!=='input')return;
  let expected=puzzleCorrectSeq[puzzleUserSeq.length];
  puzzleUserSeq.push(runeIdx);
  let btns=document.getElementById('rune-sequence').querySelectorAll('.rune-btn');
  if(runeIdx===expected){
    puzzlePhase='input-lock';
    if(btns[puzzleUserSeq.length-1]){
      btns[puzzleUserSeq.length-1].className='rune-btn correct';
      btns[puzzleUserSeq.length-1].textContent=RUNE_SYMBOLS[runeIdx];
    }
    if(puzzleUserSeq.length===puzzleCorrectSeq.length){
      activePuzzle.solved=true;
      document.getElementById('puzzle-msg').textContent='Correct! Vault unlocked!';
      setTimeout(()=>{
        closePanel();
        let vp=activePuzzle;
        dmap[vp.vaultY][vp.vaultX]=DT.CHEST;
        let vaultChest={x:vp.vaultX,y:vp.vaultY,opened:false,isVault:true,rarity:'epic',items:[vp.vaultItem,rollPotion(dungeonFloor),{isGold:true,val:scaledGoldValue(55+dungeonFloor*14,dungeonFloor)}]};
        dchests.push(vaultChest);
        openChest(vaultChest);
        msg('RUNE VAULT UNLOCKED!',2800);
      },1200);
    }else{
      setTimeout(()=>{if(panel==='puzzle'&&activePuzzle&&!activePuzzle.solved)puzzlePhase='input';},120);
    }
  }else{
    puzzlePhase='fail';
    if(btns[puzzleUserSeq.length-1]){
      btns[puzzleUserSeq.length-1].className='rune-btn wrong';
      btns[puzzleUserSeq.length-1].textContent=RUNE_SYMBOLS[runeIdx];
    }
    document.getElementById('puzzle-msg').textContent='Wrong! Try again...';
    takeDamage(20);
    setTimeout(()=>{
      puzzleUserSeq=[];
      puzzlePhase='show';
      concealPuzzleSequence();
      document.getElementById('puzzle-msg').textContent='Watch again...';
      setTimeout(()=>flashPuzzleSequence(),600);
    },800);
  }
}
function tryTalkNPC(){
  if(inDungeon){
    for(let v of dVendors)if(Math.hypot(dPlayer.x-(v.x*DTILE+DTILE/2),dPlayer.y-(v.y*DTILE+DTILE/2))<DTILE*1.2){openNPC(v);return;}
    for(let f of dForges)if(Math.hypot(dPlayer.x-(f.x*DTILE+DTILE/2),dPlayer.y-(f.y*DTILE+DTILE/2))<DTILE*1.2){openNPC(f);return;}
    for(let ev of dFloorEvents)if(!ev.used&&!ev.pending&&Math.hypot(dPlayer.x-(ev.x*DTILE+DTILE/2),dPlayer.y-(ev.y*DTILE+DTILE/2))<DTILE*1.2){resolveFloorEvent(ev);return;}
    return;
  }
  let closest=null,cd=Infinity;
  npcList.forEach(n=>{let d=Math.hypot(n.wx-P.x,n.wy-P.y);if(d<65&&d<cd){cd=d;closest=n;}});
  if(closest&&panel!=='npc'){openNPC(closest);return;}
  let site=getNearbyWorldLandmark();
  if(site&&panel!=='npc')interactWorldLandmark(site);
}

// ── TRANSITION ─────────────────────────────────────────────
function doTransition(fn){
  if(transitioning)return;transitioning=true;
  let el=document.getElementById('transition');
  el.style.transition='opacity .35s';el.style.opacity=1;
  setTimeout(()=>{fn();el.style.transition='opacity .5s';el.style.opacity=0;setTimeout(()=>transitioning=false,600);},380);
}

function leaveDungeonToHub(text='Returned to Midgard. Rest, trade, and prepare for the next descent.'){
  let hist=ensureRunHistory();
  hist.returns++;
  clearEchoBlessing();
  clearSkaldBuff();
  P._skaldUsed=false;
  P._echoBlessingUsed=false;
  P._temperBonus=0;
  P._omenTimer=0;
  P._omenCritBonus=0;
  doTransition(()=>{
    inDungeon=false;bossActive=false;bossRef=null;bossReady=false;bossSpawned=false;bossDefeated=false;bossSealPending=false;pendingBossChoice=false;
    document.getElementById('dungeon-hud').style.display='none';
    document.getElementById('wave-hud').style.display='none';
    clearBossUI();
    enemies=[];projectiles=[];loot=[];
    if(lastDungeonEntrance){P.x=lastDungeonEntrance.wx;P.y=lastDungeonEntrance.wy+T*1.2;}
    worldEntryPromptCooldown=1200;
  });
  saveGame(false);
  setTimeout(()=>msg(text,3200),500);
}

function showDescentChoice(){
  pendingBossChoice=true;
  let boss=currentDungeonBossDef();
  document.getElementById('descent-text').innerHTML=`<b>${boss.name}</b> has fallen on floor ${dungeonFloor}.<br><small>Press deeper into the dungeon or return to the safety of Midgard with your spoils.</small>`;
  openPanel('descent');
}
function showDungeonEntryChoice(){
  let routeId=lastDungeonEntrance?.routeId||activeDungeonRouteId||'barrow';
  let checkpoint=getDungeonCheckpointFloor(routeId);
  let route=currentDungeonRouteDef();
  worldEntryPromptCooldown=350;
  if(checkpoint<=1){dungeonFloor=1;enterDungeon();return;}
  let txt=document.getElementById('checkpoint-text');
  if(txt)txt.innerHTML=`<b>${route.name}</b><br><small>${route.theme}<br>Loot bias: ${route.lootHint}<br>Your last cleared milestone opened a return route to <b>floor ${checkpoint}</b>.</small>`;
  let buttons=document.querySelectorAll('#checkpoint-actions button');
  if(buttons[1]){buttons[1].disabled=false;buttons[1].textContent=`[ Resume Floor ${checkpoint} ]`;}
  openPanel('checkpoint');
}
function chooseDungeonEntry(mode){
  if(mode==='cancel'){worldEntryPromptCooldown=1400;closePanel();return;}
  activeDungeonRouteId=lastDungeonEntrance?.routeId||activeDungeonRouteId||'barrow';
  dungeonFloor=mode==='resume'?getDungeonCheckpointFloor(activeDungeonRouteId):1;
  worldEntryPromptCooldown=600;
  closePanel();
  enterDungeon();
}

function chooseDescent(goDeeper){
  if(goDeeper&&remainingDungeonMinions()>0){msg('⚠️ The dungeon still stirs. Clear the remaining mobs first.',1800);return;}
  pendingBossChoice=false;
  closePanel();
  if(goDeeper)nextFloor();
  else leaveDungeonToHub('🏚️ You return to Midgard with hard-won treasure and fresh scars.');
}

// ── DUNGEON ENTER / NEXT FLOOR ─────────────────────────────
function enterDungeon(){
  let hist=ensureRunHistory();
  activeDungeonRouteId=lastDungeonEntrance?.routeId||activeDungeonRouteId||'barrow';
  let route=currentDungeonRouteDef();
  hist.descents++;
  hist.deepestFloor=Math.max(hist.deepestFloor,dungeonFloor);
  doTransition(()=>{
    inDungeon=true;
    stashMode=false;
    P._warHallUsed=false;
    grantMidgardProvisions();
    document.getElementById('dungeon-hud').style.display='flex';
    document.getElementById('wave-hud').style.display='none';
    generateDungeon(dungeonFloor);
    spawnDungeonContents();
    revealAround(Math.floor(dPlayer.x/DTILE),Math.floor(dPlayer.y/DTILE),5);
    updateDungeonHUD();
  });
  setTimeout(()=>msg('🏚️ '+route.name+' • Floor '+dungeonFloor+(dungeonModifier?' — <span style="color:'+dungeonModifier.col+'">'+dungeonModifier.name+'</span>':'')+`<br><small>${route.theme}<br>${isBossFloor()?'Clear the floor, face the milestone boss, then choose your path':'Clear the floor to reveal the descent onward'}<br>Look for secret walls, shrines & rune puzzles!</small>`,5200),500);
}

function spawnDungeonContents(){
  let r0=drooms[0];let sp=safeFloorPos(r0,[]);
  dPlayer.x=sp.x*DTILE+DTILE/2;dPlayer.y=sp.y*DTILE+DTILE/2;
  currentRoomIdx=0;enemies=[];projectiles=[];loot=[];lootPickupCooldown=0;bossReady=false;bossRoomAnnounced=false;bossRef=null;bossActive=false;bossSpawned=false;bossDefeated=false;bossSealPending=false;pendingBossChoice=false;dungeonStartRoomId=r0.id;dungeonStartSafeTimer=4000;
  clearBossUI();
  // Spawn enemies
  drooms.forEach((r,i)=>{
    if(r.isBossRoom&&!isBossFloor())return;
    if(i===0)return;
    let count=r.isBossRoom?4+Math.floor(dungeonFloor*.8):r.type==='crypt'?3+Math.floor(dungeonFloor*.9):r.type==='prison'?3+Math.floor(dungeonFloor*.8):r.type==='ritual'?2+Math.floor(dungeonFloor*.9):2+Math.min(4,i)+Math.floor(dungeonFloor*1.1);
    for(let k=0;k<count;k++){
      let ep=safeFloorPos(r,[{x:sp.x,y:sp.y}]);
      if(i===0&&Math.hypot(ep.x-sp.x,ep.y-sp.y)<3)continue;
      let def=EDEFS[Math.floor(Math.random()*Math.min(EDEFS.length,3+dungeonFloor))];
      let roomMult=r.type==='crypt'?1.08:r.type==='armory'?1.04:r.type==='ritual'?1.12:r.type==='prison'?1.06:r.type==='library'?1.03:r.type==='barracks'?1.12:r.type==='arena'?1.16:r.type==='champion'?1.18:r.type==='treasury'?.98:1;
      let sf=scaleFactor(dungeonFloor,dungeonEnemyScaleLevel(P.level))*dungeonThreatScale(dungeonFloor)*roomMult;
      let hpScale=dungeonMobDurability(dungeonFloor)*(def.sz<=10?1.35:1)*(dungeonHasMod('Ironbound')?1.18:1),dmgScale=dungeonMobDamage(dungeonFloor);
      enemies.push({...def,maxHp:Math.floor(def.hp*sf*hpScale),hp:Math.floor(def.hp*sf*hpScale),dmg:Math.floor(def.dmg*sf*dmgScale),xp:Math.floor(def.xp*sf*.32),gold:Math.floor(def.gold*sf*(r.type==='treasury'?1.2:1)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ep.x*DTILE+DTILE/2,y:ep.y*DTILE+DTILE/2,roomId:r.id,isDungeon:true});
    }
    if(r.type==='barracks'||r.type==='arena'||r.type==='champion'){
      let ep=safeFloorPos(r,[{x:sp.x,y:sp.y}]);
      let def=EDEFS[Math.floor(Math.random()*Math.min(EDEFS.length,4+dungeonFloor))];
      let sf=scaleFactor(dungeonFloor,dungeonEnemyScaleLevel(P.level))*dungeonThreatScale(dungeonFloor)*(r.type==='arena'?1.22:r.type==='champion'?1.3:1.15);
      enemies.push({...def,name:r.type==='arena'?'Arena Champion':r.type==='champion'?'Dread Champion':'Barracks Captain',isElite:true,isMiniBoss:r.type==='champion',maxHp:Math.floor(def.hp*sf*(r.type==='champion'?3.4:2.6)),hp:Math.floor(def.hp*sf*(r.type==='champion'?3.4:2.6)),dmg:Math.floor(def.dmg*sf*(r.type==='champion'?1.85:1.55)),xp:Math.floor(def.xp*sf*(r.type==='champion'?3.1:2.2)),gold:Math.floor(def.gold*sf*(r.type==='champion'?4.2:2.8)),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ep.x*DTILE+DTILE/2,y:ep.y*DTILE+DTILE/2,roomId:r.id,isDungeon:true,col:def.col,sz:def.sz+(r.type==='champion'?5:3)});
    }
  });
  // Add elites
  dElites.forEach(e=>enemies.push({...e}));
  if(!isBossFloor()&&dungeonFloor>=30){
    let threatRooms=drooms.filter((r,i)=>i>0&&!r.isBossRoom&&!r.isSecret&&r.id!==dungeonStartRoomId);
    let room=threatRooms[Math.floor(Math.random()*threatRooms.length)];
    if(room){
      room.deepThreat=dungeonFloor>=60?'abyssal':'deep';
      let ep=safeFloorPos(room,[{x:sp.x,y:sp.y}]);
      let def=EDEFS[Math.floor(Math.random()*Math.min(EDEFS.length,5+dungeonFloor))];
      let sf=scaleFactor(dungeonFloor,dungeonEnemyScaleLevel(P.level))*dungeonThreatScale(dungeonFloor)*(room.deepThreat==='abyssal'?1.42:1.32);
      enemies.push({...def,name:room.deepThreat==='abyssal'?'Abyss Champion':'Deep Champion',isElite:true,isMiniBoss:true,maxHp:Math.floor(def.hp*sf*3.8),hp:Math.floor(def.hp*sf*3.8),dmg:Math.floor(def.dmg*sf*1.95),xp:Math.floor(def.xp*sf*3.4),gold:Math.floor(def.gold*sf*4.6),shotTimer:0,froze:0,slow:0,id:Math.random(),x:ep.x*DTILE+DTILE/2,y:ep.y*DTILE+DTILE/2,roomId:room.id,isDungeon:true,col:def.col,sz:def.sz+6});
      if(dungeonHasMod('Gravewake'))summonThreatEscort(room,room.deepThreat);
    }
  }
  if(dungeonHasMod('Gravewake')&&!isBossFloor()){
    let threatRooms=drooms.filter((r,i)=>i>0&&!r.isBossRoom&&!r.isSecret&&r.id!==dungeonStartRoomId);
    let room=threatRooms[Math.floor(Math.random()*threatRooms.length)];
    if(room)summonThreatEscort(room,dungeonFloor>=60?'abyssal':'deep');
  }
  let modLabel=document.getElementById('dmod-label');
  if(modLabel){
    let mods=activeDungeonMods();
    let route=currentDungeonRouteDef();
    modLabel.textContent=`${route.name} • Loot Bias: ${route.lootHint}`+(mods.length?` • ⚠️ ${mods.map(m=>m.name).join(' • ')} • Loot: ${currentLootBand().name}`:` • Loot: ${currentLootBand().name}`);
  }
}

function spawnDungeonBoss(){
  if(bossActive||bossRef||bossSpawned||!dbossRoom)return;
  let bdef=currentDungeonBossDef();
  let sf=scaleFactor(dungeonFloor,P.level)*(1+.12*Math.max(0,dungeonFloor-1))*bossDepthMod();
  let boss=dbossRoom;
  let bx=Math.floor(boss.x+boss.w/2)*DTILE+DTILE/2,by=Math.floor(boss.y+boss.h/2)*DTILE+DTILE/2;
  let sigCol=bdef.family==='grave'?'#d0b6ff':bdef.family==='ember'?'#ff7a2f':bdef.family==='serpent'?'#61d36d':'#a7a7ff';
  bossRef={...bdef,maxHp:Math.floor(bdef.maxHp*sf),hp:Math.floor(bdef.maxHp*sf),dmg:Math.floor(bdef.dmg*sf),phase2hp:Math.floor(bdef.phase2hp*sf),phase:1,shotTimer:0,froze:0,slow:0,id:Math.random(),x:bx,y:by,roomId:dbossRoom.id,isDungeon:true,isBoss:true,abilityTimer:2400,auraTimer:0,volleyTimer:0,chargeTimer:0};
  bossRef.affixes=chooseBossAffixes(dungeonFloor);
  bossRef.affixIds=bossRef.affixes.map(a=>a.id);
  bossRef.affixTitle=bossRef.affixes.map(a=>a.name).join(' • ');
  bossRef.affixRateMult=1;
  bossRef.affixTimeRate=1;
  bossRef.affixes.forEach(aff=>{
    bossRef.maxHp=Math.floor(bossRef.maxHp*(aff.hpMult||1));
    bossRef.hp=Math.floor(bossRef.hp*(aff.hpMult||1));
    bossRef.phase2hp=Math.floor(bossRef.phase2hp*(aff.hpMult||1));
    bossRef.dmg=Math.floor(bossRef.dmg*(aff.dmgMult||1));
    bossRef.spd*=aff.spdMult||1;
    bossRef.affixRateMult*=aff.timeRate?1/aff.timeRate:1;
    bossRef.affixTimeRate*=aff.timeRate||1;
  });
  enemies.push(bossRef);bossActive=true;bossSpawned=true;playSfx('bossSpawn',1.15);
  let escortBase=bossEscortBase(bdef);
  spawnBossEscort(bossRef,escortBase,2,bdef.family==='grave'?1.12:bdef.family==='ember'?1.08:1.1,bdef.family==='seer'||bdef.family==='shadow'?1.06:1.03);
  if(dungeonFloor>=20)spawnBossEscort(bossRef,escortBase,2,1.18,1.08);
  if(bossHasAffix(bossRef,'warcaller'))spawnBossEscort(bossRef,escortBase,dungeonFloor>=50?3:2,1.26,1.12);
  document.getElementById('bossbar').style.display='block';document.getElementById('bossname').textContent=bossRef.affixTitle?`${bossRef.affixTitle} ${bdef.name}`:bdef.name;
  if(dungeonFloor>=50)spawnRing(bx,by,'#ffd27a',30,36,false);
  spawnRing(bx,by,sigCol,24,28,false);
  spawnTrail(bx,by,sigCol,false,18,34);
  msg(dungeonFloor>=50?'ALERT: ABYSSAL MILESTONE! '+(bossRef.affixTitle?bossRef.affixTitle+' ':'')+bdef.name+' rises in full wrath!':dungeonFloor>=20?'ALERT: DEEP MILESTONE! '+(bossRef.affixTitle?bossRef.affixTitle+' ':'')+bdef.name+' rises with a retinue!':'ALERT: '+(bossRef.affixTitle?bossRef.affixTitle+' ':'')+bdef.name+' rises within the sanctum!',2800);
}

function nextFloor(){
  if(remainingDungeonMinions()>0){msg('⚠️ Clear the remaining mobs before descending.',1800);return;}
  P._temperBonus=0;
  dungeonFloor++;
  doTransition(()=>{
    generateDungeon(dungeonFloor);spawnDungeonContents();
    revealAround(Math.floor(dPlayer.x/DTILE),Math.floor(dPlayer.y/DTILE),5);updateDungeonHUD();
  });
  let route=currentDungeonRouteDef();
  setTimeout(()=>msg('⬇ '+route.name+' • Floor '+dungeonFloor+(dungeonModifier?' — <span style="color:'+dungeonModifier.col+'">'+dungeonModifier.name+'</span>':'')+`<br><small>${isBossFloor()?'Milestone floor: a boss waits in the depths':'The way deeper will open once the floor is cleared'}<br>${route.theme}</small>`,3400),500);
}

function updateDungeonHUD(){
  let remaining=remainingDungeonMinions();
  let bossName=currentDungeonBossDef().name;
  let objective=isBossFloor()
    ? (bossDefeated?'Choose whether to descend or return to Midgard':
      bossActive?'Survive and slay '+bossName:
      bossReady?'Enter '+bossName+'\'s lair':
      remaining>0?'Hunt '+remaining+' minion'+(remaining===1?'':'s')+' to reveal '+bossName:
      'The sanctum stirs...')
    : (remaining>0?'Clear '+remaining+' remaining foe'+(remaining===1?'':'s')+' to reveal the descent':
      'The descent is open. Step onto the stairs to continue.');
  document.getElementById('floor-num').textContent=dungeonFloor;
  document.getElementById('room-num').textContent=currentRoomIdx+1;
  document.getElementById('room-tot').textContent=drooms.length;
  document.getElementById('floor-enemies').textContent=remaining;
  document.getElementById('floor-enemies-note').textContent=isBossFloor()
    ? (bossDefeated?'Boss Defeated':remaining>0?`Clear ${remaining} To Open Lair`:bossReady?'Lair Open':'Lair Sealed')
    : (remaining>0?`Clear ${remaining} To Reveal Stairs`:'Stairs Revealed');
  document.getElementById('floor-objective').textContent=objective;
  if(bossRef&&bossRef.hp>0)document.getElementById('bossf').style.width=(bossRef.hp/bossRef.maxHp*100)+'%';
}
function remainingDungeonMinions(){return enemies.filter(e=>e.hp>0&&e.isDungeon===true&&!e.isBoss).length;}
function openBossLairIfReady(){
  if(!isBossFloor())return;
  if(!dbossRoom||bossReady||bossActive||bossRef||bossSpawned||bossDefeated)return;
  let remaining=remainingDungeonMinions();
  if(remaining!==0)return;
  bossReady=true;
  if(dbossRoom.doorX!=null&&dbossRoom.doorY!=null&&dmap[dbossRoom.doorY]?.[dbossRoom.doorX]===DT.DOOR)dmap[dbossRoom.doorY][dbossRoom.doorX]=DT.FLOOR;
  let ri=getCurrentRoom();
  if(ri>=0&&drooms[ri]?.isBossRoom){
    spawnDungeonBoss();bossReady=false;bossSealPending=true;
    msg(`⚠️ ${currentDungeonBossDef().name} answers the slaughter!`,2400);
  }else{
    msg(`⚠️ ${currentDungeonBossDef().name} stirs in the arena ahead!`,2400);
  }
}
function openStairsIfReady(){
  if(isBossFloor()||!dstairsPos||bossDefeated)return;
  if(remainingDungeonMinions()!==0)return;
  if(dmap[dstairsPos.y]?.[dstairsPos.x]===DT.WALL){
    dmap[dstairsPos.y][dstairsPos.x]=DT.STAIRS;
    msg('⬇ The way deeper is now open!',2200);
  }
}
function getCurrentRoom(){let ptx=Math.floor(dPlayer.x/DTILE),pty=Math.floor(dPlayer.y/DTILE);return drooms.findIndex(r=>ptx>=r.x&&ptx<r.x+r.w&&pty>=r.y&&pty<r.y+r.h);}
function checkRoomCleared(ri){
  if(ri<0)return;let room=drooms[ri];if(!room||room.cleared)return;
  let alive=enemies.filter(e=>e.hp>0&&e.roomId===room.id&&!e.isBoss).length;
  if(alive===0){
    room.cleared=true;
    let next=drooms[ri+1];
    if(next?.doorX!=null){
      let dt2=next.isBossRoom?DT.BOSS_DOOR:DT.DOOR;
      if(dmap[next.doorY]?.[next.doorX]===dt2){
        dmap[next.doorY][next.doorX]=DT.FLOOR;
        msg(next.isBossRoom?'⚠️ Boss door unlocked! Face '+currentDungeonBossDef().name+'!':'🚪 Room cleared! Door unlocked.',2000);
      }
    }
  }
}
function collectChest(chest){
  if(chest.opened)return;chest.opened=true;dmap[chest.y][chest.x]=DT.FLOOR;
  chest.items.forEach(item=>{
if(item.isGold){let g=item.val*(dungeonHasMod('Blessed')?2:1);P.gold+=g;floatText('+'+g+'g',dPlayer.x,dPlayer.y-20,'#ffd700');}
    else if(addItemToInventory({...item})){}
    else loot.push({...item,x:dPlayer.x+Math.random()*60-30,y:dPlayer.y+Math.random()*60-30,id:Math.random(),isDungeon:true,pickupCooldown:2000});
  });
}
function checkRoomCleared(ri){
  if(ri<0)return;
  let room=drooms[ri];
  if(!room||room.cleared||room.isBossRoom)return;
  let alive=enemies.filter(e=>e.hp>0&&e.roomId===room.id&&!e.isBoss).length;
  if(alive!==0)return;
  room.cleared=true;
  let next=drooms[ri+1];
  if(next?.doorX==null)return;
  let dt2=next.isBossRoom?DT.BOSS_DOOR:DT.DOOR;
  let allMinionsDown=!next.isBossRoom||enemies.filter(e=>e.hp>0&&!e.isBoss).length===0;
  if(allMinionsDown&&dmap[next.doorY]?.[next.doorX]===dt2){
    dmap[next.doorY][next.doorX]=DT.FLOOR;
    if(next.isBossRoom)bossReady=true;
    msg(next.isBossRoom?'⚠️ Boss sanctum opened! Face '+currentDungeonBossDef().name+'!':'🚪 Room cleared! Door unlocked.',2200);
  }
}
function openChest(chest){
  if(chest.opened)return;pendingChest=chest;
  playSfx('chest',1);
  document.querySelector('#chest-panel h3').textContent=chest.isVault?'Rune Vault Opened!':'Treasure Chest!';
  let div=document.getElementById('chest-items');div.innerHTML='';
  if(chest.isVault){
    let note=document.createElement('div');note.className='chest-item';
    note.style.borderColor='#ffd700';note.style.color='#ffd700';
    note.innerHTML='<b>Vault Reward</b><br><span style="color:#aaa;font-size:12px">The sealed rune cache has opened. Collect your prize.</span>';
    div.appendChild(note);
  }
  chest.items.forEach(item=>{
    let d=document.createElement('div');d.className='chest-item';
    if(item.isGold)d.innerHTML=`💰 <b>${item.val}g</b> gold`;
    else{let rc=item.type==='potion'?'#ff4488':rarityColor(item.rarity);d.innerHTML=`${item.icon} <b>${item.name}</b> <span style="color:${rc}">[${item.type==='potion'?'POTION':item.rarity.toUpperCase()}]</span><br><span style="color:#666;font-size:12px">${item.desc||''}</span>`;}
    div.appendChild(d);
  });
  openPanel('chest');
}

// ── ENEMIES ────────────────────────────────────────────────
function checkRoomCleared(ri){
  if(ri<0)return;
  let room=drooms[ri];
  if(!room||room.cleared)return;
  let alive=enemies.filter(e=>e.hp>0&&e.roomId===room.id&&!e.isBoss).length;
  if(alive!==0)return;
  room.cleared=true;
  let next=drooms[ri+1];
  if(next?.doorX==null)return;
  let dt2=next.isBossRoom?DT.BOSS_DOOR:DT.DOOR;
  let remaining=enemies.filter(e=>e.hp>0&&!e.isBoss).length;
  let allMinionsDown=!next.isBossRoom||remaining===0;
  if(allMinionsDown&&dmap[next.doorY]?.[next.doorX]===dt2){
    dmap[next.doorY][next.doorX]=DT.FLOOR;
    if(next.isBossRoom)bossReady=true;
    msg(next.isBossRoom?`⚠️ ${currentDungeonBossDef().name}'s lair is now open!`:'🚪 Room cleared! Door unlocked.',2400);
  }
}
function checkRoomCleared(ri){
  if(ri<0)return;
  let room=drooms[ri];
  if(!room||room.cleared||room.isBossRoom)return;
  let alive=enemies.filter(e=>e.hp>0&&e.isDungeon===true&&e.roomId===room.id&&!e.isBoss).length;
  if(alive!==0)return;
  room.cleared=true;
  let next=drooms[ri+1];
  if(next?.doorX==null||next?.doorY==null)return;
  if(next.isBossRoom){openBossLairIfReady();return;}
  if(dmap[next.doorY]?.[next.doorX]===DT.DOOR){
    dmap[next.doorY][next.doorX]=DT.FLOOR;
    msg('Door unlocked.',2400);
  }
}
function spawnEnemy(nearPlayer){
  let def=EDEFS[Math.floor(Math.random()*5)];
  let sf=scaleFactor(1,P.level)*(1+wave*.08);
  let e={...def,maxHp:Math.floor(def.hp*sf),hp:Math.floor(def.hp*sf),dmg:Math.floor(def.dmg*sf),xp:Math.floor(def.xp*sf),gold:Math.floor(def.gold*sf),shotTimer:0,froze:0,slow:0,id:Math.random(),x:0,y:0};
  let tries=0;
  do{e.x=nearPlayer?P.x+(Math.random()-.5)*500:Math.random()*WS*T;e.y=nearPlayer?P.y+(Math.random()-.5)*500:Math.random()*WS*T;tries++;}
  while((isBlockedWorld(e.x,e.y)||Math.hypot(e.x-P.x,e.y-P.y)<160)&&tries<30);
  enemies.push(e);
}
function spawnEnemiesWorld(n,near){for(let i=0;i<n;i++)spawnEnemy(near);}
function spawnWorldBoss(){
  if(inDungeon)return;
  bossActive=true;
  let def=WORLD_BOSSES[worldBossIndex%WORLD_BOSSES.length];worldBossIndex++;
  let sf=scaleFactor(1,P.level);
  bossRef={...def,hp:Math.floor(def.maxHp*sf),maxHp:Math.floor(def.maxHp*sf),dmg:Math.floor(def.dmg*sf),phase2hp:Math.floor(def.phase2hp*sf),phase:1,shotTimer:0,froze:0,slow:0,id:Math.random(),x:P.x+350,y:P.y+100,isBoss:true,isDungeon:false};
  enemies.push(bossRef);document.getElementById('bossbar').style.display='block';document.getElementById('bossname').textContent=def.name;
  msg('⚠️ '+def.name+' AWAKENS! ⚠️',4000);
}
function dropLoot(x,y,isDungeon,floor){
  floor=floor||dungeonFloor||1;
  if(Math.random()<.18){
    let p=clampLootPos(x+(Math.random()-.5)*18,y+(Math.random()-.5)*18,isDungeon);
    loot.push({...rollLootItem(floor,P.level),x:p.x,y:p.y,id:Math.random(),isDungeon,pickupCooldown:600});
  }
  if(Math.random()<.035){
    let p=clampLootPos(x+15+(Math.random()-.5)*12,y+10+(Math.random()-.5)*12,isDungeon);
    loot.push({...rollPotion(floor),x:p.x,y:p.y,id:Math.random(),isDungeon,pickupCooldown:600});
  }
  let gv=scaledGoldValue(8+Math.random()*(14+floor*3),floor);
  if(Math.random()<.48){
    let p=clampLootPos(x+8+(Math.random()-.5)*20,y+4+(Math.random()-.5)*20,isDungeon);
    loot.push({isGold:true,val:gv,x:p.x,y:p.y,id:Math.random(),isDungeon,pickupCooldown:600});
  }
}
function dropEnemyLoot(enemy){
  if(!enemy)return;
  if(enemy.isBoss)return;
  if(enemy.isMiniBoss){
    dropLoot(enemy.x,enemy.y,inDungeon,dungeonFloor);
    return;
  }
  if(enemy.isElite){
    if(Math.random()<.7){
      let p=clampLootPos(enemy.x+8+(Math.random()-.5)*20,enemy.y+4+(Math.random()-.5)*20,inDungeon);
      loot.push({isGold:true,val:scaledGoldValue(20+Math.random()*(20+dungeonFloor*3),dungeonFloor),x:p.x,y:p.y,id:Math.random(),isDungeon:inDungeon,pickupCooldown:600});
    }
    if(Math.random()<.4){
      let p=clampLootPos(enemy.x+(Math.random()-.5)*18,enemy.y+(Math.random()-.5)*18,inDungeon);
      loot.push({...rollPotion(dungeonFloor),x:p.x,y:p.y,id:Math.random(),isDungeon:inDungeon,pickupCooldown:600});
    }
    return;
  }
  if(Math.random()<.06){
    let p=clampLootPos(enemy.x+8+(Math.random()-.5)*16,enemy.y+4+(Math.random()-.5)*16,inDungeon);
    loot.push({isGold:true,val:scaledGoldValue(5+Math.random()*(7+dungeonFloor*1.4),dungeonFloor),x:p.x,y:p.y,id:Math.random(),isDungeon:inDungeon,pickupCooldown:600});
  }
}
function awardBossLoot(x,y,bossName){
  let rewards=[rollBossReward(bossName,dungeonFloor,P.level),rollLootItem(dungeonFloor+2,P.level,true),rollPotion(dungeonFloor)];
  let routeId=activeDungeonRouteId||lastDungeonEntrance?.routeId||currentDungeonRouteDef().id;
  if(inDungeon&&dungeonFloor===100){
    let shard=grantBifrostShardReward(routeId,x,y);
    if(shard){
      msg(`◈ ${shard.name} recovered from the depths. The Broken Bifrost Gate stirs in Ravenwatch.`,3600);
    }
  }
  rewards.forEach((item,idx)=>{
    if(addItemToInventory(item))return;
    loot.push({...item,x:x+(idx-1)*18,y:y+8,id:Math.random(),isDungeon:true,pickupCooldown:800});
  });
}

// ── SKILLS ─────────────────────────────────────────────────
function useSkill(i){
  if(skillCD[i]>0||panel)return;
  if(P.debuffs.silence>0){msg('🔇 Skills silenced!',1500);return;}
  const costs=[30,40,35,50],cds=[4,7,9,16];
  let skillCostMult=i===3?classMod('rageCost',1):classMod('skillCost',1);
  if(P.mp<costs[i]*skillCostMult){msg('⚠️ Not enough mana!');return;}
  P.mp-=costs[i]*skillCostMult;skillCD[i]=cds[i]*1000*classMod('skillCooldown',1);
  if(P.perks.some(p=>p.name==='Arcane Wellspring'))P.mp=Math.min(P.maxMp,P.mp+8);
  if(P.perks.some(p=>p.name==='Seidr Surge'))P._seidrSurgeTimer=4500;
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  let sm=playerSkillMult();
  if(i===0){
    playSfx('skillAxes',1);
    let base=Math.atan2(P.facing.y,P.facing.x);
    [-0.3,0,0.3].forEach(s=>{let a=base+s;projectiles.push({x:px,y:py,startX:px,startY:py,range:320,vx:Math.cos(a)*7,vy:Math.sin(a)*7,dmg:playerAtk()*1.4*sm,type:'axe',life:1,col:'#c8a000',sz:7,owner:'player',isDungeon:inDungeon});});
    spawnRing(px,py,'#d7b15c',10,16,!inDungeon);
  }else if(i===1){
    playSfx('skillWrath',1.05);
    let hit=0,wrathRange=P.perks.some(p=>p.name==='Tempest Calling')?320:260;
    enemies.forEach(e=>{if(Math.hypot(e.x-px,e.y-py)<wrathRange){let d=Math.floor((34+P.level*4+playerAtk()*.9)*sm*playerVsEliteMult(e)*playerVsControlMult(e));e.hp-=d;e.slow=Math.max(e.slow||0,.28);applyEnemyHitFeedback(e,(e.x-px)/Math.max(1,Math.hypot(e.x-px,e.y-py)),(e.y-py)/Math.max(1,Math.hypot(e.x-px,e.y-py)),'#4169e1',true);floatText(d,e.x,e.y,'#4169e1');spawnParticle(e.x,e.y,'#4169e1',10,!inDungeon,'rune');hit++;}});
    if(hit>0&&P.perks.some(p=>p.name==='Tempest Calling'))enemies.filter(e=>e.hp>0&&Math.hypot(e.x-px,e.y-py)<wrathRange+40).sort((a,b)=>Math.hypot(a.x-px,a.y-py)-Math.hypot(b.x-px,b.y-py)).slice(0,2).forEach(e=>{let d=Math.floor((18+P.level*2+playerAtk()*.45)*sm*playerVsEliteMult(e));e.hp-=d;e.slow=Math.max(e.slow||0,.35);applyEnemyHitFeedback(e,0,0,'#7aa6ff',false);spawnRing(e.x,e.y,'#7aa6ff',6,8,!inDungeon);});
    if(hit>0)addScreenShake(1.05,95);
    spawnRing(px,py,'#4169e1',12,20,!inDungeon);
    msg('⚡ Odin\'s Wrath! Hit '+hit+' enemies',2000);
  }else if(i===2){
    playSfx('skillFrost',1);
    let frostDmg=Math.floor((22+P.level*3+playerAtk()*.55)*frostDamageMult());
    enemies.forEach(e=>{if(Math.hypot(e.x-px,e.y-py)<220){let alreadyFrozen=e.froze>0||e.slow>0;let dealt=Math.floor(frostDmg*playerVsEliteMult(e)*(alreadyFrozen&&P.perks.some(p=>p.name==='Winter\'s Bite')?1.3:1));e.froze=3000;e.slow=1;e.hp-=dealt;applyEnemyHitFeedback(e,(e.x-px)/Math.max(1,Math.hypot(e.x-px,e.y-py)),(e.y-py)/Math.max(1,Math.hypot(e.x-px,e.y-py)),'#c6ebff',true);floatText(dealt,e.x,e.y,'#a0d0ff');spawnParticle(e.x,e.y,'#c6ebff',8,!inDungeon,'spark');if(alreadyFrozen&&P.perks.some(p=>p.name==='Winter\'s Bite'))spawnRing(e.x,e.y,'#c6ebff',6,10,!inDungeon);}});
    addScreenShake(1.15,100);
    spawnRing(px,py,'#a0d0ff',12,24,!inDungeon);
    spawnTrail(px,py,'#c6ebff',!inDungeon,8,20);
    msg('❄️ Frost Nova! Enemies frozen and shattered!',2000);
  }else{
    playSfx('skillRage',1.1);
    P.rage=true;P.rageTimer=6500*classMod('rageDuration',1)*(P.perks.some(p=>p.name==='Relentless')?1.2:1);
    spawnRing(px,py,'#ff4400',20,20,!inDungeon);
    spawnTrail(px,py,'#ff7a3d',!inDungeon,14,24);
    msg('🔥 BERSERKER RAGE! Damage doubled!',2000);
  }
}

// ── COMBAT ─────────────────────────────────────────────────
function doAttack(){
  if(P.attackTimer>0||panel)return;
  let spd=P.perks.some(p=>p.name==='Dual Wield')?0.65:1;
  let ws=getWeaponStyle();
  let tempo=earlyGameAttackTempo();
  let trance=playerAttackTempoMult();
  P.attackPoseTimer=Math.max(P.attackPoseTimer||0,170*ws.attackSpeed);
  if(P.classId==='berserker'){
    P.attackTimer=220*spd*ws.attackSpeed*tempo*trance;
    meleeSwing(1.18*(ws.meleeMult||1),ws.reach||52,ws.arc||34,0,ws);
  }
  else if(P.classId==='ranger'){
    P.attackTimer=230*spd*ws.attackSpeed*tempo*trance;
    P.atkMode=(P.atkMode+1)%3;
    if(ws.id==='dagger'||ws.id==='blade'||ws.id==='axe'||ws.id==='hammer'||ws.id==='pike')meleeSwing(.92*(ws.meleeMult||1),ws.reach||42,ws.arc||22,0,ws);
    else if(ws.id==='arcane')shootArcane(0.92*(1+(ws.skillMult||0)));
    else shootArrow(.95*(ws.rangedMult||1),P.atkMode===2?2:1,P.atkMode===2?0.12+(ws.spread||0):ws.spread||0,ws);
  }
  else if(P.classId==='runecaster'){
    P.attackTimer=250*spd*ws.attackSpeed*tempo*trance;
    if(ws.id==='axe'||ws.id==='hammer'||ws.id==='blade'||ws.id==='pike'||ws.id==='dagger')meleeSwing(.95*(ws.meleeMult||1),ws.reach||42,ws.arc||22,0,ws);
    else shootArcane(1+(ws.skillMult||0));
  }
  else if(P.classId==='guardian'){
    P.attackTimer=320*spd*ws.attackSpeed*tempo*trance;
    P.atkMode=(P.atkMode+1)%2;
    if(P.atkMode===0)meleeSwing(1.05*(ws.meleeMult||1),ws.reach||46,Math.max(30,ws.arc||30),.2,ws);else guardianBash(ws);
  }
  else{
    P.attackTimer=280*spd*ws.attackSpeed*tempo*trance;
    P.atkMode=(P.atkMode+1)%3;
    if(ws.id==='bow')shootArrow(1.02*(ws.rangedMult||1),P.atkMode===2?2:1,P.atkMode===2?0.1+(ws.spread||0):ws.spread||0,ws);
    else if(ws.id==='arcane')shootArcane(1+(ws.skillMult||0));
    else meleeSwing(ws.meleeMult||1,ws.reach||42,ws.arc||22,0,ws);
  }
}
function meleeSwing(dmgMult=1,reach=42,arcPad=22,slowHit=0,ws=null){
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  let ax=px+P.facing.x*reach,ay=py+P.facing.y*reach;
  ws=ws||getWeaponStyle();
  playSfx('melee',ws.id==='hammer'||ws.id==='axe'?1.08:.92);
  let hitSomething=false;
  enemies.forEach(e=>{
    if(Math.hypot(e.x-ax,e.y-ay)<e.sz+arcPad){
      hitSomething=true;
      let d=playerAtk()*playerMeleeMult()*dmgMult*playerVsEliteMult(e)*playerVsControlMult(e);
      if(Math.random()<playerCrit()+(ws.critBonus||0))d=Math.floor(d*2.2),floatText('CRIT! '+Math.floor(d),e.x,e.y-16,'#ff4400');
      else floatText(Math.floor(d),e.x,e.y,'#ffd700');
      applyEnemyHitFeedback(e,P.facing.x,P.facing.y,ws.color||(P.classId==='guardian'?'#88ccff':P.classId==='runecaster'?'#9b7cff':'#ff3300'),d>playerAtk()*1.5);
      addScreenShake(d>playerAtk()*1.5?1.35:0.7,d>playerAtk()*1.5?110:70);
      e.hp-=d;spawnParticle(e.x,e.y,ws.color||(P.classId==='guardian'?'#88ccff':P.classId==='runecaster'?'#9b7cff':'#ff3300'),7,!inDungeon,'spark');
      let leech=playerLifeSteal();
      if(leech>0)P.hp=Math.min(P.maxHp,P.hp+Math.max(1,Math.floor(d*leech)));
      if(P.perks.some(p=>p.name==='Frost Touch')||P.equip.weapon?.special==='slow'||slowHit>0){e.slow=.5+slowHit;e.froze=Math.max(e.froze,600+slowHit*1000);}
      if(P.equip.weapon?.special==='shockwave')enemies.forEach(e2=>{if(e2!==e&&Math.hypot(e2.x-e.x,e2.y-e.y)<80){e2.hp-=Math.floor(d*.4);spawnParticle(e2.x,e2.y,'#ffaa00',5,!inDungeon);}});
      if(P.equip.weapon?.special==='lightning'&&Math.random()<.3){let cl=enemies.filter(e2=>e2!==e&&e2.hp>0).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];if(cl){cl.hp-=Math.floor(d*.5);spawnParticle(cl.x,cl.y,'#4169e1',8,!inDungeon);}}
      if(P.equip.weapon?.special==='fire'){spawnParticle(e.x,e.y,'#ff7a3d',8,!inDungeon);if(Math.random()<.35)e.hp-=Math.floor(d*.25);}
      if(ws.cleave)enemies.forEach(e2=>{if(e2!==e&&e2.hp>0&&Math.hypot(e2.x-e.x,e2.y-e.y)<68){e2.hp-=Math.floor(d*ws.cleave);}});
      if(P.perks.some(p=>p.name==='Shatterstrike')&&(e.froze>0||e.slow>0)){spawnRing(e.x,e.y,'#9fd9ff',6,8,!inDungeon);enemies.forEach(e2=>{if(e2!==e&&e2.hp>0&&Math.hypot(e2.x-e.x,e2.y-e.y)<82)e2.hp-=Math.floor(d*.25);});}
      if(ws.shock)spawnRing(e.x,e.y,'#f0c56f',8,10,!inDungeon);
    }
  });
  if(hitSomething){playSfx('hit',1);if(P.perks.some(p=>p.name==='Relentless'))reduceOtherCooldowns(180);}
}
function shootArrow(mult=1,count=1,spread=0,ws=null){
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  let a=Math.atan2(P.facing.y,P.facing.x);
  ws=ws||getWeaponStyle();
  let dmg=playerAtk()*.7*playerRangedMult()*mult*(P.perks.some(p=>p.name==='Overdraw')?1.25:1);
  let pierceArrow=P.equip.weapon?.special==='slow'||ws.id==='pike'||P.perks.some(p=>p.name==='Eagle Eyes');
  let range=(ws.projectileRange||360)*(P.perks.some(p=>p.name==='Overdraw')?1.2:1);
  playSfx('arrow',count>1?1.06:.95);
  if(count===1)projectiles.push({x:px,y:py,startX:px,startY:py,range,vx:Math.cos(a)*10,vy:Math.sin(a)*10,dmg,type:'arrow',life:1,col:ws.color||'#8b6900',sz:4,owner:'player',pierce:pierceArrow,isDungeon:inDungeon});
  else for(let k=0;k<count;k++){let off=(k-(count-1)/2)*spread;projectiles.push({x:px,y:py,startX:px,startY:py,range,vx:Math.cos(a+off)*10,vy:Math.sin(a+off)*10,dmg,type:'arrow',life:1,col:ws.color||'#8b6900',sz:4,owner:'player',pierce:pierceArrow,isDungeon:inDungeon});}
  spawnTrail(px,py,'#d7b15c',!inDungeon,count===1?3:5,14);
}
function shootArcane(mult=1){
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  let a=Math.atan2(P.facing.y,P.facing.x);
  let dmg=playerAtk()*.9*playerSkillMult()*mult;
  let range=(getWeaponStyle().projectileRange||280);
  playSfx('arcane',1);
  projectiles.push({x:px,y:py,startX:px,startY:py,range,vx:Math.cos(a)*9,vy:Math.sin(a)*9,dmg,type:'arcane',life:1,col:'#9b7cff',sz:6,owner:'player',pierce:true,isDungeon:inDungeon,manaSiphon:P.perks.some(p=>p.name==='Spell Siphon')});
  spawnTrail(px,py,'#b9a4ff',!inDungeon,4,10);
}
function guardianBash(ws=null){
  ws=ws||getWeaponStyle();
  playSfx('melee',1.12);
  meleeSwing(1.35*(ws.meleeMult||1),Math.max(38,ws.reach||38),Math.max(34,ws.arc||34),.5,ws);
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  spawnRing(px+P.facing.x*18,py+P.facing.y*18,'#88ccff',7,8,!inDungeon);
  if(P.perks.some(p=>p.name==='Bulwark'))P._bulwarkWardTimer=Math.max(P._bulwarkWardTimer||0,4000);
}

// ── UPDATE LOOP ─────────────────────────────────────────────
function update(dt){
  if(dead||paused||panel==='lu'||panel==='class'||transitioning)return;
  updateAmbientAudio();
  updateAmbientEvents(dt);
  maybeTriggerBifrostDiscovery();
  syncBossStateToMode();
  if(inDungeon)updateDungeonMode(dt);else updateWorldMode(dt);
  updateEnemies(dt);updateProjectiles(dt);updateParticles(dt);
  P.mp=Math.min(P.maxMp,P.mp+playerManaRegen()*dt/1000);
  if(P.rage){P.rageTimer-=dt;if(P.rageTimer<=0)P.rage=false;}
  for(let i=0;i<4;i++)skillCD[i]=Math.max(0,skillCD[i]-dt);
  if(P.blink>0)P.blink-=dt;
  P.attackTimer=Math.max(0,P.attackTimer-dt);
  P.attackPoseTimer=Math.max(0,(P.attackPoseTimer||0)-dt);
  P._battleTranceTimer=Math.max(0,(P._battleTranceTimer||0)-dt);
  P._seidrSurgeTimer=Math.max(0,(P._seidrSurgeTimer||0)-dt);
  P._warBannerTimer=Math.max(0,(P._warBannerTimer||0)-dt);
  P._bulwarkWardTimer=Math.max(0,(P._bulwarkWardTimer||0)-dt);
  P._huntmasterTimer=Math.max(0,(P._huntmasterTimer||0)-dt);
  P._omenTimer=Math.max(0,(P._omenTimer||0)-dt);
  if(P._omenTimer<=0)P._omenCritBonus=0;
  if(P._warBannerTimer<=0)P._warBannerBonus=0;
  if(screenShake.time>0){
    screenShake.time=Math.max(0,screenShake.time-dt);
    let amt=screenShake.power*(screenShake.time/100);
    screenShake.x=(Math.random()-.5)*amt*4;
    screenShake.y=(Math.random()-.5)*amt*4;
    screenShake.power*=0.88;
  }else{
    screenShake.x=0;screenShake.y=0;screenShake.power=0;
  }
  if(lootPickupCooldown>0)lootPickupCooldown-=dt;
  loot.forEach(l=>{if(l.pickupCooldown>0)l.pickupCooldown-=dt;});
  // Debuff ticks
  let anyDebuff=false;
  Object.keys(P.debuffs).forEach(k=>{if(P.debuffs[k]>0){P.debuffs[k]-=dt;anyDebuff=true;}else P.debuffs[k]=0;});
  if(anyDebuff)updateDebuffDisplay();
  // Poison tick
  if(P.debuffs.poison>0&&Math.floor(Date.now()/1200)%2===0&&P.blink<=0){P.hp=Math.max(1,P.hp-1);}
  if(P.hp<=0)handleDeath();
}

function updateSprint(moving,dt){
  let sprinting=keys['shift']&&moving&&P.stamina>0&&(P.debuffs.slow||0)<=0;
  let stCost=SPRINT_COST*(P.perks.some(p=>p.name==='Storm Walker')?0.7:1);
  let stRegen=SPRINT_REGEN*(P.perks.some(p=>p.name==='Iron Stamina')?1.6:1);
  if(sprinting){P.stamina=Math.max(0,P.stamina-stCost*(dt/1000));P.staminaRegenTimer=SPRINT_REGEN_DELAY;P.sprinting=P.stamina>0;}
  else{P.sprinting=false;if(P.staminaRegenTimer>0)P.staminaRegenTimer-=dt;else P.stamina=Math.min(P.maxStamina,P.stamina+stRegen*(dt/1000));}
  return P.sprinting?1.7:1;
}

function movePlayer(dx,dy,sp,dt,isDungeon){
  if(!dx&&!dy)return;
  let l=Math.hypot(dx,dy);dx/=l;dy/=l;let pad=isDungeon?12:13;
  if(isDungeon){
    let nx=dPlayer.x+dx*sp*(dt/16),ny=dPlayer.y+dy*sp*(dt/16);
    if(!isDBlocked(Math.floor((nx+pad*Math.sign(dx))/DTILE),Math.floor(dPlayer.y/DTILE)))dPlayer.x=nx;
    if(!isDBlocked(Math.floor(dPlayer.x/DTILE),Math.floor((ny+pad*Math.sign(dy))/DTILE)))dPlayer.y=ny;
    // Check secret wall
    let ptx=Math.floor(dPlayer.x/DTILE),pty=Math.floor(dPlayer.y/DTILE);
    dSecretRooms.forEach(sr=>{
      if(Math.abs(ptx-sr.wallX)<=1&&Math.abs(pty-sr.wallY)<=1&&!sr.revealed){
        sr.revealed=true;dmap[sr.wallY][sr.wallX]=DT.FLOOR;
        msg('🔍 SECRET ROOM DISCOVERED! Hidden treasures await!',3500);
        revealAround(sr.room.x+Math.floor(sr.room.w/2),sr.room.y+Math.floor(sr.room.h/2),4);
      }
    });
  }else{
    let nx=P.x+dx*sp*(dt/16),ny=P.y+dy*sp*(dt/16);
    if(!isBlockedWorld(nx+pad*Math.sign(dx),P.y))P.x=Math.max(pad,Math.min(WS*T-pad,nx));
    if(!isBlockedWorld(P.x,ny+pad*Math.sign(dy)))P.y=Math.max(pad,Math.min(WS*T-pad,ny));
  }
}

function updateWorldMode(dt){
  if(worldEntryPromptCooldown>0)worldEntryPromptCooldown=Math.max(0,worldEntryPromptCooldown-dt);
  if(panel)return;
  let dx=0,dy=0;
  if(keys['w']||keys['ArrowUp'])dy=-1;if(keys['s']||keys['ArrowDown'])dy=1;
  if(keys['a']||keys['ArrowLeft'])dx=-1;if(keys['d']||keys['ArrowRight'])dx=1;
  let mx=mouse.x+cam.x-P.x,my=mouse.y+cam.y-P.y,ml=Math.hypot(mx,my);
  if(ml>5){P.facing.x=mx/ml;P.facing.y=my/ml;}
  let moving=!!(dx||dy);
  let spMult=updateSprint(moving,dt);
  let slowMult=P.debuffs.slow>0?0.5:1;
  movePlayer(dx,dy,playerMoveSpeed()*spMult*slowMult,dt,false);
  if(keys['e']||keys[' ']||keys['mouse'])doAttack();
  if(getTile(P.x,P.y)===TILE.LAVA&&Math.floor(Date.now()/600)%2===0)takeDamage(2);
  if((keys['f']||keys['F'])&&!panel)tryTalkNPC();
  if(!panel&&worldEntryPromptCooldown<=0)dungeonEntrances.forEach(ent=>{if(Math.hypot(P.x-ent.wx,P.y-ent.wy)<32){lastDungeonEntrance=ent;showDungeonEntryChoice();}});
  pickupLoot(false);
  let tx=P.x-W/2,ty=P.y-H/2;
  cam.x+=(tx-cam.x)*.12;cam.y+=(ty-cam.y)*.12;
  cam.x+=screenShake.x;cam.y+=screenShake.y;
  cam.x=Math.max(0,Math.min(WS*T-W,cam.x));cam.y=Math.max(0,Math.min(WS*T-H,cam.y));
}
function projectileExpired(p){
  if(!p.range)return false;
  let sx=p.startX??p.x,sy=p.startY??p.y;
  return Math.hypot(p.x-sx,p.y-sy)>=p.range;
}

function updateDungeonMode(dt){
  if(panel)return;
  if(dungeonStartSafeTimer>0)dungeonStartSafeTimer=Math.max(0,dungeonStartSafeTimer-dt);
  let dx=0,dy=0;
  if(keys['w']||keys['ArrowUp'])dy=-1;if(keys['s']||keys['ArrowDown'])dy=1;
  if(keys['a']||keys['ArrowLeft'])dx=-1;if(keys['d']||keys['ArrowRight'])dx=1;
  let mx=mouse.x+dCam.x-dPlayer.x,my=mouse.y+dCam.y-dPlayer.y,ml=Math.hypot(mx,my);
  if(ml>5){P.facing.x=mx/ml;P.facing.y=my/ml;}
  let moving=!!(dx||dy);
  let spMult=updateSprint(moving,dt);
  let slowMult=P.debuffs.slow>0?0.5:1;
let frozenMult=dungeonHasMod('Frozen')?0.8:1;
  movePlayer(dx,dy,playerMoveSpeed()*spMult*slowMult*frozenMult,dt,true);
  if(keys['e']||keys[' ']||keys['mouse'])doAttack();
  let tx2=dPlayer.x-W/2,ty2=dPlayer.y-H/2;
  dCam.x+=(tx2-dCam.x)*.15;dCam.y+=(ty2-dCam.y)*.15;
  dCam.x+=screenShake.x;dCam.y+=screenShake.y;
  let ptx=Math.floor(dPlayer.x/DTILE),pty=Math.floor(dPlayer.y/DTILE);
  revealAround(ptx,pty,5);
  let ri=getCurrentRoom();if(ri>=0&&ri!==currentRoomIdx){currentRoomIdx=ri;if(drooms[ri]?.id!==dungeonStartRoomId)dungeonStartSafeTimer=0;if(bossReady&&drooms[ri]?.isBossRoom&&!bossActive&&!bossRef&&!bossDefeated){spawnDungeonBoss();bossReady=false;bossSealPending=true;if(!bossRoomAnnounced){bossRoomAnnounced=true;msg('⚠️ The sanctum seals behind you. Survive the lair.',2400);}}let room=drooms[ri];if(room&&!room._announced&&['treasury','barracks','arena','champion'].includes(room.type)){room._announced=true;msg(room.type==='treasury'?'💰 <b>Treasury</b><br><small>Richer chests and greedier danger fill this chamber.</small>':room.type==='barracks'?'🛡️ <b>Barracks</b><br><small>A war room packed with heavier resistance.</small>':room.type==='arena'?'⚔️ <b>Arena</b><br><small>A set-piece combat chamber. Expect an elite champion.</small>':'👑 <b>Champion Room</b><br><small>A miniboss-tier foe holds this chamber.</small>',2400);}if(room?.deepThreat&&!room._deepAnnounced){room._deepAnnounced=true;msg(room.deepThreat==='abyssal'?'🜂 <b>Abyss Breach</b><br><small>The deep has claimed this chamber. Expect a champion and escorts.</small>':'☠️ <b>Deep Hunt</b><br><small>A hardened champion stalks this room.</small>',2500);}let roomEvent=dFloorEvents.find(ev=>ev.roomId===drooms[ri]?.id&&!ev.used&&!ev.noticed);if(roomEvent){roomEvent.noticed=true;msg(`${roomEvent.icon} <b>${roomEvent.name}</b><br><small>${roomEvent.roomText||roomEvent.desc}<br>${roomEvent.rewardText||''}</small>`,2600);}updateDungeonHUD();}
  if(bossSealPending&&bossActive&&dbossRoom?.doorX!=null&&dbossRoom?.doorY!=null){
    let doorCx=dbossRoom.doorX*DTILE+DTILE/2,doorCy=dbossRoom.doorY*DTILE+DTILE/2;
    if(Math.hypot(dPlayer.x-doorCx,dPlayer.y-doorCy)>DTILE*1.15){
      dmap[dbossRoom.doorY][dbossRoom.doorX]=DT.BOSS_DOOR;
      bossSealPending=false;
    }
  }
  checkRoomCleared(ri);
  openBossLairIfReady();
  openStairsIfReady();
  updateAllTraps(dt);pickupLoot(true);
  // F key interactions
  if(keys['f']||keys['F']){
    dchests.forEach(ch=>{if(!ch.opened&&Math.hypot(dPlayer.x-ch.x*DTILE-DTILE/2,dPlayer.y-ch.y*DTILE-DTILE/2)<DTILE*1.1)openChest(ch);});
    dShrines.forEach(sh=>{if(Math.hypot(dPlayer.x-sh.x*DTILE-DTILE/2,dPlayer.y-sh.y*DTILE-DTILE/2)<DTILE*1.1)openShrine(sh);});
    dPuzzles.forEach(pz=>{if(!pz.solved&&Math.hypot(dPlayer.x-pz.x*DTILE-DTILE/2,dPlayer.y-pz.y*DTILE-DTILE/2)<DTILE*1.1)openPuzzle(pz);});
    tryTalkNPC();
  }
  if(dstairsPos&&dmap[dstairsPos.y]?.[dstairsPos.x]===DT.STAIRS){
    let sx=dstairsPos.x*DTILE+DTILE/2,sy=dstairsPos.y*DTILE+DTILE/2;
    if(Math.hypot(dPlayer.x-sx,dPlayer.y-sy)<DTILE*.9)nextFloor();
  }
  updateDungeonHUD();
if(dungeonHasMod('Cursed'))enemies.forEach(e=>{if(e.hp>0)e.hp=Math.min(e.maxHp,e.hp+dt*.001);});
}

function updateAllTraps(dt){
  let px=dPlayer.x,py=dPlayer.y;
  // Pressure traps
  dtraps.forEach(trap=>{
    if(trap.armTimer>0){trap.armTimer-=dt;return;}
    let tx=trap.x*DTILE+DTILE/2,ty=trap.y*DTILE+DTILE/2;
    if(Math.hypot(px-tx,py-ty)<DTILE*.7&&!trap.active){trap.active=true;trap.timer=900;takeDamage(45,true);spawnParticle(tx,ty,'#ff8800',14,false);msg('💥 PRESSURE TRAP! -45 HP',1500);}
    if(trap.active){trap.timer-=dt;if(trap.timer<=0)trap.active=false;}
  });
  // Spike traps
  dspikes.forEach(sp=>{
    sp.timer-=dt;if(sp.timer<=0){sp.active=!sp.active;sp.timer=sp.period*(sp.active?0.35:0.65);}
    if(sp.active){let sx=sp.x*DTILE+DTILE/2,sy=sp.y*DTILE+DTILE/2;if(Math.hypot(px-sx,py-sy)<DTILE*.6)takeDamage(25,true);}
  });
  // Poison gas vents
  dPoisonVents.forEach(v=>{
    v.timer-=dt;if(v.timer<=0){v.active=!v.active;v.timer=v.period*(v.active?0.22:0.78);}
    if(v.active){
      let vx=v.x*DTILE+DTILE/2,vy=v.y*DTILE+DTILE/2;
      if(Math.hypot(px-vx,py-vy)<DTILE*1.35){
        addDebuff('poison',900);
        v.dmgTimer=(v.dmgTimer||0)-dt;
        if(v.dmgTimer<=0){takeDamage(1,true);v.dmgTimer=2600;}
      }else v.dmgTimer=0;
    }
  });
  // Arrow wall traps
  dArrowTraps.forEach(at=>{
    let now=Date.now();
    if(now-at.lastFired>at.cooldown){
      at.lastFired=now;
      // Fire 3 arrows in direction
      for(let k=-1;k<=1;k++){
        projectiles.push({x:at.x*DTILE+DTILE/2+k*8,y:at.y*DTILE+DTILE/2,vx:at.dir.vx*8,vy:at.dir.vy*8+k*.5,dmg:20,col:'#8b6900',sz:4,life:1,owner:'trap',isDungeon:true,type:'arrow'});
      }
      spawnParticle(at.x*DTILE+DTILE/2,at.y*DTILE+DTILE/2,'#8b6900',6,false);
    }
  });
  // Rune curse tiles
  dRuneTiles.forEach(rt=>{
    if(rt.triggered)return;
    let rx=rt.x*DTILE+DTILE/2,ry=rt.y*DTILE+DTILE/2;
    if(Math.hypot(px-rx,py-ry)<DTILE*.7){
      rt.triggered=true;
      addDebuff(rt.debuff,8000);
      spawnParticle(rx,ry,'#8888ff',12,false);
      dmap[rt.y][rt.x]=DT.FLOOR; // tile consumed
    }
  });
}

function pickupLoot(isDungeon){
  if(lootPickupCooldown>0)return;
  let px=isDungeon?dPlayer.x:P.x,py=isDungeon?dPlayer.y:P.y;
  for(let i=loot.length-1;i>=0;i--){
    let l=loot[i];
    if(l.isDungeon!==isDungeon||(l.pickupCooldown||0)>0)continue;
    if(Math.hypot(l.x-px,l.y-py)<22){
      if(l.isGold){P.gold+=l.val;playSfx('pickupGold',Math.min(1.2,.75+l.val/140));floatText('+'+l.val+'g',l.x,l.y,'#ffd700');}
      else if(addItemToInventory({...l,x:undefined,y:undefined,id:undefined,isDungeon:undefined,pickupCooldown:undefined})){playSfx('pickupItem',l.rarity==='legendary'?1.2:l.rarity==='epic'?1.08:1);msg('🎒 Picked up: '+l.icon+' '+l.name);}
      else{msg('⚠️ Inventory full! [I] to manage',1000);continue;}
      loot.splice(i,1);
    }
  }
}

function updateEnemies(dt){
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  for(let i=enemies.length-1;i>=0;i--){
    let e=enemies[i];
    if(!isEnemyInActiveMode(e)){
      if(e===bossRef){bossRef=null;bossActive=false;clearBossUI();}
      enemies.splice(i,1);continue;
    }
    if(e.hp<=0){
      spawnKillEffect(e,inDungeon);
      dropEnemyLoot(e);
      gainXP(e.xp);P.gold+=Math.max(1,Math.floor(e.gold*directGoldFactor(e)*(dungeonHasMod('Blessed')?2:1)*(dungeonHasMod('Fortune-Touched')?1.12:1)));
      if(e.landmarkSiteId){
        let site=worldLandmarks.find(s=>s.id===e.landmarkSiteId);
        if(site&&site.pending){
          let remain=enemies.filter(en=>en!==e&&en.hp>0&&en.landmarkSiteId===site.id).length;
          if(remain===0){
            site.pending=false;site.used=true;
            rewardLandmark(site,{gold:90+P.level*20,items:[rollLootItem(2,P.level),{...POTIONS[1]}]},'☠ Whispering Barrows fell silent. A grave treasure is yours.');
          }
        }
      }
      if(e.isElite){addItemToInventory(rollLootItem(dungeonFloor+1,P.level));msg('💎 ELITE DEFEATED! Rare loot dropped!',3000);}
      if(P.perks.some(p=>p.name==='Battle Trance'))P._battleTranceTimer=2200;
      if(P.perks.some(p=>p.name==='Huntmaster'))P._huntmasterTimer=4500;
      if(e.isMiniBoss){
        let miniReward=rollLootItem(dungeonFloor+2,P.level);
        if(!addItemToInventory(miniReward))loot.push({...miniReward,x:e.x+10,y:e.y,id:Math.random(),isDungeon:true,pickupCooldown:800});
        P.gold+=scaledGoldValue(22+dungeonFloor*6,dungeonFloor);playSfx('bossDeath',.9);
        msg('👑 CHAMPION SLAIN! A richer prize drops from the chamber.',2600);
      }
      if(e===bossRef){
        let bossName=e.name;
        let hist=ensureRunHistory();
        hist.bossesSlain++;
        hist.deepestFloor=Math.max(hist.deepestFloor,dungeonFloor);
        bossActive=false;bossDefeated=true;bossRef=null;document.getElementById('bossbar').style.display='none';
        if(inDungeon){
          dbossRoom.cleared=true;bossSealPending=false;
          if(dbossRoom?.doorY!=null&&dbossRoom?.doorX!=null)dmap[dbossRoom.doorY][dbossRoom.doorX]=DT.FLOOR;playSfx('bossDeath',1.2);
          msg('🏆 '+e.name+' DEFEATED!',3600);
          setDungeonCheckpointFloor(dungeonFloor+1);
          awardBossLoot(e.x,e.y,bossName);
          setTimeout(()=>showDescentChoice(),1300);
        }else msg('🏆 '+e.name+' DEFEATED!',4000);
      }
      enemies.splice(i,1);continue;
    }
    if(e.froze>0){e.froze-=dt;if(dungeonHasMod('Cursed'))e.hp=Math.min(e.maxHp,e.hp+.5);continue;}
    if(e.hitFlash>0)e.hitFlash=Math.max(0,e.hitFlash-dt);
    if(e.hitKickX||e.hitKickY){
      e.hitKickX=(e.hitKickX||0)*0.78;
      e.hitKickY=(e.hitKickY||0)*0.78;
      if(Math.abs(e.hitKickX)<0.1)e.hitKickX=0;
      if(Math.abs(e.hitKickY)<0.1)e.hitKickY=0;
    }
    if(inDungeon&&!e.isBoss&&dungeonStartSafeTimer>0)continue;
    let slow=e.slow>0?(e.slow-=dt/1000,.5):1;
    let dist=Math.hypot(e.x-px,e.y-py);
    if(!inDungeon&&dist>900)continue;
    let a=Math.atan2(py-e.y,px-e.x);
    if(e===bossRef&&e.phase===1&&e.hp<e.phase2hp){e.phase=2;spawnParticle(e.x,e.y,'#ff0000',30,!inDungeon);msg('?????? '+e.name+' ENRAGED! Phase 2!',2500);}
    if(e===bossRef&&e.isDungeon&&dungeonFloor>=20&&!e.deepPhase&&e.hp<e.maxHp*.45){
      e.deepPhase=true;
      let escortBase=bossEscortBase(e);
      spawnBossEscort(e,escortBase,dungeonFloor>=50?3:2,1.22,1.1);
      if(bossHasAffix(e,'warcaller'))spawnBossEscort(e,escortBase,dungeonFloor>=50?3:2,1.28,1.14);
      e.abilityTimer=Math.min(e.abilityTimer||9999,900);
      e.volleyTimer=0;
      msg(dungeonFloor>=50?'ALERT: ABYSSAL SURGE! The lair erupts with reinforcements.':'ALERT: The deep lair answers its master!',2200);
    }
    if(e===bossRef&&e.isDungeon){
      handleBossMechanics(e,dt,px,py,dist,a);
      dist=Math.hypot(e.x-px,e.y-py);
      a=Math.atan2(py-e.y,px-e.x);
    }
    let spd=e.spd*(e===bossRef&&e.phase===2?1.6:1)*slow*(dt/16)*(dungeonHasMod('Enraged')?1.3:1)*(dungeonHasMod('Predatory')?1.12:1);
    if(dist>e.sz+14){
      let nx=e.x+Math.cos(a)*spd,ny=e.y+Math.sin(a)*spd;
      if(inDungeon){if(!isDBlocked(Math.floor(nx/DTILE),Math.floor(e.y/DTILE)))e.x=nx;if(!isDBlocked(Math.floor(e.x/DTILE),Math.floor(ny/DTILE)))e.y=ny;}
      else{if(!isBlockedWorld(nx,e.y))e.x=nx;if(!isBlockedWorld(e.x,ny))e.y=ny;}
    }
    e.shotTimer-=dt;
    let ar=e===bossRef?80:e.range;
    if(dist<ar+40&&e.shotTimer<=0){
      let rate=e===bossRef?700*(e.affixRateMult||1):1600;e.shotTimer=rate;
      let dm=e.dmg*(dungeonHasMod('Enraged')?1.5:1)*(dungeonHasMod('Predatory')?1.08:1);
      if(e.range>40){
        let defenseFactor=enemyDefenseFactor(e);
        let hostileType=e===bossRef?(e.family==='serpent'?'venom':(e.family==='ember'?'ember':((e.family==='seer'||e.family==='shadow'||e.family==='veil')?'veil':'orb'))):'orb';
        let hostileCol=e===bossRef?(e.family==='serpent'?'#61d36d':(e.family==='ember'?'#ff7a2f':((e.family==='seer'||e.family==='shadow'||e.family==='veil')?'#b9b9ff':'#cc2200'))):'#cc2200';
        projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*5.5,vy:Math.sin(a)*5.5,dmg:dm,col:hostileCol,sz:5,life:1,owner:'enemy',isDungeon:inDungeon,defenseFactor,bossAffixes:e.affixIds,type:hostileType});
        if(e===bossRef&&(e.phase===2||bossHasAffix(e,'stormbound')))[-0.35,0.35].forEach(s=>{let ba=a+s;projectiles.push({x:e.x,y:e.y,vx:Math.cos(ba)*6,vy:Math.sin(ba)*6,dmg:dm*.6,col:e.family==='ember'?'#ff9c52':e.family==='serpent'?'#88ee66':'#ff4400',sz:4,life:1,owner:'enemy',isDungeon:inDungeon,defenseFactor,bossAffixes:e.affixIds,type:hostileType});});
      }else if(dist<ar+20){
        takeDamage(dm,false,enemyDefenseFactor(e));
        if(e===bossRef&&bossHasAffix(e,'venomous'))addDebuff('poison',1600);
        if(e===bossRef&&bossHasAffix(e,'hexed'))addDebuff(e.phase===2?'silence':'weaken',e.phase===2?1700:1300);
        if(e===bossRef&&bossHasAffix(e,'ravenous'))e.hp=Math.min(e.maxHp,e.hp+Math.max(8,dm*.3));
      }
    }
    if(e===bossRef&&e.hp>0)document.getElementById('bossf').style.width=(e.hp/e.maxHp*100)+'%';
  }
}

function updateProjectiles(dt){
  let px=inDungeon?dPlayer.x:P.x,py=inDungeon?dPlayer.y:P.y;
  for(let i=projectiles.length-1;i>=0;i--){
    let p=projectiles[i];
    if(!isProjectileInActiveMode(p)){projectiles.splice(i,1);continue;}
  if(p.type==='slash'&&p.followPlayer&&p.owner==='player'){
      p.x=(inDungeon?dPlayer.x:P.x)+(p.offX||0);
      p.y=(inDungeon?dPlayer.y:P.y)+(p.offY||0);
    }
    p.x+=p.vx*(dt/16);p.y+=p.vy*(dt/16);p.life-=dt/2200;
    let blocked=p.isDungeon?isDBlocked(Math.floor(p.x/DTILE),Math.floor(p.y/DTILE)):isBlockedWorld(p.x,p.y);
    if(p.life<=0||blocked||projectileExpired(p)){spawnParticle(p.x,p.y,p.col,4,!p.isDungeon);projectiles.splice(i,1);continue;}
    if(p.owner==='player'){
      let hit=false;
      for(let j=0;j<enemies.length;j++){
        let e=enemies[j];if(e.hp<=0)continue;
        if(p.hitIds?.includes(e.id))continue;
        if(Math.hypot(e.x-p.x,e.y-p.y)<e.sz+p.sz){
          if(p.pierce){
            p.hitIds=p.hitIds||[];
            p.hitIds.push(e.id);
          }
          let plen=Math.max(1,Math.hypot(p.vx||0,p.vy||0));
          applyEnemyHitFeedback(e,(p.vx||0)/plen,(p.vy||0)/plen,p.col||'#ffd700',p.type==='arcane');
          addScreenShake(p.type==='arcane'?0.85:0.45,p.type==='arcane'?85:55);
          let dealt=p.dmg*playerVsEliteMult(e)*playerVsControlMult(e);
          e.hp-=dealt;
          if(P.equip.weapon?.special==='lightning'&&Math.random()<.25){
            let chain=enemies.filter(e2=>e2!==e&&e2.hp>0).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
            if(chain&&Math.hypot(chain.x-e.x,chain.y-e.y)<120){chain.hp-=Math.floor(dealt*.45);spawnParticle(chain.x,chain.y,'#4169e1',8,!p.isDungeon);}
          }
          if(P.equip.weapon?.special==='fire'){e.hp-=Math.floor(dealt*.18);spawnParticle(e.x,e.y,'#ff7a3d',6,!p.isDungeon);}
          floatText(Math.floor(dealt),e.x,e.y,'#ffcc00');
          if(p.manaSiphon)P.mp=Math.min(P.maxMp,P.mp+2);
          spawnParticle(p.x,p.y,p.col,5,!p.isDungeon);
          if(!p.pierce){hit=true;break;}
        }
      }
      if(hit&&p.type!=='slash')projectiles.splice(i,1);
    }else{
      // Trap projectiles and enemy projectiles hit player
      if(Math.hypot(px-p.x,py-p.y)<14+p.sz){
        takeDamage(p.dmg,p.owner==='trap'||p.ignoreDefense,p.defenseFactor||.4);
        if(p.debuff)addDebuff(p.debuff,p.debuffDur||1200);
        if(p.bossAffixes?.includes('venomous'))addDebuff('poison',1600);
        if(p.bossAffixes?.includes('hexed'))addDebuff(Math.random()<.5?'weaken':'silence',1400);
        if(p.bossAffixes?.includes('ravenous')&&bossRef&&bossRef.hp>0)bossRef.hp=Math.min(bossRef.maxHp,bossRef.hp+Math.max(8,p.dmg*.25));
        projectiles.splice(i,1);
      }
    }
  }
}

function updateParticles(dt){
  particles=particles.filter(p=>{p.x+=p.vx*(dt/16);p.y+=p.vy*(dt/16);p.vy+=0.06;p.life-=dt/700;return p.life>0;});
  floaters=floaters.filter(f=>{f.y+=f.vy*(dt/16);f.life-=dt/1600;return f.life>0;});
}

function updateWaves(dt){
  document.getElementById('wave-hud').style.display='none';
}

function handleDeath(){
  if(!dead){
    if(!P.revived&&P.perks.some(p=>p.name==='Valhalla Chosen')){P.revived=true;P.hp=Math.floor(P.maxHp*.3);msg('⚡ VALHALLA CHOSEN — REVIVED FROM DEATH!',3500);return;}
    dead=true;
    document.getElementById('death-stats').innerHTML=
      `Level ${P.level} &nbsp;·&nbsp; Deepest floor ${dungeonFloor}<br>`+
      `💰 ${P.gold} gold earned &nbsp;·&nbsp; ⚔️ ${playerAtk()} attack &nbsp;·&nbsp; 🛡️ ${playerDef()} defense<br>`+
      (inDungeon?`Reached dungeon floor ${dungeonFloor}`:'Fell in the open world');
    document.getElementById('death-screen').style.display='flex';
  }
}

// ── DRAW ───────────────────────────────────────────────────
function restartGame(){
  keys={};
  location.reload();
}

function drawTile(tx,ty,sx,sy){
  let t=world[ty]?.[tx]??TILE.WALL,bi=biome[ty]?.[tx]??0;
  let site=nearestLandmark(tx,ty,8);
  let dist=site?Math.hypot(site.x-tx,site.y-ty):999;
  let n=tileNoise(tx,ty);
  ctx.save();
  switch(t){
    case TILE.GRASS:{
      let grassTop=site?.kind==='village'&&dist<8?'#4a5d36':site?.kind==='grove'&&dist<7?'#32592c':'#2e5c1b';
      let grassBot=site?.kind==='grove'&&dist<8?'#183816':site?.kind==='grave'&&dist<7?'#263121':'#203f18';
      let gg=ctx.createLinearGradient(sx,sy,sx,sy+T);
      gg.addColorStop(0,grassTop);gg.addColorStop(1,grassBot);
      ctx.fillStyle=gg;ctx.fillRect(sx,sy,T,T);
      if(n>.22){ctx.fillStyle='rgba(0,0,0,.04)';ctx.fillRect(sx,sy+T-5,T,2);}
      ctx.fillStyle='rgba(255,255,255,.03)';
      ctx.beginPath();ctx.ellipse(sx+10,sy+8,5,3,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(sx+24,sy+13,4,2.6,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(24,52,18,.16)';
      ctx.beginPath();ctx.ellipse(sx+12,sy+24,8,5,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(sx+27,sy+25,6,4,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(62,96,40,.15)';
      ctx.fillRect(sx+4,sy+18,8,4);
      ctx.fillRect(sx+18,sy+22,10,3);
      ctx.fillStyle='rgba(34,66,24,.2)';
      ctx.beginPath();ctx.ellipse(sx+8,sy+28,10,4,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(sx+24,sy+30,9,4,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(132,168,84,.12)';
      ctx.fillRect(sx+3,sy+12,12,3);
      ctx.fillRect(sx+20,sy+16,9,3);
      if(n>.46&&t!==TILE.STONE){
        ctx.strokeStyle='rgba(105,138,74,.18)';
        ctx.lineWidth=1.2;
        ctx.beginPath();
        ctx.moveTo(sx+7,sy+T);ctx.lineTo(sx+10,sy+23);
        ctx.moveTo(sx+18,sy+T);ctx.lineTo(sx+20,sy+21);
        ctx.moveTo(sx+25,sy+T);ctx.lineTo(sx+27,sy+22);
        ctx.stroke();
      }
      if(site?.kind==='village'&&dist<8&&n>.58){ctx.fillStyle='rgba(120,105,70,.08)';ctx.fillRect(sx,sy,T,T);}
      if(site?.kind==='watcher'&&dist<7&&n>.62){ctx.fillStyle='rgba(12,14,18,.18)';ctx.fillRect(sx+10,sy+10,4,10);}
      break;}
    case TILE.SNOW:ctx.fillStyle='#ccdde8';ctx.fillRect(sx,sy,T,T);if((tx+ty)%6===0){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(sx,sy,T,2);}break;
    case TILE.LAVA:{let lv=Math.sin(Date.now()/900+tx*.4+ty*.6)*.12+.88;ctx.fillStyle=`rgb(${Math.floor(200*lv)},${Math.floor(48*lv)},0)`;ctx.fillRect(sx,sy,T,T);if((tx*3+ty*2+Math.floor(Date.now()/250))%11===0){ctx.fillStyle='#ff7700';ctx.fillRect(sx+8,sy+8,5,5);}break;}
    case TILE.STONE:{
      let sg=ctx.createLinearGradient(sx,sy,sx,sy+T);
      sg.addColorStop(0,site?.kind==='village'?'#6f6253':'#545466');
      sg.addColorStop(1,site?.kind==='bridge'?'#4b4034':'#3f4252');
      ctx.fillStyle=sg;ctx.fillRect(sx,sy,T,T);
      ctx.fillStyle='rgba(255,255,255,.02)';
      ctx.fillRect(sx,sy,2,T);
      ctx.fillRect(sx+T-2,sy,2,T);
      ctx.fillStyle='rgba(255,255,255,.035)';
      ctx.fillRect(sx+4,sy+4,12,2);
      ctx.fillRect(sx+18,sy+8,10,2);
      ctx.fillStyle='rgba(0,0,0,.08)';
      ctx.fillRect(sx+7,sy+T-5,16,2);
      ctx.fillRect(sx+18,sy+15,8,6);
      ctx.fillStyle='rgba(90,78,65,.08)';
      ctx.fillRect(sx+6,sy+10,20,1);
      ctx.fillRect(sx+9,sy+21,13,1);
      if(n>.4){
        ctx.strokeStyle='rgba(150,145,155,.18)';
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(sx+7,sy+11);ctx.lineTo(sx+15,sy+8);ctx.lineTo(sx+26,sy+14);
        ctx.moveTo(sx+9,sy+23);ctx.lineTo(sx+16,sy+20);ctx.lineTo(sx+24,sy+23);
        ctx.stroke();
      }
      if(n>.76){ctx.fillStyle='rgba(0,0,0,.09)';ctx.fillRect(sx+5,sy+5,6,5);ctx.fillRect(sx+23,sy+11,5,8);}
      ctx.fillStyle='rgba(255,255,255,.025)';
      ctx.fillRect(sx+3,sy+3,DTILE-6,1);
      ctx.fillStyle='rgba(0,0,0,.1)';
      ctx.fillRect(sx+4,sy+26,DTILE-8,2);
      if(site?.kind==='bridge'&&dist<5){
        ctx.fillStyle='rgba(116,92,60,.16)';
        ctx.fillRect(sx+5,sy+6,DTILE-10,3);
        ctx.fillRect(sx+7,sy+19,DTILE-14,2);
      }
      if(site?.kind==='council'&&dist<6){ctx.fillStyle='rgba(215,177,92,.07)';ctx.fillRect(sx+6,sy+6,DTILE-12,2);}
      break;}
    case TILE.WATER:{let wv=Date.now()/2200+tx*.5+ty*.3;let water=ctx.createLinearGradient(sx,sy,sx,sy+T);water.addColorStop(0,'#224d76');water.addColorStop(1,'#10263f');ctx.fillStyle=water;ctx.fillRect(sx,sy,T,T);ctx.fillStyle='rgba(255,255,255,.09)';ctx.fillRect(sx+Math.sin(wv)*4+8,sy+6,14,2);ctx.fillStyle='rgba(160,210,255,.08)';ctx.fillRect(sx+3,sy+24,18,2);break;}
    case TILE.WALL:
      ctx.fillStyle='#252535';ctx.fillRect(sx,sy,T,T);
      ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(sx,sy,T,2);
      ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(sx,sy+T-4,T,4);
      break;
    case TILE.TREE:
      ctx.fillStyle='#223b19';ctx.fillRect(sx,sy,T,T);
      drawShadow(sx+20,sy+31,21,8,.22);
      ctx.fillStyle='#4d311d';ctx.fillRect(sx+14,sy+16,10,16);
      ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(sx+18,sy+18,2,12);
      ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(sx+22,sy+18,2,13);
      ctx.fillStyle=site?.kind==='grove'?'#193d1a':'#163416';
      ctx.beginPath();ctx.ellipse(sx+20,sy+21,20,11,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=site?.kind==='grove'?'#214a1f':'#1a3918';
      ctx.beginPath();ctx.arc(sx+20,sy+15,18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=site?.kind==='grove'?'#2f622c':'#2a5527';
      ctx.beginPath();ctx.arc(sx+10,sy+15,11,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+30,sy+14,10.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+20,sy+6,10.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(82,120,60,.18)';
      ctx.beginPath();ctx.arc(sx+14,sy+10,6,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+25,sy+9,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(18,32,15,.22)';
      ctx.beginPath();ctx.ellipse(sx+20,sy+23,16,6,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.07)';
      ctx.beginPath();ctx.arc(sx+11,sy+10,5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(sx+25,sy+8,4.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.14)';
      ctx.beginPath();ctx.ellipse(sx+27,sy+26,10,5,0,0,Math.PI*2);ctx.fill();
      break;
    case TILE.RUNE:
      ctx.fillStyle='#21371c';ctx.fillRect(sx,sy,T,T);
      ctx.fillStyle='#514e62';ctx.fillRect(sx+7,sy+5,26,30);
      ctx.fillStyle='#69657a';ctx.fillRect(sx+9,sy+7,22,26);
      drawGlow(sx+20,sy+18,16,'rgb(159,140,255)',.1);
      ctx.fillStyle='#c1b7ff';ctx.font='15px sans-serif';ctx.textAlign='center';ctx.fillText('ᚱ',sx+20,sy+26);ctx.textAlign='left';
      break;
    case TILE.DUNGEON_ENTRY:{
      ctx.fillStyle='#161324';ctx.fillRect(sx,sy,T,T);
      let pg=pulse(380,tx+ty,.7,1);
      ctx.fillStyle='#514968';ctx.fillRect(sx+5,sy+8,7,24);ctx.fillRect(sx+28,sy+8,7,24);
      ctx.fillStyle='#665d82';ctx.beginPath();ctx.moveTo(sx+5,sy+8);ctx.lineTo(sx+20,sy-2);ctx.lineTo(sx+35,sy+8);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(95,75,190,.2)';ctx.fillRect(sx+12,sy+8,16,24);
      ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(sx+14,sy+10,12,2);
      ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(sx+13,sy+24,14,4);
      ctx.strokeStyle=`rgba(176,158,255,${pg})`;ctx.lineWidth=2;ctx.strokeRect(sx+12,sy+8,16,24);
      ctx.fillStyle='rgba(185,164,255,.96)';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('ᚦ',sx+T/2,sy+25);
      drawGlow(sx+T/2,sy+18,24,'rgb(159,140,255)',.1);
      ctx.textAlign='left';
      break;}
  }
  drawWorldProp(tx,ty,sx,sy);
  ctx.restore();
}

function drawDungeonTile(t,tx,ty,sx,sy){
  ctx.save();
  let routeFx=routeVisuals();
  // Determine room type for floor color variation
  let roomType='normal';
  drooms.forEach(r=>{if(tx>=r.x&&tx<r.x+r.w&&ty>=r.y&&ty<r.y+r.h)roomType=r.type||'normal';});
  let floorCol={
    normal:(tx+ty)%2===0?routeFx.floorA:routeFx.floorB,
    shrine:routeFx.id==='seer'?'#182637':routeFx.id==='ember'?'#2a1712':'#1b1526',
    armory:routeFx.id==='ember'?'#2d1d14':'#1d1812',
    crypt:routeFx.id==='barrow'?'#1a1720':'#181818',
    ritual:routeFx.id==='seer'?'#1a2230':'#24151a',
    library:routeFx.id==='seer'?'#16263a':'#161e29',
    prison:routeFx.id==='barrow'?'#1d1923':'#1c1b21',
    treasury:routeFx.id==='ember'?'#332317':'#2b2212',
    barracks:routeFx.id==='ember'?'#2f1c16':'#241b16',
    arena:routeFx.id==='ember'?'#301411':'#241012',
    champion:routeFx.id==='seer'?'#1e2036':routeFx.id==='ember'?'#341315':'#2a1118',
    secret:routeFx.id==='seer'?'#162532':'#1e2a1e',
    boss:routeFx.id==='ember'?'#230806':routeFx.id==='seer'?'#0d1622':'#1a0505'
  }[roomType]||((tx+ty)%2===0?routeFx.floorA:routeFx.floorB);

  switch(t){
    case DT.FLOOR:{
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      if(roomType==='boss'||roomType==='arena'||roomType==='champion'){
        ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(sx,sy+DTILE-5,DTILE,2);
      }
      ctx.fillStyle='rgba(255,255,255,.015)';
      ctx.fillRect(sx,sy,2,DTILE);
      ctx.fillRect(sx,sy,DTILE,2);
      let rn=roomNoise(tx,ty);
      if((tx*7+ty*3)%11===0){ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(sx+2,sy+2,5,2);}
      ctx.fillStyle=`rgba(255,255,255,${.014+rn*.016})`;ctx.fillRect(sx+4,sy+4,6,2);
      ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(sx+10,sy+20,11,2);
      ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(sx+18,sy+11,7,2);
      ctx.fillStyle='rgba(0,0,0,.035)';ctx.fillRect(sx+5,sy+9,20,1);
      if(rn>.74){ctx.strokeStyle='rgba(135,126,149,.11)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+7,sy+24);ctx.lineTo(sx+19,sy+16);ctx.lineTo(sx+26,sy+21);ctx.stroke();}
      if(routeFx.id==='barrow'){
        if(rn>.48){ctx.strokeStyle='rgba(186,174,205,.08)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+6,sy+12);ctx.lineTo(sx+13,sy+9);ctx.lineTo(sx+20,sy+15);ctx.stroke();}
        if(rn>.79){ctx.fillStyle='rgba(210,205,220,.05)';ctx.fillRect(sx+21,sy+8,6,2);}
        if(roomType==='crypt'&&rn>.58){ctx.fillStyle='rgba(205,196,221,.08)';ctx.fillRect(sx+7,sy+8,16,4);ctx.fillRect(sx+12,sy+12,7,9);}
        if(rn>.62){ctx.fillStyle='rgba(186,174,205,.05)';ctx.fillRect(sx+7,sy+17,5,5);}
        if(rn>.66){ctx.fillStyle='rgba(230,224,240,.06)';ctx.fillRect(sx+15,sy+7,2,18);}
        if(roomType==='crypt'&&rn>.72){ctx.strokeStyle='rgba(186,174,205,.13)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+16,sy+16,6,0,Math.PI*2);ctx.stroke();}
      }else if(routeFx.id==='ember'){
        if(rn>.44){ctx.fillStyle='rgba(255,132,52,.05)';ctx.fillRect(sx+7,sy+7,3,3);ctx.fillRect(sx+24,sy+19,2,2);}
        if(rn>.7){ctx.strokeStyle='rgba(110,70,52,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+8,sy+26);ctx.lineTo(sx+14,sy+18);ctx.lineTo(sx+25,sy+22);ctx.stroke();}
        if((roomType==='barracks'||roomType==='arena')&&rn>.53){ctx.fillStyle='rgba(135,82,56,.1)';ctx.fillRect(sx+6,sy+8,5,16);ctx.fillRect(sx+22,sy+10,4,12);}
        if(rn>.58){ctx.fillStyle='rgba(132,74,48,.08)';ctx.fillRect(sx+13,sy+6,8,3);}
        if(rn>.63){ctx.fillStyle='rgba(255,170,88,.06)';ctx.fillRect(sx+8,sy+22,16,2);}
        if((roomType==='arena'||roomType==='barracks')&&rn>.7){ctx.fillStyle='rgba(168,92,64,.1)';ctx.fillRect(sx+15,sy+9,2,16);}
      }else if(routeFx.id==='seer'){
        if(rn>.5){ctx.strokeStyle='rgba(122,184,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+11,sy+13,4,0,Math.PI*2);ctx.stroke();}
        if(rn>.72){ctx.fillStyle='rgba(159,140,255,.08)';ctx.fillRect(sx+22,sy+10,4,8);}
        if((roomType==='library'||roomType==='ritual')&&rn>.54){ctx.strokeStyle='rgba(122,184,255,.14)';ctx.strokeRect(sx+8,sy+8,DTILE-16,DTILE-16);}
        if(rn>.6){ctx.fillStyle='rgba(122,184,255,.05)';ctx.fillRect(sx+9,sy+18,10,3);}
        if(rn>.68){ctx.strokeStyle='rgba(180,204,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+16,sy+7);ctx.lineTo(sx+20,sy+12);ctx.lineTo(sx+16,sy+17);ctx.lineTo(sx+12,sy+12);ctx.closePath();ctx.stroke();}
        if((roomType==='library'||roomType==='ritual')&&rn>.74){ctx.fillStyle='rgba(159,140,255,.06)';ctx.fillRect(sx+15,sy+9,2,14);}
      }
      if(roomType==='treasury'&&rn>.66){ctx.fillStyle='rgba(215,177,92,.08)';ctx.fillRect(sx+7,sy+7,5,5);}
      if(roomType==='barracks'&&rn>.7){ctx.fillStyle='rgba(120,82,62,.1)';ctx.fillRect(sx+8,sy+DTILE-11,11,2);}
      if(roomType==='arena'&&rn>.62){ctx.strokeStyle='rgba(160,70,70,.12)';ctx.strokeRect(sx+5,sy+5,DTILE-10,DTILE-10);}
      if(roomType==='champion'&&rn>.58){ctx.strokeStyle='rgba(215,90,120,.16)';ctx.strokeRect(sx+4,sy+4,DTILE-8,DTILE-8);}
      if(roomType==='champion'){
        if(routeFx.id==='barrow'&&rn>.66){ctx.strokeStyle='rgba(214,205,230,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+8,sy+24);ctx.lineTo(sx+16,sy+8);ctx.lineTo(sx+24,sy+24);ctx.stroke();}
        if(routeFx.id==='ember'&&rn>.66){ctx.fillStyle='rgba(216,108,47,.09)';ctx.fillRect(sx+8,sy+8,16,2);ctx.fillRect(sx+15,sy+8,2,16);}
        if(routeFx.id==='seer'&&rn>.66){ctx.strokeStyle='rgba(159,140,255,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+16,sy+16,7,0,Math.PI*2);ctx.stroke();}
        if(routeFx.id==='barrow'&&rn>.78){ctx.fillStyle='rgba(214,205,230,.06)';ctx.fillRect(sx+6,sy+6,20,2);ctx.fillRect(sx+15,sy+6,2,20);}
        if(routeFx.id==='ember'&&rn>.78){ctx.fillStyle='rgba(216,108,47,.08)';ctx.fillRect(sx+6,sy+24,20,2);ctx.fillRect(sx+9,sy+9,2,14);ctx.fillRect(sx+21,sy+9,2,14);}
        if(routeFx.id==='seer'&&rn>.78){ctx.strokeStyle='rgba(180,204,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+16,sy+6);ctx.lineTo(sx+26,sy+16);ctx.lineTo(sx+16,sy+26);ctx.lineTo(sx+6,sy+16);ctx.closePath();ctx.stroke();}
        let cx=((tx+ty*3)%5===0),cy=((tx*2+ty)%5===0);
        if(routeFx.id==='barrow'&&cx){
          ctx.fillStyle='rgba(214,205,230,.08)';
          ctx.fillRect(sx+13,sy+6,6,18);
          ctx.fillRect(sx+10,sy+22,12,2);
          ctx.fillStyle='rgba(255,255,255,.05)';
          ctx.fillRect(sx+14,sy+9,4,2);
        }
        if(routeFx.id==='ember'&&cy){
          ctx.fillStyle='rgba(216,108,47,.09)';
          ctx.fillRect(sx+8,sy+23,16,2);
          ctx.fillRect(sx+10,sy+9,3,10);
          ctx.fillRect(sx+19,sy+9,3,10);
          ctx.fillStyle='rgba(255,190,110,.05)';
          ctx.fillRect(sx+11,sy+11,1,3);
          ctx.fillRect(sx+20,sy+11,1,3);
        }
        if(routeFx.id==='seer'&&cx){
          ctx.strokeStyle='rgba(180,204,255,.14)';
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(sx+16,sy+7);ctx.lineTo(sx+24,sy+16);ctx.lineTo(sx+16,sy+25);ctx.lineTo(sx+8,sy+16);ctx.closePath();
          ctx.stroke();
          ctx.fillStyle='rgba(159,140,255,.06)';
          ctx.beginPath();ctx.arc(sx+16,sy+16,3,0,Math.PI*2);ctx.fill();
        }
        if(routeFx.id==='barrow'&&cy){
          ctx.fillStyle='rgba(214,205,230,.06)';
          ctx.fillRect(sx+6,sy+14,5,8);
          ctx.fillRect(sx+21,sy+14,5,8);
          ctx.fillRect(sx+7,sy+21,3,2);
          ctx.fillRect(sx+22,sy+21,3,2);
          ctx.fillRect(sx+14,sy+10,4,10);
          ctx.fillStyle='rgba(255,255,255,.04)';
          ctx.fillRect(sx+15,sy+12,2,2);
        }
        if(routeFx.id==='ember'&&cx){
          ctx.fillStyle='rgba(216,108,47,.07)';
          ctx.fillRect(sx+7,sy+8,4,14);
          ctx.fillRect(sx+21,sy+8,4,14);
          ctx.fillRect(sx+6,sy+22,6,2);
          ctx.fillRect(sx+20,sy+22,6,2);
          ctx.fillRect(sx+14,sy+12,4,12);
          ctx.fillStyle='rgba(255,210,130,.04)';
          ctx.fillRect(sx+15,sy+14,2,3);
        }
        if(routeFx.id==='seer'&&cy){
          ctx.strokeStyle='rgba(180,204,255,.12)';
          ctx.lineWidth=1;
          ctx.beginPath();ctx.arc(sx+8,sy+16,3,0,Math.PI*2);ctx.stroke();
          ctx.beginPath();ctx.arc(sx+24,sy+16,3,0,Math.PI*2);ctx.stroke();
          ctx.beginPath();ctx.moveTo(sx+16,sy+10);ctx.lineTo(sx+20,sy+16);ctx.lineTo(sx+16,sy+22);ctx.lineTo(sx+12,sy+16);ctx.closePath();ctx.stroke();
        }
      }
      if(roomType==='crypt'&&routeFx.id==='barrow'&&rn>.7){ctx.fillStyle='rgba(214,205,230,.06)';ctx.fillRect(sx+9,sy+22,14,2);ctx.fillRect(sx+15,sy+10,2,14);}
      if(roomType==='barracks'&&routeFx.id==='ember'&&rn>.68){ctx.fillStyle='rgba(168,92,64,.08)';ctx.fillRect(sx+9,sy+8,2,16);ctx.fillRect(sx+21,sy+8,2,16);}
      if(roomType==='library'&&routeFx.id==='seer'&&rn>.68){ctx.strokeStyle='rgba(180,204,255,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+8,sy+24);ctx.lineTo(sx+16,sy+8);ctx.lineTo(sx+24,sy+24);ctx.stroke();}
      if(roomType==='boss'){
        let bossStyle=currentDungeonBossDef();
        let bossId=bossStyle.id;
        if(routeFx.id==='barrow'&&rn>.64){ctx.strokeStyle='rgba(210,205,220,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+16,sy+16,8,0,Math.PI*2);ctx.stroke();}
        if(routeFx.id==='ember'&&rn>.62){ctx.fillStyle='rgba(255,120,60,.08)';ctx.fillRect(sx+6,sy+24,20,2);}
        if(routeFx.id==='seer'&&rn>.62){ctx.strokeStyle='rgba(159,140,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+16,sy+6);ctx.lineTo(sx+26,sy+16);ctx.lineTo(sx+16,sy+26);ctx.lineTo(sx+6,sy+16);ctx.closePath();ctx.stroke();}
        if(routeFx.id==='barrow'&&rn>.74){ctx.fillStyle='rgba(214,205,230,.06)';ctx.fillRect(sx+15,sy+6,2,20);}
        if(routeFx.id==='ember'&&rn>.72){ctx.fillStyle='rgba(216,108,47,.08)';ctx.fillRect(sx+8,sy+8,2,16);ctx.fillRect(sx+22,sy+8,2,16);}
        if(routeFx.id==='seer'&&rn>.72){ctx.strokeStyle='rgba(180,204,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+16,sy+16,10,0,Math.PI*2);ctx.stroke();}
        if(routeFx.id==='barrow'&&rn>.82){ctx.strokeStyle='rgba(214,205,230,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+8,sy+24);ctx.lineTo(sx+16,sy+8);ctx.lineTo(sx+24,sy+24);ctx.stroke();ctx.fillStyle='rgba(214,205,230,.06)';ctx.fillRect(sx+6,sy+6,20,2);}
        if(routeFx.id==='ember'&&rn>.82){ctx.fillStyle='rgba(255,150,80,.07)';ctx.fillRect(sx+7,sy+7,18,2);ctx.fillRect(sx+7,sy+23,18,2);ctx.fillRect(sx+10,sy+10,2,12);ctx.fillRect(sx+20,sy+10,2,12);}
        if(routeFx.id==='seer'&&rn>.82){ctx.strokeStyle='rgba(180,204,255,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+16,sy+16,6,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(sx+16,sy+4);ctx.lineTo(sx+28,sy+16);ctx.lineTo(sx+16,sy+28);ctx.lineTo(sx+4,sy+16);ctx.closePath();ctx.stroke();}
        let bossAnchor=((tx+ty)%4===0),bossSide=((tx*3+ty)%6===0);
        if(routeFx.id==='barrow'&&bossAnchor){
          ctx.fillStyle='rgba(214,205,230,.08)';
          ctx.fillRect(sx+12,sy+6,8,16);
          ctx.fillRect(sx+9,sy+20,14,3);
          ctx.fillStyle='rgba(255,255,255,.05)';
          ctx.fillRect(sx+13,sy+8,6,2);
        }
        if(routeFx.id==='ember'&&bossSide){
          ctx.fillStyle='rgba(255,140,76,.1)';
          ctx.fillRect(sx+9,sy+8,4,15);
          ctx.fillRect(sx+19,sy+8,4,15);
          ctx.fillRect(sx+7,sy+23,18,2);
          ctx.fillStyle='rgba(255,210,130,.05)';
          ctx.fillRect(sx+10,sy+10,2,4);
          ctx.fillRect(sx+20,sy+10,2,4);
        }
        if(routeFx.id==='seer'&&bossAnchor){
          ctx.strokeStyle='rgba(180,204,255,.16)';
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(sx+16,sy+5);ctx.lineTo(sx+26,sy+16);ctx.lineTo(sx+16,sy+27);ctx.lineTo(sx+6,sy+16);ctx.closePath();
          ctx.stroke();
          ctx.beginPath();ctx.arc(sx+16,sy+16,4,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle='rgba(159,140,255,.08)';
          ctx.fillRect(sx+15,sy+7,2,18);
        }
        if(routeFx.id==='barrow'&&bossSide){
          ctx.fillStyle='rgba(214,205,230,.06)';
          ctx.fillRect(sx+5,sy+11,6,12);
          ctx.fillRect(sx+21,sy+11,6,12);
          ctx.fillRect(sx+7,sy+10,2,2);
          ctx.fillRect(sx+23,sy+10,2,2);
          ctx.fillRect(sx+13,sy+7,6,16);
          ctx.fillStyle='rgba(255,255,255,.05)';
          ctx.fillRect(sx+14,sy+10,4,2);
          ctx.fillRect(sx+15,sy+20,2,2);
        }
        if(routeFx.id==='ember'&&bossAnchor){
          ctx.fillStyle='rgba(216,108,47,.08)';
          ctx.fillRect(sx+6,sy+14,20,4);
          ctx.fillRect(sx+14,sy+8,4,16);
          ctx.fillStyle='rgba(255,190,110,.05)';
          ctx.fillRect(sx+15,sy+10,2,4);
          ctx.fillRect(sx+9,sy+9,3,12);
          ctx.fillRect(sx+20,sy+9,3,12);
          ctx.fillRect(sx+8,sy+21,5,2);
          ctx.fillRect(sx+19,sy+21,5,2);
        }
        if(routeFx.id==='seer'&&bossSide){
          ctx.strokeStyle='rgba(180,204,255,.14)';
          ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(sx+8,sy+10);ctx.lineTo(sx+10,sy+22);ctx.lineTo(sx+6,sy+22);ctx.closePath();ctx.stroke();
          ctx.beginPath();ctx.moveTo(sx+24,sy+10);ctx.lineTo(sx+26,sy+22);ctx.lineTo(sx+22,sy+22);ctx.closePath();ctx.stroke();
          ctx.beginPath();ctx.moveTo(sx+16,sy+7);ctx.lineTo(sx+22,sy+16);ctx.lineTo(sx+16,sy+25);ctx.lineTo(sx+10,sy+16);ctx.closePath();ctx.stroke();
          ctx.beginPath();ctx.arc(sx+16,sy+16,3,0,Math.PI*2);ctx.stroke();
        }
        if(bossId==='garmr'&&bossSide){
          ctx.strokeStyle='rgba(245,235,215,.16)';
          ctx.lineWidth=1.4;
          ctx.beginPath();ctx.moveTo(sx+7,sy+23);ctx.lineTo(sx+13,sy+9);ctx.lineTo(sx+18,sy+23);ctx.stroke();
          ctx.beginPath();ctx.moveTo(sx+14,sy+23);ctx.lineTo(sx+19,sy+11);ctx.lineTo(sx+25,sy+23);ctx.stroke();
        }
        if(bossId==='bone_king'&&bossAnchor){
          ctx.fillStyle='rgba(228,225,205,.06)';
          ctx.fillRect(sx+11,sy+9,10,12);
          ctx.fillRect(sx+15,sy+6,2,18);
          ctx.fillRect(sx+9,sy+12,14,2);
        }
        if(bossId==='hel'&&bossSide){
          ctx.strokeStyle='rgba(195,165,255,.18)';
          ctx.lineWidth=1.2;
          ctx.beginPath();ctx.arc(sx+16,sy+16,9,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle='rgba(159,140,255,.08)';
          ctx.fillRect(sx+15,sy+8,2,16);
        }
        if(bossId==='forge_guardian'&&bossAnchor){
          ctx.fillStyle='rgba(255,150,80,.08)';
          ctx.fillRect(sx+10,sy+9,12,12);
          ctx.fillRect(sx+13,sy+6,6,18);
          ctx.fillStyle='rgba(255,210,130,.05)';
          ctx.fillRect(sx+14,sy+11,4,3);
        }
        if(bossId==='jormungandr'&&bossSide){
          ctx.strokeStyle='rgba(120,240,140,.16)';
          ctx.lineWidth=1.4;
          ctx.beginPath();ctx.arc(sx+16,sy+16,9,Math.PI*.2,Math.PI*1.8);ctx.stroke();
          ctx.beginPath();ctx.arc(sx+16,sy+16,5,Math.PI*1.1,Math.PI*.8,true);ctx.stroke();
          ctx.fillStyle='rgba(120,240,140,.08)';
          ctx.beginPath();ctx.arc(sx+21,sy+13,2.5,0,Math.PI*2);ctx.fill();
        }
        if(bossId==='surtr'&&bossAnchor){
          ctx.fillStyle='rgba(255,120,60,.09)';
          ctx.fillRect(sx+8,sy+23,16,2);
          ctx.fillRect(sx+11,sy+9,3,12);
          ctx.fillRect(sx+18,sy+9,3,12);
          ctx.fillStyle='rgba(255,200,130,.06)';
          ctx.fillRect(sx+14,sy+7,4,14);
        }
        if(bossId==='veilscribe'&&bossSide){
          ctx.strokeStyle='rgba(122,184,255,.16)';
          ctx.lineWidth=1.2;
          ctx.beginPath();ctx.moveTo(sx+16,sy+6);ctx.lineTo(sx+24,sy+16);ctx.lineTo(sx+16,sy+26);ctx.lineTo(sx+8,sy+16);ctx.closePath();ctx.stroke();
          ctx.fillStyle='rgba(122,184,255,.08)';
          ctx.fillRect(sx+15,sy+9,2,14);
        }
        if(bossId==='mimir_echo'&&bossAnchor){
          ctx.strokeStyle='rgba(190,220,255,.18)';
          ctx.lineWidth=1.2;
          ctx.beginPath();ctx.arc(sx+16,sy+16,8,0,Math.PI*2);ctx.stroke();
          ctx.beginPath();ctx.arc(sx+16,sy+16,4,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle='rgba(190,220,255,.06)';
          ctx.fillRect(sx+15,sy+6,2,20);
        }
        if(bossId==='odin_shadow'&&bossSide){
          ctx.strokeStyle='rgba(180,190,255,.18)';
          ctx.lineWidth=1.2;
          ctx.beginPath();ctx.moveTo(sx+16,sy+5);ctx.lineTo(sx+25,sy+16);ctx.lineTo(sx+16,sy+27);ctx.lineTo(sx+7,sy+16);ctx.closePath();ctx.stroke();
          ctx.beginPath();ctx.moveTo(sx+10,sy+10);ctx.lineTo(sx+22,sy+22);ctx.moveTo(sx+22,sy+10);ctx.lineTo(sx+10,sy+22);ctx.stroke();
        }
      }
      break;}
    case DT.WALL:
      ctx.fillStyle=routeFx.wall;ctx.fillRect(sx,sy,DTILE,DTILE);
      ctx.fillStyle=routeFx.wallHi;ctx.fillRect(sx,sy,DTILE,5);
      ctx.fillStyle=routeFx.wallLo||'rgba(0,0,0,.12)';ctx.fillRect(sx,sy+DTILE-7,DTILE,7);
      ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(sx+4,sy+5,DTILE-8,2);
      ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(sx,sy+DTILE-4,DTILE,4);
      ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(sx,sy,5,DTILE);
      ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(sx+DTILE-3,sy,3,DTILE);
      if(dmap[ty-1]?.[tx]!==DT.WALL&&dmap[ty-1]?.[tx]!==DT.SECRET_WALL){
        ctx.fillStyle=routeFx.wallHi;
        ctx.beginPath();
        ctx.moveTo(sx,sy+3);ctx.lineTo(sx+4,sy-2);ctx.lineTo(sx+DTILE-4,sy-2);ctx.lineTo(sx+DTILE,sy+3);
        ctx.closePath();ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(sx+6,sy+1,DTILE-12,2);
      }
      if((tx+ty*2)%5===0){ctx.fillStyle='rgba(100,80,130,.15)';ctx.fillRect(sx+4,sy+4,DTILE-8,DTILE-8);}
      let wrn=roomNoise(tx,ty,.82);
      if(wrn>.42){ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(sx+5,sy+12,DTILE-10,2);}
      if(wrn>.68){ctx.fillStyle='rgba(60,46,82,.22)';ctx.fillRect(sx+8,sy+19,12,3);}
      if(routeFx.id==='barrow'&&wrn>.56){ctx.strokeStyle='rgba(201,182,255,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+8,sy+8);ctx.lineTo(sx+14,sy+13);ctx.lineTo(sx+10,sy+18);ctx.stroke();}
      if(routeFx.id==='ember'&&wrn>.5){ctx.fillStyle='rgba(216,108,47,.09)';ctx.fillRect(sx+7,sy+7,DTILE-14,3);}
      if(routeFx.id==='seer'&&wrn>.47){ctx.strokeStyle='rgba(122,184,255,.13)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+DTILE/2,5,0,Math.PI*2);ctx.stroke();}
      if(wrn>.74){ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(sx+6,sy+6,4,4);ctx.fillRect(sx+21,sy+17,3,6);}
      if(wrn>.58){ctx.fillStyle='rgba(255,255,255,.025)';ctx.fillRect(sx+4,sy+5,DTILE-9,2);}
      if(wrn>.46){ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(sx+9,sy+11,12,1);}
      if(routeFx.id==='barrow'&&wrn>.72){ctx.fillStyle='rgba(210,205,220,.05)';ctx.fillRect(sx+14,sy+8,2,16);}
      if(routeFx.id==='ember'&&wrn>.68){ctx.fillStyle='rgba(168,92,64,.08)';ctx.fillRect(sx+7,sy+DTILE-10,DTILE-14,2);}
      if(routeFx.id==='seer'&&wrn>.66){ctx.strokeStyle='rgba(159,140,255,.1)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+8,sy+DTILE-8);ctx.lineTo(sx+DTILE/2,sy+10);ctx.lineTo(sx+DTILE-8,sy+DTILE-8);ctx.stroke();}
      break;
    case DT.SECRET_WALL:
      // Looks almost like a wall but with a very subtle difference
      ctx.fillStyle=routeFx.wall;ctx.fillRect(sx,sy,DTILE,DTILE);
      ctx.fillStyle=`${routeFx.glow}1f`;ctx.fillRect(sx+3,sy+3,DTILE-6,DTILE-6);
      ctx.fillStyle=`${routeFx.glow}14`;ctx.fillRect(sx+DTILE/2-2,sy+4,4,DTILE-8);break;
    case DT.DOOR:
      ctx.fillStyle='#2a2236';ctx.fillRect(sx,sy,DTILE,DTILE);ctx.fillStyle='#6b4a00';ctx.fillRect(sx+4,sy+2,DTILE-8,DTILE-4);
      ctx.strokeStyle='#8b6900';ctx.lineWidth=1;ctx.strokeRect(sx+4,sy+2,DTILE-8,DTILE-4);
      ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('🔒',sx+DTILE/2,sy+DTILE/2+5);ctx.textAlign='left';break;
    case DT.BOSS_DOOR:{
      ctx.fillStyle='#120005';ctx.fillRect(sx,sy,DTILE,DTILE);
      let pg=Math.sin(Date.now()/400)*.3+.7;
      drawShadow(sx+DTILE/2,sy+DTILE-3,12,3,.22);
      ctx.fillStyle='#2d0910';ctx.fillRect(sx+4,sy+6,DTILE-8,DTILE-8);
      ctx.fillStyle=`rgba(180,0,0,${pg*.35})`;ctx.fillRect(sx+5,sy+3,DTILE-10,DTILE-12);
      ctx.fillStyle='rgba(255,255,255,.04)';ctx.fillRect(sx+7,sy+6,DTILE-14,2);
      ctx.strokeStyle=`rgba(220,20,20,${pg})`;ctx.lineWidth=2;ctx.strokeRect(sx+4,sy+6,DTILE-8,DTILE-8);
      ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(sx+DTILE/2-2,sy+6,4,DTILE-8);
      if(routeFx.id==='barrow'){
        ctx.strokeStyle='rgba(210,205,220,.18)';
        ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(sx+DTILE/2,sy+15,6,0,Math.PI*2);ctx.stroke();
        ctx.fillStyle='rgba(214,205,230,.08)';ctx.fillRect(sx+DTILE/2-1,sy+8,2,15);
      }else if(routeFx.id==='ember'){
        ctx.fillStyle='rgba(216,108,47,.12)';
        ctx.fillRect(sx+7,sy+9,DTILE-14,2);ctx.fillRect(sx+10,sy+20,DTILE-20,2);
        ctx.fillRect(sx+9,sy+9,2,14);ctx.fillRect(sx+DTILE-11,sy+9,2,14);
      }else if(routeFx.id==='seer'){
        ctx.strokeStyle='rgba(159,140,255,.18)';
        ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(sx+DTILE/2,sy+7);ctx.lineTo(sx+25,sy+15);ctx.lineTo(sx+DTILE/2,sy+23);ctx.lineTo(sx+7,sy+15);ctx.closePath();ctx.stroke();
      }
      if(Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.8){
        let bossName=currentDungeonBossDef().name;
        ctx.fillStyle='rgba(0,0,0,.8)';ctx.fillRect(sx-22,sy-18,DTILE+44,16);
        ctx.fillStyle='#ff8a8a';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(bossReady?'[ENTER] '+bossName:bossName+' SEALED',sx+DTILE/2,sy-6);
      }
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('💀',sx+DTILE/2,sy+DTILE/2+5);ctx.textAlign='left';break;}
    case DT.CHEST:{
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      drawShadow(sx+DTILE/2,sy+DTILE-3,11,4,.2);
      ctx.fillStyle='#3c2200';ctx.fillRect(sx+5,sy+12,DTILE-10,DTILE-15);
      ctx.fillStyle='#8f6c1a';ctx.beginPath();ctx.moveTo(sx+4,sy+12);ctx.lineTo(sx+8,sy+7);ctx.lineTo(sx+DTILE-8,sy+7);ctx.lineTo(sx+DTILE-4,sy+12);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(sx+8,sy+9,DTILE-16,2);
      ctx.fillStyle='#6f4f13';ctx.fillRect(sx+8,sy+16,DTILE-16,3);
      ctx.fillStyle='#ffd700';ctx.fillRect(sx+DTILE/2-3,sy+12,6,4);
      let cp=Math.sin(Date.now()/800)*.2+.8;ctx.strokeStyle=`rgba(255,215,0,${cp})`;ctx.lineWidth=1;ctx.strokeRect(sx+5,sy+12,DTILE-10,DTILE-15);
      let ch=dchests.find(c=>c.x===tx&&c.y===ty);
      if(ch&&!ch.opened&&Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.5){
        ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(sx+DTILE/2-20,sy-15,40,15);ctx.fillStyle='#ffd700';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('[F] Open',sx+DTILE/2,sy-4);ctx.textAlign='left';}break;}
    case DT.TRAP:
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      ctx.fillStyle='rgba(180,60,0,.25)';ctx.fillRect(sx+3,sy+3,DTILE-6,DTILE-6);
      ctx.strokeStyle='rgba(200,80,0,.4)';ctx.lineWidth=1;ctx.strokeRect(sx+3,sy+3,DTILE-6,DTILE-6);break;
    case DT.STAIRS:
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      let sp2=Math.sin(Date.now()/500)*.2+.8;ctx.fillStyle=`rgba(0,200,255,${sp2*.14})`;ctx.fillRect(sx+2,sy+2,DTILE-4,DTILE-4);
      ctx.fillStyle='#2a3742';for(let i=0;i<4;i++)ctx.fillRect(sx+6+i*4,sy+8+i*4,DTILE-12-i*8,3);
      ctx.strokeStyle=`rgba(0,220,255,${sp2})`;ctx.lineWidth=2;ctx.strokeRect(sx+2,sy+2,DTILE-4,DTILE-4);
      if(routeFx.id==='barrow'){ctx.fillStyle='rgba(214,205,230,.08)';ctx.fillRect(sx+8,sy+6,2,20);}
      else if(routeFx.id==='ember'){ctx.fillStyle='rgba(216,108,47,.09)';ctx.fillRect(sx+7,sy+24,DTILE-14,2);}
      else if(routeFx.id==='seer'){ctx.strokeStyle='rgba(159,140,255,.16)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+14,5,0,Math.PI*2);ctx.stroke();}
      ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('⬇',sx+DTILE/2,sy+DTILE/2+6);ctx.textAlign='left';
      if(Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*2){
        ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(sx-14,sy-18,DTILE+28,16);ctx.fillStyle='#00eeff';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText('Next Floor',sx+DTILE/2,sy-6);ctx.textAlign='left';}
      break;
    case DT.VENDOR:{
      ctx.fillStyle='#1d1625';ctx.fillRect(sx,sy,DTILE,DTILE);
      drawShadow(sx+DTILE/2,sy+DTILE-4,11,4,.18);
      ctx.fillStyle='#4a2b11';ctx.fillRect(sx+7,sy+13,DTILE-14,DTILE-12);
      ctx.fillStyle='#7a4a26';ctx.fillRect(sx+9,sy+9,DTILE-18,5);
      ctx.fillStyle='rgba(255,245,215,.08)';ctx.fillRect(sx+10,sy+10,DTILE-20,2);
      ctx.fillStyle='#d8c39c';ctx.beginPath();ctx.arc(sx+DTILE/2,sy+11,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#6b4c99';ctx.beginPath();ctx.moveTo(sx+DTILE/2,sy+13);ctx.lineTo(sx+9,sy+DTILE-5);ctx.lineTo(sx+DTILE-9,sy+DTILE-5);ctx.closePath();ctx.fill();
      ctx.fillStyle='#a07c42';ctx.fillRect(sx+6,sy+16,4,8);ctx.fillRect(sx+DTILE-10,sy+16,4,8);
      ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(sx+7,sy+20,DTILE-14,2);
      if(routeFx.id==='barrow'){ctx.fillStyle='rgba(214,205,230,.08)';ctx.fillRect(sx+12,sy+8,8,2);}
      else if(routeFx.id==='ember'){ctx.fillStyle='rgba(216,108,47,.08)';ctx.fillRect(sx+8,sy+24,DTILE-16,2);}
      else if(routeFx.id==='seer'){ctx.strokeStyle='rgba(159,140,255,.14)';ctx.lineWidth=1;ctx.strokeRect(sx+10,sy+15,DTILE-20,8);}
      ctx.fillStyle='#171116';ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText('🧙',sx+DTILE/2,sy+DTILE/2+5);ctx.textAlign='left';
      if(Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.5){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(sx-8,sy-18,DTILE+16,16);ctx.fillStyle='#ffd700';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('[F] Trade',sx+DTILE/2,sy-5);ctx.textAlign='left';}break;}
    case DT.FORGE:{
      ctx.fillStyle='#22181d';ctx.fillRect(sx,sy,DTILE,DTILE);
      drawShadow(sx+DTILE/2,sy+DTILE-4,11,4,.2);
      ctx.fillStyle='#2e1000';ctx.fillRect(sx+5,sy+13,DTILE-10,DTILE-10);
      ctx.fillStyle='#5c3924';ctx.fillRect(sx+7,sy+9,DTILE-14,5);
      let ff=Math.sin(Date.now()/300)*.15+.85;ctx.fillStyle=`rgba(255,${Math.floor(100*ff)},0,${ff})`;ctx.fillRect(sx+10,sy+13,DTILE-20,DTILE-18);
      ctx.fillStyle='rgba(255,180,80,.3)';ctx.fillRect(sx+12,sy+8,DTILE-24,2);
      ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;ctx.strokeRect(sx+6,sy+13,DTILE-12,DTILE-11);
      ctx.fillStyle='#7a7e86';ctx.fillRect(sx+18,sy+7,3,7);
      ctx.fillRect(sx+19,sy+4,1,4);
      if(routeFx.id==='ember'){ctx.fillStyle='rgba(255,150,80,.14)';ctx.fillRect(sx+8,sy+11,DTILE-16,2);}
      else if(routeFx.id==='barrow'){ctx.fillStyle='rgba(214,205,230,.07)';ctx.fillRect(sx+12,sy+13,2,10);}
      else if(routeFx.id==='seer'){ctx.strokeStyle='rgba(159,140,255,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx+13,sy+18,4,0,Math.PI*2);ctx.stroke();}
      ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('🔥',sx+DTILE/2,sy+DTILE/2+6);ctx.textAlign='left';
      if(Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.5){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(sx-8,sy-18,DTILE+16,16);ctx.fillStyle='#ffd700';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('[F] Forge',sx+DTILE/2,sy-5);ctx.textAlign='left';}break;}
    case DT.SHRINE:{
      ctx.fillStyle='#161021';ctx.fillRect(sx,sy,DTILE,DTILE);
      drawShadow(sx+DTILE/2,sy+DTILE-4,11,4,.18);
      let sp3=Math.sin(Date.now()/600)*.3+.7;
      ctx.fillStyle='#302344';ctx.beginPath();ctx.moveTo(sx+DTILE/2,sy+5);ctx.lineTo(sx+8,sy+DTILE-5);ctx.lineTo(sx+DTILE-8,sy+DTILE-5);ctx.closePath();ctx.fill();
      ctx.fillStyle=`rgba(155,48,255,${sp3*.35})`;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+13,6,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`rgba(180,100,255,${sp3})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+13,8,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(sx+DTILE/2-1,sy+9,2,12);
      ctx.fillStyle='rgba(159,140,255,.1)';ctx.fillRect(sx+10,sy+21,DTILE-20,2);
      if(routeFx.id==='seer'){
        ctx.strokeStyle='rgba(180,204,255,.18)';
        ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(sx+16,sy+8);ctx.lineTo(sx+24,sy+16);ctx.lineTo(sx+16,sy+24);ctx.lineTo(sx+8,sy+16);ctx.closePath();ctx.stroke();
      }else if(routeFx.id==='ember'){ctx.fillStyle='rgba(216,108,47,.07)';ctx.fillRect(sx+11,sy+24,10,2);}
      else if(routeFx.id==='barrow'){ctx.fillStyle='rgba(214,205,230,.07)';ctx.fillRect(sx+15,sy+8,2,16);}
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('🔮',sx+DTILE/2,sy+DTILE/2+7);ctx.textAlign='left';
      let sh=dShrines.find(s=>s.x===tx&&s.y===ty);
      if(sh&&!sh.used&&Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.5){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(sx-8,sy-18,DTILE+16,16);ctx.fillStyle='#cc88ff';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('[F] Pray',sx+DTILE/2,sy-5);ctx.textAlign='left';}break;}
    case DT.PUZZLE:{
      ctx.fillStyle='#1c1810';ctx.fillRect(sx,sy,DTILE,DTILE);
      drawShadow(sx+DTILE/2,sy+DTILE-4,11,4,.18);
      let pp=Math.sin(Date.now()/700)*.25+.75;
      ctx.fillStyle='#5d4921';ctx.fillRect(sx+7,sy+11,DTILE-14,DTILE-12);
      ctx.fillStyle=`rgba(200,160,0,${pp*.25})`;ctx.fillRect(sx+10,sy+9,DTILE-20,DTILE-16);
      ctx.strokeStyle=`rgba(220,180,0,${pp})`;ctx.lineWidth=1;ctx.strokeRect(sx+10,sy+9,DTILE-20,DTILE-16);
      ctx.strokeStyle='rgba(255,220,130,.3)';ctx.beginPath();ctx.arc(sx+DTILE/2,sy+15,5,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(sx+DTILE/2,sy+10);ctx.lineTo(sx+DTILE/2,sy+20);ctx.moveTo(sx+DTILE/2-5,sy+15);ctx.lineTo(sx+DTILE/2+5,sy+15);ctx.stroke();
      ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('🔑',sx+DTILE/2,sy+DTILE/2+6);ctx.textAlign='left';
      let pz=dPuzzles.find(p=>p.x===tx&&p.y===ty);
      if(pz&&!pz.solved&&Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.5){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(sx-8,sy-18,DTILE+16,16);ctx.fillStyle='#ffd700';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText('[F] Solve',sx+DTILE/2,sy-5);ctx.textAlign='left';}break;}
    case DT.EVENT:{
      ctx.fillStyle='#17131f';ctx.fillRect(sx,sy,DTILE,DTILE);
      let ev=dFloorEvents.find(f=>f.x===tx&&f.y===ty);
      let pulse=Math.sin(Date.now()/520)*.22+.78;
      let evCol=ev?.col||'#d7b15c';
      drawShadow(sx+DTILE/2,sy+DTILE-4,11,4,.18);
      drawGlow(sx+DTILE/2,sy+DTILE/2,26,evCol,.16);
      ctx.fillStyle='#241d2d';ctx.beginPath();ctx.moveTo(sx+DTILE/2,sy+5);ctx.lineTo(sx+8,sy+DTILE-6);ctx.lineTo(sx+DTILE-8,sy+DTILE-6);ctx.closePath();ctx.fill();
      ctx.fillStyle=`${evCol}33`;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+14,8,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`${evCol}${Math.floor((.55+pulse*.35)*255).toString(16).padStart(2,'0')}`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+14,10,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='rgba(255,240,190,.18)';ctx.fillRect(sx+11,sy+18,DTILE-22,5);
      ctx.fillStyle='rgba(255,255,255,.1)';ctx.fillRect(sx+DTILE/2-1,sy+10,2,10);
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(ev?.icon||'✦',sx+DTILE/2,sy+DTILE/2+7);ctx.textAlign='left';
      if(ev&&!ev.used&&!ev.pending&&Math.hypot(dPlayer.x-(tx*DTILE+DTILE/2),dPlayer.y-(ty*DTILE+DTILE/2))<DTILE*1.6){
        ctx.fillStyle='rgba(0,0,0,.86)';ctx.fillRect(sx-34,sy-36,DTILE+68,36);
        ctx.fillStyle=evCol;ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(ev.name,sx+DTILE/2,sy-23);
        ctx.fillStyle='#f0dfb8';ctx.fillText(ev.rewardText||'',sx+DTILE/2,sy-12);
        ctx.fillStyle='#d7b15c';ctx.fillText(ev.prompt,sx+DTILE/2,sy-2);ctx.textAlign='left';
      }break;}
    case DT.POISON_VENT:{
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      let pv=dPoisonVents.find(v=>v.x===tx&&v.y===ty);
      if(pv?.active){
        let ppa=Math.sin(Date.now()/200)*.2+.8;
        ctx.fillStyle=`rgba(50,180,50,${ppa*.5})`;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+DTILE/2,DTILE*.6,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=`rgba(80,220,80,${ppa*.3})`;ctx.beginPath();ctx.arc(sx+DTILE/2,sy+DTILE/2,DTILE*1,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#55ff55';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('☠',sx+DTILE/2,sy+DTILE/2+6);ctx.textAlign='left';
      }else{ctx.fillStyle='rgba(50,100,50,.2)';ctx.fillRect(sx+6,sy+6,DTILE-12,DTILE-12);ctx.fillStyle='rgba(100,150,100,.4)';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText('⊙',sx+DTILE/2,sy+DTILE/2+4);ctx.textAlign='left';}break;}
    case DT.ARROW_TRAP:
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      ctx.fillStyle='rgba(139,105,0,.4)';ctx.fillRect(sx+4,sy+4,DTILE-8,DTILE-8);
      ctx.strokeStyle='rgba(240,210,120,.22)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx+DTILE/2,sy+DTILE/2);ctx.lineTo(sx+DTILE-5,sy+DTILE/2);ctx.stroke();
      ctx.fillStyle='#8b6900';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('→',sx+DTILE/2,sy+DTILE/2+5);ctx.textAlign='left';break;
    case DT.RUNE_TILE:{
      ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
      let rt=dRuneTiles.find(r=>r.x===tx&&r.y===ty);
      if(!rt?.triggered){
        let rta=Math.sin(Date.now()/400)*.2+.8;
        ctx.fillStyle=`rgba(100,100,255,${rta*.3})`;ctx.fillRect(sx+3,sy+3,DTILE-6,DTILE-6);
        ctx.strokeStyle=`rgba(120,120,255,${rta})`;ctx.lineWidth=1;ctx.strokeRect(sx+3,sy+3,DTILE-6,DTILE-6);
        ctx.fillStyle=`rgba(150,150,255,${rta})`;ctx.font='13px sans-serif';ctx.textAlign='center';ctx.fillText('ᚱ',sx+DTILE/2,sy+DTILE/2+5);ctx.textAlign='left';
      }break;}
    default:ctx.fillStyle=floorCol;ctx.fillRect(sx,sy,DTILE,DTILE);
  }
  // Torch overlay
  let torch=dtorches.find(t2=>t2.x===tx&&t2.y===ty);
  if(torch){let fl=Math.sin(Date.now()/150+torch.flicker)*.2+.8;ctx.fillStyle=`rgba(255,${Math.floor(120*fl)},20,${fl})`;ctx.fillRect(sx+DTILE/2-3,sy+4,6,10);ctx.fillStyle=`rgba(255,200,50,${fl*.7})`;ctx.beginPath();ctx.ellipse(sx+DTILE/2,sy+4,5*fl,7*fl,0,0,Math.PI*2);ctx.fill();}
  // Spike overlay
  let spike=dspikes.find(s=>s.x===tx&&s.y===ty);
  if(spike){
    if(spike.active){ctx.fillStyle='rgba(180,180,200,.9)';for(let k=0;k<4;k++){let kx=sx+6+k*(DTILE-12)/3,ky=sy+DTILE-6;ctx.beginPath();ctx.moveTo(kx,ky);ctx.lineTo(kx+3,sy+4);ctx.lineTo(kx+6,ky);ctx.fill();}}
    else{ctx.fillStyle='rgba(80,80,100,.25)';ctx.fillRect(sx+3,sy+DTILE-6,DTILE-6,4);}
  }
  ctx.restore();
}

function drawDungeon(){
  let routeFx=routeVisuals();
  let dg=ctx.createLinearGradient(0,0,0,H);
  dg.addColorStop(0,routeFx.bgTop);
  dg.addColorStop(.55,routeFx.bgMid);
  dg.addColorStop(1,routeFx.bgBot);
  ctx.fillStyle=dg;ctx.fillRect(0,0,W,H);
  ctx.save();
  ctx.globalAlpha=.16;
  for(let i=0;i<5;i++){
    let bx=i*(W/4)-40-((dCam.x*.08)%120),h=routeFx.id==='ember'?120:routeFx.id==='seer'?150:136;
    ctx.fillStyle=routeFx.id==='ember'?'#21110d':routeFx.id==='seer'?'#121b27':'#17131d';
    ctx.beginPath();
    ctx.moveTo(bx,H*.52+h*.18);
    ctx.lineTo(bx+24,H*.52-h*.15);
    ctx.lineTo(bx+76,H*.52-h*.48);
    ctx.lineTo(bx+118,H*.52-h*.06);
    ctx.lineTo(bx+136,H*.52+h*.22);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  let ox=-dCam.x,oy=-dCam.y;
  for(let ty=0;ty<DH;ty++)for(let tx=0;tx<DW;tx++){
    let sx=tx*DTILE+ox,sy=ty*DTILE+oy;
    if(sx<-DTILE||sx>W+DTILE||sy<-DTILE||sy>H+DTILE)continue;
    if(!dungeonRevealed[ty][tx]){ctx.fillStyle='#050508';ctx.fillRect(sx,sy,DTILE,DTILE);continue;}
    drawDungeonTile(dmap[ty][tx],tx,ty,sx,sy);
  }
  // Torch glow pools
  dtorches.forEach(torch=>{
    if(!dungeonRevealed[torch.y]?.[torch.x])return;
    let sx=torch.x*DTILE+DTILE/2+ox,sy=torch.y*DTILE+DTILE/2+oy;
    let fl=Math.sin(Date.now()/200+torch.flicker)*.15+.85;
    let grad=ctx.createRadialGradient(sx,sy,0,sx,sy,DTILE*2.5*fl);
    grad.addColorStop(0,'rgba(255,160,60,0.16)');grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad;ctx.fillRect(sx-DTILE*3,sy-DTILE*3,DTILE*6,DTILE*6);
  });
  // Fog of war edge
  for(let ty=0;ty<DH;ty++)for(let tx=0;tx<DW;tx++){
    if(dungeonRevealed[ty][tx])continue;
    let adj=false;for(let dy=-1;dy<=1&&!adj;dy++)for(let dx=-1;dx<=1&&!adj;dx++){let nx=tx+dx,ny=ty+dy;if(nx>=0&&nx<DW&&ny>=0&&ny<DH&&dungeonRevealed[ny][nx])adj=true;}
    if(adj){let sx=tx*DTILE+ox,sy=ty*DTILE+oy;ctx.fillStyle='rgba(5,5,12,0.8)';ctx.fillRect(sx,sy,DTILE,DTILE);}
  }
  // Loot
  loot.filter(l=>l.isDungeon).forEach(l=>{
    drawLootSprite(l,l.x-dCam.x,l.y-dCam.y);
  });
  // Enemies
  enemies.filter(e=>e.isDungeon).forEach(e=>{
    if(e.hp<=0)return;
    let etx=Math.floor(e.x/DTILE),ety=Math.floor(e.y/DTILE);
    if(!dungeonRevealed[ety]?.[etx])return;
    drawEnemyFigure(e,e.x-dCam.x,e.y-dCam.y);
  });
  // Projectiles - Dungeon
  projectiles.filter(p=>p.isDungeon).forEach(p=>{
    let sx=p.x-dCam.x,sy=p.y-dCam.y;
    drawProjectileSprite(p, sx, sy);
  });
  // Player
  let psx=dPlayer.x-dCam.x,psy=dPlayer.y-dCam.y;
  if(!(P.blink>0&&Math.floor(Date.now()/90)%2===0)){
    drawPlayerSprite(psx,psy);
  }
  // Player torch glow
  let grad2=ctx.createRadialGradient(psx,psy,0,psx,psy,DTILE*4);
  grad2.addColorStop(0,'rgba(255,200,100,0.14)');grad2.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=grad2;ctx.fillRect(psx-DTILE*5,psy-DTILE*5,DTILE*10,DTILE*10);
  drawParticles();drawFloaters();drawDungeonMinimap();
  let vg=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.75);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,8,.8)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
}

function drawDungeonMinimap(){
  mctx.fillStyle='#0a0810';mctx.fillRect(0,0,120,120);
  let sc=Math.min(120/DW,120/DH);
  for(let ty=0;ty<DH;ty++)for(let tx=0;tx<DW;tx++){
    if(!dungeonRevealed[ty][tx])continue;
    let t=dmap[ty][tx];
    mctx.fillStyle=t===DT.WALL?'#16121e':t===DT.DOOR?'#8b6900':t===DT.BOSS_DOOR?'#cc0000':t===DT.CHEST?'#c8a000':t===DT.STAIRS?'#00ddff':t===DT.VENDOR?'#44ff44':t===DT.FORGE?'#ff6600':t===DT.SHRINE?'#9b30ff':t===DT.PUZZLE?'#ffd700':t===DT.SECRET_WALL?'#334433':'#3a3050';
    mctx.fillRect(tx*sc,ty*sc,sc+.5,sc+.5);
  }
  if(dbossRoom){
    let cx=Math.floor((dbossRoom.x+dbossRoom.w/2)*sc),cy=Math.floor((dbossRoom.y+dbossRoom.h/2)*sc);
    let revealed=bossReady||bossActive||bossDefeated||dungeonRevealed[dbossRoom.doorY]?.[dbossRoom.doorX];
    if(revealed){
      mctx.strokeStyle=bossDefeated?'#00ddff':bossActive?'#ff4444':bossReady?'#ffb347':'#773333';
      mctx.lineWidth=2;
      mctx.strokeRect(dbossRoom.x*sc,dbossRoom.y*sc,Math.max(2,dbossRoom.w*sc),Math.max(2,dbossRoom.h*sc));
      mctx.fillStyle=bossDefeated?'#00ddff':bossActive?'#ff4444':'#ffb347';
      mctx.fillRect(cx-1,cy-1,3,3);
    }
  }
  mctx.fillStyle='#ffd700';mctx.fillRect(Math.floor(dPlayer.x/DTILE)*sc,Math.floor(dPlayer.y/DTILE)*sc,sc+1,sc+1);
  enemies.filter(e=>e.isDungeon&&e.hp>0).forEach(e=>{
    let etx=Math.floor(e.x/DTILE),ety=Math.floor(e.y/DTILE);
    if(!dungeonRevealed[ety]?.[etx])return;
    mctx.fillStyle=e===bossRef?'#ff0000':e.isElite?'#ffd700':'#cc2200';mctx.fillRect(etx*sc,ety*sc,sc+1,sc+1);
  });
  dFloorEvents.forEach(ev=>{
    if(ev.used||!dungeonRevealed[ev.y]?.[ev.x])return;
    mctx.fillStyle=ev.col||'#f8da82';
    mctx.fillRect(ev.x*sc,ev.y*sc,sc+1,sc+1);
  });
}

function drawWorld(){
  let sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#182030');
  sky.addColorStop(.45,'#0d1119');
  sky.addColorStop(1,'#07080d');
  ctx.fillStyle=sky;
  ctx.fillRect(0,0,W,H);
  let auroraT=Date.now()/4200;
  for(let i=0;i<3;i++){
    let baseY=90+i*42+Math.sin(auroraT+i)*18;
    ctx.save();
    ctx.globalAlpha=.08-(i*.015);
    ctx.strokeStyle=i===0?'#8ecaf4':i===1?'#9f8cff':'#d7b15c';
    ctx.lineWidth=26-i*5;
    ctx.beginPath();
    ctx.moveTo(-40,baseY);
    ctx.bezierCurveTo(W*.18,baseY-26,W*.42,baseY+32,W*.7,baseY-18);
    ctx.bezierCurveTo(W*.86,baseY-34,W*1.02,baseY+20,W+60,baseY-8);
    ctx.stroke();
    ctx.restore();
  }
  let mist=ctx.createLinearGradient(0,H*.45,0,H);
  mist.addColorStop(0,'rgba(90,110,150,0)');
  mist.addColorStop(1,'rgba(18,22,30,.18)');
  ctx.fillStyle=mist;
  ctx.fillRect(0,H*.45,W,H*.55);
  ctx.save();
  ctx.globalAlpha=.14;
  ctx.fillStyle='#0a0d14';
  for(let i=0;i<6;i++){
    let bx=i*(W/5)-50-((cam.x*.04)%140),by=H*.34+Math.sin(Date.now()/2400+i)*10;
    ctx.fillRect(bx,by,28,70);
    ctx.fillRect(bx+34,by-18,18,88);
    ctx.fillRect(bx+58,by+10,24,60);
  }
  ctx.globalAlpha=.08;
  ctx.fillStyle='#6fe7ff';
  ctx.fillRect(W*.68,H*.29,90,2);
  ctx.fillRect(W*.72,H*.32,56,2);
  ctx.restore();
  let tx0=Math.floor(cam.x/T),ty0=Math.floor(cam.y/T),vx=Math.ceil(W/T)+2,vy=Math.ceil(H/T)+2;
  for(let ty=ty0-1;ty<ty0+vy;ty++)for(let tx=tx0-1;tx<tx0+vx;tx++)if(ty>=0&&ty<WS&&tx>=0&&tx<WS)drawTile(tx,ty,(tx-tx0)*T-(cam.x%T),(ty-ty0)*T-(cam.y%T));
}

function drawWorldEntities(){
  const spriteKinds=new Set(['village','tower','dungeon','grave','ruin','hall','council','sanctum','meadhall','memorial','watcher','portal']);
  worldLandmarks.forEach(site=>{
    let sx=site.x*T+T/2-cam.x,sy=site.y*T+T/2-cam.y;
    if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
    let d=Math.hypot(site.x*T+T/2-P.x,site.y*T+T/2-P.y);
    let near=d<145;
    let actionable=site.kind!=='village'&&site.kind!=='dungeon'&&(!site.used||isReusableLandmarkKind(site.kind));
    ctx.save();
    if(site.kind==='village'||site.kind==='dungeon'||(actionable&&near))drawGlow(sx,sy,24,site.kind==='dungeon'?'rgb(159,140,255)':'rgb(215,177,92)',actionable&&near ? .1 : .07);
    ctx.restore();
  });
  dungeonEntrances.forEach(ent=>{
    let sx=ent.wx-cam.x,sy=ent.wy-cam.y;
    if(Math.hypot(ent.wx-P.x,ent.wy-P.y)<110){
      ctx.save();
      let label=(ent.name||'Dungeon')+' - walk in';
      let sub=ent.routeLootHint||'';
      let w=Math.max(140,Math.max(label.length*6.4,sub.length*6.2));
      ctx.fillStyle='rgba(8,6,18,.88)';
      ctx.fillRect(sx-w/2,sy-44,w,28);
      ctx.strokeStyle='rgba(176,158,255,.75)';
      ctx.lineWidth=1;
      ctx.strokeRect(sx-w/2,sy-44,w,28);
      ctx.fillStyle='#efe7ff';
      ctx.font='12px monospace';
      ctx.textAlign='center';
      ctx.fillText(label,sx,sy-31);
      ctx.fillStyle='#bdaedb';
      ctx.font='10px monospace';
      ctx.fillText(sub,sx,sy-18);
      ctx.textAlign='left';
      ctx.restore();
    }
  });
  worldLandmarks.forEach(site=>{
    let sx=site.x*T+T/2-cam.x,sy=site.y*T+T/2-cam.y;
    if(sx<-120||sx>W+120||sy<-120||sy>H+120)return;
    if(['village','tower','dungeon','grave','ruin','hall','council','sanctum','meadhall','memorial','watcher','portal'].includes(site.kind))drawWorldSiteSprite(site,sx,sy);
  });
  npcList.forEach(n=>{
    let sx=n.wx-cam.x,sy=n.wy-cam.y;if(sx<-60||sx>W+60||sy<-60||sy>H+60)return;
    let isMerchant=(n.shopItems||[]).length>0;
    ctx.save();
    drawWorldNPCFigure(n,sx,sy);
    if(Math.hypot(n.wx-P.x,n.wy-P.y)<100){
      let boxW=Math.max(92,n.name.length*6.2+18);
      let boxY=sy-46;
      ctx.fillStyle='rgba(0,0,0,.68)';
      ctx.fillRect(sx-boxW/2,boxY,boxW,24);
      ctx.textAlign='center';
      ctx.fillStyle='#ffd700';
      ctx.font='10px monospace';
      ctx.fillText(n.name,sx,boxY+11);
      ctx.fillStyle=isMerchant?'#f8da82':'#aaa';
      ctx.font='9px monospace';
      ctx.fillText(isMerchant?'[F] Trade':'[F] Talk',sx,boxY+21);
    }
    ctx.textAlign='left';ctx.restore();
  });
  loot.filter(l=>!l.isDungeon).forEach(l=>{
    drawLootSprite(l,l.x-cam.x,l.y-cam.y);
  });
  enemies.filter(e=>!e.isDungeon).forEach(e=>{
    if(e.hp<=0)return;let sx=e.x-cam.x,sy=e.y-cam.y;if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
    drawEnemyFigure(e,sx,sy);
  });
  projectiles.filter(p=>!p.isDungeon).forEach(p=>{
    let sx=p.x-cam.x,sy=p.y-cam.y;
    drawProjectileSprite(p, sx, sy);
  });
  let sx=P.x-cam.x,sy=P.y-cam.y;
  if(!(P.blink>0&&Math.floor(Date.now()/90)%2===0)){
    drawPlayerSprite(sx,sy);
  }
  worldLandmarks.forEach(site=>{
    let sx=site.x*T+T/2-cam.x,sy=site.y*T+T/2-cam.y;
    if(sx<-80||sx>W+80||sy<-80||sy>H+80)return;
    let d=Math.hypot(site.x*T+T/2-P.x,site.y*T+T/2-P.y);
    let near=d<145;
    let actionable=site.kind!=='village'&&site.kind!=='dungeon'&&(!site.used||isReusableLandmarkKind(site.kind));
    let label=worldSiteLabelAnchor(site,sx,sy);
    ctx.save();
    ctx.textAlign='center';
    if(!spriteKinds.has(site.kind)){
      ctx.globalAlpha=near ? .9 : .32;
      ctx.font=near?'14px sans-serif':'13px sans-serif';
      ctx.fillStyle=site.kind==='dungeon'?'#bca8ff':actionable?'#f3deb0':'#d7b15c';
      ctx.fillText(site.icon,label.x,label.y+14);
    }
    if(near){
      let w=Math.max(72,site.name.length*6+18);
      ctx.fillStyle='rgba(0,0,0,.72)';
      ctx.fillRect(label.x-w/2,label.y,w,16);
      ctx.fillStyle='#f3deb0';
      ctx.font='10px monospace';
      ctx.fillText(site.name,label.x,label.y+11);
      if(actionable){
        let promptY=label.y+18;
        ctx.fillStyle='rgba(0,0,0,.68)';
        ctx.fillRect(label.x-38,promptY,76,14);
        ctx.fillStyle='#d7b15c';
        ctx.font='9px monospace';
        ctx.fillText('[F] '+(site.pending?'Survive':' '+site.actionLabel).trim(),label.x,promptY+10);
      }
    }
    ctx.textAlign='left';
    ctx.restore();
  });
}

function drawParticles(){
  particles.forEach(p=>{
    let sx=p.x-(inDungeon?dCam.x:cam.x),sy=p.y-(inDungeon?dCam.y:cam.y);
    ctx.save();
    ctx.globalAlpha=p.life;
    if(p.style==='rune'){
      ctx.translate(sx,sy);
      ctx.rotate((p.rot||0)+(1-p.life)*2);
      ctx.fillStyle=p.col;
      ctx.fillRect(-p.sz*.45,-p.sz*.45,p.sz*.9,p.sz*.9);
      ctx.strokeStyle='rgba(255,255,255,.35)';
      ctx.strokeRect(-p.sz*.45,-p.sz*.45,p.sz*.9,p.sz*.9);
    }else if(p.style==='mist'){
      ctx.fillStyle=p.col;
      ctx.beginPath();
      ctx.arc(sx,sy,p.sz*(1.2-p.life*.2),0,Math.PI*2);
      ctx.fill();
    }else{
      ctx.fillStyle=p.col;
      ctx.beginPath();
      ctx.arc(sx,sy,p.sz*p.life,0,Math.PI*2);
      ctx.fill();
      if(p.style==='spark'){
        ctx.strokeStyle='rgba(255,255,255,.28)';
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(sx-p.sz,sy);
        ctx.lineTo(sx+p.sz,sy);
        ctx.moveTo(sx,sy-p.sz);
        ctx.lineTo(sx,sy+p.sz);
        ctx.stroke();
      }
    }
    ctx.restore();
  });
}
function drawFloaters(){
  floaters.forEach(f=>{ctx.save();ctx.globalAlpha=f.life;ctx.fillStyle=f.col;ctx.font=f.sz+'px monospace';ctx.textAlign='center';ctx.fillText(f.txt,f.x-(inDungeon?dCam.x:cam.x),f.y-(inDungeon?dCam.y:cam.y));ctx.restore();});
}
function drawWorldMinimap(){
  mctx.fillStyle='#0a0a0f';mctx.fillRect(0,0,120,120);let sc=120/WS;
  for(let y=0;y<WS;y+=2)for(let x=0;x<WS;x+=2){let t=world[y][x];mctx.fillStyle=t===TILE.WATER?'#1a4a8b':t===TILE.LAVA?'#8b2200':t===TILE.SNOW?'#8baaba':t===TILE.TREE||t===TILE.GRASS?'#1f4a1f':t===TILE.DUNGEON_ENTRY?'#6040cc':'#252535';mctx.fillRect(x*sc,y*sc,sc*2+1,sc*2+1);}
  npcList.forEach(n=>{mctx.fillStyle='#ffd700';mctx.fillRect(n.wx/T*sc-1,n.wy/T*sc-1,3,3);});
  worldLandmarks.forEach(site=>{mctx.fillStyle=site.kind==='dungeon'?'#9f8cff':site.kind==='village'?'#f8da82':'#c9d0de';mctx.fillRect(site.x*sc-1,site.y*sc-1,3,3);});
  dungeonEntrances.forEach(e=>{mctx.fillStyle='#8866ff';mctx.fillRect(e.wx/T*sc-1,e.wy/T*sc-1,4,4);});
  enemies.filter(e=>!e.isDungeon).forEach(e=>{if(e.hp>0){mctx.fillStyle=e===bossRef?'#ff0000':'#cc2200';mctx.fillRect(e.x/T*sc-1,e.y/T*sc-1,3,3);}});
  mctx.fillStyle='#ffd700';mctx.fillRect(P.x/T*sc-2,P.y/T*sc-2,5,5);
}
function drawPauseOverlay(){
  if(!paused)return;
  ctx.save();ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffd700';ctx.font='bold 36px monospace';ctx.textAlign='center';ctx.fillText('⏸ PAUSED',W/2,H/2-10);
  ctx.fillStyle='#aaa';ctx.font='16px monospace';ctx.fillText('Press P to resume',W/2,H/2+28);ctx.textAlign='left';ctx.restore();
}
function updateHUD(){
  document.getElementById('hpf').style.width=(P.hp/P.maxHp*100)+'%';
  document.getElementById('mpf').style.width=(P.mp/P.maxMp*100)+'%';
  document.getElementById('xpf').style.width=(P.xp/P.xpNext*100)+'%';
  document.getElementById('stf').style.width=(P.stamina/P.maxStamina*100)+'%';
  document.getElementById('stf').style.background=P.stamina<20?'linear-gradient(90deg,#550000,#cc2200)':P.sprinting?'linear-gradient(90deg,#007700,#44ff44)':'linear-gradient(90deg,#005500,#22cc44)';
  let echoText=P._echoBlessing?' | Echo: '+echoBlessingLabel():'';
  let skaldText=P._skaldBuff?' | Skald: '+skaldBuffLabel():'';
  document.getElementById('gold').textContent='💰 '+P.gold+'g'+(P.className?' | '+P.className:'')+echoText+skaldText+' | [I] Bag [F] Interact [Q] Potion('+countPotions()+') [Shift] Sprint [P] Pause [M] Audio';
  document.getElementById('potion-count').textContent=countPotions();
  skillCD.forEach((cd,i)=>{let el=document.getElementById('cd'+i);if(cd>0){el.style.display='flex';el.textContent=Math.ceil(cd/1000)+'s';}else el.style.display='none';});
}

// ── INPUT ──────────────────────────────────────────────────
window.addEventListener('keydown',e=>{
  let k=normKey(e.key);
  keys[k]=true;
  if(e.key==='m'||e.key==='M'){toggleAudioMute();}
  if(e.key==='i'||e.key==='I'){panel==='inv'?closePanel():openInv();e.preventDefault();}
  if(e.key==='F10'){panel==='debug'?closePanel():openDebugMenu();e.preventDefault();}
  if(e.key==='f'||e.key==='F'){if(panel&&panel!=='npc')closePanel();else tryTalkNPC();}
  if(e.key==='q'||e.key==='Q')usePotion();
  if(e.key==='1')useSkill(0);if(e.key==='2')useSkill(1);if(e.key==='3')useSkill(2);if(e.key==='4')useSkill(3);
  if(e.key==='p'||e.key==='P'){if(panel==='lu'||panel==='class')return;paused=!paused;if(!paused)document.getElementById('msg').style.opacity=0;}
  if(e.key==='Escape'&&panel&&panel!=='lu'&&panel!=='class')closePanel();
  if(e.key===' ')e.preventDefault();
});
window.addEventListener('keyup',e=>{let k=normKey(e.key);keys[k]=false;});
window.addEventListener('blur',()=>{keys={};clearTransientInput();});
C.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
C.addEventListener('mousedown',e=>{if(e.button===0)keys['mouse']=true;});
C.addEventListener('mouseup',e=>{if(e.button===0)keys['mouse']=false;});
window.addEventListener('mouseup',e=>{if(e.button===0)keys['mouse']=false;});

function loop(ts){
  dt=Math.min(ts-lastT,50);lastT=ts;
  update(dt);
  ctx.clearRect(0,0,W,H);
  if(inDungeon){drawDungeon();}
  else{
    ctx.fillStyle='#0a0a0f';ctx.fillRect(0,0,W,H);
    drawWorld();drawWorldEntities();drawParticles();drawFloaters();
    let vg=ctx.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.65)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    drawWorldMinimap();
    let tx=Math.floor(P.x/T),ty=Math.floor(P.y/T),bi=biome[ty]?.[tx]??0;
    ctx.save();ctx.globalAlpha=.55;ctx.fillStyle='#c8a000';ctx.font='12px monospace';ctx.fillText(BIOMES[bi].name,10,H-10);ctx.restore();
  }
  drawPauseOverlay();updateHUD();
  requestAnimationFrame(loop);
}

initAudioUI();
window.addEventListener('pointerdown',()=>ensureAudio(),{passive:true});
window.addEventListener('keydown',()=>ensureAudio(),{passive:true});

// Initialize Asset Loader before starting the game
AssetLoader.init(() => {
  console.log('✅ All assets loaded successfully');
  initClassPanel();
  initSkillbarTooltips();
  openTitleScreen();
  requestAnimationFrame(loop);
});
