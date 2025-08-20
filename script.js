// Global variables
let materialItems = [];
let currentFilter = 'all';
let draggedElement = null;
let editingItemId = null;
let currentCatalogFilter = 'all';

// Material catalog data - comprehensive collection
const MATERIAL_CATALOG = {
  // Character EXP Materials
  'character-exp': [
    { id: 'wanderers-advice', name: "Wanderer's Advice", category: 'character-exp', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e6e6fa" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%234b0082" font-size="30">📜</text></svg>' },
    { id: 'adventurers-experience', name: "Adventurer's Experience", category: 'character-exp', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23add8e6" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23008080" font-size="30">📘</text></svg>' },
    { id: 'heros-wit', name: "Hero's Wit", category: 'character-exp', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffd700" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23ff8c00" font-size="30">📕</text></svg>' }
  ],
  
  // Weapon EXP Materials
  'weapon-exp': [
    { id: 'enhancement-ore', name: 'Enhancement Ore', category: 'weapon-exp', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23d3d3d3" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23696969" font-size="30">🪨</text></svg>' },
    { id: 'fine-enhancement-ore', name: 'Fine Enhancement Ore', category: 'weapon-exp', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2398fb98" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23228b22" font-size="30">💎</text></svg>' },
    { id: 'mystic-enhancement-ore', name: 'Mystic Enhancement Ore', category: 'weapon-exp', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23dda0dd" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%238b008b" font-size="30">💜</text></svg>' }
  ],
  
  // Elemental Gems
  'gems': [
    { id: 'agnidus-agate-sliver', name: 'Agnidus Agate Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ff6347" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🔥</text></svg>' },
    { id: 'agnidus-agate-fragment', name: 'Agnidus Agate Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ff4500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🔥</text></svg>' },
    { id: 'agnidus-agate-chunk', name: 'Agnidus Agate Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23dc143c" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🔥</text></svg>' },
    { id: 'agnidus-agate-gemstone', name: 'Agnidus Agate Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23b22222" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🔥</text></svg>' },
    { id: 'varunada-lazurite-sliver', name: 'Varunada Lazurite Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2387ceeb" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'varunada-lazurite-fragment', name: 'Varunada Lazurite Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2300bfff" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'varunada-lazurite-chunk', name: 'Varunada Lazurite Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230080ff" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'varunada-lazurite-gemstone', name: 'Varunada Lazurite Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23006699" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'nagadus-emerald-sliver', name: 'Nagadus Emerald Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2398fb98" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌱</text></svg>' },
    { id: 'nagadus-emerald-fragment', name: 'Nagadus Emerald Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2332cd32" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌱</text></svg>' },
    { id: 'nagadus-emerald-chunk', name: 'Nagadus Emerald Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌱</text></svg>' },
    { id: 'nagadus-emerald-gemstone', name: 'Nagadus Emerald Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23006400" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌱</text></svg>' },
    { id: 'prithiva-topaz-sliver', name: 'Prithiva Topaz Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23daa520" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🪨</text></svg>' },
    { id: 'prithiva-topaz-fragment', name: 'Prithiva Topaz Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23b8860b" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🪨</text></svg>' },
    { id: 'prithiva-topaz-chunk', name: 'Prithiva Topaz Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23cd853f" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🪨</text></svg>' },
    { id: 'prithiva-topaz-gemstone', name: 'Prithiva Topaz Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%238b4513" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🪨</text></svg>' },
    { id: 'shivada-jade-sliver', name: 'Shivada Jade Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e0ffff" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23000080" font-size="30">❄️</text></svg>' },
    { id: 'shivada-jade-fragment', name: 'Shivada Jade Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23b0e0e6" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23000080" font-size="30">❄️</text></svg>' },
    { id: 'shivada-jade-chunk', name: 'Shivada Jade Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2387ceeb" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23000080" font-size="30">❄️</text></svg>' },
    { id: 'shivada-jade-gemstone', name: 'Shivada Jade Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%234682b4" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">❄️</text></svg>' },
    { id: 'vayuda-turquoise-sliver', name: 'Vayuda Turquoise Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2340e0d0" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💨</text></svg>' },
    { id: 'vayuda-turquoise-fragment', name: 'Vayuda Turquoise Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2320b2aa" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💨</text></svg>' },
    { id: 'vayuda-turquoise-chunk', name: 'Vayuda Turquoise Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2300ced1" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💨</text></svg>' },
    { id: 'vayuda-turquoise-gemstone', name: 'Vayuda Turquoise Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23008b8b" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💨</text></svg>' },
    { id: 'vajrada-amethyst-sliver', name: 'Vajrada Amethyst Sliver', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23dda0dd" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚡</text></svg>' },
    { id: 'vajrada-amethyst-fragment', name: 'Vajrada Amethyst Fragment', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ba55d3" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚡</text></svg>' },
    { id: 'vajrada-amethyst-chunk', name: 'Vajrada Amethyst Chunk', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%239370db" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚡</text></svg>' },
    { id: 'vajrada-amethyst-gemstone', name: 'Vajrada Amethyst Gemstone', category: 'gems', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%238b008b" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚡</text></svg>' }
  ],
  
  // Boss Materials
  'boss': [
    { id: 'dvalin-plume', name: "Dvalin's Plume", category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🪶</text></svg>' },
    { id: 'dvalin-claw', name: "Dvalin's Claw", category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🦅</text></svg>' },
    { id: 'dvalin-sigh', name: "Dvalin's Sigh", category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌪️</text></svg>' },
    { id: 'tail-of-boreas', name: 'Tail of Boreas', category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%234682b4" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🐺</text></svg>' },
    { id: 'ring-of-boreas', name: 'Ring of Boreas', category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%234682b4" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💍</text></svg>' },
    { id: 'spirit-locket-of-boreas', name: 'Spirit Locket of Boreas', category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%234682b4" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🔮</text></svg>' },
    { id: 'tusk-of-monoceros-caeli', name: 'Tusk of Monoceros Caeli', category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffa500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🦏</text></svg>' },
    { id: 'shard-of-foul-legacy', name: 'Shard of a Foul Legacy', category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffa500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚔️</text></svg>' },
    { id: 'shadow-of-warrior', name: 'Shadow of the Warrior', category: 'boss', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffa500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">👤</text></svg>' }
  ],
  
  // Local Specialties (sample)
  'local': [
    { id: 'windwheel-aster', name: 'Windwheel Aster', category: 'local', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2398fb98" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌸</text></svg>' },
    { id: 'philanemo-mushroom', name: 'Philanemo Mushroom', category: 'local', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23daa520" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🍄</text></svg>' },
    { id: 'cecilia', name: 'Cecilia', category: 'local', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e6e6fa" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌺</text></svg>' },
    { id: 'calla-lily', name: 'Calla Lily', category: 'local', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffffff" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23000" font-size="30">🌷</text></svg>' },
    { id: 'valberry', name: 'Valberry', category: 'local', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23dc143c" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🫐</text></svg>' }
  ],
  
  // Common Enemy Drops
  'common': [
    { id: 'slime-condensate', name: 'Slime Condensate', category: 'common', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2398fb98" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'slime-secretions', name: 'Slime Secretions', category: 'common', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2332cd32" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'slime-concentrate', name: 'Slime Concentrate', category: 'common', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💧</text></svg>' },
    { id: 'damaged-mask', name: 'Damaged Mask', category: 'common', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23d2b48c" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🎭</text></svg>' },
    { id: 'stained-mask', name: 'Stained Mask', category: 'common', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23cd853f" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🎭</text></svg>' },
    { id: 'ominous-mask', name: 'Ominous Mask', category: 'common', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%238b4513" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🎭</text></svg>' }
  ],
  
  // Elite Enemy Drops
  'elite': [
    { id: 'chaos-device', name: 'Chaos Device', category: 'elite', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ff4500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚙️</text></svg>' },
    { id: 'chaos-circuit', name: 'Chaos Circuit', category: 'elite', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23dc143c" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚙️</text></svg>' },
    { id: 'chaos-core', name: 'Chaos Core', category: 'elite', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23b22222" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚙️</text></svg>' },
    { id: 'mist-grass-pollen', name: 'Mist Grass Pollen', category: 'elite', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23adff2f" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌿</text></svg>' },
    { id: 'mist-grass', name: 'Mist Grass', category: 'elite', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2332cd32" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌿</text></svg>' },
    { id: 'mist-grass-wick', name: 'Mist Grass Wick', category: 'elite', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🌿</text></svg>' }
  ],
  
  // Weekly Boss Materials
  'weekly': [
    { id: 'dvalins-plume', name: "Dvalin's Plume", category: 'weekly', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🪶</text></svg>' },
    { id: 'ring-of-boreas', name: 'Ring of Boreas', category: 'weekly', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%234682b4" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">💍</text></svg>' },
    { id: 'tusk-of-monoceros', name: 'Tusk of Monoceros Caeli', category: 'weekly', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffa500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🦏</text></svg>' },
    { id: 'shard-foul-legacy', name: 'Shard of a Foul Legacy', category: 'weekly', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffa500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">⚔️</text></svg>' }
  ],
  
  // Talent Books
  'talent': [
    { id: 'teachings-freedom', name: 'Teachings of Freedom', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2387ceeb" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📖</text></svg>' },
    { id: 'guide-freedom', name: 'Guide to Freedom', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2300bfff" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📘</text></svg>' },
    { id: 'philosophies-freedom', name: 'Philosophies of Freedom', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230080ff" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📕</text></svg>' },
    { id: 'teachings-resistance', name: 'Teachings of Resistance', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ff6347" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📖</text></svg>' },
    { id: 'guide-resistance', name: 'Guide to Resistance', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ff4500" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📘</text></svg>' },
    { id: 'philosophies-resistance', name: 'Philosophies of Resistance', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23dc143c" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📕</text></svg>' },
    { id: 'teachings-ballad', name: 'Teachings of Ballad', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2332cd32" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📖</text></svg>' },
    { id: 'guide-ballad', name: 'Guide to Ballad', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23228b22" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📘</text></svg>' },
    { id: 'philosophies-ballad', name: 'Philosophies of Ballad', category: 'talent', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23006400" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">📕</text></svg>' }
  ],
  
  // Weapon Ascension Materials
  'weapon-ascension': [
    { id: 'tile-decarabian', name: 'Tile of Decarabian\'s Tower', category: 'weapon-ascension', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2340e0d0" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🧱</text></svg>' },
    { id: 'debris-decarabian', name: 'Debris of Decarabian\'s City', category: 'weapon-ascension', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2320b2aa" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🧱</text></svg>' },
    { id: 'fragment-decarabian', name: 'Fragment of Decarabian\'s Epic', category: 'weapon-ascension', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2300ced1" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🧱</text></svg>' },
    { id: 'scattered-piece-boreas', name: 'Scattered Piece of Decarabian\'s Dream', category: 'weapon-ascension', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23008b8b" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">🧱</text></svg>' }
  ],
  
  // Crown
  'crown': [
    { id: 'crown-insight', name: 'Crown of Insight', category: 'crown', image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ffd700" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23fff" font-size="30">👑</text></svg>' }
  ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

function initializeApp() {
  loadFromLocalStorage();
  renderMaterials();
  setupEventListeners();
  setupDragAndDrop();
  setupFileInput();
  updateItemCounts();
  console.log('App initialized successfully');
}

// Load and save data
function loadFromLocalStorage() {
  const saved = localStorage.getItem('materialItems');
  if (saved) {
    try {
      materialItems = JSON.parse(saved);
      console.log('Data loaded from localStorage');
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      materialItems = [];
    }
  } else {
    materialItems = [];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('materialItems', JSON.stringify(materialItems));
    console.log('Data saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// File input setup
function setupFileInput() {
  setupImageInput('imageFile', 'filePreview', 'previewImage', 'fileName');
  setupImageInput('customMaterialImage', 'customMaterialPreview', 'customPreviewImage', 'customFileName');
}

function setupImageInput(inputId, previewId, imageId, nameId) {
  const fileInput = document.getElementById(inputId);
  const fileLabel = document.querySelector(`label[for="${inputId}"]`);
  const filePreview = document.getElementById(previewId);
  const previewImage = document.getElementById(imageId);
  const fileName = document.getElementById(nameId);

  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file (JPG, PNG, SVG, etc.)');
          fileInput.value = '';
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          fileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          fileName.textContent = file.name;
          filePreview.style.display = 'block';
          fileLabel.classList.add('has-file');
          fileLabel.innerHTML = '<span>📷 Change Image</span>';
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.btn-filter:not(.catalog-filter)').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.btn-filter:not(.catalog-filter)').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderMaterials();
    });
  });

  // Add button
  const addButton = document.getElementById('addButton');
  if (addButton) {
    addButton.addEventListener('click', function() {
      showAddModal();
    });
  }

  // Modal events
  setupModalEvents();
  setupCatalogEvents();
}

function setupModalEvents() {
  const modal = document.getElementById('addModal');
  const form = document.getElementById('addForm');
  const cancelBtn = document.getElementById('cancelButton');
  const editMaterialsModal = document.getElementById('editMaterialsModal');
  const saveMaterialsBtn = document.getElementById('saveMaterialsButton');
  const cancelMaterialsBtn = document.getElementById('cancelMaterialsButton');

  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideAddModal);
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideAddModal();
      }
    });
  }

  if (editMaterialsModal) {
    editMaterialsModal.addEventListener('click', function(e) {
      if (e.target === editMaterialsModal) {
        hideEditMaterialsModal();
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const fileInput = document.getElementById('imageFile');
      const previewImage = document.getElementById('previewImage');
      
      const itemData = {
        name: formData.get('name').trim(),
        type: formData.get('type'),
        rarity: parseInt(formData.get('rarity')),
        element: formData.get('element') || null,
        materialType: formData.get('materialType') || null,
        imageUrl: fileInput.files[0] ? previewImage.src : getDefaultImage(formData.get('type')),
        notes: formData.get('notes').trim(),
        currentLevel: formData.get('currentLevel') ? parseInt(formData.get('currentLevel')) : 1,
        targetLevel: formData.get('targetLevel') ? parseInt(formData.get('targetLevel')) : 90,
        materials: [] // Start with empty materials array
      };
      
      if (itemData.name && itemData.type && itemData.rarity && itemData.materialType) {
        if (editingItemId) {
          updateItem(itemData);
        } else {
          addItem(itemData);
        }
        hideAddModal();
        resetForm();
      } else {
        alert('Please fill in all required fields (Name, Type, Rarity, Material Type)');
      }
    });
  }

  // Materials editor events
  if (saveMaterialsBtn) {
    saveMaterialsBtn.addEventListener('click', saveMaterialsChanges);
  }

  if (cancelMaterialsBtn) {
    cancelMaterialsBtn.addEventListener('click', hideEditMaterialsModal);
  }

  // Add material button
  const addMaterialButton = document.getElementById('addMaterialButton');
  if (addMaterialButton) {
    addMaterialButton.addEventListener('click', function() {
      showMaterialCatalogModal();
    });
  }

  // Type change event for showing/hiding element selector
  const typeSelect = document.getElementById('itemType');
  const elementSelect = document.getElementById('itemElement');
  const levelSelector = document.getElementById('levelSelector');

  if (typeSelect) {
    typeSelect.addEventListener('change', function() {
      if (this.value === 'character') {
        elementSelect.style.display = 'block';
        elementSelect.required = true;
        levelSelector.style.display = 'block';
      } else if (this.value === 'weapon') {
        elementSelect.style.display = 'none';
        elementSelect.required = false;
        levelSelector.style.display = 'block';
      } else {
        elementSelect.style.display = 'none';
        levelSelector.style.display = 'none';
      }
    });
  }
}

function setupCatalogEvents() {
  const catalogModal = document.getElementById('materialCatalogModal');
  const catalogSearch = document.getElementById('catalogSearch');
  const closeCatalogBtn = document.getElementById('closeCatalogButton');
  const customMaterialModal = document.getElementById('addCustomMaterialModal');
  const customMaterialForm = document.getElementById('customMaterialForm');
  const cancelCustomBtn = document.getElementById('cancelCustomMaterialButton');

  // Catalog search
  if (catalogSearch) {
    catalogSearch.addEventListener('input', function() {
      renderCatalogGrid();
    });
  }

  // Catalog filters
  document.querySelectorAll('.catalog-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.catalog-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCatalogFilter = this.dataset.category;
      renderCatalogGrid();
    });
  });

  // Close catalog
  if (closeCatalogBtn) {
    closeCatalogBtn.addEventListener('click', hideMaterialCatalogModal);
  }

  // Close catalog when clicking outside
  if (catalogModal) {
    catalogModal.addEventListener('click', function(e) {
      if (e.target === catalogModal) {
        hideMaterialCatalogModal();
      }
    });
  }

  // Custom material form
  if (customMaterialForm) {
    customMaterialForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addCustomMaterial();
    });
  }

  if (cancelCustomBtn) {
    cancelCustomBtn.addEventListener('click', hideCustomMaterialModal);
  }

  // Close custom material modal when clicking outside
  if (customMaterialModal) {
    customMaterialModal.addEventListener('click', function(e) {
      if (e.target === customMaterialModal) {
        hideCustomMaterialModal();
      }
    });
  }
}

function getDefaultImage(type) {
  if (type === 'character') {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle fill="%23e5a6b2" cx="50" cy="50" r="40"/><text y="60" x="50" text-anchor="middle" fill="white" font-size="30">👤</text></svg>';
  } else {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5a6b2" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="white" font-size="30">⚔️</text></svg>';
  }
}

// Modal functions
function showAddModal(itemId = null) {
  const modal = document.getElementById('addModal');
  const modalTitle = document.getElementById('modalTitle');
  const submitButton = document.getElementById('submitButton');

  if (itemId) {
    editingItemId = itemId;
    const item = materialItems.find(item => item.id === itemId);
    if (item) {
      modalTitle.textContent = 'Edit Item';
      submitButton.textContent = 'Update Item';
      populateForm(item);
    }
  } else {
    editingItemId = null;
    modalTitle.textContent = 'Add New Item';
    submitButton.textContent = 'Add Item';
    resetForm();
  }

  modal.classList.add('show');
}

function hideAddModal() {
  const modal = document.getElementById('addModal');
  modal.classList.remove('show');
  editingItemId = null;
}

function populateForm(item) {
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemType').value = item.type;
  document.getElementById('itemRarity').value = item.rarity;
  document.getElementById('itemElement').value = item.element || '';
  document.getElementById('materialType').value = item.materialType || '';
  document.getElementById('itemNotes').value = item.notes || '';
  document.getElementById('currentLevel').value = item.currentLevel || 1;
  document.getElementById('targetLevel').value = item.targetLevel || 90;

  // Trigger type change event to show/hide fields
  const typeEvent = new Event('change');
  document.getElementById('itemType').dispatchEvent(typeEvent);

  // Handle image
  if (item.imageUrl && !item.imageUrl.startsWith('data:image/svg+xml')) {
    const previewImage = document.getElementById('previewImage');
    const fileName = document.getElementById('fileName');
    const filePreview = document.getElementById('filePreview');
    const fileLabel = document.querySelector('.file-input-label');

    previewImage.src = item.imageUrl;
    fileName.textContent = 'Current image';
    filePreview.style.display = 'block';
    fileLabel.classList.add('has-file');
    fileLabel.innerHTML = '<span>📷 Change Image</span>';
  }
}

function resetForm() {
  const form = document.getElementById('addForm');
  const fileInput = document.getElementById('imageFile');
  const fileLabel = document.querySelector('.file-input-label');
  const filePreview = document.getElementById('filePreview');

  form.reset();
  if (fileInput) fileInput.value = '';
  if (filePreview) filePreview.style.display = 'none';
  if (fileLabel) {
    fileLabel.classList.remove('has-file');
    fileLabel.innerHTML = '<span>📷 Choose Image (JPG, PNG, SVG...)</span>';
  }

  // Hide optional fields
  document.getElementById('itemElement').style.display = 'none';
  document.getElementById('levelSelector').style.display = 'none';
}

// Materials editor modal
function showEditMaterialsModal(itemId) {
  const modal = document.getElementById('editMaterialsModal');
  const item = materialItems.find(item => item.id === itemId);
  
  if (!item) return;

  editingItemId = itemId;
  renderCurrentMaterials(item);
  modal.classList.add('show');
}

function hideEditMaterialsModal() {
  const modal = document.getElementById('editMaterialsModal');
  modal.classList.remove('show');
  editingItemId = null;
}

function renderCurrentMaterials(item) {
  const container = document.getElementById('currentMaterialsList');
  container.innerHTML = '';

  if (!item.materials || item.materials.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No materials added yet. Click "Add Material from Catalog" to get started.</p>
      </div>
    `;
    return;
  }

  item.materials.forEach((material, index) => {
    const materialDiv = document.createElement('div');
    materialDiv.className = 'current-material-item';
    materialDiv.innerHTML = `
      <img src="${material.image}" alt="${material.name}" />
      <div class="current-material-info">
        <div class="current-material-name">${material.name}</div>
        <div class="current-material-inputs">
          <input type="number" value="${material.obtained}" min="0" max="${material.required}" 
                 onchange="updateMaterialProgress(${index}, 'obtained', this.value)" />
          <span>of</span>
          <input type="number" value="${material.required}" min="1" 
                 onchange="updateMaterialProgress(${index}, 'required', this.value)" />
        </div>
      </div>
      <button type="button" class="remove-material-btn" onclick="removeMaterial(${index})" title="Remove Material">
        ✕
      </button>
    `;
    container.appendChild(materialDiv);
  });
}

function updateMaterialProgress(materialIndex, field, value) {
  const item = materialItems.find(item => item.id === editingItemId);
  if (item && item.materials[materialIndex]) {
    item.materials[materialIndex][field] = parseInt(value) || 0;
    // Ensure obtained doesn't exceed required
    if (field === 'required' || field === 'obtained') {
      const material = item.materials[materialIndex];
      if (material.obtained > material.required) {
        material.obtained = material.required;
      }
    }
  }
}

function removeMaterial(materialIndex) {
  const item = materialItems.find(item => item.id === editingItemId);
  if (item && item.materials) {
    item.materials.splice(materialIndex, 1);
    renderCurrentMaterials(item);
  }
}

function saveMaterialsChanges() {
  saveToLocalStorage();
  hideEditMaterialsModal();
  renderMaterials();
}

// Material catalog modal
function showMaterialCatalogModal() {
  const modal = document.getElementById('materialCatalogModal');
  currentCatalogFilter = 'all';
  document.querySelector('.catalog-filter.active').classList.remove('active');
  document.querySelector('.catalog-filter[data-category="all"]').classList.add('active');
  document.getElementById('catalogSearch').value = '';
  renderCatalogGrid();
  modal.classList.add('show');
}

function hideMaterialCatalogModal() {
  const modal = document.getElementById('materialCatalogModal');
  modal.classList.remove('show');
}

function renderCatalogGrid() {
  const container = document.getElementById('catalogGrid');
  const searchTerm = document.getElementById('catalogSearch').value.toLowerCase();
  
  container.innerHTML = '';

  // Get all materials from catalog
  let materials = [];
  Object.values(MATERIAL_CATALOG).forEach(categoryMaterials => {
    materials = materials.concat(categoryMaterials);
  });

  // Filter materials
  let filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm);
    const matchesCategory = currentCatalogFilter === 'all' || material.category === currentCatalogFilter;
    return matchesSearch && matchesCategory;
  });

  if (filteredMaterials.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No materials found${searchTerm ? ` for "${searchTerm}"` : ''}.</p>
      </div>
    `;
    return;
  }

  filteredMaterials.forEach(material => {
    const materialDiv = document.createElement('div');
    materialDiv.className = 'catalog-item';
    materialDiv.innerHTML = `
      <img src="${material.image}" alt="${material.name}" />
      <div class="catalog-item-name">${material.name}</div>
    `;
    materialDiv.addEventListener('click', () => selectMaterialFromCatalog(material));
    container.appendChild(materialDiv);
  });

  // Add custom material option
  const customDiv = document.createElement('div');
  customDiv.className = 'catalog-item';
  customDiv.style.borderStyle = 'dashed';
  customDiv.innerHTML = `
    <div style="width: 2.5rem; height: 2.5rem; border: 1px dashed var(--border); border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; font-size: 1.2rem;">+</div>
    <div class="catalog-item-name">Add Custom</div>
  `;
  customDiv.addEventListener('click', showCustomMaterialModal);
  container.appendChild(customDiv);
}

function selectMaterialFromCatalog(material) {
  // Show quantity selector or add directly
  const quantity = prompt(`How many ${material.name} do you need?`, '1');
  if (quantity && parseInt(quantity) > 0) {
    addMaterialToCurrentItem(material, parseInt(quantity));
    hideMaterialCatalogModal();
  }
}

function addMaterialToCurrentItem(materialData, required) {
  const item = materialItems.find(item => item.id === editingItemId);
  if (!item) return;

  if (!item.materials) {
    item.materials = [];
  }

  // Check if material already exists
  const existingMaterial = item.materials.find(m => m.name === materialData.name);
  if (existingMaterial) {
    existingMaterial.required += required;
  } else {
    item.materials.push({
      id: materialData.id || `custom-${Date.now()}`,
      name: materialData.name,
      image: materialData.image,
      required: required,
      obtained: 0,
      category: materialData.category || 'custom'
    });
  }

  renderCurrentMaterials(item);
}

// Custom material modal
function showCustomMaterialModal() {
  const modal = document.getElementById('addCustomMaterialModal');
  document.getElementById('customMaterialForm').reset();
  const filePreview = document.getElementById('customMaterialPreview');
  const fileLabel = document.querySelector('label[for="customMaterialImage"]');
  if (filePreview) filePreview.style.display = 'none';
  if (fileLabel) {
    fileLabel.classList.remove('has-file');
    fileLabel.innerHTML = '<span>📷 Choose Material Image (Optional)</span>';
  }
  modal.classList.add('show');
}

function hideCustomMaterialModal() {
  const modal = document.getElementById('addCustomMaterialModal');
  modal.classList.remove('show');
}

function addCustomMaterial() {
  const name = document.getElementById('customMaterialName').value.trim();
  const required = parseInt(document.getElementById('customMaterialRequired').value);
  const obtained = parseInt(document.getElementById('customMaterialObtained').value);
  const fileInput = document.getElementById('customMaterialImage');
  const previewImage = document.getElementById('customPreviewImage');

  if (!name || !required) {
    alert('Please fill in material name and required amount.');
    return;
  }

  const materialData = {
    id: `custom-${Date.now()}`,
    name: name,
    image: fileInput.files[0] ? previewImage.src : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ddd" width="100" height="100" rx="10"/><text y="60" x="50" text-anchor="middle" fill="%23666" font-size="30">📦</text></svg>',
    required: required,
    obtained: obtained,
    category: 'custom'
  };

  const item = materialItems.find(item => item.id === editingItemId);
  if (item) {
    if (!item.materials) {
      item.materials = [];
    }
    item.materials.push(materialData);
    renderCurrentMaterials(item);
  }

  hideCustomMaterialModal();
}

// Drag and drop setup
function setupDragAndDrop() {
  // This can be implemented later for reordering items
}

// Add/Update/Delete item functions
function addItem(itemData) {
  const newItem = {
    ...itemData,
    id: Date.now().toString(),
    completed: false,
    materials: itemData.materials || []
  };
  
  materialItems.push(newItem);
  saveToLocalStorage();
  renderMaterials();
  updateItemCounts();
}

function updateItem(itemData) {
  const index = materialItems.findIndex(item => item.id === editingItemId);
  if (index !== -1) {
    // Preserve existing materials and completion status
    const existingItem = materialItems[index];
    materialItems[index] = {
      ...itemData,
      id: editingItemId,
      materials: existingItem.materials || [],
      completed: existingItem.completed || false
    };
    saveToLocalStorage();
    renderMaterials();
    updateItemCounts();
  }
}

function deleteItem(itemId) {
  if (confirm('Are you sure you want to delete this item?')) {
    materialItems = materialItems.filter(item => item.id !== itemId);
    saveToLocalStorage();
    renderMaterials();
    updateItemCounts();
  }
}

function toggleItemCompletion(itemId) {
  const item = materialItems.find(item => item.id === itemId);
  if (item) {
    item.completed = !item.completed;
    saveToLocalStorage();
    renderMaterials();
    updateItemCounts();
  }
}

// Render functions
function renderMaterials() {
  const inProgressContainer = document.getElementById('inProgressContainer');
  const completedContainer = document.getElementById('completedContainer');
  const inProgressSection = document.getElementById('inProgressSection');
  const completedSection = document.getElementById('completedSection');
  
  // Clear containers
  inProgressContainer.innerHTML = '';
  completedContainer.innerHTML = '';
  
  // Control section visibility based on current filter
  if (currentFilter === 'completed') {
    // Only show completed section when "completed" filter is active
    inProgressSection.style.display = 'none';
    completedSection.style.display = 'block';
  } else {
    // Show in-progress section for all other filters, hide completed section
    inProgressSection.style.display = 'block';
    completedSection.style.display = 'none';
  }
  
  // Filter items based on current filter and completion status
  const filteredItems = materialItems.filter(item => {
    if (currentFilter === 'all') return !item.completed; // For 'all', only show non-completed items
    if (currentFilter === 'in-progress') return !item.completed;
    if (currentFilter === 'completed') return item.completed;
    if (currentFilter === 'ascension-materials') return item.materialType === 'ascension' && !item.completed;
    if (currentFilter === 'talent-materials') return item.materialType === 'talent' && !item.completed;
    if (currentFilter.includes('-')) {
      const [type, rarity] = currentFilter.split('-');
      return item.type === type && item.rarity.toString() === rarity && !item.completed; // Only non-completed for other filters
    }
    return item.element === currentFilter && !item.completed; // Only non-completed for element filters
  });
  
  if (currentFilter === 'completed') {
    // When showing completed filter, render completed items
    const completedItems = filteredItems;
    
    if (completedItems.length === 0) {
      completedContainer.innerHTML = `
        <div class="empty-state">
          <h3>No completed items</h3>
          <p>Mark items as complete once you've gathered all materials.</p>
        </div>
      `;
    } else {
      completedItems.forEach(item => {
        completedContainer.appendChild(createItemElement(item));
      });
    }
  } else {
    // For all other filters, render in-progress items
    const inProgressItems = filteredItems;
    
    if (inProgressItems.length === 0) {
      inProgressContainer.innerHTML = `
        <div class="empty-state">
          <h3>No items in progress</h3>
          <p>Add some items to track their material progress.</p>
        </div>
      `;
    } else {
      inProgressItems.forEach(item => {
        inProgressContainer.appendChild(createItemElement(item));
      });
    }
  }
}

function createItemElement(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = `material-item ${item.completed ? 'completed' : ''}`;
  itemDiv.dataset.itemId = item.id;

  const materialsHtml = item.materials && item.materials.length > 0 
    ? item.materials.map(material => {
        const isComplete = material.obtained >= material.required;
        return `
          <div class="material-slot">
            <img src="${material.image}" alt="${material.name}" class="material-image" />
            <div class="material-name">${material.name}</div>
            <span class="material-count ${isComplete ? 'complete' : 'incomplete'}">
              ${material.obtained}/${material.required}
            </span>
          </div>
        `;
      }).join('')
    : '<div class="empty-state"><p>No materials added yet.</p></div>';

  itemDiv.innerHTML = `
    <div class="drag-handle">⋮⋮</div>
    <img src="${item.imageUrl}" alt="${item.name}" class="item-image" />
    <div class="item-content">
      <div class="item-header">
        <div class="item-title">
          <h3 class="item-name ${item.completed ? 'completed' : ''}">${item.name}</h3>
          <div class="level-selectors">
            <select class="level-select" onchange="updateItemLevel('${item.id}', 'currentLevel', this.value)">
              ${[1, 20, 40, 50, 60, 70, 80, 90].map(level => 
                `<option value="${level}" ${item.currentLevel === level ? 'selected' : ''}>${level}</option>`
              ).join('')}
            </select>
            <span class="level-arrow">→</span>
            <select class="level-select" onchange="updateItemLevel('${item.id}', 'targetLevel', this.value)">
              ${[20, 40, 50, 60, 70, 80, 90].map(level => 
                `<option value="${level}" ${item.targetLevel === level ? 'selected' : ''}>${level}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="item-meta">
          <span class="item-rarity">${'★'.repeat(item.rarity)}</span>
          <span class="item-tag">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
          ${item.element ? `<span class="item-element">${item.element.charAt(0).toUpperCase() + item.element.slice(1)}</span>` : ''}
          ${item.materialType ? `<span class="item-material-type">${item.materialType.charAt(0).toUpperCase() + item.materialType.slice(1)} Materials</span>` : ''}
        </div>
      </div>
      <div class="materials-grid">
        ${materialsHtml}
      </div>
      <div class="item-actions">
        <div class="completion-controls">
          <label class="checkbox-label">
            <input type="checkbox" ${item.completed ? 'checked' : ''} 
                   onchange="toggleItemCompletion('${item.id}')" />
            Mark as completed
          </label>
          <button class="btn-edit-materials" onclick="showEditMaterialsModal('${item.id}')">
            Edit Materials
          </button>
          <button class="btn-edit" onclick="showAddModal('${item.id}')">
            Edit Item
          </button>
        </div>
        <button class="btn-delete" onclick="deleteItem('${item.id}')" title="Delete Item">
          ×
        </button>
      </div>
    </div>
  `;

  return itemDiv;
}

function updateItemLevel(itemId, levelType, value) {
  const item = materialItems.find(item => item.id === itemId);
  if (item) {
    item[levelType] = parseInt(value);
    saveToLocalStorage();
  }
}

function updateItemCounts() {
  const inProgressCount = materialItems.filter(item => !item.completed).length;
  const completedCount = materialItems.filter(item => item.completed).length;
  
  // Update counts based on current filter
  if (currentFilter === 'completed') {
    document.getElementById('completedCount').textContent = `${completedCount} item${completedCount !== 1 ? 's' : ''}`;
  } else {
    // For all other filters, show in-progress count
    let filteredCount = inProgressCount;
    if (currentFilter !== 'all' && currentFilter !== 'in-progress') {
      // Count items that match the current filter and are not completed
      if (currentFilter === 'ascension-materials') {
        filteredCount = materialItems.filter(item => 
          item.materialType === 'ascension' && !item.completed
        ).length;
      } else if (currentFilter === 'talent-materials') {
        filteredCount = materialItems.filter(item => 
          item.materialType === 'talent' && !item.completed
        ).length;
      } else if (currentFilter.includes('-')) {
        const [type, rarity] = currentFilter.split('-');
        filteredCount = materialItems.filter(item => 
          item.type === type && item.rarity.toString() === rarity && !item.completed
        ).length;
      } else {
        filteredCount = materialItems.filter(item => 
          item.element === currentFilter && !item.completed
        ).length;
      }
    }
    document.getElementById('inProgressCount').textContent = `${filteredCount} item${filteredCount !== 1 ? 's' : ''}`;
  }
}

// Local storage functions
function saveToLocalStorage() {
  localStorage.setItem('genshinMaterialItems', JSON.stringify(materialItems));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('genshinMaterialItems');
  if (saved) {
    try {
      materialItems = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      materialItems = [];
    }
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  loadFromLocalStorage();
  setupEventListeners();
  setupFileInput();
  setupDragAndDrop();
  renderMaterials();
  updateItemCounts();
});
