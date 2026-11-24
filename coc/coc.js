(function () {
  if (window.self !== window.top) document.body.classList.add('embedded');
  const STORAGE_KEY = 'coc_countdown_data_v1';
  const CLOUD_ENDPOINT = 'https://veuxkavrcaeiwxkbboqo.supabase.co/rest/v1/coc_data';
  const CLOUD_KEY = 'sb_publishable_YC9UtVVSLTbin_Ge1mDr2Q_nqZSnbND';
  const CLOUD_SYNC_ID_STORAGE = 'coc_cloud_sync_id_v1';
  const CLOUD_SETUP_DISMISSED = 'coc_cloud_setup_dismissed_v1';
  const FILTER_KEY = 'coc_account_filter_v1';
  const CLOUD_HEADERS = {
    apikey: CLOUD_KEY,
    Authorization: `Bearer ${CLOUD_KEY}`,
    'Content-Type': 'application/json'
  };
  let cloudSyncId = localStorage.getItem(CLOUD_SYNC_ID_STORAGE) || '';
  let filterAccountId = localStorage.getItem(FILTER_KEY) || '';
  let cloudPushTimer = null;
  let cloudSyncing = false;
  let cloudInitialized = false;
  const CATEGORY_META = {
    builder: { label: '建筑工人', short: '建筑' },
    pet: { label: '战宠小屋', short: '战宠' },
    research: { label: '实验室', short: '研究' }
  };
  /* 旧存档任务名的改名迁移 */
  const TASK_NAME_RENAMES = {
    '冰封法术': '冰杖法术',
    '狂怒法术': '愤怒法术'
  };
  const BOOST_META = {
    builder_potion: { label: '建筑工人药水', scope: 'builder', rateText: '×10' },
    research_potion: { label: '研究药水', scope: 'research', rateText: '×24' },
    pet_potion: { label: '战宠药水', scope: 'pet', rateText: '×24' },
    builder_apprentice: { label: '建筑工人学徒' },
    lab_assistant: { label: '实验室助手' },
    custom: { label: '自定义加速' }
  };
  /** 「持续协助」向后推算的最大天数，避免无限展开 */
  const AUTO_ASSIST_DAYS = 180;
  const HOUR_MS = 3600000;
  const DAY_MS = 86400000;
  const APPRENTICE_WORK_MS = HOUR_MS;
  const APPRENTICE_COOLDOWN_MS = 23 * HOUR_MS;

  /** 游戏导出里的常见项目 ID → 中文名；未收录的会兜底为「项目 #ID」。 */
  const COC_NAME_MAP = {
    // 建筑
    1000000: '兵营', 1000001: '大本营', 1000002: '圣水收集器', 1000003: '圣水瓶',
    1000004: '金矿', 1000005: '储金罐', 1000006: '训练营', 1000007: '实验室',
    1000008: '加农炮', 1000009: '箭塔', 1000010: '城墙', 1000011: '法师塔',
    1000012: '防空火箭', 1000013: '迫击炮', 1000014: '部落城堡', 1000015: '建筑工人小屋',
    1000019: '特斯拉电磁塔', 1000020: '法术工厂', 1000021: 'X连弩', 1000023: '暗黑重油钻井',
    1000024: '暗黑重油罐', 1000026: '暗黑训练营', 1000027: '地狱之塔', 1000028: '空气炮',
    1000029: '暗黑法术工厂', 1000031: '天鹰火炮', 1000032: '炸弹塔', 1000059: '攻城机器工坊',
    1000064: '小博木屋',
    1000067: '投石炮', 1000068: '战宠小屋', 1000070: '铁匠铺', 1000071: '英雄殿堂',
    1000072: '法术塔', 1000077: '巨石碑', 1000079: '跳弹加农炮', 1000081: '多头箭塔',
    1000084: '奥仔控制站', 1000093: '帮手小屋',
    // 英雄
    28000000: '野蛮人之王', 28000001: '弓箭女皇', 28000002: '大守护者',
    28000004: '飞盾战神', 28000006: '亡灵王子',
    // 战宠
    73000000: '莱希', 73000001: '大牦', 73000002: '闪枭', 73000003: '独角',
    73000004: '冰牙', 73000007: '猛蜥', 73000008: '凤凰', 73000009: '挖地狗',
    73000010: '灵狐', 73000011: '怒水灵',
    // 法术
    26000000: '雷电法术', 26000001: '疗伤法术', 26000002: '狂暴法术', 26000003: '弹跳法术',
    26000005: '冰冻法术', 26000009: '毒药法术', 26000010: '地震法术', 26000011: '急速法术',
    26000016: '镜像法术', 26000017: '骷髅法术', 26000028: '蝙蝠法术', 26000035: '隐形法术',
    26000053: '召回法术', 26000070: '根蔓法术',
    // 兵种 & 攻城机器
    4000000: '野蛮人', 4000001: '弓箭手', 4000002: '哥布林', 4000003: '巨人',
    4000004: '炸弹人', 4000005: '气球兵', 4000006: '法师', 4000007: '天使',
    4000008: '飞龙', 4000009: '皮卡超人', 4000010: '亡灵', 4000011: '野猪骑士',
    4000012: '瓦基丽武神', 4000013: '戈仑石人', 4000015: '女巫', 4000017: '熔岩猎犬',
    4000022: '巨石投手', 4000023: '飞龙宝宝', 4000024: '掘地矿工', 4000051: '攻城战车',
    4000052: '攻城飞艇', 4000053: '雷电飞龙', 4000058: '戈仑冰人', 4000059: '大雪怪',
    4000062: '攻城气球', 4000065: '英雄猎手', 4000075: '攻城训练营', 4000082: '龙骑士',
    4000087: '攻城滚木车', 4000091: '攻城烈焰车', 4000092: '攻城钻机', 4000097: '雷霆泰坦'
  };
  const COC_NIGHT_BUILDING_MAP = {
    1000033: '夜世界城墙',
    1000034: '建筑大师大本营',
    1000042: '夜世界兵营',
    1000043: '夜世界特斯拉电磁塔',
    1000047: '夜世界工人小屋',
    1000049: '夜世界增援营地',
    1000065: '小博控制室',
    1000080: '战斗直升机祭坛'
  };
  const COC_NIGHT_HERO_MAP = {
    28000003: '战争机器', 28000005: '战斗直升机'
  };
  const COC_NIGHT_TROOP_MAP = {};
  const COC_NIGHT_TRAP_MAP = {};

  /* 卡片英雄栏用的简称 */
  const HERO_SHORT_MAP = {
    28000000: '蛮王', 28000001: '女皇', 28000002: '咏王',
    28000004: '闰土', 28000006: '王子', 28000007: '公爵'
  };
  /* 英雄栏徽章配色 */
  const HERO_BADGE_CLASS = {
    28000000: 'hero-bk',
    28000001: 'hero-aq',
    28000002: 'hero-gw',
    28000004: 'hero-rc',
    28000006: 'hero-mp',
    28000007: 'hero-dd',
    28000003: 'hero-bm',
    28000005: 'hero-bc'
  };

  /* 概览页的功能建筑、资源建筑、城墙分类 */
  const VILLAGE_FUNCTION_IDS = [
    [1000014, '部落城堡'], [1000007, '实验室'],
    [1000000, '兵营'], [1000006, '训练营'], [1000026, '暗黑训练营'],
    [1000020, '法术工厂'], [1000029, '暗黑法术工厂'],
    [1000059, '攻城机器工坊'], [1000071, '英雄殿堂'],
    [1000068, '战宠小屋'], [1000070, '铁匠铺'], [1000106, '小队训练营']
  ];
  const VILLAGE_FUNCTION_ID_SET = new Set(VILLAGE_FUNCTION_IDS.map(([id]) => id));
  const VILLAGE_NON_DEFENSE_IDS = new Set([
    1000000, 1000001, 1000002, 1000003, 1000004, 1000005,
    1000010, 1000015, 1000023, 1000024, 1000093,
    ...VILLAGE_FUNCTION_ID_SET
  ]);
  /* 图鉴分类：夜世界建筑/陷阱/兵种/英雄（图鉴的 th 字段对建筑来说就是解锁所需本数） */
  const VILLAGE_NIGHT_BUILDING_IDS = new Set([
    1000034, 1000035, 1000036, 1000037, 1000038, 1000039, 1000040, 1000041,
    1000042, 1000043, 1000044, 1000045, 1000046, 1000047, 1000048, 1000049,
    1000050, 1000051, 1000052, 1000053, 1000054, 1000055, 1000056, 1000057,
    1000058, 1000063, 1000078, 1000080, 1000081, 1000082
  ]);
  const VILLAGE_NIGHT_TRAP_IDS = new Set([12000010, 12000011, 12000013, 12000014]);
  const VILLAGE_NIGHT_TROOP_IDS = new Set([
    4000031, 4000032, 4000033, 4000034, 4000035, 4000036, 4000037, 4000038,
    4000041, 4000042, 4000070, 4000106
  ]);
  const VILLAGE_NIGHT_HERO_IDS = new Set([28000003, 28000005]);
  const VILLAGE_SIEGE_IDS = new Set([4000051, 4000052, 4000062, 4000075, 4000087, 4000091, 4000092]);
  /* 装备按英雄分组时的显示顺序 */
  const VILLAGE_EQUIPMENT_HERO_ORDER = [
    '野蛮人之王', '弓箭女皇', '大守护者', '飞盾战神', '亡灵王子', '飞龙公爵'
  ];

  /* 解包得到的升级图鉴：{ id: { cat, name, times[], th[] } }，异步加载，失败时只影响升级时间展示 */
  let cocCatalog = null;
  let cocCatalogLoading = false;

  function loadCocCatalog() {
    if (cocCatalog || cocCatalogLoading || typeof fetch !== 'function') return;
    cocCatalogLoading = true;
    fetch('./coc_catalog.json', { cache: 'no-cache' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data || typeof data !== 'object') return;
        cocCatalog = data;
        codexItems = null;
        if (villageAccountId) {
          const acc = state.accounts.find(a => a.id === villageAccountId);
          if (acc && acc.village) renderVillage(acc);
        }
        const codexMask = document.getElementById('codexMask');
        if (codexMask && codexMask.classList.contains('show')) renderCodex();
        const mask = document.getElementById('taskEditMask');
        if (mask && mask.classList.contains('show')) {
          const results = document.getElementById('formItemResults');
          if (results && !results.classList.contains('hidden')) renderTaskItemResults();
          else if (!taskFormItem) setPickerStatus(pickerHintText());
        }
      })
      .catch(() => {})
      .finally(() => { cocCatalogLoading = false; });
  }

  function catalogEntry(id) {
    if (!cocCatalog) return null;
    return cocCatalog[Number(id)] || null;
  }

  function catalogLevelInfo(id, lvl) {
    const entry = catalogEntry(id);
    const level = Number(lvl) || 0;
    if (!entry || level <= 0) return null;
    const times = Array.isArray(entry.times) ? entry.times : null;
    const maxLevel = times ? times.length : (Number(entry.maxLvl) || 0);
    if (maxLevel && level >= maxLevel) return { maxed: true, maxLevel };
    /* 装备这类条目只有 maxLvl、没有升级时长 */
    if (!times) return { maxed: false, maxLevel, nextLevel: maxLevel ? level + 1 : 0, seconds: null };
    const seconds = Number(times[level]);
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return { maxed: false, maxLevel, nextLevel: level + 1, seconds: 0 };
    }
    return { maxed: false, maxLevel, nextLevel: level + 1, seconds };
  }

  function cocName(id, fallbackPrefix, map) {
    const key = Number(id);
    const entry = catalogEntry(key);
    if (entry && entry.name) return entry.name;
    const table = map || COC_NAME_MAP;
    return table[key] || `${fallbackPrefix} #${id}`;
  }

  function cocItemName(id, fallbackPrefix, lvl) {
    const base = cocName(id, fallbackPrefix);
    const level = Number(lvl);
    return Number.isFinite(level) && level > 0 ? `${base} (${level}→${level + 1}级)` : base;
  }

  /* 名称优先用图鉴（图鉴比手写映射更准），没有时用导入时保存的名称 */
  function villageItemName(item) {
    const entry = catalogEntry(item.id);
    if (entry && entry.name) return entry.name;
    const id = Number(item.id);
    return COC_NAME_MAP[id] || COC_NIGHT_BUILDING_MAP[id] || COC_NIGHT_HERO_MAP[id] || item.name;
  }

  /* 等级文案：有图鉴时显示「当前/上限」，满级单独标注 */
  function villageLevelText(item) {
    const lvl = Number(item.lvl) || 0;
    const count = item.count > 1 ? ` ×${item.count}` : '';
    if (!lvl) return count.trim();
    const info = catalogLevelInfo(item.id, lvl);
    const maxLevel = Number(item.cap) || (info && info.maxLevel) || 0;
    if (maxLevel && lvl >= maxLevel) return `Lv.${lvl} 满级${count}`;
    if (maxLevel) return `Lv.${lvl}/${maxLevel}${count}`;
    return `Lv.${lvl}${count}`;
  }

  /* 下一级升级总时长（来自图鉴），没有图鉴数据时返回空 */
  function villageNextText(item) {
    const lvl = Number(item.lvl) || 0;
    const cap = Number(item.cap) || 0;
    if (cap && lvl >= cap) return '';
    const info = catalogLevelInfo(item.id, lvl);
    if (!info || info.maxed || info.seconds == null) return '';
    if (!info.seconds) return `升 ${info.nextLevel} 级 即刻`;
    return `升 ${info.nextLevel} 级 ${formatDuration(info.seconds * 1000)}`;
  }

  /* 图鉴里 1 级对应的解锁本数：主世界是 TH，夜世界是 BH */
  function catalogUnlockLevel(id) {
    const entry = catalogEntry(id);
    if (!entry || !Array.isArray(entry.th) || !entry.th.length) return 0;
    return Number(entry.th[0]) || 0;
  }

  /* 当前大本等级允许升到的最高等级（英雄图鉴的 th 数组已按等级补齐） */
  function catalogMaxLevelForTH(id, th) {
    const entry = catalogEntry(id);
    const level = Number(th) || 0;
    if (!entry || !level || !Array.isArray(entry.times) || !Array.isArray(entry.th)) return 0;
    let max = 0;
    entry.times.forEach((_, index) => {
      const need = Number(entry.th[index]) || 0;
      if (need > 0 && need <= level) max = index + 1;
    });
    return max;
  }

  function catalogIdsWhere(test) {
    if (!cocCatalog) return [];
    return Object.keys(cocCatalog)
      .map(Number)
      .filter(id => test(cocCatalog[id], id));
  }

  function villageCatalogBuildingIds(night) {
    return catalogIdsWhere((entry, id) =>
      entry.cat === 'builder' && id >= 1000000 && id < 1100000 &&
      VILLAGE_NIGHT_BUILDING_IDS.has(id) === !!night
    );
  }

  function villageCatalogTrapIds(night) {
    return catalogIdsWhere((entry, id) =>
      entry.cat === 'builder' && id >= 12000000 && id < 13000000 &&
      VILLAGE_NIGHT_TRAP_IDS.has(id) === !!night
    );
  }

  function villageCatalogHeroIds(night) {
    return catalogIdsWhere((entry, id) =>
      entry.cat === 'builder' && id >= 28000000 && id < 29000000 &&
      VILLAGE_NIGHT_HERO_IDS.has(id) === !!night
    );
  }

  function villageCatalogTroopIds(night) {
    return catalogIdsWhere((entry, id) =>
      entry.cat === 'research' && id >= 4000000 && id < 4100000 &&
      !VILLAGE_SIEGE_IDS.has(id) && VILLAGE_NIGHT_TROOP_IDS.has(id) === !!night
    );
  }

  function villageCatalogSiegeIds() {
    return catalogIdsWhere((entry, id) => entry.cat === 'research' && VILLAGE_SIEGE_IDS.has(id));
  }

  function villageCatalogSpellIds() {
    return catalogIdsWhere((entry, id) => entry.cat === 'research' && id >= 26000000 && id < 27000000);
  }

  function villageCatalogPetIds() {
    return catalogIdsWhere(entry => entry.cat === 'pet');
  }

  function villageCatalogEquipmentIds() {
    return catalogIdsWhere(entry => entry.cat === 'equipment');
  }

  let state = loadState();
  saveState(false);
  let editingTaskId = null;
  let editingInitialMinutes = null;
  let taskFormItem = null;
  let pickerMatches = [];
  let pickerActiveIndex = -1;
  let codexCategory = 'all';
  let codexWorld = 'all';
  let codexKeyword = '';
  let codexSelectedId = '';
  let codexItems = null;
  let dragAccountId = null;
  let lastDoneSignature = null;
  let villageTab = 'overview';
  let villageAccountId = null;

  // ---------- 数据层 ----------
  function defaultState() {
    return {
      accounts: [{
        id: uid(), name: '我的账号', townHallLevel: 1, builderCount: 6,
        builderApprenticeLevel: 0, labAssistantLevel: 0,
        builderApprenticeAutoContinue: false, labAssistantAutoContinue: false,
        builderApprenticeCooldownEnd: 0, labAssistantCooldownEnd: 0,
        boosts: [],
        village: null,
        tasks: []
      }],
      activeAccountId: null,
      updatedAt: 0
    };
  }

  function normalizeState(s) {
    if (!s || !Array.isArray(s.accounts) || !s.accounts.length) {
      throw new Error('数据结构不正确');
    }
    const categories = ['builder', 'pet', 'research'];
    s.accounts = s.accounts.filter(acc => acc && typeof acc === 'object');
    if (!s.accounts.length) throw new Error('没有可用的账号数据');
    s.accounts.forEach(acc => {
      if (!acc.id) acc.id = uid();
      if (!acc.name) acc.name = '未命名账号';
      acc.builderCount = Math.min(6, Math.max(1, Number(acc.builderCount) || 6));
      acc.townHallLevel = Math.min(19, Math.max(1, Number(acc.townHallLevel) || 1));
      acc.builderApprenticeLevel = Math.min(8, Math.max(0, Number(acc.builderApprenticeLevel) || 0));
      acc.labAssistantLevel = Math.min(12, Math.max(0, Number(acc.labAssistantLevel) || 0));
      acc.builderApprenticeAutoContinue = !!acc.builderApprenticeAutoContinue;
      acc.labAssistantAutoContinue = !!acc.labAssistantAutoContinue;

      const legacyCooldown = Number(acc.assistantCooldownEnd) || 0;
      acc.builderApprenticeCooldownEnd = Number(acc.builderApprenticeCooldownEnd) || legacyCooldown || 0;
      acc.labAssistantCooldownEnd = Number(acc.labAssistantCooldownEnd) || legacyCooldown || 0;
      delete acc.assistantCooldownEnd;

      /* 游戏导出数据：旧数据没有这个字段，保持 null 即可 */
      if (acc.village && typeof acc.village === 'object') {
        [
          'mainBuildings', 'mainTraps', 'nightBuildings', 'nightTraps', 'nightUnits',
          'heroes', 'nightHeroes', 'pets', 'units', 'spells', 'siege', 'equipment', 'nightUpgrades'
        ].forEach(key => {
          if (!Array.isArray(acc.village[key])) acc.village[key] = [];
        });
        acc.village.equipmentCount = Number(acc.village.equipmentCount) || 0;
        acc.village.equipmentMax = Number(acc.village.equipmentMax) || 0;
      } else {
        acc.village = null;
      }

      normalizeBoosts(acc);

      if (!Array.isArray(acc.tasks)) acc.tasks = [];
      const now = Date.now();
      acc.tasks = acc.tasks
        .filter(t => t && t.id && t.name && categories.includes(t.category))
        .map(t => {
          Object.keys(TASK_NAME_RENAMES).forEach(oldName => {
            if (t.name.includes(oldName)) {
              t.name = t.name.split(oldName).join(TASK_NAME_RENAMES[oldName]);
            }
          });
          let duration = Number(t.durationMs);
          let checkpoint = Number(t.checkpointAt);
          let remain = Number(t.remainWorkMs);
          const end = Number(t.endTime) || now;

          if (!Number.isFinite(checkpoint) || checkpoint <= 0) {
            /* 旧数据迁移：把固定的 endTime 换算成「某时刻还剩多少 1x 基础工期」 */
            checkpoint = now;
            remain = Math.max(0, end - now);
            if (!Number.isFinite(duration) || duration <= 0) duration = Math.max(60000, remain);
          } else {
            if (!Number.isFinite(remain) || remain < 0) remain = Math.max(0, end - checkpoint);
            if (!Number.isFinite(duration) || duration <= 0) duration = Math.max(60000, remain);
          }

          t.checkpointAt = checkpoint;
          t.remainWorkMs = remain;
          t.durationMs = Math.max(duration, remain);
          t.endTime = end;
          return t;
        });

      /* 结算到当前时刻，并顺带清掉已结束的加速区间 */
      settleAccount(acc, now);

      const usedSlots = new Set();
      const ordered = acc.tasks.slice().sort((a, b) => {
        const aDone = a.endTime <= Date.now();
        const bDone = b.endTime <= Date.now();
        if (aDone !== bDone) return aDone ? 1 : -1;
        return 0;
      });
      ordered.forEach(t => {
        if (t.category !== 'builder') {
          delete t.slot;
          return;
        }
        let slot = Number(t.slot);
        if (!Number.isInteger(slot) || slot < 1 || slot > acc.builderCount || usedSlots.has(slot)) {
          slot = null;
          for (let i = 1; i <= acc.builderCount; i++) {
            if (!usedSlots.has(i)) { slot = i; break; }
          }
        }
        if (slot) {
          t.slot = slot;
          usedSlots.add(slot);
        } else {
          delete t.slot;
        }
      });
    });
    if (!s.activeAccountId || !s.accounts.some(a => a.id === s.activeAccountId)) {
      s.activeAccountId = s.accounts[0].id;
    }
    s.updatedAt = Number(s.updatedAt) || 0;
    return s;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (e) { console.warn('读取本地数据失败', e); }
    const s = defaultState();
    s.activeAccountId = s.accounts[0].id;
    return s;
  }

  function saveState(touch = true) {
    if (touch) state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (touch) scheduleCloudPush();
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function getActiveAccount() {
    return state.accounts.find(a => a.id === state.activeAccountId) || state.accounts[0];
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* 本地图鉴图标：支持等级变体（如大本营），缺失时回退到基础图标或问号占位 */
  function cocIcon(id, alt, size, level) {
    const wrap = el('span', 'coc-icon');
    wrap.style.setProperty('--coc-icon-size', `${Number(size) || 22}px`);
    if (alt) wrap.title = alt;
    wrap.appendChild(el('span', 'coc-icon-fallback', '?'));
    const key = Number(id);
    if (Number.isFinite(key) && key > 0) {
      const sources = [];
      const lvl = Number(level) || 0;
      if (lvl > 0) sources.push(`./icons/${key}_${lvl}.webp`);
      sources.push(`./icons/${key}.webp`);
      const img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      let index = 0;
      const loadNext = () => {
        if (index >= sources.length) {
          wrap.classList.remove('loaded');
          wrap.classList.add('error');
          return;
        }
        img.src = sources[index++];
      };
      img.addEventListener('load', () => {
        wrap.classList.add('loaded');
        wrap.classList.remove('error');
      });
      img.addEventListener('error', loadNext);
      wrap.appendChild(img);
      loadNext();
    } else {
      wrap.classList.add('error');
    }
    return wrap;
  }

  // ---------- 时间流速引擎 ----------
  /*
   * 任务不直接保存 endTime，而是保存：
   *   checkpointAt  上次结算时刻
   *   remainWorkMs  该时刻还剩多少「1x 基础工期」
   * 加速记录在账号的 boosts 里，按区间提供额外倍率。
   * 任意时刻的剩余工期 = 从 checkpoint 到 now 对 (1 + ΣextraRate) 做分段积分。
   */
  function normalizeBoosts(acc) {
    const list = Array.isArray(acc.boosts) ? acc.boosts : [];
    acc.boosts = list
      .filter(b => b && Number.isFinite(Number(b.startTime)) && Number.isFinite(Number(b.endTime)))
      .map(b => {
        const kind = BOOST_META[b.kind] ? b.kind : 'custom';
        const scope = ['builder', 'pet', 'research', 'task'].includes(b.scope)
          ? b.scope
          : (b.taskId ? 'task' : (BOOST_META[kind].scope || 'builder'));
        return {
          id: b.id || uid(),
          kind,
          scope,
          taskId: scope === 'task' ? (b.taskId || null) : null,
          extraRate: Math.max(0, Number(b.extraRate) || 0),
          startTime: Number(b.startTime),
          endTime: Number(b.endTime),
          autoContinue: !!b.autoContinue
        };
      });
  }

  function calcRateAt(boosts, t) {
    let rate = 1;
    for (const b of boosts) {
      if (t >= b.startTime && t < b.endTime) rate += b.extraRate;
    }
    return rate;
  }

  /**
   * 取出作用于某个任务的加速区间。
   * 「持续协助」的学徒/助手的首轮工作窗口之后，按每 24 小时再工作 1 小时的节奏展开。
   */
  function getTaskBoosts(acc, task) {
    const result = [];
    (acc.boosts || []).forEach(b => {
      const matchTask = b.scope === 'task' && b.taskId === task.id;
      const matchCategory = b.scope === task.category;
      if (!matchTask && !matchCategory) return;
      if (b.endTime <= task.checkpointAt && !(matchTask && b.autoContinue)) return;

      result.push(b);
      if (!(matchTask && b.autoContinue)) return;

      const cycle = DAY_MS;
      const workLen = Math.max(60000, b.endTime - b.startTime);
      /* 超过任务最长可能完工时间的循环不用再展开 */
      const maxHorizon = (Number(task.checkpointAt) || Date.now())
        + Math.max(0, Number(task.remainWorkMs) || 0)
        + DAY_MS;
      for (let i = 1; i <= AUTO_ASSIST_DAYS; i++) {
        const start = b.startTime + i * cycle;
        if (start > maxHorizon) break;
        result.push({
          id: `${b.id}@${i}`,
          kind: b.kind,
          scope: 'task',
          taskId: b.taskId,
          extraRate: b.extraRate,
          startTime: start,
          endTime: start + workLen,
          autoContinue: false
        });
      }
    });
    return result;
  }

  /**
   * 计算任务在 now 时刻的：
   *   remainWorkMs    游戏内显示的剩余基础工期（加速时快速减少）
   *   predictedEndTime 考虑当前已排期加速后的真实完成时刻
   *   currentRate     当前实时流速（1 = 常速）
   */
  function evaluateTask(acc, task, now = Date.now()) {
    const boosts = getTaskBoosts(acc, task);
    const checkpoint = Number(task.checkpointAt) || now;

    const points = new Set([checkpoint, now]);
    boosts.forEach(b => {
      if (b.endTime > checkpoint) {
        points.add(b.startTime);
        points.add(b.endTime);
      }
    });
    const sorted = Array.from(points).filter(t => Number.isFinite(t)).sort((a, b) => a - b);

    /* 1) 从 checkpoint 积分到 now，得到当前剩余基础工期 */
    let rem = Math.max(0, Number(task.remainWorkMs) || 0);
    for (let i = 0; i < sorted.length - 1 && rem > 0; i++) {
      const segStart = Math.max(sorted[i], checkpoint);
      const segEnd = Math.min(sorted[i + 1], now);
      if (segEnd <= segStart) continue;
      rem = Math.max(0, rem - (segEnd - segStart) * calcRateAt(boosts, (segStart + segEnd) / 2));
    }
    const remainWorkMs = rem;

    let currentRate = 1;
    if (remainWorkMs > 0) currentRate = calcRateAt(boosts, now + 1);

    /* 2) 从 now 往后推算真实完成时刻 */
    let predictedEndTime = now;
    if (remainWorkMs > 0) {
      let left = remainWorkMs;
      let cursor = now;
      predictedEndTime = now + remainWorkMs;
      const future = sorted.filter(t => t > now);
      for (const point of future) {
        const rate = calcRateAt(boosts, (cursor + point) / 2);
        const work = (point - cursor) * rate;
        if (left <= work) {
          predictedEndTime = cursor + left / rate;
          left = 0;
          break;
        }
        left -= work;
        cursor = point;
      }
      if (left > 0) predictedEndTime = cursor + left;
    }

    return { remainWorkMs, predictedEndTime, currentRate };
  }

  /** 结算单个任务：把剩余工期推进到 now，并刷新预计完成时刻。 */
  function settleTask(acc, task, now = Date.now()) {
    const result = evaluateTask(acc, task, now);
    task.remainWorkMs = result.remainWorkMs;
    task.checkpointAt = now;
    task.endTime = result.predictedEndTime;
    return result;
  }

  /** 结算整个账号；随后清理不再生效的加速区间。 */
  function settleAccount(acc, now = Date.now()) {
    (acc.tasks || []).forEach(task => settleTask(acc, task, now));
    pruneBoosts(acc, now);
  }

  /**
   * 持续协助跨天时，任务如果是在后续某一轮协助窗口里完工，
   * 需要按实际完工时刻补一次 23 小时冷却，不能沿用第一轮留下的旧值。
   */
  function syncAutoAssistCooldown(acc, boost, completedAt) {
    const workLen = Math.max(60000, boost.endTime - boost.startTime);
    const elapsed = Math.max(0, completedAt - boost.startTime);
    const cycleIndex = Math.floor(elapsed / DAY_MS);
    const workStart = boost.startTime + cycleIndex * DAY_MS;
    const workEnd = workStart + workLen;
    const cooldownEnd = (completedAt >= workStart && completedAt < workEnd)
      ? completedAt + APPRENTICE_COOLDOWN_MS
      : workEnd + APPRENTICE_COOLDOWN_MS;

    if (boost.kind === 'builder_apprentice') {
      acc.builderApprenticeCooldownEnd = Math.max(
        Number(acc.builderApprenticeCooldownEnd) || 0,
        cooldownEnd
      );
    } else {
      acc.labAssistantCooldownEnd = Math.max(
        Number(acc.labAssistantCooldownEnd) || 0,
        cooldownEnd
      );
    }
  }

  function pruneBoosts(acc, now = Date.now()) {
    const taskById = new Map((acc.tasks || []).map(t => [t.id, t]));
    acc.boosts = (acc.boosts || []).filter(b => {
      if (b.scope === 'task' && !taskById.has(b.taskId)) return false;
      if (b.autoContinue) {
        const target = taskById.get(b.taskId);
        const stillWorking = !!target && evaluateTask(acc, target, now).remainWorkMs > 0;
        /* 完工时补算跨天协助的冷却，再移除这条持续协助 */
        if (!stillWorking && target && (b.kind === 'builder_apprentice' || b.kind === 'lab_assistant')) {
          syncAutoAssistCooldown(acc, b, now);
        }
        return stillWorking;
      }
      return b.endTime > now;
    });
  }

  function buildTaskIndex() {
    const index = new Map();
    state.accounts.forEach(acc => acc.tasks.forEach(task => index.set(task.id, { acc, task })));
    return index;
  }

  // ---------- 主页面卡片 ----------
  /** 当前筛选的账号；为空时展示该同步码下的全部账号。 */
  function getVisibleAccounts() {
    if (!filterAccountId) return state.accounts;
    const match = state.accounts.find(acc => acc.id === filterAccountId);
    return match ? [match] : state.accounts;
  }

  function renderAccountFilter() {
    if (filterAccountId && !state.accounts.some(acc => acc.id === filterAccountId)) {
      filterAccountId = '';
      localStorage.removeItem(FILTER_KEY);
    }
    const select = document.getElementById('accountFilter');
    select.innerHTML = '';
    const allOption = el('option', null, '全部账号');
    allOption.value = '';
    select.appendChild(allOption);
    state.accounts.forEach(acc => {
      const option = el('option', null, acc.name);
      option.value = acc.id;
      select.appendChild(option);
    });
    select.value = filterAccountId;
  }

  function renderCards() {
    const wrap = document.getElementById('cards');
    const accounts = getVisibleAccounts();
    wrap.innerHTML = '';
    accounts.forEach(acc => wrap.appendChild(buildCard(acc)));
    renderUpcoming();
    tick();
  }

  function renderUpcoming() {
    const card = document.getElementById('upcomingCard');
    const list = document.getElementById('upcomingList');
    const sub = document.getElementById('upcomingSub');
    list.innerHTML = '';

    /* 已筛选到单一账号时，该账号卡片本身已足够，不再展示跨账号的「即将完成」 */
    if (filterAccountId) {
      card.classList.add('hidden');
      return;
    }

    const now = Date.now();
    const all = [];
    getVisibleAccounts().forEach(acc => acc.tasks.forEach(task => all.push({ acc, task })));

    if (!all.length) {
      card.classList.add('hidden');
      return;
    }

    /* 进行中的任务优先，已完成的单独分组放在末尾 */
    const active = all
      .filter(item => item.task.endTime > now)
      .sort((a, b) => a.task.endTime - b.task.endTime);
    const finished = all
      .filter(item => item.task.endTime <= now)
      .sort((a, b) => b.task.endTime - a.task.endTime);

    sub.textContent = `进行中 ${active.length} · 已完成 ${finished.length}`;

    const renderUpItem = ({ acc, task }, done) => {
      const item = el('div', 'up-item' + (done ? ' done compact' : ''));
      item.dataset.end = task.endTime;

      const line1 = el('div', 'up-line');
      const accName = el('span', 'up-acc', acc.name);
      accName.title = acc.name;
      line1.appendChild(accName);
      line1.appendChild(el('span', 'up-sep', '·'));
      if (Number(task.itemId) > 0) {
        const iconLevel = Number(task.itemId) === 1000001 ? Number(task.lvl) : 0;
        line1.appendChild(cocIcon(task.itemId, taskDisplayName(task), 14, iconLevel));
      }
      line1.appendChild(el('span', 'up-name', taskDisplayName(task)));
      item.appendChild(line1);

      const line2 = el('div', 'up-line');
      const tag = el('span', `tag ${task.category}`);
      if (task.category === 'builder') {
        tag.textContent = done ? '空闲' : (task.slot ? `工人${task.slot}` : '建筑');
      } else {
        tag.textContent = CATEGORY_META[task.category].short;
      }
      line2.appendChild(tag);

      if (done) {
        line2.appendChild(el('span', 'up-done', '✓ 已完成'));
      } else {
        const cd = el('span', 'cd');
        cd.dataset.end = task.endTime;
        cd.dataset.task = task.id;
        line2.appendChild(cd);

        const rate = el('span', 'cd-rate hidden');
        rate.dataset.task = task.id;
        line2.appendChild(rate);

        const finish = el('span', 'finish up-finish', formatFinishTime(task.endTime));
        finish.dataset.end = task.endTime;
        line2.appendChild(finish);
      }

      item.appendChild(line2);
      return item;
    };

    const shownActive = active.slice(0, 6);
    /* 已完成任务全部展示，方便确认刚结束的项目 */
    const shownFinished = finished;
    shownActive.forEach(entry => list.appendChild(renderUpItem(entry, false)));
    if (shownFinished.length) {
      if (shownActive.length) list.appendChild(el('div', 'up-divider', '已完成'));
      shownFinished.forEach(entry => list.appendChild(renderUpItem(entry, true)));
    }

    card.classList.remove('hidden');
  }

  function buildCard(acc) {
    const card = el('article', 'card');
    card.dataset.accountId = acc.id;

    const head = el('div', 'card-head');
    const handle = el('span', 'drag-handle', '⠿');
    handle.title = '拖动排序';
    head.appendChild(handle);

    const titleBox = el('div', 'card-title');
    titleBox.appendChild(el('h2', null, acc.name));
    const used = acc.tasks.filter(t => t.category === 'builder' && t.endTime > Date.now()).length;
    const idle = Math.max(0, acc.builderCount - used);
    const done = acc.tasks.filter(t => t.endTime <= Date.now()).length;
    if (done > 0) card.classList.add('attention-done');
    else if (idle > 0) card.classList.add('attention-idle');
    const meta = el('span', 'card-meta');
    const th = acc.townHallLevel || 1;
    meta.appendChild(el('span', `th-pill th-${th}`, `${th} 本`));
    if (acc.village && acc.village.builderHallLevel) {
      const bh = el('span', 'bh-pill', `夜 ${acc.village.builderHallLevel}`);
      bh.title = `夜世界 ${acc.village.builderHallLevel} 本`;
      meta.appendChild(document.createTextNode(' '));
      meta.appendChild(bh);
    }
    if (acc.village && acc.village.tag) {
      const tagPill = el('span', 'tag-pill', acc.village.tag);
      tagPill.title = '点击复制村落标签';
      tagPill.addEventListener('click', () => copyPlainText(acc.village.tag, '村落标签已复制'));
      meta.appendChild(document.createTextNode(' '));
      meta.appendChild(tagPill);
    }
    meta.appendChild(document.createTextNode(` · ${acc.builderCount} 工人 · `));
    if (idle > 0) meta.appendChild(el('span', 'idle-pill', `空闲 ${idle}`));
    else meta.appendChild(document.createTextNode('空闲 0'));
    if (done > 0) {
      meta.appendChild(document.createTextNode(' · '));
      meta.appendChild(el('span', 'done-pill', `已完成 ${done}`));
    }
    titleBox.appendChild(meta);
    head.appendChild(titleBox);

    const actions = el('div', 'card-actions');
    if (acc.village) {
      const villageBtn = el('button', 'mini-village', '村落');
      villageBtn.title = '查看游戏导出的村落数据';
      villageBtn.addEventListener('click', () => openVillage(acc.id));
      actions.appendChild(villageBtn);
    }
    const gearBtn = el('button', 'mini-gear', '⚙');
    gearBtn.title = '配置此账号';
    gearBtn.addEventListener('click', () => openAccountConfig(acc.id));
    actions.appendChild(gearBtn);

    const accelBtn = el('button', 'accel-btn', '⚡ 加速');
    accelBtn.addEventListener('click', () => openAccel(acc.id));
    actions.appendChild(accelBtn);
    head.appendChild(actions);
    card.appendChild(head);

    /* 已导入村落的账号才显示英雄等级条 */
    const heroBar = buildHeroBar(acc);
    if (heroBar) card.appendChild(heroBar);

    const builders = acc.tasks.filter(t => t.category === 'builder').sort(compareTasks);
    const builderList = el('div', 'task-list');
    if (!builders.length) {
      builderList.appendChild(el('div', 'task-empty', '暂无建筑任务'));
    } else {
      builders.forEach(task => builderList.appendChild(buildLine(task, acc)));
    }
    card.appendChild(builderList);

    const now = Date.now();
    const researchTasks = acc.tasks.filter(t => t.category === 'research').sort(compareTasks);
    const petTasks = acc.tasks.filter(t => t.category === 'pet').sort(compareTasks);
    const techZone = el('div', 'tech-zone');
    const techList = el('div', 'task-list');

    researchTasks.forEach(task => techList.appendChild(buildLine(task, acc)));
    if (!researchTasks.some(t => t.endTime > now)) {
      techList.appendChild(buildIdleLine('research'));
    }

    const showPet = (acc.townHallLevel || 1) >= 14 || petTasks.length > 0;
    if (showPet) {
      petTasks.forEach(task => techList.appendChild(buildLine(task, acc)));
      if (!petTasks.some(t => t.endTime > now)) {
        techList.appendChild(buildIdleLine('pet'));
      }
    }

    techZone.appendChild(techList);
    card.appendChild(techZone);

    bindCardDrag(card, acc, handle);
    return card;
  }

  function clearDropMarks() {
    document.querySelectorAll('.card').forEach(node => {
      node.classList.remove('drag-over-left', 'drag-over-right');
    });
  }

  function bindCardDrag(card, acc, handle) {
    card.draggable = false;

    handle.addEventListener('mousedown', () => { card.draggable = true; });
    handle.addEventListener('mouseup', () => { card.draggable = false; });

    card.addEventListener('dragstart', e => {
      dragAccountId = acc.id;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', acc.id);
    });

    card.addEventListener('dragend', () => {
      dragAccountId = null;
      card.draggable = false;
      card.classList.remove('dragging');
      clearDropMarks();
    });

    card.addEventListener('dragover', e => {
      if (!dragAccountId || dragAccountId === acc.id) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      clearDropMarks();
      const rect = card.getBoundingClientRect();
      const before = e.clientX < rect.left + rect.width / 2;
      card.classList.add(before ? 'drag-over-left' : 'drag-over-right');
    });

    card.addEventListener('dragleave', e => {
      if (!card.contains(e.relatedTarget)) {
        card.classList.remove('drag-over-left', 'drag-over-right');
      }
    });

    card.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragAccountId || dragAccountId === acc.id) return;
      const sourceIndex = state.accounts.findIndex(a => a.id === dragAccountId);
      if (sourceIndex < 0) return;

      const rect = card.getBoundingClientRect();
      const before = e.clientX < rect.left + rect.width / 2;
      const [moved] = state.accounts.splice(sourceIndex, 1);
      const targetIndex = state.accounts.findIndex(a => a.id === acc.id);
      state.accounts.splice(before ? targetIndex : targetIndex + 1, 0, moved);

      dragAccountId = null;
      card.draggable = false;
      clearDropMarks();
      saveState();
      renderCards();
      renderAccountSelect();
    });
  }

  function compareTasks(a, b) {
    const now = Date.now();
    const aDone = a.endTime <= now;
    const bDone = b.endTime <= now;
    if (aDone !== bDone) return aDone ? 1 : -1;
    if (aDone) return b.endTime - a.endTime;
    return a.endTime - b.endTime;
  }

  function buildLine(task, acc) {
    const line = el('div', 'tline');
    const top = el('div', 'tline-top');

    const tag = el('span', `tag ${task.category}`);
    if (task.category === 'builder') {
      tag.textContent = task.endTime <= Date.now()
        ? '已完成'
        : (task.slot ? `工人${task.slot}` : '建筑');
    } else {
      tag.textContent = CATEGORY_META[task.category].short;
    }
    top.appendChild(tag);

    if (Number(task.itemId) > 0) {
      const iconLevel = Number(task.itemId) === 1000001 ? Number(task.lvl) : 0;
      top.appendChild(cocIcon(task.itemId, taskDisplayName(task), 18, iconLevel));
    }
    top.appendChild(el('span', 'tname', taskDisplayName(task)));

    const levelLabel = taskLevelLabel(task);
    if (levelLabel) top.appendChild(el('span', 'tlevel', levelLabel));

    const cdWrap = el('span', 'cd-wrap');
    const cdLine = el('span', 'cd-line');
    const cd = el('span', 'cd');
    cd.dataset.end = task.endTime;
    cd.dataset.task = task.id;
    cdLine.appendChild(cd);
    const rate = el('span', 'cd-rate hidden');
    rate.dataset.task = task.id;
    cdLine.appendChild(rate);
    cdWrap.appendChild(cdLine);
    const finish = el('span', 'finish', formatFinishTime(task.endTime));
    finish.dataset.end = task.endTime;
    cdWrap.appendChild(finish);
    top.appendChild(cdWrap);

    line.appendChild(top);

    /* 进行中的任务也直接给编辑入口，不必再打开配置弹窗找任务 */
    const editBtn = el('button', 'edit-btn', '编辑');
    editBtn.title = '修改时长，继续升级这个项目';
    editBtn.addEventListener('click', () => editTaskFromCard(acc.id, task.id));
    top.appendChild(editBtn);

    if (task.endTime <= Date.now()) {
      const doneBtn = el('button', 'complete-btn', '完成');
      doneBtn.title = '确认完成并删除这条任务';
      doneBtn.addEventListener('click', () => deleteTask(task.id, acc.id, true));
      top.appendChild(doneBtn);
    } else {
      const bar = el('div', 'bar');
      const fill = el('span', 'bar-fill');
      fill.dataset.task = task.id;
      bar.appendChild(fill);
      line.appendChild(bar);
    }

    return line;
  }

  function buildIdleLine(category) {
    const line = el('div', 'tline idle-line');
    const top = el('div', 'tline-top');
    top.appendChild(el('span', 'tag idle-tag', CATEGORY_META[category].short));
    top.appendChild(el('span', 'tname idle-text', '空闲'));
    line.appendChild(top);
    return line;
  }

  /* ---------- 轻量提示 / 复制 ---------- */
  let toastTimer = null;

  function showToast(text) {
    let node = document.getElementById('cocToast');
    if (!node) {
      node = el('div', 'coc-toast');
      node.id = 'cocToast';
      document.body.appendChild(node);
    }
    node.textContent = text;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 1600);
  }

  function fallbackCopy(text) {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    input.remove();
    return ok;
  }

  function copyPlainText(text, message) {
    if (!text) return;
    const done = () => showToast(message || '已复制');
    const fail = () => {
      if (fallbackCopy(text)) done();
      else showToast('复制失败，请手动选择');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fail);
    } else {
      fail();
    }
  }

  /* 任务名与等级标签：兼容旧数据里已经拼进名称的「(2→3级)」 */
  function taskDisplayName(task) {
    const name = String(task.name || '');
    const stripped = name.replace(/\s*[（(]\s*\d+\s*→\s*\d+\s*级\s*[）)]\s*$/, '').trim();
    return stripped || name;
  }

  function taskLevelLabel(task) {
    const lvl = Number(task.lvl);
    const next = Number(task.nextLvl);
    if (Number.isFinite(lvl) && lvl > 0 && Number.isFinite(next) && next > lvl) {
      return `${lvl}→${next}级`;
    }
    const match = String(task.name || '').match(/[（(]\s*(\d+)\s*→\s*(\d+)\s*级\s*[）)]/);
    return match ? `${match[1]}→${match[2]}级` : '';
  }

  /* ---------- 卡片英雄等级条 ---------- */
  function heroShortName(item) {
    const short = HERO_SHORT_MAP[Number(item.id)];
    if (short) return short;
    const name = villageItemName(item) || '';
    return name.replace(/^(夜世界|建筑大师)/, '').slice(0, 4) || '英雄';
  }

  function buildHeroBar(acc) {
    const heroes = ((acc.village && acc.village.heroes) || []).filter(h => Number(h.lvl) > 0);
    if (!heroes.length) return null;
    const order = Object.keys(HERO_SHORT_MAP).map(Number);
    heroes.sort((a, b) => {
      const ai = order.indexOf(Number(a.id));
      const bi = order.indexOf(Number(b.id));
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });
    const bar = el('div', 'hero-bar');
    heroes.forEach(hero => {
      const pill = el('span', 'hero-pill');
      const badge = HERO_BADGE_CLASS[Number(hero.id)];
      if (badge) pill.classList.add(badge);
      const up = Number(hero.endAt) > Date.now();
      if (up) pill.classList.add('up');
      if (hero.endAt) pill.dataset.end = String(hero.endAt);
      pill.title = `${villageItemName(hero)} Lv.${hero.lvl}${up ? ' · 升级中' : ''}`;
      pill.appendChild(cocIcon(hero.id, villageItemName(hero), 16));
      pill.appendChild(el('span', 'hero-name', heroShortName(hero)));
      pill.appendChild(el('span', 'hero-lvl', String(hero.lvl)));
      pill.appendChild(el('span', 'hero-arrow', up ? '↑' : ''));
      bar.appendChild(pill);
    });
    return bar;
  }

  // ---------- 倒计时 ----------
  function formatDuration(ms, withSeconds = false) {
    if (ms <= 0) return '已完成';
    if (withSeconds) {
      const totalSec = Math.ceil(ms / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      if (d > 0) return `${d}天${h}时${m}分${s}秒`;
      if (h > 0) return `${h}时${m}分${s}秒`;
      if (m > 0) return `${m}分${s}秒`;
      return `${s}秒`;
    }
    const totalMinutes = Math.ceil(ms / 60000);
    const d = Math.floor(totalMinutes / 1440);
    const h = Math.floor((totalMinutes % 1440) / 60);
    const m = totalMinutes % 60;
    if (d > 0) return `${d}天${h}时${m}分`;
    if (h > 0) return `${h}时${m}分`;
    return `${m}分`;
  }

  function formatFinishTime(endTime) {
    const target = new Date(endTime);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
    const dayDiff = Math.round((targetStart - todayStart) / 86400000);
    const hh = String(target.getHours()).padStart(2, '0');
    const mm = String(target.getMinutes()).padStart(2, '0');
    if (dayDiff === 0) return `今天 ${hh}:${mm}`;
    if (dayDiff === 1) return `明天 ${hh}:${mm}`;
    if (dayDiff === -1) return `昨天 ${hh}:${mm}`;
    return `${target.getMonth() + 1}/${target.getDate()} ${hh}:${mm}`;
  }

  function applyTier(node, remain) {
    node.classList.remove('tier-1', 'tier-2', 'tier-3', 'tier-4', 'tier-5', 'tier-done');
    let tier = 'tier-5';
    if (remain <= 0) tier = 'tier-done';
    else if (remain <= 3600000) tier = 'tier-1';
    else if (remain <= 6 * 3600000) tier = 'tier-2';
    else if (remain <= 12 * 3600000) tier = 'tier-3';
    else if (remain <= 24 * 3600000) tier = 'tier-4';
    node.classList.add(tier);
  }

  function updateCountdown(node, index, now) {
    const entry = node.dataset.task ? index.get(node.dataset.task) : null;
    if (!entry) {
      const remain = Number(node.dataset.end) - now;
      node.textContent = formatDuration(remain);
      applyTier(node, remain);
      return;
    }
    const result = evaluateTask(entry.acc, entry.task, now);
    node.textContent = formatDuration(result.remainWorkMs, result.currentRate > 1);
    applyTier(node, Number(entry.task.endTime) - now);
  }

  function updateRateBadge(node, index, now) {
    const entry = index.get(node.dataset.task);
    if (!entry) { node.classList.add('hidden'); return; }
    const result = evaluateTask(entry.acc, entry.task, now);
    if (result.remainWorkMs > 0 && result.currentRate > 1) {
      node.textContent = `⚡${Math.round(result.currentRate * 10) / 10}x`;
      node.classList.remove('hidden');
    } else {
      node.classList.add('hidden');
    }
  }

  function updateBar(node, index, now) {
    const entry = index.get(node.dataset.task);
    if (!entry) return;
    const result = evaluateTask(entry.acc, entry.task, now);
    const duration = Number(entry.task.durationMs) || 0;
    let pct = 100;
    if (result.remainWorkMs > 0) {
      pct = duration > 0 ? Math.min(99, Math.max(0, (1 - result.remainWorkMs / duration) * 100)) : 0;
    }
    node.style.width = pct.toFixed(1) + '%';
    applyTier(node, Number(entry.task.endTime) - now);
  }

  function updateDocumentTitle() {
    const now = Date.now();
    let nearest = Infinity;
    getVisibleAccounts().forEach(acc => {
      acc.tasks.forEach(task => {
        if (task.endTime > now && task.endTime < nearest) nearest = task.endTime;
      });
    });
    document.title = nearest === Infinity
      ? '部落冲突工具'
      : `${formatDuration(nearest - now)} · 部落冲突工具`;
  }

  let accelRendering = false;
  let accelStateSig = null;
  let accelBoostSig = null;

  function itemBoostSignature(acc) {
    return visibleBoosts(acc, Date.now()).map(b => b.id).join(',');
  }

  function updateLiveCountdowns() {
    const now = Date.now();
    const index = buildTaskIndex();
    document.querySelectorAll('.cd[data-task]').forEach(node => updateCountdown(node, index, now));
    document.querySelectorAll('.cd-rate[data-task]').forEach(node => updateRateBadge(node, index, now));
    document.querySelectorAll('.bar-fill[data-task]').forEach(node => updateBar(node, index, now));
    document.querySelectorAll('.finish[data-end]').forEach(node => {
      node.textContent = formatFinishTime(Number(node.dataset.end));
    });
    document.querySelectorAll('.up-item[data-end]').forEach(item => {
      applyTier(item, Number(item.dataset.end) - now);
    });
    document.querySelectorAll('.assistant-cd[data-end]').forEach(node => {
      const remain = Number(node.dataset.end) - now;
      node.textContent = remain > 0 ? formatDuration(remain) : '可用';
    });
    document.querySelectorAll('.boost-cd[data-end]').forEach(node => {
      const remain = Number(node.dataset.end) - now;
      node.textContent = remain > 0 ? formatDuration(remain, true) : '已结束';
    });
    document.querySelectorAll('.village-cd[data-end]').forEach(node => {
      const remain = Number(node.dataset.end) - now;
      node.textContent = remain > 0 ? formatDuration(remain, true) : '已完成';
    });
    document.querySelectorAll('.hero-pill[data-end]').forEach(node => {
      const up = Number(node.dataset.end) > now;
      node.classList.toggle('up', up);
      const arrow = node.querySelector('.hero-arrow');
      if (arrow) arrow.textContent = up ? '↑' : '';
    });
    updateDocumentTitle();
  }

  function tick() {
    updateLiveCountdowns();

    if (accelRendering || !accelAccountId) return;
    const mask = document.getElementById('accelMask');
    if (!mask || !mask.classList.contains('show')) return;
    const acc = getAccelAccount();

    if (accelTab === 'item') {
      /* 药水到期 / 任务完成时，自动移除顶部失效的加速条 */
      const sig = itemBoostSignature(acc);
      if (accelBoostSig === null) { accelBoostSig = sig; return; }
      if (sig !== accelBoostSig) {
        accelBoostSig = sig;
        renderAccel();
      }
      return;
    }

    /* 学徒页：冷却/协助窗口到点后自动刷新按钮状态 */
    const sig = apprenticeUiSignature(acc);
    if (accelStateSig === null) { accelStateSig = sig; return; }
    if (sig !== accelStateSig) {
      accelStateSig = sig;
      renderAccel();
    }
  }

  function getDoneSignature() {
    return state.accounts
      .map(acc => `${acc.id}:${acc.tasks.filter(t => t.endTime <= Date.now()).length}`)
      .sort()
      .join('|');
  }

  function checkCompletions() {
    const signature = getDoneSignature();
    if (lastDoneSignature === null) {
      lastDoneSignature = signature;
      return;
    }
    if (signature === lastDoneSignature) return;
    lastDoneSignature = signature;
    renderCards();
    renderConfigTasks();
    if (document.getElementById('accelMask').classList.contains('show')) renderAccel();
  }

  // ---------- 任务操作 ----------
  function deleteTask(taskId, accountId, skipConfirm) {
    const acc = state.accounts.find(a => a.id === accountId) || getActiveAccount();
    if (!skipConfirm && !confirm('确定删除这个倒计时吗？')) return;
    acc.tasks = acc.tasks.filter(t => t.id !== taskId);
    settleAccount(acc, Date.now());
    saveState();
    renderAll();
  }

  // ---------- 加速弹窗 ----------
  let accelAccountId = null;
  let accelTab = 'item';

  function openAccel(accountId) {
    accelAccountId = accountId;
    accelTab = 'item';
    accelStateSig = null;
    accelBoostSig = null;
    renderAccel();
    document.getElementById('accelMask').classList.add('show');
  }

  function closeAccel() {
    document.getElementById('accelMask').classList.remove('show');
    accelAccountId = null;
    accelStateSig = null;
    accelBoostSig = null;
  }

  function getAccelAccount() {
    return state.accounts.find(a => a.id === accelAccountId) || getActiveAccount();
  }

  function renderAccel() {
    accelRendering = true;
    try {
      const acc = getAccelAccount();
      document.getElementById('accelTitle').textContent = `加速 · ${acc.name}`;
      document.querySelectorAll('.accel-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === accelTab);
      });
      const body = document.getElementById('accelBody');
      body.innerHTML = '';
      if (accelTab === 'item') renderItemTab(acc, body);
      else renderApprenticeTab(acc, body);
      accelStateSig = accelTab === 'apprentice' ? apprenticeUiSignature(acc) : null;
      accelBoostSig = accelTab === 'item' ? itemBoostSignature(acc) : null;
    } finally {
      accelRendering = false;
    }
    updateLiveCountdowns();
  }

  function getActiveTasks(acc, category) {
    return acc.tasks
      .filter(t => t.category === category && t.endTime > Date.now())
      .sort((a, b) => a.endTime - b.endTime);
  }

  function taskLabel(task) {
    if (task.category === 'builder') return `工人${task.slot || '?'} · ${task.name}`;
    return `${CATEGORY_META[task.category].short} · ${task.name}`;
  }

  function accelItem(title, meta, desc, control) {
    const card = el('div', 'accel-item');
    const head = el('div', 'accel-item-head');
    head.appendChild(el('span', 'title', title));
    if (meta) head.appendChild(typeof meta === 'string' ? el('span', 'meta', meta) : meta);
    card.appendChild(head);
    card.appendChild(el('div', 'accel-desc', desc));
    if (control) card.appendChild(control);
    return card;
  }

  function targetRow(tasks, buttonLabel, onUse, disabled) {
    const row = el('div', 'accel-row');
    const sel = document.createElement('select');
    tasks.forEach(task => {
      const opt = document.createElement('option');
      opt.value = task.id;
      opt.textContent = taskLabel(task);
      sel.appendChild(opt);
    });
    const btn = el('button', 'primary', buttonLabel);
    btn.disabled = !!disabled;
    btn.addEventListener('click', () => {
      const task = tasks.find(t => t.id === sel.value);
      if (task) onUse(task);
    });
    row.appendChild(sel);
    row.appendChild(btn);
    return row;
  }

  function actionRow(label, note, onUse) {
    const row = el('div', 'accel-row');
    row.appendChild(el('span', 'accel-row-note', note || ''));
    const btn = el('button', 'primary', label);
    btn.addEventListener('click', onUse);
    row.appendChild(btn);
    return row;
  }

  function usePotionBoost(acc, kind, scope, extraRate, now = Date.now()) {
    const existing = (acc.boosts || []).find(b => b.kind === kind && b.endTime > now);
    if (existing) {
      /* 同类药水连续使用只延长持续时间，不叠加倍率 */
      existing.endTime += HOUR_MS;
      return;
    }
    acc.boosts.push({
      id: uid(), kind, scope, taskId: null,
      extraRate, startTime: now, endTime: now + HOUR_MS,
      autoContinue: false
    });
  }

  function completeTaskNow(acc, task, now = Date.now()) {
    task.remainWorkMs = 0;
    task.checkpointAt = now;
    task.endTime = now;
    acc.boosts = (acc.boosts || []).filter(b => !(b.scope === 'task' && b.taskId === task.id));
  }

  function visibleBoosts(acc, now) {
    const taskById = new Map(acc.tasks.map(t => [t.id, t]));
    return (acc.boosts || []).filter(b => {
      if (b.scope === 'task') {
        const task = taskById.get(b.taskId);
        if (!task) return false;
        if (evaluateTask(acc, task, now).remainWorkMs <= 0) return false;
        return b.autoContinue || b.endTime > now;
      }
      return b.endTime > now;
    });
  }

  function boostDisplayName(acc, b) {
    const meta = BOOST_META[b.kind] || BOOST_META.custom;
    let name = meta.label;
    if (b.kind === 'custom') name += ` ×${b.extraRate + 1}`;
    else if (meta.rateText) name += ` ${meta.rateText}`;
    else if (b.extraRate > 0) name += ` +${b.extraRate} 倍`;
    if (b.scope === 'task') {
      const task = acc.tasks.find(t => t.id === b.taskId);
      if (task) name += ` · ${taskLabel(task)}`;
    } else if (CATEGORY_META[b.scope]) {
      name += ` · ${CATEGORY_META[b.scope].label}`;
    }
    return name;
  }

  function renderBoostList(acc, body, now) {
    const boosts = visibleBoosts(acc, now);
    if (!boosts.length) return;

    const box = el('div', 'boost-box');
    const head = el('div', 'boost-box-head');
    head.appendChild(el('span', null, '⚡ 生效中的加速'));
    head.appendChild(el('span', 'boost-note', '重叠时额外倍率相加'));
    box.appendChild(head);

    boosts.forEach(b => {
      const item = el('div', 'boost-item');
      item.appendChild(el('span', 'boost-name', boostDisplayName(acc, b)));

      if (b.kind === 'builder_apprentice' || b.kind === 'lab_assistant') {
        const st = getApprenticeState(acc, b.kind, now);
        if (b.autoContinue && st.state === 'waiting') {
          item.appendChild(el('span', 'boost-cd', `下一轮 ${formatFinishTime(st.nextStart)}`));
        } else {
          const cd = el('span', 'boost-cd');
          cd.dataset.end = st.state === 'working' ? st.endTime : b.endTime;
          item.appendChild(cd);
        }
      } else {
        const cd = el('span', 'boost-cd');
        cd.dataset.end = b.endTime;
        item.appendChild(cd);
      }

      if (b.kind.endsWith('_potion')) {
        const extend = el('button', null, '+1 小时');
        extend.title = '连续续杯，延长 1 小时';
        extend.addEventListener('click', () => applyAccel(acc2 => {
          const target = acc2.boosts.find(x => x.id === b.id);
          if (target) target.endTime += HOUR_MS;
        }));
        item.appendChild(extend);
      }

      const remove = el('button', 'danger', '取消');
      remove.title = '已经生效的加速保留，后续不再加速';
      remove.addEventListener('click', () => {
        if (!confirm('取消这条加速吗？已经生效的部分会保留。')) return;
        applyAccel(acc2 => {
          acc2.boosts = acc2.boosts.filter(x => x.id !== b.id);
        });
      });
      item.appendChild(remove);
      box.appendChild(item);
    });

    body.appendChild(box);
  }

  /** 自定义加速：选择目标 + 倍率 + 持续时长。 */
  function customAccelRow(builders, researches, pets) {
    const wrap = el('div', 'custom-accel');
    let builderAll = null;
    const builderChecks = [];
    const researchChecks = [];
    const petChecks = [];

    function addCheck(group, task) {
      const label = el('label', 'accel-check');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.appendChild(checkbox);
      label.appendChild(el('span', null, taskLabel(task)));
      group.appendChild(label);
      return { checkbox, task };
    }

    if (builders.length) {
      const group = el('div', 'accel-check-group');
      group.appendChild(el('div', 'accel-check-head', '建筑工人'));
      const allLabel = el('label', 'accel-check');
      builderAll = document.createElement('input');
      builderAll.type = 'checkbox';
      allLabel.appendChild(builderAll);
      allLabel.appendChild(el('span', null, `全体建筑工人（${builders.length} 个进行中，期间新开也生效）`));
      group.appendChild(allLabel);
      builders.forEach(task => builderChecks.push(addCheck(group, task)));
      wrap.appendChild(group);
    }

    function addGroup(title, tasks, bucket) {
      if (!tasks.length) return;
      const group = el('div', 'accel-check-group');
      group.appendChild(el('div', 'accel-check-head', title));
      tasks.forEach(task => bucket.push(addCheck(group, task)));
      wrap.appendChild(group);
    }
    addGroup('研究', researches, researchChecks);
    addGroup('战宠', pets, petChecks);

    const row1 = el('div', 'accel-row');
    row1.appendChild(el('span', 'accel-field-label', '倍率'));
    const mult = document.createElement('input');
    mult.type = 'number';
    mult.className = 'accel-mult';
    mult.min = '2';
    mult.step = '1';
    mult.value = '2';
    mult.title = '加速倍率';
    mult.setAttribute('aria-label', '加速倍率');
    row1.appendChild(mult);
    row1.appendChild(el('span', 'accel-unit', '倍'));

    row1.appendChild(el('span', 'accel-field-label', '持续'));
    const duration = document.createElement('input');
    duration.type = 'number';
    duration.className = 'accel-mult';
    duration.min = '1';
    duration.step = '1';
    duration.value = '60';
    duration.title = '持续时长';
    duration.setAttribute('aria-label', '持续时长');
    row1.appendChild(duration);

    const unit = document.createElement('select');
    unit.style.flex = 'none';
    unit.style.width = 'auto';
    [['minute', '分钟'], ['hour', '小时']].forEach(([value, text]) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      unit.appendChild(opt);
    });
    row1.appendChild(unit);
    wrap.appendChild(row1);

    const row2 = el('div', 'accel-row');
    row2.appendChild(el('span', 'accel-row-note', '加速期间新开始的任务同样生效，多份加速按额外倍率相加。'));
    const btn = el('button', 'primary', '应用');
    btn.addEventListener('click', () => {
      const multiplier = Number(mult.value);
      const amount = Number(duration.value);
      const durationMs = Math.round(amount * (unit.value === 'hour' ? HOUR_MS : 60000));
      if (!Number.isFinite(multiplier) || multiplier <= 1) {
        alert('加速倍率需大于 1');
        return;
      }
      if (!Number.isFinite(durationMs) || durationMs <= 0) {
        alert('持续时长需大于 0');
        return;
      }

      const allBuilders = !!(builderAll && builderAll.checked);
      const targets = [];
      if (!allBuilders) {
        builderChecks.forEach(item => { if (item.checkbox.checked) targets.push(item.task); });
      }
      researchChecks.forEach(item => { if (item.checkbox.checked) targets.push(item.task); });
      petChecks.forEach(item => { if (item.checkbox.checked) targets.push(item.task); });

      if (!allBuilders && !targets.length) {
        alert('请至少选择一个加速目标');
        return;
      }

      applyAccel(acc2 => {
        const now = Date.now();
        const boost = scope => ({
          id: uid(), kind: 'custom', scope, taskId: null,
          extraRate: multiplier - 1, startTime: now, endTime: now + durationMs,
          autoContinue: false
        });
        if (allBuilders) acc2.boosts.push(boost('builder'));
        targets.forEach(task => {
          const item = boost('task');
          item.taskId = task.id;
          acc2.boosts.push(item);
        });
      });
    });
    row2.appendChild(btn);
    wrap.appendChild(row2);
    return wrap;
  }

  function applyAccel(action) {
    const acc = getAccelAccount();
    settleAccount(acc, Date.now());
    action(acc);
    settleAccount(acc, Date.now());
    saveState();
    renderAll();
    if (accelAccountId) renderAccel();
  }

  function renderItemTab(acc, body) {
    const now = Date.now();
    renderBoostList(acc, body, now);

    const builders = getActiveTasks(acc, 'builder');
    const researches = getActiveTasks(acc, 'research');
    const pets = getActiveTasks(acc, 'pet');

    if (!builders.length && !researches.length && !pets.length) {
      body.appendChild(el('div', 'accel-empty', '当前没有进行中的任务'));
      return;
    }

    body.appendChild(accelItem(
      '自定义加速',
      '任意目标 · 自定义时长',
      '按设定倍率持续一段时间，期间新开的任务也会生效；多份加速同时存在时，额外倍率相加（例如 10x 药水 + 8 级学徒 = 18x）。',
      customAccelRow(builders, researches, pets)
    ));

    if (builders.length) {
      body.appendChild(accelItem(
        '建筑工人药水',
        '10 倍 · 1 小时',
        '1 小时内全体建筑工人速度 ×10，期间新开的建筑任务也会生效。已有同类药水时再喝一瓶会延长 1 小时，而不是叠成 100 倍。',
        actionRow('全部使用', `${builders.length} 个建筑进行中`, () => applyAccel(acc2 => {
          usePotionBoost(acc2, 'builder_potion', 'builder', 9);
        }))
      ));
      body.appendChild(accelItem(
        '建筑之书',
        '',
        '立即完成一个正在进行的建筑升级或建造，不保留剩余时间。',
        targetRow(builders, '立即完成', task => applyAccel(acc2 => {
          completeTaskNow(acc2, task);
        }))
      ));
    }

    if (researches.length) {
      body.appendChild(accelItem(
        '研究药水',
        '24 倍 · 1 小时',
        '1 小时内全部研究速度 ×24，直接作用于研究分类；期间新开的研究（例如哥布林第二研究位）也会生效。已有同类药水时会延长 1 小时。',
        actionRow('全部使用', `${researches.length} 个研究进行中`, () => applyAccel(acc2 => {
          usePotionBoost(acc2, 'research_potion', 'research', 23);
        }))
      ));
      body.appendChild(accelItem(
        '研究之书 / 战斗之书',
        '',
        '立即完成选中的研究项目。',
        targetRow(researches, '立即完成', task => applyAccel(acc2 => {
          completeTaskNow(acc2, task);
        }))
      ));
    }

    if (pets.length) {
      body.appendChild(accelItem(
        '战宠药水',
        '24 倍 · 1 小时',
        '1 小时内战宠升级速度 ×24，期间新开始的战宠升级也会生效。已有同类药水时会延长 1 小时。',
        actionRow('全部使用', `${pets.length} 个战宠升级进行中`, () => applyAccel(acc2 => {
          usePotionBoost(acc2, 'pet_potion', 'pet', 23);
        }))
      ));
    }
  }

  function getApprenticeState(acc, kind, now = Date.now()) {
    const isBuilder = kind === 'builder_apprentice';
    const level = isBuilder ? acc.builderApprenticeLevel : acc.labAssistantLevel;
    if (!(level > 0)) return { state: 'locked', level: 0 };

    const cooldownEnd = Number(isBuilder ? acc.builderApprenticeCooldownEnd : acc.labAssistantCooldownEnd) || 0;
    const boost = (acc.boosts || []).find(b =>
      b.kind === kind && b.scope === 'task' && (b.autoContinue || b.endTime > now)
    );

    if (boost) {
      const target = acc.tasks.find(t => t.id === boost.taskId);
      const stillWorking = target ? evaluateTask(acc, target, now).remainWorkMs > 0 : false;

      if (!boost.autoContinue) {
        if (boost.endTime > now && stillWorking) {
          return { state: 'working', level, boost, taskId: boost.taskId, endTime: boost.endTime };
        }
      } else if (stillWorking) {
        const workLen = Math.max(60000, boost.endTime - boost.startTime);
        const elapsed = Math.max(0, now - boost.startTime);
        let start = boost.startTime + Math.floor(elapsed / DAY_MS) * DAY_MS;
        let end = start + workLen;
        while (now >= end) {
          start += DAY_MS;
          end += DAY_MS;
        }
        if (now >= start) {
          return { state: 'working', level, boost, taskId: boost.taskId, endTime: end, auto: true };
        }
        return { state: 'waiting', level, boost, taskId: boost.taskId, nextStart: start, auto: true };
      }
    }

    if (cooldownEnd > now) return { state: 'cooldown', level, cooldownEnd };
    return { state: 'ready', level };
  }

  function apprenticeUiSignature(acc) {
    const now = Date.now();
    return ['builder_apprentice', 'lab_assistant'].map(kind => {
      const st = getApprenticeState(acc, kind, now);
      return `${kind}:${st.state}:${st.taskId || ''}`;
    }).join('|');
  }

  function assignAssistant(acc, kind, task) {
    const isBuilder = kind === 'builder_apprentice';
    const level = isBuilder ? acc.builderApprenticeLevel : acc.labAssistantLevel;
    if (!(level > 0)) return;
    const now = Date.now();

    acc.boosts = (acc.boosts || []).filter(b => !(b.kind === kind && b.scope === 'task' && b.taskId === task.id));
    acc.boosts.push({
      id: uid(), kind, scope: 'task', taskId: task.id,
      extraRate: level, startTime: now, endTime: now + APPRENTICE_WORK_MS,
      autoContinue: !!(isBuilder ? acc.builderApprenticeAutoContinue : acc.labAssistantAutoContinue)
    });

    const result = settleTask(acc, task, now);
    const cooldownEnd = Math.min(now + APPRENTICE_WORK_MS, result.predictedEndTime) + APPRENTICE_COOLDOWN_MS;
    if (isBuilder) acc.builderApprenticeCooldownEnd = cooldownEnd;
    else acc.labAssistantCooldownEnd = cooldownEnd;
  }

  function renderApprenticeTab(acc, body) {
    body.appendChild(el('div', 'accel-note', '学徒 / 助手每次协助 1 小时后进入 23 小时冷却，两人独立计算；等级 0 表示尚未解锁。'));

    renderAssistantCard(acc, body, 'builder_apprentice');
    renderAssistantCard(acc, body, 'lab_assistant');
  }

  function renderAssistantCard(acc, body, kind) {
    const isBuilder = kind === 'builder_apprentice';
    const now = Date.now();
    const level = isBuilder ? acc.builderApprenticeLevel : acc.labAssistantLevel;
    const state = getApprenticeState(acc, kind, now);
    const tasks = getActiveTasks(acc, isBuilder ? 'builder' : 'research');
    const target = state.taskId ? acc.tasks.find(t => t.id === state.taskId) : null;

    /* 标题右侧状态 */
    const meta = el('span', 'meta');
    if (level <= 0) {
      meta.textContent = '未解锁';
    } else if (state.state === 'working') {
      meta.appendChild(document.createTextNode(`Lv.${level} · ${state.auto ? '持续协助中' : '协助中'} `));
      const cd = el('span', 'assistant-cd');
      cd.dataset.end = state.endTime;
      meta.appendChild(cd);
    } else if (state.state === 'waiting') {
      meta.textContent = `Lv.${level} · 等待下一轮 ${formatFinishTime(state.nextStart)}`;
    } else if (state.state === 'cooldown') {
      meta.appendChild(document.createTextNode(`Lv.${level} · 冷却中 `));
      const cd = el('span', 'assistant-cd');
      cd.dataset.end = state.cooldownEnd;
      meta.appendChild(cd);
    } else {
      meta.textContent = `Lv.${level} · 可用`;
    }

    let desc;
    if (level <= 0) {
      desc = '尚未解锁：在「配置 → 账号」中把等级设为 1 以上后即可使用。';
    } else if (state.state === 'working') {
      desc = `正在为「${target ? taskLabel(target) : '任务'}」提供额外 +${level} 倍速度，1 小时后进入冷却。`;
    } else if (state.state === 'waiting') {
      desc = `已锁定「${target ? taskLabel(target) : '任务'}」，本轮冷却结束后会自动继续协助。`;
    } else if (state.state === 'cooldown') {
      desc = '本轮协助已经结束，冷却 23 小时后可再次指派。';
    } else {
      desc = `指派后 1 小时内目标额外 +${level} 倍速度，随后进入 23 小时冷却。`;
    }

    const control = el('div', 'custom-accel');
    if (level <= 0) {
      control.appendChild(el('div', 'accel-empty', '未解锁'));
    } else if (state.state === 'working' || state.state === 'waiting') {
      const row = el('div', 'accel-row');
      row.appendChild(el('span', 'accel-row-note', state.state === 'working' ? '本轮协助进行中' : '等待下一轮协助'));
      const stop = el('button', 'danger', '取消协助');
      stop.addEventListener('click', () => {
        if (!confirm('取消协助吗？已经生效的部分会保留。')) return;
        applyAccel(acc2 => {
          acc2.boosts = (acc2.boosts || []).filter(b => b.kind !== kind);
        });
      });
      row.appendChild(stop);
      control.appendChild(row);
    } else if (tasks.length) {
      control.appendChild(targetRow(tasks, '指派', task => applyAccel(acc2 => {
        assignAssistant(acc2, kind, task);
      }), state.state !== 'ready'));
    } else {
      control.appendChild(el('div', 'accel-empty', isBuilder ? '暂无进行中的建筑任务' : '暂无进行中的研究任务'));
    }

    if (level > 0) {
      const label = el('label', 'accel-check');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!(isBuilder ? acc.builderApprenticeAutoContinue : acc.labAssistantAutoContinue);
      checkbox.addEventListener('change', () => {
        if (isBuilder) acc.builderApprenticeAutoContinue = checkbox.checked;
        else acc.labAssistantAutoContinue = checkbox.checked;
        (acc.boosts || []).forEach(b => {
          if (b.kind === kind && (b.autoContinue || b.endTime > Date.now())) b.autoContinue = checkbox.checked;
        });
        settleAccount(acc, Date.now());
        saveState();
        renderAll();
        if (accelAccountId) renderAccel();
      });
      label.appendChild(checkbox);
      label.appendChild(el('span', null, '持续协助直到当前升级完成（冷却结束后自动继续）'));
      control.appendChild(label);
    }

    body.appendChild(accelItem(
      isBuilder ? '建筑工人学徒' : '实验室助手',
      meta,
      desc,
      control
    ));
  }

  // ---------- 配置 ----------
  function renderConfig() {
    renderAccountSelect();
    renderAccountFields();
    renderConfigTasks();
    renderCloudFields();
  }

  function renderAccountSelect() {
    const sel = document.getElementById('cfgAccountSelect');
    sel.innerHTML = '';
    state.accounts.forEach(acc => {
      const opt = document.createElement('option');
      opt.value = acc.id;
      opt.textContent = acc.name;
      if (acc.id === getActiveAccount().id) opt.selected = true;
      sel.appendChild(opt);
    });

    const idx = state.accounts.findIndex(a => a.id === getActiveAccount().id);
    document.getElementById('cfgMoveUpBtn').disabled = idx <= 0;
    document.getElementById('cfgMoveDownBtn').disabled = idx >= state.accounts.length - 1;
  }

  function renderAccountFields() {
    const acc = getActiveAccount();
    document.getElementById('cfgAccountName').value = acc.name;
    document.getElementById('cfgTownHallLevel').value = acc.townHallLevel;
    document.getElementById('cfgBuilderCount').value = acc.builderCount;
    document.getElementById('cfgBuilderApprenticeLevel').value = acc.builderApprenticeLevel;
    document.getElementById('cfgLabAssistantLevel').value = acc.labAssistantLevel;
  }

  function renderConfigTasks() {
    const wrap = document.getElementById('cfgTaskList');
    wrap.innerHTML = '';
    const acc = getActiveAccount();
    const tasks = acc.tasks.slice().sort((a, b) => {
      const order = { builder: 0, pet: 1, research: 2 };
      if (order[a.category] !== order[b.category]) return order[a.category] - order[b.category];
      if (a.category === 'builder') return a.slot - b.slot;
      return a.endTime - b.endTime;
    });

    if (!tasks.length) {
      wrap.appendChild(el('div', 'group-empty', '暂无任务'));
      return;
    }

    tasks.forEach(task => {
      const row = el('div', 'cfg-task');
      row.appendChild(el('span', 'cat', CATEGORY_META[task.category].short));
      if (Number(task.itemId) > 0) {
        const iconLevel = Number(task.itemId) === 1000001 ? Number(task.lvl) : 0;
        row.appendChild(cocIcon(task.itemId, task.name, 16, iconLevel));
      }
      const prefix = task.category === 'builder' && task.slot ? `工人${task.slot} · ` : '';
      row.appendChild(el('span', 'name', prefix + task.name));

      const cd = el('span', 'cd');
      cd.dataset.end = task.endTime;
      cd.dataset.task = task.id;
      row.appendChild(cd);

      if (task.endTime <= Date.now()) {
        const editBtn = el('button', 'edit-btn', '编辑');
        editBtn.title = '修改时长，继续升级这个项目';
        editBtn.addEventListener('click', () => openTaskForm(task.id));
        row.appendChild(editBtn);

        const doneBtn = el('button', 'complete-btn', '完成');
        doneBtn.title = '确认完成并删除这条任务';
        doneBtn.addEventListener('click', () => deleteTask(task.id, acc.id, true));
        row.appendChild(doneBtn);
      } else {
        const editBtn = el('button', null, '编辑');
        editBtn.addEventListener('click', () => openTaskForm(task.id));
        row.appendChild(editBtn);

        const delBtn = el('button', 'danger', '删除');
        delBtn.addEventListener('click', () => deleteTask(task.id));
        row.appendChild(delBtn);
      }

      wrap.appendChild(row);
    });

    tick();
  }

  function openConfig() {
    if (filterAccountId) state.activeAccountId = filterAccountId;
    document.getElementById('configMask').classList.add('show');
    renderConfig();
  }

  function openAccountConfig(accountId) {
    state.activeAccountId = accountId;
    saveState();
    closeTaskForm();
    openConfig();
  }

  /** 从主卡片编辑任务：只打开任务编辑弹窗，不展开配置弹窗。 */
  function editTaskFromCard(accountId, taskId) {
    state.activeAccountId = accountId;
    openTaskForm(taskId);
  }

  function closeConfig() {
    document.getElementById('configMask').classList.remove('show');
    closeTaskForm();
  }

  // ---------- 任务表单 ----------
  function findFreeSlot(acc, excludeTaskId) {
    const used = new Set(
      acc.tasks
        .filter(t => t.category === 'builder' && t.id !== excludeTaskId && t.endTime > Date.now())
        .map(t => t.slot)
    );
    for (let i = 1; i <= acc.builderCount; i++) {
      if (!used.has(i)) return i;
    }
    return null;
  }

  /** 某个工人槽位是否已被其他进行中的任务占用。 */
  function isBuilderSlotTaken(acc, slot, excludeTaskId) {
    return acc.tasks.some(task =>
      task.id !== excludeTaskId &&
      task.category === 'builder' &&
      task.endTime > Date.now() &&
      task.slot === slot
    );
  }

  /* ---------- 任务项目搜索 ---------- */
  const TASK_ITEM_ALIASES = {
    1000001: ['大本', '老家'],
    1000019: ['电塔'],
    1000021: ['x弩', '连弩'],
    1000028: ['吹风机'],
    28000000: ['男王'],
    28000001: ['女王'],
    28000002: ['永王'],
    28000004: ['飞盾'],
    4000008: ['龙'],
    4000023: ['龙宝'],
    4000053: ['雷龙'],
    26000109: ['冰封'],
    26000123: ['狂怒']
  };
  const TASK_ITEM_MAX_RESULTS = 40;

  /** 图鉴分类 → 任务分类 / 搜索分组；装备返回 null，夜世界由调用方排除 */
  function taskItemGroup(id, cat) {
    if (cat === 'equipment') return null;
    if (cat === 'pet' || (!cat && id >= 73000000 && id < 74000000)) {
      return { group: '战宠', category: 'pet' };
    }
    if (cat === 'research') {
      if (VILLAGE_SIEGE_IDS.has(id)) return { group: '攻城机器', category: 'research' };
      if (id >= 26000000 && id < 27000000) return { group: '法术', category: 'research' };
      return { group: '兵种', category: 'research' };
    }
    if (cat === 'builder' || !cat) {
      if (id >= 28000000 && id < 29000000) return { group: '英雄', category: 'builder' };
      if (id >= 12000000 && id < 13000000) return { group: '陷阱', category: 'builder' };
      if (id >= 1000000 && id < 1100000) return { group: '建筑', category: 'builder' };
    }
    return null;
  }

  function makeTaskItem(id, name, lvl, count, owned, th, hasVillage) {
    const entry = catalogEntry(id);
    const groupInfo = taskItemGroup(id, entry ? entry.cat : undefined);
    if (!groupInfo) return null;
    const aliases = (TASK_ITEM_ALIASES[id] || []).slice();
    if (HERO_SHORT_MAP[id]) aliases.push(HERO_SHORT_MAP[id]);
    const item = {
      id, name, lvl, count, owned: !!owned,
      group: groupInfo.group, category: groupInfo.category,
      aliases, iconLevel: id === 1000001 ? lvl : 0,
      locked: false, maxed: false, capped: false, unknownLevel: false,
      lockText: '', seconds: null, note: '',
      nextLvl: lvl > 0 ? lvl + 1 : 0
    };
    if (!entry) {
      item.note = '图鉴暂无时长';
      item.unknownLevel = !owned;
      return item;
    }

    const unlockTh = catalogUnlockLevel(id);
    if (th > 0 && unlockTh > 0 && unlockTh > th) {
      item.locked = true;
      item.lockText = `需${unlockTh}本`;
    }

    if (owned && lvl > 0) {
      const info = catalogLevelInfo(id, lvl);
      if (info && info.maxed) {
        item.maxed = true;
        item.lockText = '已满级';
      } else if (info) {
        item.seconds = info.seconds;
        if (th > 0) {
          const maxForTh = catalogMaxLevelForTH(id, th);
          if (maxForTh > 0 && lvl >= maxForTh) {
            item.capped = true;
            const need = Array.isArray(entry.th) ? Number(entry.th[lvl]) || 0 : 0;
            item.lockText = need ? `需${need}本` : '需更高大本';
          }
        }
      }
    } else if (!owned && !hasVillage) {
      item.unknownLevel = true;
      item.note = '未导入村庄，时长手动';
    } else if (!owned && !item.locked && (item.group === '建筑' || item.group === '陷阱' || item.group === '英雄')) {
      /* 大本已解锁但村庄里没有：按 1 级建造时间估算 */
      const build = Array.isArray(entry.times) ? Number(entry.times[0]) : NaN;
      item.seconds = Number.isFinite(build) ? build : null;
      item.note = '未建造';
    } else if (!owned && !item.locked) {
      item.locked = true;
      item.lockText = '未解锁';
    }

    item.nextLvl = item.unknownLevel ? 0 : (lvl > 0 ? lvl + 1 : 1);
    return item;
  }

  function buildTaskItemCandidates() {
    const acc = getActiveAccount();
    const village = acc && acc.village;
    const th = Number(acc && acc.townHallLevel) || 0;
    const hasVillage = !!village;
    const list = [];
    const ownedMap = new Map();

    const addOwned = item => {
      const id = Number(item.id);
      if (!id || id === 1000010 || id === 1000033 || id === 1000064) return;
      const lvl = Number(item.lvl) || 0;
      if (lvl <= 0) return;
      const count = Math.max(1, Number(item.count) || 1);
      const candidate = makeTaskItem(
        id,
        villageItemName(item) || `项目 #${id}`,
        lvl, count, true, th, hasVillage
      );
      if (!candidate) return;
      const key = id + '|' + lvl;
      if (ownedMap.has(key)) {
        ownedMap.get(key).count += count;
        return;
      }
      ownedMap.set(key, candidate);
      list.push(candidate);
    };

    if (village) {
      (village.mainBuildings || []).forEach(addOwned);
      (village.mainTraps || []).forEach(addOwned);
      (village.heroes || []).forEach(addOwned);
      (village.units || []).forEach(addOwned);
      (village.siege || []).forEach(addOwned);
      (village.spells || []).forEach(addOwned);
      (village.pets || []).forEach(addOwned);
    }

    /* 图鉴里有、村庄里没有的主世界项目：未建造或未解锁也允许搜到 */
    if (cocCatalog) {
      const ownedIds = new Set(list.map(item => item.id));
      catalogIdsWhere((entry, id) => {
        if (Number(entry.v) !== 0) return false;
        if (entry.cat === 'equipment') return false;
        if (id === 1000010) return false;
        if (!Array.isArray(entry.times) || !entry.times.length) return false;
        return !!taskItemGroup(id, entry.cat);
      }).forEach(id => {
        if (ownedIds.has(id)) return;
        const entry = catalogEntry(id);
        const candidate = makeTaskItem(id, entry.name, 0, 1, false, th, hasVillage);
        if (candidate) list.push(candidate);
      });
    }

    return list;
  }

  function taskItemScore(item, keyword) {
    const name = item.name.toLowerCase();
    if (name === keyword) return 0;
    if (name.startsWith(keyword)) return 1;
    if (name.includes(keyword)) return 2;
    for (let i = 0; i < item.aliases.length; i++) {
      const alias = String(item.aliases[i]).toLowerCase();
      if (alias === keyword) return 3;
      if (alias.startsWith(keyword)) return 4;
      if (alias.includes(keyword)) return 5;
    }
    if (item.group.includes(keyword)) return 6;
    return -1;
  }

  function searchTaskItems(rawKeyword) {
    const keyword = String(rawKeyword || '').trim().toLowerCase().replace(/\s+/g, '');
    const all = buildTaskItemCandidates();
    if (!keyword) {
      return all
        .filter(item => item.owned && !item.maxed && !item.locked && !item.capped)
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
        .slice(0, 12);
    }
    return all
      .map(item => ({ item, score: taskItemScore(item, keyword) }))
      .filter(row => row.score >= 0)
      .sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        const rank = row => (row.item.locked || row.item.capped ? 2 : row.item.maxed ? 1 : 0);
        if (rank(a) !== rank(b)) return rank(a) - rank(b);
        if (a.item.owned !== b.item.owned) return a.item.owned ? -1 : 1;
        return a.item.name.localeCompare(b.item.name, 'zh-Hans-CN');
      })
      .slice(0, TASK_ITEM_MAX_RESULTS)
      .map(row => row.item);
  }

  function taskItemDurationText(seconds) {
    if (seconds == null) return '';
    if (seconds <= 0) return '即刻';
    return formatDuration(seconds * 1000, seconds < 3600);
  }

  function taskItemSubText(item) {
    const parts = [];
    if (item.owned && item.lvl > 0) {
      const info = catalogLevelInfo(item.id, item.lvl);
      parts.push(`Lv.${item.lvl}${info && info.maxLevel ? `/${info.maxLevel}` : ''}`);
    } else if (item.unknownLevel) {
      parts.push('等级未知');
    } else if (!item.locked && (item.group === '建筑' || item.group === '陷阱' || item.group === '英雄')) {
      parts.push('未建造');
    }
    parts.push(item.group);
    if (item.maxed) {
      parts.push('已满级');
    } else if (item.locked || item.capped) {
      parts.push(item.lockText || '暂不可用');
    } else if (item.seconds != null) {
      parts.push(`${item.lvl > 0 ? `升${item.lvl + 1}级` : '建造'} ${taskItemDurationText(item.seconds)}`);
    } else if (item.note) {
      parts.push(item.note);
    } else {
      parts.push('时长需手动填写');
    }
    return parts.join(' · ');
  }

  function taskItemTag(item) {
    if (item.maxed) return { text: '满级', cls: 'lock' };
    if (item.locked || item.capped) return { text: item.lockText || '不可用', cls: 'lock' };
    if (item.unknownLevel) return { text: '时长手动', cls: 'note' };
    if (!item.owned) return { text: '未建造', cls: 'note' };
    if (item.seconds == null) return { text: '无时长', cls: 'note' };
    return { text: '可升级', cls: 'ok' };
  }

  function renderTaskItemResults() {
    const input = document.getElementById('formItemSearch');
    const box = document.getElementById('formItemResults');
    if (!input || !box) return;
    const keyword = input.value.trim();
    pickerMatches = searchTaskItems(keyword);
    pickerActiveIndex = -1;
    box.innerHTML = '';
    box.classList.remove('hidden');
    if (!pickerMatches.length) {
      box.appendChild(el('p', 'picker-empty', keyword
        ? '没有匹配项目，可直接手动填写名称和时长。'
        : '输入名称开始搜索。'));
      return;
    }
    pickerMatches.forEach((item, index) => {
      const unavailable = item.locked || item.capped || item.maxed;
      const row = el('button', 'picker-row');
      row.type = 'button';
      row.disabled = unavailable;
      row.dataset.index = String(index);
      row.appendChild(cocIcon(item.id, item.name, 20, item.iconLevel));
      const main = el('span', 'picker-main');
      const nameLine = el('span', 'picker-name', item.name);
      if (item.count > 1) nameLine.appendChild(el('span', 'picker-count', ` ×${item.count}`));
      main.appendChild(nameLine);
      main.appendChild(el('span', 'picker-sub', taskItemSubText(item)));
      row.appendChild(main);
      const tag = taskItemTag(item);
      row.appendChild(el('span', `picker-tag ${tag.cls}`, tag.text));
      row.addEventListener('mousedown', event => event.preventDefault());
      row.addEventListener('click', () => pickTaskItem(item));
      box.appendChild(row);
    });
    if (pickerMatches.length >= TASK_ITEM_MAX_RESULTS) {
      box.appendChild(el('p', 'picker-more', `仅显示前 ${TASK_ITEM_MAX_RESULTS} 项，继续输入可缩小范围。`));
    }
  }

  function closeTaskItemResults() {
    const box = document.getElementById('formItemResults');
    if (box) {
      box.classList.add('hidden');
      box.innerHTML = '';
    }
    pickerMatches = [];
    pickerActiveIndex = -1;
  }

  function movePickerActive(delta) {
    const rows = Array.from(document.querySelectorAll('#formItemResults .picker-row'));
    const enabled = rows.map((row, index) => (row.disabled ? -1 : index)).filter(index => index >= 0);
    if (!enabled.length) return;
    const current = enabled.indexOf(pickerActiveIndex);
    const next = current < 0
      ? (delta > 0 ? 0 : enabled.length - 1)
      : (current + delta + enabled.length) % enabled.length;
    pickerActiveIndex = enabled[next];
    rows.forEach((row, index) => row.classList.toggle('active', index === pickerActiveIndex));
    const activeRow = rows[pickerActiveIndex];
    if (activeRow && typeof activeRow.scrollIntoView === 'function') {
      activeRow.scrollIntoView({ block: 'nearest' });
    }
  }

  function fillTaskFormDuration(seconds) {
    const totalMinutes = Math.max(0, Math.ceil(Number(seconds) / 60));
    document.getElementById('formDays').value = Math.floor(totalMinutes / 1440);
    document.getElementById('formHours').value = Math.floor((totalMinutes % 1440) / 60);
    document.getElementById('formMinutes').value = totalMinutes % 60;
  }

  function pickTaskItem(item) {
    if (!item || item.locked || item.capped || item.maxed) return;
    const lvl = item.unknownLevel ? 0 : item.lvl;
    const nextLvl = item.unknownLevel ? 0 : (lvl > 0 ? lvl + 1 : 1);
    taskFormItem = {
      id: item.id,
      lvl,
      nextLvl,
      name: item.name,
      category: item.category
    };
    document.getElementById('formCategory').value = item.category;
    document.getElementById('formName').value = lvl > 0
      ? `${item.name} (${lvl}→${nextLvl}级)`
      : item.name;
    if (!item.unknownLevel && item.seconds != null) fillTaskFormDuration(item.seconds);
    document.getElementById('formItemSearch').value = '';
    closeTaskItemResults();
    renderPickedTaskItem(item);
  }

  function renderPickedTaskItem(item, opts) {
    const box = document.getElementById('formItemStatus');
    if (!box) return;
    const editing = !!(opts && opts.editing);
    box.innerHTML = '';
    box.className = 'item-picker-status is-picked';
    const line = el('span', 'picked-line');
    line.appendChild(cocIcon(item.id, item.name, 16, item.iconLevel || 0));
    const levelText = item.lvl > 0
      ? ` Lv.${item.lvl}→${item.nextLvl || item.lvl + 1}`
      : (item.unknownLevel ? '' : ' 未建造');
    let text = item.name + levelText;
    let warn = false;
    if (editing) {
      text += ' · 已关联图鉴';
    } else if (item.unknownLevel) {
      text += ' · 未导入村庄，请手动填写时长';
      warn = true;
    } else if (item.seconds == null) {
      text += ' · 图鉴无时长，请手动填写';
      warn = true;
    } else {
      text += ` · 时长已填入（${taskItemDurationText(item.seconds)}）`;
    }
    line.appendChild(el('span', 'picked-text', text));
    box.appendChild(line);
    if (warn) box.classList.add('is-warn');
    const clear = el('button', 'picked-clear', '取消关联');
    clear.type = 'button';
    clear.addEventListener('click', clearPickedTaskItem);
    box.appendChild(clear);
  }

  function clearPickedTaskItem() {
    taskFormItem = null;
    closeTaskItemResults();
    const search = document.getElementById('formItemSearch');
    if (search) search.value = '';
    setPickerStatus(pickerHintText());
  }

  function setPickerStatus(text) {
    const box = document.getElementById('formItemStatus');
    if (!box) return;
    box.innerHTML = '';
    box.className = 'item-picker-status' + (text ? '' : ' hidden');
    if (text) box.textContent = text;
  }

  function pickerHintText() {
    const acc = getActiveAccount();
    if (!acc || !acc.village) {
      return '当前账号未导入村庄数据：搜索只用于填名称和分类，升级时长需手动填写。';
    }
    if (!cocCatalog) return '图鉴加载中：可先搜索村庄项目，时长稍后可自动计算。';
    return '输入名称搜索主世界项目；选中后自动填写分类和升级时长。';
  }

  function taskItemFromTask(task) {
    const id = Number(task.itemId);
    if (!id) return null;
    const lvl = Number(task.lvl) || 0;
    const entry = catalogEntry(id);
    const groupInfo = taskItemGroup(id, entry ? entry.cat : undefined);
    return {
      id,
      name: taskDisplayName(task),
      lvl,
      nextLvl: Number(task.nextLvl) || (lvl > 0 ? lvl + 1 : 0),
      count: 1,
      owned: true,
      group: groupInfo ? groupInfo.group : '',
      category: task.category,
      aliases: [],
      iconLevel: id === 1000001 ? lvl : 0,
      locked: false,
      maxed: false,
      capped: false,
      unknownLevel: false,
      lockText: '',
      seconds: null,
      note: ''
    };
  }

  function applyTaskItemMeta(task, item) {
    if (!item) {
      delete task.itemId;
      delete task.lvl;
      delete task.nextLvl;
      return;
    }
    task.itemId = Number(item.id) || 0;
    task.lvl = Number(item.lvl) || 0;
    task.nextLvl = Number(item.nextLvl) || (task.lvl > 0 ? task.lvl + 1 : 0);
  }

  function handleTaskItemSearchKeydown(event) {
    const box = document.getElementById('formItemResults');
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!box || box.classList.contains('hidden')) renderTaskItemResults();
      else movePickerActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      movePickerActive(-1);
    } else if (event.key === 'Enter') {
      if (pickerActiveIndex >= 0 && pickerMatches[pickerActiveIndex]) {
        event.preventDefault();
        pickTaskItem(pickerMatches[pickerActiveIndex]);
      }
    } else if (event.key === 'Escape') {
      closeTaskItemResults();
    }
  }

  function openTaskForm(taskId) {
    editingTaskId = taskId || null;
    const acc = getActiveAccount();
    const catSel = document.getElementById('formCategory');
    const hint = document.getElementById('formHint');

    taskFormItem = null;
    closeTaskItemResults();
    const itemSearch = document.getElementById('formItemSearch');
    if (itemSearch) itemSearch.value = '';

    if (editingTaskId) {
      const task = acc.tasks.find(t => t.id === editingTaskId);
      if (!task) return;
      catSel.value = task.category;
      document.getElementById('formName').value = task.name;
      const remain = evaluateTask(acc, task, Date.now()).remainWorkMs;
      const totalMinutes = Math.ceil(remain / 60000);
      document.getElementById('formDays').value = Math.floor(totalMinutes / 1440);
      document.getElementById('formHours').value = Math.floor((totalMinutes % 1440) / 60);
      document.getElementById('formMinutes').value = totalMinutes % 60;
      editingInitialMinutes = totalMinutes;

      const linked = taskItemFromTask(task);
      if (linked) {
        taskFormItem = {
          id: linked.id,
          lvl: linked.lvl,
          nextLvl: linked.nextLvl,
          name: linked.name,
          category: linked.category
        };
        renderPickedTaskItem(linked, { editing: true });
      } else {
        setPickerStatus(pickerHintText());
      }

      const isDone = remain <= 0;
      hint.textContent = isDone ? '这是已完成任务：填入新一轮升级时长后，会从当前时间重新开始倒计时。' : '';
      hint.classList.toggle('hidden', !isDone);
    } else {
      catSel.value = 'builder';
      document.getElementById('formName').value = '';
      document.getElementById('formDays').value = 0;
      document.getElementById('formHours').value = 0;
      document.getElementById('formMinutes').value = 0;
      editingInitialMinutes = null;
      hint.classList.add('hidden');
      setPickerStatus(pickerHintText());
    }

    document.getElementById('taskEditTitle').textContent = editingTaskId ? '编辑任务' : '添加任务';
    document.getElementById('taskEditMask').classList.add('show');
    document.getElementById('formName').focus();
  }

  function closeTaskForm() {
    document.getElementById('taskEditMask').classList.remove('show');
    editingTaskId = null;
    editingInitialMinutes = null;
    taskFormItem = null;
    closeTaskItemResults();
    setPickerStatus('');
    const search = document.getElementById('formItemSearch');
    if (search) search.value = '';
  }

  function saveTask() {
    const acc = getActiveAccount();
    const category = document.getElementById('formCategory').value;
    const name = document.getElementById('formName').value.trim();
    const days = Math.max(0, Number(document.getElementById('formDays').value) || 0);
    const hours = Math.max(0, Number(document.getElementById('formHours').value) || 0);
    const minutes = Math.max(0, Number(document.getElementById('formMinutes').value) || 0);

    if (!name) { alert('请填写项目名称'); return; }
    const enteredMinutes = days * 1440 + hours * 60 + minutes;
    const durationMs = enteredMinutes * 60000;
    const now = Date.now();
    const linkedItem = taskFormItem && taskFormItem.category === category ? taskFormItem : null;

    /* 先把当前进度结算到 now，避免编辑时丢失加速期间已经推进的工期 */
    settleAccount(acc, now);

    if (editingTaskId) {
      const task = acc.tasks.find(t => t.id === editingTaskId);
      if (!task) return;
      if (category === 'builder') {
        /* 已完成任务重新计时时，原来的工人槽位可能已被别的任务占用 */
        if (task.category !== 'builder' || !task.slot || isBuilderSlotTaken(acc, task.slot, task.id)) {
          const slot = findFreeSlot(acc, task.id);
          if (slot === null) { alert('没有空闲工人，请先删除一个建筑任务。'); return; }
          task.slot = slot;
        }
      } else {
        delete task.slot;
      }
      task.name = name;
      task.category = category;
      applyTaskItemMeta(task, linkedItem);
      if (enteredMinutes !== editingInitialMinutes) {
        /* 用户改了时长：按新一轮升级从当前时刻重新计算 */
        task.durationMs = durationMs;
        task.remainWorkMs = durationMs;
        task.checkpointAt = now;
      }
    } else {
      let slot;
      if (category === 'builder') {
        slot = findFreeSlot(acc, null);
        if (slot === null) { alert('没有空闲工人，请先删除一个建筑任务。'); return; }
      }
      const task = {
        id: uid(),
        category,
        slot: category === 'builder' ? slot : undefined,
        name,
        durationMs,
        checkpointAt: now,
        remainWorkMs: durationMs,
        endTime: now + durationMs
      };
      applyTaskItemMeta(task, linkedItem);
      acc.tasks.push(task);
    }

    /* 重新推算预计完成时间（新任务/改分类后可能吃到当前生效的加速） */
    settleAccount(acc, now);
    saveState();
    closeTaskForm();
    renderAll();
  }

  /* ---------- 图鉴 ---------- */
  const CODEX_CATEGORIES = [
    { key: 'all', label: '全部' },
    { key: 'building', label: '建筑' },
    { key: 'trap', label: '陷阱' },
    { key: 'hero', label: '英雄' },
    { key: 'troop', label: '兵种' },
    { key: 'spell', label: '法术' },
    { key: 'siege', label: '攻城机器' },
    { key: 'pet', label: '战宠' },
    { key: 'equipment', label: '装备' }
  ];
  const CODEX_CATEGORY_LABELS = {
    building: '建筑', trap: '陷阱', hero: '英雄', troop: '兵种',
    spell: '法术', siege: '攻城机器', pet: '战宠', equipment: '装备'
  };
  const CODEX_CATEGORY_ORDER = {
    building: 0, trap: 1, hero: 2, troop: 3, spell: 4, siege: 5, pet: 6, equipment: 7
  };
  const CODEX_RESOURCES = {
    gold: { label: '金币', cls: 'gold' },
    gold2: { label: '建筑大师金币', cls: 'gold2' },
    elixir: { label: '圣水', cls: 'elixir' },
    elixir2: { label: '建筑大师圣水', cls: 'elixir2' },
    dark: { label: '暗黑重油', cls: 'dark' },
    gems: { label: '宝石', cls: 'gems' },
    common: { label: '闪亮矿石', cls: 'common' },
    rare: { label: '稀有矿石', cls: 'rare' },
    epic: { label: '史诗矿石', cls: 'epic' }
  };
  const CODEX_RARITY = {
    COMMON: '普通', RARE: '稀有', EPIC: '史诗', LEGENDARY: '传说'
  };

  function codexCategoryOf(id, entry) {
    if (!entry) return '';
    if (entry.cat === 'equipment') return 'equipment';
    if (entry.cat === 'pet') return 'pet';
    if (id >= 4000000 && id < 4100000) {
      return VILLAGE_SIEGE_IDS.has(id) ? 'siege' : 'troop';
    }
    if (entry.cat === 'research') {
      if (VILLAGE_SIEGE_IDS.has(id)) return 'siege';
      if (id >= 26000000 && id < 27000000) return 'spell';
      return 'troop';
    }
    if (entry.cat === 'builder') {
      if (id >= 28000000 && id < 29000000) return 'hero';
      if (id >= 12000000 && id < 13000000) return 'trap';
      return 'building';
    }
    return '';
  }

  function buildCodexIndex() {
    if (!cocCatalog) return [];
    const items = [];
    Object.keys(cocCatalog).forEach(key => {
      const id = Number(key);
      const entry = cocCatalog[key];
      const category = codexCategoryOf(id, entry);
      if (!category) return;
      const world = Number(entry.v) === 1 ? 1 : 0;
      const times = Array.isArray(entry.times) ? entry.times.map(value => Number(value) || 0) : [];
      const maxLevel = entry.cat === 'equipment'
        ? (Number(entry.maxLvl) || 0)
        : times.length;
      const start = entry.cat === 'equipment'
        ? 1
        : Math.max(1, Number(entry.start) || 1);
      const th = Array.isArray(entry.th) ? entry.th : [];
      const unlock = th.length
        ? Number(th[Math.min(start - 1, th.length - 1)]) || 0
        : 0;
      const aliases = (TASK_ITEM_ALIASES[id] || []).slice();
      if (HERO_SHORT_MAP[id]) aliases.push(HERO_SHORT_MAP[id]);
      const searchParts = [
        entry.name,
        CODEX_CATEGORY_LABELS[category],
        world === 1 ? '夜世界' : '主世界',
        entry.hero,
        CODEX_RARITY[entry.rarity],
        String(id)
      ].concat(aliases);
      items.push({
        id,
        entry,
        category,
        world,
        times,
        maxLevel,
        start,
        unlock,
        totalSeconds: times.reduce((sum, seconds) => sum + seconds, 0),
        name: entry.name || `项目 #${id}`,
        search: searchParts.filter(Boolean).join(' ').toLowerCase()
      });
    });
    return items;
  }

  function getCodexItems() {
    if (!codexItems && cocCatalog) codexItems = buildCodexIndex();
    return codexItems || [];
  }

  function codexSort(a, b) {
    if (codexCategory === 'all' && a.category !== b.category) {
      return CODEX_CATEGORY_ORDER[a.category] - CODEX_CATEGORY_ORDER[b.category];
    }
    if (a.category === 'equipment' && b.category === 'equipment') {
      const indexA = VILLAGE_EQUIPMENT_HERO_ORDER.indexOf(a.entry.hero || '');
      const indexB = VILLAGE_EQUIPMENT_HERO_ORDER.indexOf(b.entry.hero || '');
      const rankA = indexA < 0 ? 99 : indexA;
      const rankB = indexB < 0 ? 99 : indexB;
      if (rankA !== rankB) return rankA - rankB;
    }
    if (a.world !== b.world) return a.world - b.world;
    if (a.unlock !== b.unlock) return a.unlock - b.unlock;
    return a.name.localeCompare(b.name, 'zh-Hans-CN');
  }

  function codexFormatNumber(value) {
    const number = Number(value) || 0;
    if (number >= 100000000) return `${Number((number / 100000000).toFixed(1))}亿`;
    if (number >= 10000) return `${Number((number / 10000).toFixed(1))}万`;
    return number.toLocaleString('zh-CN');
  }

  function codexFormatTime(seconds) {
    const total = Number(seconds) || 0;
    if (total <= 0) return '';
    const totalMinutes = Math.round(total / 60);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days > 0) return hours > 0 ? `${days}天${hours}时` : `${days}天`;
    if (hours > 0) return minutes > 0 ? `${hours}时${minutes}分` : `${hours}时`;
    if (minutes > 0) return `${minutes}分`;
    return `${Math.round(total)}秒`;
  }

  function codexOwnedLevel(id) {
    const acc = getActiveAccount();
    const village = acc && acc.village;
    if (!village) return 0;
    let level = 0;
    [
      village.mainBuildings, village.mainTraps, village.heroes,
      village.units, village.siege, village.spells, village.pets, village.equipment,
      village.nightBuildings, village.nightTraps, village.nightHeroes, village.nightUnits
    ].forEach(list => {
      (list || []).forEach(item => {
        if (Number(item.id) === Number(id)) {
          level = Math.max(level, Number(item.lvl) || 0);
        }
      });
    });
    return level;
  }

  function codexMaxLevelForTH(item) {
    if (item.category !== 'building' && item.category !== 'trap' && item.category !== 'hero') {
      return 0;
    }
    const acc = getActiveAccount();
    const village = acc && acc.village;
    const th = item.world === 1
      ? Number(village && village.builderHallLevel) || 0
      : (Number(acc && acc.townHallLevel) || Number(village && village.townHallLevel) || 0);
    if (!th) return 0;
    const cap = catalogMaxLevelForTH(item.id, th);
    return cap > 0 ? Math.max(codexOwnedLevel(item.id), cap) : 0;
  }

  function codexCostChips(pairs) {
    if (!Array.isArray(pairs) || !pairs.length) {
      return el('span', 'codex-muted', '—');
    }
    const wrap = el('span', 'codex-costs');
    pairs.forEach(pair => {
      if (!Array.isArray(pair) || pair.length < 2) return;
      const key = pair[0];
      const amount = Number(pair[1]) || 0;
      if (!amount) return;
      const meta = CODEX_RESOURCES[key] || { label: key, cls: 'other' };
      const chip = el('span', `codex-cost res-${meta.cls}`);
      chip.appendChild(el('span', 'codex-cost-label', meta.label));
      chip.appendChild(el('span', 'codex-cost-amount', codexFormatNumber(amount)));
      wrap.appendChild(chip);
    });
    return wrap.childNodes.length ? wrap : el('span', 'codex-muted', '—');
  }

  function codexResourceSummary(entry) {
    const keys = new Set();
    (entry.costs || []).forEach(pairs => {
      (pairs || []).forEach(pair => {
        if (Array.isArray(pair) && pair[0]) keys.add(pair[0]);
      });
    });
    return Array.from(keys)
      .map(key => (CODEX_RESOURCES[key] || {}).label || key)
      .join(' / ');
  }

  function codexHasVaryingUnlock(item) {
    if (item.category === 'building' || item.category === 'trap' || item.category === 'hero') {
      return true;
    }
    const values = (item.entry.th || [])
      .slice(0, item.maxLevel)
      .map(value => Number(value) || 0);
    return new Set(values).size > 1;
  }

  function addCodexStat(container, label, value) {
    const stat = el('div', 'codex-stat');
    stat.appendChild(el('span', 'codex-stat-label', label));
    stat.appendChild(el('span', 'codex-stat-value', value));
    container.appendChild(stat);
  }

  function renderCodexLevelTable(item, ownedLevel, worldCap) {
    const wrap = el('div', 'codex-levels');
    const table = el('table');
    const showUnlock = item.category !== 'equipment' && codexHasVaryingUnlock(item);
    const headers = item.category === 'equipment'
      ? ['等级', '矿石费用']
      : (showUnlock ? ['等级', '升到该级耗时', '费用', '解锁'] : ['等级', '升到该级耗时', '费用']);
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headers.forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const firstLevel = Math.max(1, Math.min(item.start || 1, item.maxLevel || 1));
    for (let level = firstLevel; level <= item.maxLevel; level++) {
      const index = level - 1;
      const row = document.createElement('tr');
      if (ownedLevel === level) row.className = 'is-owned';
      if (worldCap && level > worldCap) row.classList.add('beyond-cap');

      const levelCell = document.createElement('td');
      levelCell.appendChild(document.createTextNode(String(level)));
      if (ownedLevel === level) levelCell.appendChild(el('span', 'codex-level-badge', '当前'));
      row.appendChild(levelCell);

      if (item.category !== 'equipment') {
        const seconds = item.times[index] || 0;
        let timeText = '即刻';
        if (seconds > 0) timeText = codexFormatTime(seconds);
        else if (level === 1 && item.category !== 'building' && item.category !== 'trap') {
          timeText = '解锁';
        }
        const timeCell = document.createElement('td');
        timeCell.className = seconds > 0 ? '' : 'codex-muted';
        timeCell.textContent = timeText;
        row.appendChild(timeCell);
      }

      const costCell = document.createElement('td');
      costCell.appendChild(codexCostChips(item.entry.costs && item.entry.costs[index]));
      row.appendChild(costCell);

      if (showUnlock) {
        const need = Array.isArray(item.entry.th) ? Number(item.entry.th[index]) || 0 : 0;
        const unlockCell = document.createElement('td');
        unlockCell.className = need ? '' : 'codex-muted';
        unlockCell.textContent = need ? `${item.world === 1 ? 'BH' : 'TH'} ${need}` : '—';
        row.appendChild(unlockCell);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    wrap.appendChild(table);

    if (ownedLevel > 0) {
      requestAnimationFrame(() => {
        const row = wrap.querySelector('tr.is-owned');
        if (!row) return;
        wrap.scrollTop = Math.max(0, row.offsetTop - Math.round(wrap.clientHeight / 2));
      });
    }
    return wrap;
  }

  function renderCodexDetail() {
    const pane = document.getElementById('codexDetail');
    if (!pane) return;
    pane.innerHTML = '';
    const item = codexSelectedId
      ? getCodexItems().find(entry => String(entry.id) === codexSelectedId)
      : null;
    if (!item) {
      const empty = el('div', 'codex-detail-empty');
      empty.appendChild(el('div', 'codex-detail-empty-icon', '📖'));
      empty.appendChild(el('p', '', '选择项目查看升级时间与费用'));
      pane.appendChild(empty);
      return;
    }

    const back = el('button', 'codex-detail-back', '← 返回列表');
    back.type = 'button';
    back.addEventListener('click', closeCodexDetail);
    pane.appendChild(back);

    const head = el('div', 'codex-detail-hero');
    head.appendChild(cocIcon(item.id, item.name, 58, 0));
    const title = el('div', 'codex-detail-title');
    title.appendChild(el('h3', '', item.name));
    const chips = el('div', 'codex-chips');
    chips.appendChild(el('span', 'codex-chip', CODEX_CATEGORY_LABELS[item.category]));
    chips.appendChild(el('span', 'codex-chip world', item.world === 1 ? '夜世界' : '主世界'));
    if (item.entry.hero) chips.appendChild(el('span', 'codex-chip hero', item.entry.hero));
    if (item.entry.rarity) {
      chips.appendChild(el('span', 'codex-chip rarity',
        CODEX_RARITY[item.entry.rarity] || item.entry.rarity));
    }
    title.appendChild(chips);
    head.appendChild(title);
    pane.appendChild(head);

    const ownedLevel = codexOwnedLevel(item.id);
    const worldCap = codexMaxLevelForTH(item);
    const stats = el('div', 'codex-stats');
    addCodexStat(stats, '最高等级', `Lv.${item.maxLevel}`);
    if (item.category === 'equipment') {
      addCodexStat(stats, '升级耗时', '不耗时');
      addCodexStat(stats, '铁匠铺', item.entry.smith ? `Lv.${item.entry.smith}` : '—');
      addCodexStat(stats, '你的等级', ownedLevel ? `Lv.${ownedLevel}` : '未拥有');
    } else {
      if (item.category === 'building' || item.category === 'trap' || item.category === 'hero') {
        addCodexStat(stats, '解锁',
          item.unlock ? `${item.world === 1 ? 'BH' : 'TH'} ${item.unlock}` : '—');
        if (worldCap > 0) addCodexStat(stats, '当前大本上限', `Lv.${worldCap}`);
      } else {
        addCodexStat(stats, '升级场所', item.category === 'pet' ? '战宠小屋' : '实验室');
      }
      addCodexStat(stats, '升级总时长', codexFormatTime(item.totalSeconds) || '—');
      addCodexStat(stats, '你的等级', ownedLevel ? `Lv.${ownedLevel}` : '未拥有');
      addCodexStat(stats, '费用资源', codexResourceSummary(item.entry) || '—');
    }
    pane.appendChild(stats);
    pane.appendChild(renderCodexLevelTable(item, ownedLevel, worldCap));
    const capNote = worldCap > 0 && worldCap < item.maxLevel ? '；灰色等级为当前大本尚未解锁' : '';
    const note = item.category === 'equipment'
      ? '装备升级不耗时，消耗矿石；费用来自游戏 CSV。'
      : (item.start > 1
        ? `该项目从 Lv.${item.start} 开始；时间为升到该等级所需；费用来自游戏 CSV${capNote}。`
        : `时间为升到该等级所需，1 级为建造 / 解锁；费用来自游戏 CSV${capNote}。`);
    pane.appendChild(el('p', 'codex-note', note));
  }

  function createCodexCard(item) {
    const card = el('button', 'codex-card');
    card.type = 'button';
    card.dataset.id = String(item.id);
    if (String(item.id) === codexSelectedId) card.classList.add('active');
    card.appendChild(cocIcon(item.id, item.name, 40, 0));
    const main = el('span', 'codex-card-main');
    main.appendChild(el('span', 'codex-card-name', item.name));
    main.appendChild(el('span', 'codex-card-meta',
      `${CODEX_CATEGORY_LABELS[item.category]} · ${item.world === 1 ? '夜世界' : '主世界'}`));
    const unlockText = item.category === 'equipment'
      ? (item.entry.hero || '装备')
      : (item.category === 'building' || item.category === 'trap' || item.category === 'hero'
        ? `${item.world === 1 ? 'BH' : 'TH'} ${item.unlock || '?'}`
        : '');
    main.appendChild(el('span', 'codex-card-meta codex-card-max',
      unlockText ? `最高 Lv.${item.maxLevel} · ${unlockText}` : `最高 Lv.${item.maxLevel}`));
    card.appendChild(main);
    card.appendChild(el('span', 'codex-card-chevron', '›'));
    card.addEventListener('click', () => selectCodexItem(item.id));
    return card;
  }

  function renderCodexTabs(searched) {
    const tabs = document.getElementById('codexTabs');
    if (!tabs) return;
    tabs.innerHTML = '';
    CODEX_CATEGORIES.forEach(category => {
      const count = category.key === 'all'
        ? searched.length
        : searched.filter(item => item.category === category.key).length;
      const button = el('button', 'codex-tab' + (codexCategory === category.key ? ' active' : ''));
      button.type = 'button';
      button.appendChild(el('span', '', category.label));
      button.appendChild(el('span', 'codex-tab-count', String(count)));
      button.addEventListener('click', () => {
        codexCategory = category.key;
        renderCodex();
      });
      tabs.appendChild(button);
    });
  }

  function renderCodex() {
    const grid = document.getElementById('codexGrid');
    const countNode = document.getElementById('codexCount');
    if (!grid) return;
    if (!cocCatalog) {
      renderCodexTabs([]);
      grid.innerHTML = '<p class="codex-empty">图鉴加载中…</p>';
      if (countNode) countNode.textContent = '';
      renderCodexDetail();
      return;
    }

    const keyword = codexKeyword.trim().toLowerCase().replace(/\s+/g, '');
    const all = getCodexItems();
    const scoped = all.filter(item => codexWorld === 'all' || String(item.world) === codexWorld);
    const searched = scoped.filter(item => !keyword || item.search.includes(keyword));
    renderCodexTabs(searched);

    let items = searched;
    if (codexCategory !== 'all') {
      items = items.filter(item => item.category === codexCategory);
    }
    items = items.slice().sort(codexSort);

    if (countNode) {
      countNode.textContent = keyword
        ? `筛选结果 ${items.length} 项`
        : `共 ${items.length} 项`;
    }

    grid.innerHTML = '';
    if (!items.length) {
      grid.appendChild(el('p', 'codex-empty', '没有匹配项目，试试其他关键词或分类。'));
    } else {
      const fragment = document.createDocumentFragment();
      items.forEach(item => fragment.appendChild(createCodexCard(item)));
      grid.appendChild(fragment);
    }

    if (codexSelectedId && !items.some(item => String(item.id) === codexSelectedId)) {
      codexSelectedId = '';
      const modal = document.querySelector('.codex-modal');
      if (modal) modal.classList.remove('detail-open');
    }
    renderCodexDetail();
  }

  function selectCodexItem(id) {
    codexSelectedId = String(id);
    const modal = document.querySelector('.codex-modal');
    if (modal) modal.classList.add('detail-open');
    document.querySelectorAll('#codexGrid .codex-card').forEach(card => {
      card.classList.toggle('active', card.dataset.id === codexSelectedId);
    });
    renderCodexDetail();
  }

  function closeCodexDetail() {
    codexSelectedId = '';
    const modal = document.querySelector('.codex-modal');
    if (modal) modal.classList.remove('detail-open');
    document.querySelectorAll('#codexGrid .codex-card.active').forEach(card => {
      card.classList.remove('active');
    });
    renderCodexDetail();
  }

  function openCodex() {
    codexCategory = 'all';
    codexWorld = 'all';
    codexKeyword = '';
    codexSelectedId = '';
    const search = document.getElementById('codexSearch');
    if (search) search.value = '';
    document.querySelectorAll('#codexWorlds button').forEach(button => {
      button.classList.toggle('active', button.dataset.world === 'all');
    });
    const modal = document.querySelector('.codex-modal');
    if (modal) modal.classList.remove('detail-open');
    document.getElementById('codexMask').classList.add('show');
    if (!cocCatalog) loadCocCatalog();
    renderCodex();
  }

  function closeCodex() {
    document.getElementById('codexMask').classList.remove('show');
    closeCodexDetail();
  }

  function setCodexWorld(world) {
    codexWorld = world;
    document.querySelectorAll('#codexWorlds button').forEach(button => {
      button.classList.toggle('active', button.dataset.world === world);
    });
    renderCodex();
  }

  // ---------- 账号操作 ----------
  function addAccount() {
    const acc = {
      id: uid(), name: `账号 ${state.accounts.length + 1}`, townHallLevel: 1, builderCount: 6,
      builderApprenticeLevel: 0, labAssistantLevel: 0,
      builderApprenticeAutoContinue: false, labAssistantAutoContinue: false,
      builderApprenticeCooldownEnd: 0, labAssistantCooldownEnd: 0,
      boosts: [],
      village: null,
      tasks: []
    };
    state.accounts.push(acc);
    state.activeAccountId = acc.id;
    /* 新增账号后回到全部视图，避免新卡片被当前筛选隐藏 */
    filterAccountId = '';
    localStorage.removeItem(FILTER_KEY);
    saveState();
    closeTaskForm();
    renderAll();
    const nameInput = document.getElementById('cfgAccountName');
    nameInput.focus();
    nameInput.select();
  }

  function deleteAccount() {
    if (state.accounts.length <= 1) { alert('至少保留一个账号。'); return; }
    const acc = getActiveAccount();
    if (!confirm(`确定删除账号「${acc.name}」及其所有倒计时吗？`)) return;
    state.accounts = state.accounts.filter(a => a.id !== acc.id);
    state.activeAccountId = state.accounts[0].id;
    saveState();
    closeTaskForm();
    renderAll();
  }

  function changeBuilderCount(val) {
    const n = Math.min(6, Math.max(1, parseInt(val, 10) || 6));
    const acc = getActiveAccount();
    acc.builderCount = n;
    acc.tasks = acc.tasks.filter(t => t.category !== 'builder' || t.slot <= n);
    settleAccount(acc, Date.now());
    saveState();
    closeTaskForm();
    renderAll();
  }

  function moveActiveAccount(delta) {
    const acc = getActiveAccount();
    const idx = state.accounts.findIndex(a => a.id === acc.id);
    const target = idx + delta;
    if (target < 0 || target >= state.accounts.length) return;
    state.accounts.splice(idx, 1);
    state.accounts.splice(target, 0, acc);
    saveState();
    renderCards();
    renderAccountSelect();
  }

  // ---------- 导入导出 ----------
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coc_countdown_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = normalizeState(JSON.parse(e.target.result));
        if (!confirm('导入将覆盖当前所有数据，确定继续吗？')) return;
        state = parsed;
        saveState();
        closeTaskForm();
        renderAll();
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // ---------- 导入辅助 ----------
  function clampInt(value, min, max, fallback) {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function parseAiPayload(raw) {
    let text = String(raw || '').trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) text = text.slice(start, end + 1);
    return JSON.parse(text);
  }

  // ---------- 游戏导出 JSON 导入 ----------
  function buildVillageFromExport(data, now, elapsedMs) {
    const array = value => Array.isArray(value) ? value : [];
    const thItem = array(data.buildings).find(b => Number(b.data) === 1000001);
    const bhItem = array(data.buildings2).find(b => Number(b.data) === 1000034);

    const timerEndAt = item => {
      const sec = Number(item.timer);
      if (!Number.isFinite(sec) || sec <= 0) return 0;
      const remain = Math.max(0, sec * 1000 - elapsedMs);
      return remain > 0 ? now + remain : 0;
    };
    const buildingItems = (source, prefix, map) => array(source)
      .map(item => ({
        id: Number(item.data),
        name: cocName(item.data, prefix, map),
        lvl: Number(item.lvl) || 0,
        count: Number(item.cnt) || 1,
        endAt: timerEndAt(item)
      }))
      .filter(item => item.lvl > 0 || item.count > 1 || item.endAt > 0);

    const heroes = array(data.heroes).map(h => ({
      id: Number(h.data), name: cocName(h.data, '英雄'), lvl: Number(h.lvl) || 0, endAt: timerEndAt(h)
    }));
    const nightHeroes = array(data.heroes2).map(h => ({
      id: Number(h.data), name: cocName(h.data, '夜世界英雄', COC_NIGHT_HERO_MAP),
      lvl: Number(h.lvl) || 0, endAt: timerEndAt(h)
    }));
    const pets = array(data.pets).map(p => ({
      id: Number(p.data), name: cocName(p.data, '战宠'), lvl: Number(p.lvl) || 0, endAt: timerEndAt(p)
    }));
    const units = array(data.units).map(u => ({
      id: Number(u.data), name: cocName(u.data, '兵种'), lvl: Number(u.lvl) || 0, endAt: timerEndAt(u)
    }));
    const spells = array(data.spells).map(s => ({
      id: Number(s.data), name: cocName(s.data, '法术'), lvl: Number(s.lvl) || 0, endAt: timerEndAt(s)
    }));
    const siege = array(data.siege_machines).map(s => ({
      id: Number(s.data), name: cocName(s.data, '攻城机器'), lvl: Number(s.lvl) || 0, endAt: timerEndAt(s)
    }));
    const equipment = array(data.equipment).map(e => ({
      id: Number(e.data), name: cocName(e.data, '装备'), lvl: Number(e.lvl) || 0
    }));

    const mainBuildings = buildingItems(data.buildings, '建筑', COC_NAME_MAP);
    const mainTraps = buildingItems(data.traps, '陷阱', null);
    const nightBuildings = buildingItems(data.buildings2, '夜世界建筑', COC_NIGHT_BUILDING_MAP);
    const nightTraps = buildingItems(data.traps2, '夜世界陷阱', COC_NIGHT_TRAP_MAP);
    const nightUnits = buildingItems(data.units2, '夜世界兵种', COC_NIGHT_TROOP_MAP);

    const nightUpgrades = [];
    const pushNightTimer = (item, category, map, prefix) => {
      const endAt = timerEndAt(item);
      if (!endAt) return;
      nightUpgrades.push({
        id: Number(item.data),
        name: cocName(item.data, prefix, map),
        category,
        lvl: Number(item.lvl) || 0,
        endAt
      });
    };
    array(data.buildings2).forEach(item => pushNightTimer(item, '建筑', COC_NIGHT_BUILDING_MAP, '夜世界建筑'));
    array(data.units2).forEach(item => pushNightTimer(item, '兵种', COC_NIGHT_TROOP_MAP, '夜世界兵种'));
    array(data.traps2).forEach(item => pushNightTimer(item, '陷阱', COC_NIGHT_TRAP_MAP, '夜世界陷阱'));

    return {
      tag: typeof data.tag === 'string' ? data.tag : '',
      importedAt: now,
      townHallLevel: thItem ? clampInt(thItem.lvl, 1, 19, 0) : 0,
      builderHallLevel: bhItem ? Number(bhItem.lvl) || 0 : 0,
      builderHallUpgrading: !!(bhItem && Number(bhItem.timer) > 0),
      mainBuildings,
      mainTraps,
      nightBuildings,
      nightTraps,
      nightUnits,
      heroes,
      nightHeroes,
      pets,
      units,
      spells,
      siege,
      equipment,
      equipmentCount: equipment.length,
      equipmentMax: equipment.length ? Math.max(...equipment.map(e => e.lvl)) : 0,
      nightUpgrades
    };
  }

  function setCocExportStatus(text, isError) {
    const node = document.getElementById('cocExportStatus');
    if (!node) return;
    node.textContent = text || '';
    node.classList.toggle('is-error', !!isError);
  }

  function importCocExportData() {
    const raw = document.getElementById('cocExportInput').value.trim();
    if (!raw) {
      setCocExportStatus('请先粘贴游戏导出的 JSON。', true);
      return;
    }

    let data;
    try {
      data = parseAiPayload(raw);
    } catch (err) {
      setCocExportStatus('JSON 解析失败：' + err.message, true);
      return;
    }
    if (!data || !Array.isArray(data.buildings)) {
      setCocExportStatus('格式不匹配：未找到 buildings 字段，请确认是游戏内复制的村庄导出 JSON。', true);
      return;
    }

    const now = Date.now();
    const rawTs = Number(data.timestamp);
    const exportMs = rawTs > 1e12 ? rawTs : rawTs * 1000;
    const elapsedMs = Number.isFinite(exportMs) && exportMs <= now && (now - exportMs) < 7 * DAY_MS
      ? now - exportMs
      : 0;
    const overwriteTasks = document.getElementById('cocExportOverwriteTasks').checked;

    const thItem = data.buildings.find(b => Number(b.data) === 1000001);
    const thLevel = thItem ? clampInt(thItem.lvl, 1, 19, 0) : 0;

    let hutCount = 0;
    let hasBob = false;
    data.buildings.forEach(b => {
      if (Number(b.data) === 1000015) hutCount += (Number(b.cnt) || 1);
      if (Number(b.data) === 1000084) hasBob = true;
    });

    const tasks = [];
    let builderSlot = 1;
    let recurrentTaskId = null;
    const pushTimer = (item, category, prefix) => {
      const timerSec = Number(item.timer);
      if (!Number.isFinite(timerSec) || timerSec <= 0) return;
      const remainMs = Math.max(0, timerSec * 1000 - elapsedMs);
      if (remainMs <= 0) return;
      const itemLevel = Number(item.lvl) || 0;
      const levelInfo = catalogLevelInfo(item.data, itemLevel);
      const fullMs = levelInfo && levelInfo.seconds ? levelInfo.seconds * 1000 : remainMs;
      const task = {
        id: uid(),
        category,
        name: cocItemName(item.data, prefix, itemLevel),
        itemId: Number(item.data),
        lvl: itemLevel,
        nextLvl: itemLevel > 0 ? itemLevel + 1 : 0,
        durationMs: Math.max(remainMs, fullMs),
        checkpointAt: now,
        remainWorkMs: remainMs,
        endTime: now + remainMs
      };
      if (category === 'builder') {
        task.slot = builderSlot++;
        if (item.helper_recurrent) recurrentTaskId = task.id;
      }
      tasks.push(task);
    };

    data.buildings.forEach(item => pushTimer(item, 'builder', '建筑'));
    (data.heroes || []).forEach(item => pushTimer(item, 'builder', '英雄'));
    (data.units || []).forEach(item => pushTimer(item, 'research', '兵种'));
    (data.siege_machines || []).forEach(item => pushTimer(item, 'research', '攻城机器'));
    (data.spells || []).forEach(item => pushTimer(item, 'research', '法术'));
    (data.pets || []).forEach(item => pushTimer(item, 'pet', '战宠'));
    (data.traps || []).forEach(item => pushTimer(item, 'builder', '陷阱'));

    const builderCount = clampInt(
      Math.max(hutCount + (hasBob ? 1 : 0), builderSlot - 1),
      1, 6, 5
    );

    const helpers = Array.isArray(data.helpers) ? data.helpers : [];
    const ba = helpers.find(h => Number(h.data) === 124000000);
    const la = helpers.find(h => Number(h.data) === 124000001);
    const baCooldownMs = ba ? Math.max(0, (Number(ba.helper_cooldown) || 0) * 1000 - elapsedMs) : 0;
    const laCooldownMs = la ? Math.max(0, (Number(la.helper_cooldown) || 0) * 1000 - elapsedMs) : 0;

    const acc = getActiveAccount();
    const village = buildVillageFromExport(data, now, elapsedMs);

    if (thLevel) acc.townHallLevel = thLevel;
    acc.builderCount = builderCount;
    if (overwriteTasks) acc.tasks = tasks;

    acc.builderApprenticeLevel = ba ? clampInt(ba.lvl, 0, 8, 0) : 0;
    acc.labAssistantLevel = la ? clampInt(la.lvl, 0, 12, 0) : 0;
    acc.builderApprenticeCooldownEnd = baCooldownMs > 0 ? now + baCooldownMs : 0;
    acc.labAssistantCooldownEnd = laCooldownMs > 0 ? now + laCooldownMs : 0;

    const targetId = overwriteTasks ? recurrentTaskId : null;
    acc.builderApprenticeAutoContinue = !!(targetId && acc.builderApprenticeLevel > 0);
    acc.labAssistantAutoContinue = false;
    acc.village = village;

    /* 只替换学徒/助手相关的加速，保留手动加的药水和自定义加速 */
    acc.boosts = (acc.boosts || []).filter(b =>
      b.kind !== 'builder_apprentice' && b.kind !== 'lab_assistant'
    );
    if (targetId) {
      const nextStart = baCooldownMs > 0 ? now + baCooldownMs : now;
      acc.boosts.push({
        id: uid(),
        kind: 'builder_apprentice',
        scope: 'task',
        taskId: targetId,
        extraRate: acc.builderApprenticeLevel,
        startTime: baCooldownMs > 0 ? nextStart - DAY_MS : now,
        endTime: baCooldownMs > 0 ? nextStart - APPRENTICE_COOLDOWN_MS : now + APPRENTICE_WORK_MS,
        autoContinue: true
      });
    }

    settleAccount(acc, now);
    saveState();
    renderAll();
    document.getElementById('cocExportInput').value = '';

    const parts = [];
    if (thLevel) parts.push(`${thLevel} 本`);
    if (village.builderHallLevel) parts.push(`夜世界 ${village.builderHallLevel} 本`);
    parts.push(overwriteTasks ? `导入 ${tasks.length} 个任务` : `保留 ${acc.tasks.length} 个任务`);
    if (baCooldownMs > 0) parts.push(`学徒冷却 ${formatDuration(baCooldownMs)}`);
    setCocExportStatus(`已导入：${parts.join(' · ')}`, false);
  }

  // ---------- 村落数据展示 ----------
  function villageHasFullImport(v) {
    return !!(v && ((Array.isArray(v.mainBuildings) && v.mainBuildings.length) ||
      (Array.isArray(v.nightBuildings) && v.nightBuildings.length)));
  }

  /* 合并游戏导出数据与图鉴：
     导出里有的 = 有等级记录；图鉴里缺的：
       - 建筑/陷阱按图鉴 1 级所需本数判断：本数够 = 未建造，不够 = 未解锁
       - 兵种/法术/英雄/战宠解锁后自动 1 级，缺失即未解锁
       - 装备导出没有“已拥有”标记，缺失按未解锁处理（普通装备显示铁匠铺等级） */
  function villageWithCatalog(owned, ids, opts) {
    const options = opts || {};
    const items = [];
    const seen = new Set();
    (Array.isArray(owned) ? owned : []).forEach(item => {
      if (!item) return;
      const id = Number(item.id);
      if (!id) return;
      if (!(Number(item.lvl) > 0 || Number(item.count) > 1 || Number(item.endAt) > 0)) return;
      seen.add(id);
      const lvl = Number(item.lvl) || 0;
      const capForTh = options.th ? catalogMaxLevelForTH(id, Number(options.th) || 0) : 0;
      items.push({
        ...item,
        state: 'owned',
        cap: capForTh ? Math.max(lvl, capForTh) : 0
      });
    });
    if (!cocCatalog || !Array.isArray(ids)) return items;

    const missing = [];
    ids.forEach(id => {
      const key = Number(id);
      if (!key || seen.has(key)) return;
      const entry = catalogEntry(key);
      if (!entry) return;
      const need = options.building ? catalogUnlockLevel(key) : 0;
      const locked = options.building
        ? (Number(options.th) > 0 && need > Number(options.th))
        : true;
      missing.push({
        id: key,
        name: entry.name,
        lvl: 0,
        need,
        smith: Number(entry.smith) || 0,
        state: locked ? 'locked' : 'unbuilt'
      });
    });
    missing.sort((a, b) => {
      if (a.state !== b.state) return a.state === 'unbuilt' ? -1 : 1;
      return (a.need - b.need) || (a.id - b.id);
    });
    return items.concat(missing);
  }

  function villageCatalogStats(items) {
    const stats = { owned: 0, unbuilt: 0, locked: 0, total: 0 };
    (items || []).forEach(item => {
      if (!item) return;
      stats.total++;
      if (item.state === 'locked') stats.locked++;
      else if (item.state === 'unbuilt') stats.unbuilt++;
      else stats.owned++;
    });
    return stats;
  }

  function villageLockText(item) {
    const entry = catalogEntry(item.id);
    /* 普通装备是铁匠铺等级解锁；史诗/传说装备来自活动，缺失只能说未获得 */
    if (item.smith && (!entry || entry.rarity === 'COMMON')) return `铁匠铺 ${item.smith} 级`;
    if (item.need) return `${item.need} 本解锁`;
    if (entry && entry.cat === 'equipment') return '未获得';
    return '未解锁';
  }

  const VILLAGE_AMBIGUOUS_EQUIP_TIP = '导出没有装备“已拥有”标记：Lv.1 可能是已拥有未升级，也可能是未获得';

  function villageMetaText(item) {
    const text = item.extra != null ? item.extra : villageLevelText(item);
    const entry = catalogEntry(item.id);
    if (entry && entry.cat === 'equipment' && Number(item.lvl) === 1) {
      return { text: `${text} ?`, ambiguous: true };
    }
    return { text, ambiguous: false };
  }

  function villageItem(item) {
    const state = item.state || 'owned';
    const node = el('div', 'village-item');
    if (state === 'locked') node.classList.add('locked');
    else if (state === 'unbuilt') node.classList.add('unbuilt');
    const name = villageItemName(item);
    const iconLevel = Number(item.id) === 1000001 ? Number(item.lvl) : 0;
    if (item.id) node.appendChild(cocIcon(item.id, name, 20, iconLevel));
    const nameEl = el('span', 'vname', state === 'locked' ? `🔒 ${name}` : name);
    nameEl.title = name;
    node.appendChild(nameEl);

    if (state === 'locked') {
      node.appendChild(el('span', 'vlvl', villageLockText(item)));
    } else if (state === 'unbuilt') {
      node.appendChild(el('span', 'vlvl', '未建造'));
    } else {
      const meta = villageMetaText(item);
      if (meta.text) {
        const metaEl = el('span', 'vlvl', meta.text);
        if (meta.ambiguous) metaEl.title = VILLAGE_AMBIGUOUS_EQUIP_TIP;
        node.appendChild(metaEl);
      }
      if (item.endAt) {
        const cd = el('span', 'village-cd');
        cd.dataset.end = String(item.endAt);
        cd.textContent = formatDuration(item.endAt - Date.now(), true);
        node.appendChild(cd);
      }
      const next = villageNextText(item);
      if (next) node.appendChild(el('span', 'village-next', next));
    }
    return node;
  }

  function villageGridNode(items, detail) {
    const grid = el('div', detail ? 'village-detail-grid' : 'village-grid');
    items.forEach(item => grid.appendChild(detail ? villageDetailRow(item) : villageItem(item)));
    return grid;
  }

  function renderVillageItems(parent, title, items, detail) {
    if (!items || !items.length) return;
    const section = el('section', 'village-section');
    section.appendChild(el('h4', null, title));
    const visible = items.filter(item => item.state !== 'locked');
    const locked = items.filter(item => item.state === 'locked');
    if (visible.length) section.appendChild(villageGridNode(visible, detail));
    if (locked.length) {
      const lockedWrap = el('div', 'village-locked');
      lockedWrap.appendChild(el('div', 'village-locked-title', `🔒 未解锁 ${locked.length}`));
      lockedWrap.appendChild(villageGridNode(locked, detail));
      section.appendChild(lockedWrap);
    }
    parent.appendChild(section);
  }

  function renderVillageGrid(parent, title, items) {
    renderVillageItems(parent, title, items, false);
  }

  function villageDetailRow(item) {
    const state = item.state || 'owned';
    const row = el('div', 'village-detail');
    if (state === 'locked') row.classList.add('locked');
    else if (state === 'unbuilt') row.classList.add('unbuilt');
    const top = el('div', 'village-detail-top');
    const name = villageItemName(item);
    const iconLevel = Number(item.id) === 1000001 ? Number(item.lvl) : 0;
    if (item.id) top.appendChild(cocIcon(item.id, name, 22, iconLevel));
    const nameEl = el('span', 'vname', state === 'locked' ? `🔒 ${name}` : name);
    nameEl.title = name;
    top.appendChild(nameEl);

    if (state === 'locked') {
      top.appendChild(el('span', 'vmeta', villageLockText(item)));
    } else if (state === 'unbuilt') {
      top.appendChild(el('span', 'vmeta', '未建造'));
    } else {
      const meta = villageMetaText(item);
      if (meta.text) {
        const metaEl = el('span', 'vmeta', meta.text);
        if (meta.ambiguous) metaEl.title = VILLAGE_AMBIGUOUS_EQUIP_TIP;
        top.appendChild(metaEl);
      }
    }
    row.appendChild(top);

    if (state === 'owned') {
      if (item.endAt) {
        const time = el('div', 'village-detail-time');
        const cd = el('span', 'village-cd');
        cd.dataset.end = String(item.endAt);
        cd.textContent = formatDuration(item.endAt - Date.now(), true);
        time.appendChild(cd);
        time.appendChild(el('span', 'village-finish', formatFinishTime(item.endAt)));
        row.appendChild(time);
      }
      const next = villageNextText(item);
      if (next) row.appendChild(el('span', 'village-detail-next', next));
    }
    return row;
  }

  function renderVillageDetailGrid(parent, title, items) {
    renderVillageItems(parent, title, items, true);
  }

  function renderVillageUpgradeRows(parent, title, items) {
    if (!items || !items.length) return;
    const section = el('section', 'village-section');
    section.appendChild(el('h4', null, title));
    const list = el('div', 'village-upgrades');
    items.forEach(item => {
      const row = el('div', 'village-upgrade');
      row.appendChild(el('span', 'vcat', item.category || '升级'));
      row.appendChild(el('span', 'vname',
        `${villageItemName(item)}${item.lvl ? ` (${item.lvl}→${item.lvl + 1}级)` : ''}`));
      const cd = el('span', 'village-cd');
      cd.dataset.end = String(item.endAt);
      cd.textContent = formatDuration(item.endAt - Date.now(), true);
      row.appendChild(cd);
      row.appendChild(el('span', 'village-finish', formatFinishTime(item.endAt)));
      list.appendChild(row);
    });
    section.appendChild(list);
    parent.appendChild(section);
  }

  function villageFind(items, id) {
    return (items || []).find(item => Number(item.id) === Number(id)) || null;
  }

  function villageAssistantText(acc, kind) {
    const info = getApprenticeState(acc, kind);
    if (info.state === 'locked') return '未解锁';
    const level = `Lv.${info.level}`;
    if (info.state === 'working') return `${level} · ${info.auto ? '持续协助中' : '协助中'}`;
    if (info.state === 'waiting') return `${level} · 等待下一轮 ${formatFinishTime(info.nextStart)}`;
    if (info.state === 'cooldown') {
      return `${level} · 冷却中 ${formatDuration(info.cooldownEnd - Date.now())}`;
    }
    return `${level} · 可用`;
  }

  function villageTechStats(items) {
    const list = (items || []).filter(item => item && Number(item.lvl) > 0);
    let maxed = 0;
    let ratioSum = 0;
    let levelSum = 0;
    let counted = 0;
    list.forEach(item => {
      const lvl = Number(item.lvl) || 0;
      const info = catalogLevelInfo(item.id, lvl);
      if (!info || !info.maxLevel) return;
      levelSum += lvl;
      ratioSum += Math.min(1, lvl / info.maxLevel);
      counted++;
      if (info.maxed) maxed++;
    });
    return {
      total: list.length,
      maxed,
      progress: counted ? Math.round((ratioSum / counted) * 100) : 0,
      avgLevel: counted ? levelSum / counted : 0
    };
  }

  function villageWeightedRatio(entries) {
    let weight = 0;
    let sum = 0;
    (entries || []).forEach(entry => {
      if (!entry || entry.ratio == null || !Number.isFinite(entry.ratio)) return;
      const w = Number(entry.weight) > 0 ? Number(entry.weight) : 1;
      sum += Math.max(0, Math.min(1, entry.ratio)) * w;
      weight += w;
    });
    return weight ? sum / weight : null;
  }

  function villageBuildingRatio(item, th) {
    const lvl = Number(item && item.lvl) || 0;
    if (lvl <= 0) return null;
    const info = catalogLevelInfo(item.id, lvl);
    const cap = catalogMaxLevelForTH(item.id, th) || (info && info.maxLevel) || 0;
    if (!cap) return null;
    return Math.min(1, lvl / cap);
  }

  function villageDefenseEntries(v) {
    const th = Number(v.townHallLevel) || 0;
    const entries = [];
    (v.mainBuildings || []).forEach(item => {
      const id = Number(item.id);
      if (Number(item.lvl) <= 0 || VILLAGE_NON_DEFENSE_IDS.has(id)) return;
      const ratio = villageBuildingRatio(item, th);
      if (ratio != null) entries.push({ ratio, weight: Number(item.count) || 1, lvl: Number(item.lvl) });
    });
    (v.mainTraps || []).forEach(item => {
      if (Number(item.lvl) <= 0) return;
      const ratio = villageBuildingRatio(item, th);
      if (ratio != null) entries.push({ ratio, weight: Number(item.count) || 1, lvl: Number(item.lvl) });
    });
    return entries;
  }

  function villageDefenseStats(v) {
    const entries = villageDefenseEntries(v);
    const ratio = villageWeightedRatio(entries);
    let weight = 0;
    let levelSum = 0;
    entries.forEach(entry => {
      const w = Number(entry.weight) || 1;
      weight += w;
      levelSum += entry.lvl * w;
    });
    return {
      progress: ratio == null ? 0 : Math.round(ratio * 100),
      count: entries.length,
      avgLevel: weight ? levelSum / weight : 0
    };
  }

  function villageWallStats(v) {
    const walls = (v.mainBuildings || []).filter(item =>
      Number(item.id) === 1000010 && Number(item.lvl) > 0
    );
    let total = 0;
    let weighted = 0;
    let max = 0;
    walls.forEach(item => {
      const count = Math.max(1, Number(item.count) || 1);
      const lvl = Number(item.lvl) || 0;
      total += count;
      weighted += lvl * count;
      if (lvl > max) max = lvl;
    });
    const avg = total ? weighted / total : 0;
    return {
      total,
      max,
      avg,
      progress: max ? Math.min(100, Math.round((avg / max) * 100)) : 0
    };
  }

  function villageNightProgress(v) {
    const bh = Number(v.builderHallLevel) || 0;
    const entries = [];
    const addBuildings = items => (items || []).forEach(item => {
      const id = Number(item.id);
      if (id === 1000033 || id === 1000034 || Number(item.lvl) <= 0) return;
      const ratio = villageBuildingRatio(item, bh);
      if (ratio != null) entries.push({ ratio, weight: Number(item.count) || 1 });
    });
    addBuildings(v.nightBuildings);
    addBuildings(v.nightTraps);
    (v.nightUnits || []).forEach(item => {
      if (Number(item.lvl) <= 0) return;
      const info = catalogLevelInfo(item.id, item.lvl);
      if (info && info.maxLevel) entries.push({ ratio: Math.min(1, item.lvl / info.maxLevel) });
    });
    (v.nightHeroes || []).forEach(hero => {
      if (Number(hero.lvl) <= 0) return;
      const cap = villageHeroCap(hero, v);
      if (cap > 0) entries.push({ ratio: Math.min(1, hero.lvl / cap) });
    });
    const ratio = villageWeightedRatio(entries);
    return ratio == null ? 0 : Math.round(ratio * 100);
  }

  function villageFacilityProgress(v) {
    const th = Number(v.townHallLevel) || 0;
    const entries = VILLAGE_FUNCTION_IDS.map(([id]) => {
      const item = villageFind(v.mainBuildings, id);
      if (!item || Number(item.lvl) <= 0) return { ratio: 0 };
      const ratio = villageBuildingRatio(item, th);
      return { ratio: ratio == null ? 0 : ratio };
    });
    const ratio = villageWeightedRatio(entries);
    return ratio == null ? 0 : Math.round(ratio * 100);
  }

  function villageHeroProgress(v) {
    const entries = (v.heroes || [])
      .filter(hero => Number(hero.lvl) > 0)
      .map(hero => {
        const cap = villageHeroCap(hero, v);
        return { ratio: cap > 0 ? Math.min(1, hero.lvl / cap) : 0 };
      });
    const ratio = villageWeightedRatio(entries);
    return ratio == null ? 0 : Math.round(ratio * 100);
  }

  function villageTechProgress(v) {
    const entries = [];
    [v.units, v.spells, v.siege].forEach(items => (items || []).forEach(item => {
      if (Number(item.lvl) <= 0) return;
      const info = catalogLevelInfo(item.id, item.lvl);
      if (info && info.maxLevel) entries.push({ ratio: Math.min(1, item.lvl / info.maxLevel) });
    }));
    const ratio = villageWeightedRatio(entries);
    return ratio == null ? 0 : Math.round(ratio * 100);
  }

  function villageOverallProgress(v) {
    const groups = [
      villageFacilityProgress(v),
      villageHeroProgress(v),
      villageTechProgress(v),
      villageDefenseStats(v).progress
    ];
    return Math.round(groups.reduce((sum, value) => sum + value, 0) / groups.length);
  }

  function vdSection(title, hint) {
    const section = el('section', 'vd-section');
    const head = el('div', 'vd-section-head');
    head.appendChild(el('h4', 'vd-section-title', title));
    if (hint) head.appendChild(el('span', 'vd-section-hint', hint));
    section.appendChild(head);
    return section;
  }

  function villageHeroCap(hero, v) {
    const night = VILLAGE_NIGHT_HERO_IDS.has(Number(hero.id));
    const worldLevel = night ? Number(v.builderHallLevel) || 0 : Number(v.townHallLevel) || 0;
    const cap = catalogMaxLevelForTH(hero.id, worldLevel);
    const info = catalogLevelInfo(hero.id, hero.lvl);
    const fallback = (info && info.maxLevel) || Number(hero.lvl) || 0;
    return Math.max(Number(hero.lvl) || 0, cap || fallback);
  }

  function villageHeroCard(hero, v) {
    const name = villageItemName(hero);
    const lvl = Number(hero.lvl) || 0;
    const cap = villageHeroCap(hero, v);
    const up = Number(hero.endAt) > Date.now();
    const night = VILLAGE_NIGHT_HERO_IDS.has(Number(hero.id));
    const card = el('div', 'vd-hero');
    if (night) card.classList.add('night');
    card.appendChild(cocIcon(hero.id, name, 40));
    const body = el('div', 'vd-hero-body');

    const top = el('div', 'vd-hero-top');
    const nameEl = el('span', 'vd-hero-name', name);
    nameEl.title = name;
    top.appendChild(nameEl);
    if (night) top.appendChild(el('span', 'vd-night-tag', '夜'));
    top.appendChild(el('span', 'vd-hero-lvl', `Lv.${lvl}`));
    body.appendChild(top);

    if (cap > 0) {
      const bar = el('div', 'vd-hero-bar');
      const fill = el('span', 'vd-hero-fill');
      fill.style.width = `${Math.min(100, Math.round((lvl / cap) * 100))}%`;
      if (lvl >= cap) fill.classList.add('max');
      bar.appendChild(fill);
      body.appendChild(bar);
    }

    const foot = el('div', 'vd-hero-foot');
    foot.appendChild(el('span', 'vd-hero-cap', cap > 0 ? `${lvl} / ${cap}` : `Lv.${lvl}`));
    if (cap > 0 && lvl >= cap) {
      foot.appendChild(el('span', 'vd-hero-max', 'MAX'));
    } else if (up) {
      const upEl = el('span', 'vd-hero-up');
      upEl.appendChild(el('span', 'vd-pulse'));
      upEl.appendChild(document.createTextNode(`升 ${lvl + 1} 级`));
      foot.appendChild(upEl);
    }
    body.appendChild(foot);
    card.appendChild(body);
    card.title = `${name} Lv.${lvl}${up ? ` · 升级中 → ${lvl + 1}` : ''}`;
    return card;
  }

  function villageFacilityTile(item, id, label, thLevel) {
    const tile = el('div', 'vd-facility');
    const displayName = item ? villageItemName(item) : label;
    tile.appendChild(cocIcon(item ? item.id : id, displayName, 28));
    const body = el('div', 'vd-facility-body');
    body.appendChild(el('span', 'vd-facility-name', label));
    if (item && Number(item.lvl) > 0) {
      const lvl = Number(item.lvl);
      const up = Number(item.endAt) > Date.now();
      body.appendChild(el(
        'span',
        'vd-facility-lvl' + (up ? ' up' : ''),
        up ? `Lv.${lvl} → ${lvl + 1}` : `Lv.${lvl}`
      ));
    } else {
      const need = catalogUnlockLevel(id);
      const locked = need > 0 && thLevel > 0 && need > thLevel;
      body.appendChild(el('span', 'vd-facility-lvl missing', locked ? `${need} 本解锁` : '未建造'));
      tile.classList.add(locked ? 'locked' : 'missing');
    }
    tile.appendChild(body);
    return tile;
  }

  function renderVillageOverview(body, acc) {
    const v = acc.village;
    const now = Date.now();
    const overall = villageOverallProgress(v);

    /* 1. 身份名片 */
    const profile = el('section', 'vd-profile');
    const thWrap = el('div', 'vd-th');
    thWrap.appendChild(cocIcon(1000001, '大本营', 48, v.townHallLevel));
    if (v.townHallLevel) thWrap.appendChild(el('span', 'vd-th-badge', `${v.townHallLevel} 本`));
    profile.appendChild(thWrap);

    const identity = el('div', 'vd-identity');
    const nameRow = el('div', 'vd-name-row');
    nameRow.appendChild(el('h3', 'vd-name', acc.name));
    if (v.tag) {
      const tag = el('span', 'vd-tag', v.tag);
      tag.title = '点击复制村落标签';
      tag.addEventListener('click', () => copyPlainText(v.tag, '村落标签已复制'));
      nameRow.appendChild(tag);
      const copy = el('button', 'vd-copy', '[复制]');
      copy.title = '复制村落标签';
      copy.addEventListener('click', () => copyPlainText(v.tag, '村落标签已复制'));
      nameRow.appendChild(copy);
    }
    identity.appendChild(nameRow);

    const subline = el('div', 'vd-subline');
    const addSub = (text, title) => {
      if (subline.childNodes.length) subline.appendChild(el('span', 'vd-dot', '·'));
      const node = el('span', 'vd-subitem', text);
      if (title) node.title = title;
      subline.appendChild(node);
      return node;
    };
    addSub(
      v.townHallLevel ? `${v.townHallLevel} 本（进度 ${overall}%）` : '主村未知',
      '综合核心设施、防御、英雄和科技进度'
    );
    addSub(v.builderHallLevel ? `夜世界 ${v.builderHallLevel} 本` : '夜世界未建');
    const usedBuilders = (acc.tasks || []).filter(item =>
      item.category === 'builder' && item.endTime > now
    ).length;
    const idleBuilders = Math.max(0, (Number(acc.builderCount) || 0) - usedBuilders);
    addSub(`${acc.builderCount || 0} 工人（空闲 ${idleBuilders}）`);
    const helperCount = [acc.builderApprenticeLevel, acc.labAssistantLevel]
      .filter(level => Number(level) > 0).length;
    addSub(
      `${helperCount} 帮手`,
      `学徒 ${villageAssistantText(acc, 'builder_apprentice')} · 助手 ${villageAssistantText(acc, 'lab_assistant')}`
    );
    identity.appendChild(subline);
    profile.appendChild(identity);
    body.appendChild(profile);

    if (!villageHasFullImport(v)) {
      body.appendChild(el('p', 'village-note', '当前是旧版导入数据，重新导入一次游戏 JSON 可补全英雄、设施和装备概览。'));
      return;
    }

    /* 2. 上半区：英雄阵列 + 军队科技 */
    const dashboard = el('div', 'vd-dashboard');

    const heroSection = vdSection('👑 英雄阵列', '当前大本上限');
    const heroes = (v.heroes || []).filter(item => Number(item.lvl) > 0);
    if (heroes.length) {
      const heroList = el('div', 'vd-hero-grid');
      heroes.forEach(hero => heroList.appendChild(villageHeroCard(hero, v)));
      heroSection.appendChild(heroList);
    } else {
      heroSection.appendChild(el('p', 'vd-empty', '暂无英雄数据'));
    }
    const nightHeroes = (v.nightHeroes || []).filter(item => Number(item.lvl) > 0);
    if (nightHeroes.length) {
      const nightRow = el('div', 'vd-night-heroes');
      nightRow.appendChild(el('span', 'vd-mini-label', '夜世界'));
      nightHeroes.forEach(hero => {
        const name = villageItemName(hero);
        const item = el('span', 'vd-mini-hero');
        item.appendChild(cocIcon(hero.id, name, 20));
        item.appendChild(el('span', 'vd-mini-hero-name', name));
        item.appendChild(el('span', 'vd-mini-hero-lvl', `Lv.${hero.lvl}`));
        const cap = villageHeroCap(hero, v);
        if (cap > 0 && hero.lvl >= cap) item.appendChild(el('span', 'vd-mini-max', 'MAX'));
        nightRow.appendChild(item);
      });
      heroSection.appendChild(nightRow);
    }
    dashboard.appendChild(heroSection);

    const armySection = vdSection('⚔️ 军队与科技全景', '进度按图鉴上限');
    const unlockedUnits = (v.units || []).filter(item => Number(item.lvl) > 0);
    const spells = (v.spells || []).filter(item => Number(item.lvl) > 0);
    const siege = (v.siege || []).filter(item => Number(item.lvl) > 0);
    const pets = (v.pets || []).filter(item => Number(item.lvl) > 0);
    const techList = el('div', 'vd-tech-list');
    [
      ['兵种', unlockedUnits, villageCatalogTroopIds(false).length],
      ['法术', spells, villageCatalogSpellIds().length],
      ['攻城', siege, villageCatalogSiegeIds().length]
    ].forEach(([label, items, total]) => {
      const stats = villageTechStats(items);
      const row = el('div', 'vd-tech-row');
      const head = el('div', 'vd-tech-head');
      const totalCount = total || items.length;
      head.appendChild(el('span', 'vd-tech-name', label));
      head.appendChild(el('span', 'vd-tech-stats',
        `${items.length}/${totalCount} · ${stats.progress}%`));
      head.title = `已解锁 ${items.length}/${totalCount} · 等级进度 ${stats.progress}%`
        + (stats.avgLevel ? ` · 平均 ${stats.avgLevel.toFixed(1)} 级` : '');
      row.appendChild(head);
      const bar = el('div', 'vd-tech-bar');
      const fill = el('span', 'vd-tech-fill');
      fill.style.width = `${stats.progress}%`;
      bar.appendChild(fill);
      row.appendChild(bar);
      techList.appendChild(row);
    });
    armySection.appendChild(techList);

    const petTotal = villageCatalogPetIds().length;
    const petBlock = el('div', 'vd-pet-block');
    const petHead = el('div', 'vd-tech-head');
    petHead.appendChild(el('span', 'vd-tech-name', '战宠'));
    petHead.appendChild(el('span', 'vd-tech-stats', `${pets.length}/${petTotal || pets.length}`));
    petBlock.appendChild(petHead);
    if (pets.length) {
      const petList = el('div', 'vd-pet-list');
      pets.forEach(pet => {
        const name = villageItemName(pet);
        const item = el('span', 'vd-pet');
        item.appendChild(cocIcon(pet.id, name, 18));
        item.appendChild(el('span', 'vd-pet-name', name));
        item.appendChild(el('span', 'vd-pet-lvl', `Lv.${pet.lvl}`));
        petList.appendChild(item);
      });
      petBlock.appendChild(petList);
    } else {
      petBlock.appendChild(el('p', 'vd-empty', '暂无已解锁战宠'));
    }
    armySection.appendChild(petBlock);

    const equipment = (v.equipment || [])
      .filter(item => Number(item.lvl) > 1)
      .sort((a, b) => (Number(b.lvl) || 0) - (Number(a.lvl) || 0));
    const topEquipment = equipment.slice(0, 4);
    const equipHead = el('div', 'vd-subhead-row');
    equipHead.appendChild(el('div', 'vd-subhead', '核心装备 Top4'));
    equipHead.appendChild(el('span', 'vd-subhint', '仅显示已升级'));
    armySection.appendChild(equipHead);
    if (topEquipment.length) {
      const equipGrid = el('div', 'vd-equip-grid compact');
      topEquipment.forEach(item => {
        const name = villageItemName(item);
        const info = catalogLevelInfo(item.id, item.lvl);
        const card = el('div', 'vd-equip');
        const icon = cocIcon(item.id, name, 26);
        icon.classList.add('vd-equip-icon');
        card.appendChild(icon);
        const cardBody = el('div', 'vd-equip-body');
        cardBody.appendChild(el('span', 'vd-equip-name', name));
        cardBody.appendChild(el('span', 'vd-equip-lvl',
          `Lv.${item.lvl}${info && info.maxLevel ? `/${info.maxLevel}` : ''}`));
        card.appendChild(cardBody);
        equipGrid.appendChild(card);
      });
      armySection.appendChild(equipGrid);
    } else {
      armySection.appendChild(el('p', 'vd-empty', '暂无已升级装备'));
    }
    const more = el('button', 'vd-more', '军队 Tab 查看全部 →');
    more.addEventListener('click', () => switchVillageTab('army'));
    armySection.appendChild(more);
    dashboard.appendChild(armySection);
    body.appendChild(dashboard);

    /* 3. 核心功能设施 */
    const facilitySection = vdSection('🏛️ 核心功能设施', '升级中的设施显示目标等级');
    const facilityGrid = el('div', 'vd-facility-grid');
    const thLevel = Number(v.townHallLevel) || 0;
    VILLAGE_FUNCTION_IDS.forEach(([id, label]) => {
      facilityGrid.appendChild(villageFacilityTile(villageFind(v.mainBuildings, id), id, label, thLevel));
    });
    facilitySection.appendChild(facilityGrid);
    body.appendChild(facilitySection);

    /* 4. 防御与设施总评 */
    const defense = villageDefenseStats(v);
    const walls = villageWallStats(v);
    const nightProgress = villageNightProgress(v);
    const defenseSection = vdSection('🛡️ 防御与设施总评', '按当前大本等级上限计算');
    const defenseGrid = el('div', 'vd-defense-grid');
    const addDefenseCard = (label, value, sub, progress) => {
      const card = el('div', 'vd-defense-card');
      const head = el('div', 'vd-defense-head');
      head.appendChild(el('span', 'vd-defense-label', label));
      head.appendChild(el('span', 'vd-defense-value', value));
      card.appendChild(head);
      const bar = el('div', 'vd-defense-bar');
      const fill = el('span', 'vd-defense-fill');
      fill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
      bar.appendChild(fill);
      card.appendChild(bar);
      card.appendChild(el('span', 'vd-defense-sub', sub));
      return card;
    };
    defenseGrid.appendChild(addDefenseCard(
      '核心防御',
      `${defense.progress}%`,
      `均 ${defense.avgLevel.toFixed(1)} 级 · 含陷阱`,
      defense.progress
    ));
    defenseGrid.appendChild(addDefenseCard(
      '城墙',
      walls.max ? `Lv.${walls.max}` : '—',
      `${walls.total} 块 · 均 ${walls.avg.toFixed(1)} 级`,
      walls.progress
    ));
    defenseGrid.appendChild(addDefenseCard(
      '夜世界',
      `${nightProgress}%`,
      `BH${v.builderHallLevel || '?'} · 建筑/陷阱/兵种/英雄`,
      nightProgress
    ));
    defenseSection.appendChild(defenseGrid);
    body.appendChild(defenseSection);

    body.appendChild(el('p', 'village-note', '升级倒计时在主页面卡片查看；英雄上限按当前大本等级计算，装备仅展示已升级项目。'));
  }

  function renderVillageMain(body, v) {
    const full = villageHasFullImport(v) && !!cocCatalog;
    const th = Number(v.townHallLevel) || 0;
    const buildings = full
      ? villageWithCatalog(v.mainBuildings, villageCatalogBuildingIds(false), { building: true, th })
      : v.mainBuildings;
    const traps = full
      ? villageWithCatalog(v.mainTraps, villageCatalogTrapIds(false), { building: true, th })
      : v.mainTraps;
    renderVillageDetailGrid(body, '主世界建筑', buildings);
    renderVillageDetailGrid(body, '主世界陷阱', traps);
    if (!v.mainBuildings.length && !v.mainTraps.length) {
      body.appendChild(el('p', 'village-empty-section', '重新导入游戏 JSON 后可查看主世界建筑和陷阱等级。'));
    }
    body.appendChild(el('p', 'village-note', '🔒 未解锁项目列在每节底部，数字为解锁所需大本等级；「未建造」表示已解锁但还没建。「×N」表示同等级建筑的数量；「Lv.10/10」是当前等级 / 当前大本可升到的上限，达到上限显示「满级」；「升 11 级 X」是下一级升级总时长。'));
  }

  function renderVillageArmy(body, v) {
    const full = villageHasFullImport(v) && !!cocCatalog;
    const th = Number(v.townHallLevel) || 0;
    const merge = (owned, ids) => full ? villageWithCatalog(owned, ids, { th }) : owned;
    renderVillageGrid(body, '英雄', merge(v.heroes, villageCatalogHeroIds(false)));
    renderVillageGrid(body, '战宠', merge(v.pets, villageCatalogPetIds()));
    renderVillageGrid(body, '兵种', merge(v.units, villageCatalogTroopIds(false)));
    renderVillageGrid(body, '法术', merge(v.spells, villageCatalogSpellIds()));
    renderVillageGrid(body, '攻城机器', merge(v.siege, villageCatalogSiegeIds()));

    const equipment = merge(v.equipment, villageCatalogEquipmentIds());
    if (equipment.length) {
      const stats = villageCatalogStats(equipment);
      const upgraded = equipment.filter(item => Number(item.lvl) > 1).length;
      const levelOne = equipment.filter(item => Number(item.lvl) === 1).length;
      const summary = `装备等级 · 图鉴 ${stats.total} 件 · 导出记录 ${stats.owned} 条（已升级 ${upgraded} · Lv.1 ${levelOne}）${stats.locked ? ` · 未解锁 ${stats.locked}` : ''}`;
      const details = el('details', 'village-details');
      details.appendChild(el('summary', null, summary));

      /* 按装备所属英雄分组，未解锁的排在每个英雄组的后面 */
      const groups = new Map();
      equipment.forEach(item => {
        const entry = catalogEntry(item.id);
        const hero = (entry && entry.hero) || '其他';
        if (!groups.has(hero)) groups.set(hero, []);
        groups.get(hero).push(item);
      });
      const heroOrder = VILLAGE_EQUIPMENT_HERO_ORDER.filter(hero => groups.has(hero))
        .concat([...groups.keys()].filter(hero => !VILLAGE_EQUIPMENT_HERO_ORDER.includes(hero)));
      heroOrder.forEach(hero => {
        const group = groups.get(hero);
        const lockedCount = group.filter(item => item.state === 'locked').length;
        const upgradedCount = group.filter(item => Number(item.lvl) > 1).length;
        const presentCount = group.length - lockedCount;
        const wrap = el('div', 'village-equip-group');
        wrap.appendChild(el(
          'div', 'village-equip-hero',
          `${hero} · ${presentCount} 条记录${upgradedCount ? ` · 已升级 ${upgradedCount}` : ''}${lockedCount ? ` · 未解锁 ${lockedCount}` : ''}`
        ));
        wrap.appendChild(villageGridNode(group, false));
        details.appendChild(wrap);
      });

      body.appendChild(details);
    } else if (v.equipmentCount) {
      const section = el('section', 'village-section');
      section.appendChild(el('h4', null, '装备'));
      const grid = el('div', 'village-grid');
      grid.appendChild(villageItem({ name: '装备', extra: `${v.equipmentCount} 件 · 最高 ${v.equipmentMax} 级` }));
      section.appendChild(grid);
      body.appendChild(section);
    }
    body.appendChild(el('p', 'village-note', '🔒 未解锁项目列在每节底部；装备按使用英雄分组，未解锁装备显示所需铁匠铺等级。导出没有装备“已拥有”标记：Lv.1 带 ? 表示可能是已拥有未升级，也可能是未获得，无法从 JSON 判断。英雄的「x/y」中 y 为当前大本可升到的上限；兵种、法术、攻城机器按当前等级展示，「升 X 级」为图鉴里的下一级升级总时长。'));
  }

  function renderVillageNight(body, v) {
    const full = villageHasFullImport(v) && !!cocCatalog;
    const bh = Number(v.builderHallLevel) || 0;
    const merge = (owned, ids, opts) => full ? villageWithCatalog(owned, ids, opts) : owned;
    renderVillageGrid(body, '夜世界英雄', merge(v.nightHeroes, villageCatalogHeroIds(true), { th: bh }));
    renderVillageDetailGrid(body, '夜世界建筑', merge(v.nightBuildings, villageCatalogBuildingIds(true), { building: true, th: bh }));
    renderVillageDetailGrid(body, '夜世界陷阱', merge(v.nightTraps, villageCatalogTrapIds(true), { building: true, th: bh }));
    renderVillageDetailGrid(body, '夜世界兵种', merge(v.nightUnits, villageCatalogTroopIds(true), { th: bh }));
    if (!v.nightBuildings.length && v.nightUpgrades && v.nightUpgrades.length) {
      renderVillageUpgradeRows(body, '夜世界升级中', v.nightUpgrades);
    }
    if (!v.nightBuildings.length) {
      body.appendChild(el('p', 'village-note', '重新导入游戏 JSON 后可查看完整的夜世界建筑、陷阱和兵种等级。'));
    }
    body.appendChild(el('p', 'village-note', '🔒 未解锁项目列在每节底部，数字为解锁所需夜世界大本等级；「未建造」表示已解锁但还没建；「Lv.x/y」的 y 为当前夜世界大本可升到的上限。升级中的项目另显示导出时的剩余时间，夜世界升级不占主世界工人。'));
  }

  function renderVillage(acc) {
    const body = document.getElementById('villageBody');
    body.innerHTML = '';
    const v = acc.village;
    if (!v) {
      body.appendChild(el('p', 'village-empty', '还没有导入游戏数据。'));
      return;
    }
    document.getElementById('villageTitle').textContent = `村落数据 · ${acc.name}`;
    document.querySelectorAll('#villageTabs [data-vtab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.vtab === villageTab);
    });

    if (villageTab === 'main') renderVillageMain(body, v);
    else if (villageTab === 'army') renderVillageArmy(body, v);
    else if (villageTab === 'night') renderVillageNight(body, v);
    else renderVillageOverview(body, acc);
  }

  function openVillage(accountId) {
    const acc = state.accounts.find(a => a.id === accountId);
    if (!acc || !acc.village) return;
    villageAccountId = accountId;
    villageTab = 'overview';
    renderVillage(acc);
    document.getElementById('villageMask').classList.add('show');
  }

  function switchVillageTab(tab) {
    if (!villageAccountId) return;
    const acc = state.accounts.find(a => a.id === villageAccountId);
    if (!acc || !acc.village) return;
    villageTab = tab;
    renderVillage(acc);
    const body = document.getElementById('villageBody');
    if (body) body.scrollTop = 0;
  }

  function closeVillage() {
    document.getElementById('villageMask').classList.remove('show');
    villageAccountId = null;
  }

  // ---------- 云端同步 ----------
  function setCloudStatus(type, text) {
    const dot = document.getElementById('cloudDot');
    const textEl = document.getElementById('cloudStatus');
    if (dot) dot.className = 'cloud-dot' + (type ? ' ' + type : '');
    if (textEl) {
      textEl.textContent = text;
      textEl.title = text;
    }
    const pill = document.getElementById('cloudPill');
    const pillDot = document.getElementById('cloudPillDot');
    const pillText = document.getElementById('cloudPillText');
    if (pill) pill.title = text;
    if (pillDot) pillDot.className = 'cloud-dot' + (type ? ' ' + type : '');
    if (pillText) {
      pillText.textContent = type === 'ok' ? '已同步'
        : type === 'syncing' ? '同步中'
        : type === 'error' ? '同步失败'
        : '本地';
    }
  }

  function formatCloudTime(ms) {
    const d = new Date(ms);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function cloudErrorMessage(err) {
    const raw = String(err && err.message ? err.message : err);
    const body = raw.replace(/^HTTP \d+:\s*/, '');
    try {
      const json = JSON.parse(body);
      if (json && json.message) return json.message;
    } catch (e) { /* 不是 JSON，直接返回原文 */ }
    return raw.slice(0, 160);
  }

  function failCloud(err) {
    console.warn('云端同步失败', err);
    const msg = cloudErrorMessage(err);
    let text = msg;
    if (/permission denied/i.test(msg)) text = '表权限不足，请给 anon 授权';
    else if (/column .* does not exist/i.test(msg)) text = '表字段不完整，请检查 id / state / updated_at';
    else if (/row-level security/i.test(msg)) text = 'RLS 拦截，请添加访问策略';
    setCloudStatus('error', '同步失败：' + text);
  }

  function generateSyncId() {
    return 'coc-' + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
  }

  function normalizeSyncId(value) {
    const key = String(value || '').trim();
    if (!/^[A-Za-z0-9_-]{3,64}$/.test(key)) {
      alert('同步码只能包含字母、数字、-、_，长度 3~64 位');
      return '';
    }
    return key;
  }

  function renderCloudFields() {
    const input = document.getElementById('cloudSyncIdInput');
    if (input) input.value = cloudSyncId;
    const hasKey = !!cloudSyncId;
    ['cloudPullBtn', 'cloudPushBtn', 'cloudSyncBtn', 'cloudCopyIdBtn'].forEach(id => {
      const node = document.getElementById(id);
      if (node) node.disabled = !hasKey;
    });
  }

  function copyCloudId() {
    if (!cloudSyncId) { alert('还没有设置同步码'); return; }
    const text = cloudSyncId;
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      alert(ok ? '同步码已复制' : '复制失败，请手动选择复制。');
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => alert('同步码已复制')).catch(fallback);
    } else {
      fallback();
    }
  }

  function openSyncSetup() {
    const mask = document.getElementById('syncSetupMask');
    const input = document.getElementById('syncSetupInput');
    input.value = generateSyncId();
    mask.classList.add('show');
    input.focus();
    input.select();
  }

  function closeSyncSetup() {
    document.getElementById('syncSetupMask').classList.remove('show');
  }

  async function startCloudWithKey(key) {
    const previous = cloudSyncId;
    cloudSyncId = key;
    localStorage.setItem(CLOUD_SYNC_ID_STORAGE, key);
    localStorage.removeItem(CLOUD_SETUP_DISMISSED);
    cloudInitialized = true;
    renderCloudFields();
    setCloudStatus('syncing', '正在检查同步码…');

    try {
      const row = await fetchCloudRow();
      if (!row) {
        await pushCloudState(true);
        return;
      }
      const info = parseCloudRow(row);
      const useCloud = confirm('这个同步码云端已有数据。\n\n确定：从云端拉取并覆盖本地。\n取消：继续选择是否用本地覆盖云端。');
      if (useCloud) {
        state = info.state;
        saveState(false);
        lastDoneSignature = null;
        renderAll();
        setCloudStatus('ok', `已从云端恢复 ${formatCloudTime(info.updatedAt)}`);
        return;
      }
      const useLocal = confirm('是否用当前本地数据覆盖云端这个同步码的数据？\n\n确定：上传本地覆盖云端。\n取消：取消切换同步码。');
      if (!useLocal) {
        cloudSyncId = previous;
        if (previous) localStorage.setItem(CLOUD_SYNC_ID_STORAGE, previous);
        else localStorage.removeItem(CLOUD_SYNC_ID_STORAGE);
        renderCloudFields();
        setCloudStatus('', '已取消切换同步码');
        return;
      }
      await pushCloudState(true);
    } catch (err) {
      failCloud(err);
    }
  }

  async function saveSyncSetup() {
    const input = document.getElementById('syncSetupInput');
    const key = normalizeSyncId(input.value);
    if (!key) return;
    closeSyncSetup();
    await startCloudWithKey(key);
  }

  function postponeSyncSetup() {
    localStorage.setItem(CLOUD_SETUP_DISMISSED, '1');
    closeSyncSetup();
    setCloudStatus('', '本地模式，未设置同步码');
  }

  async function applyCloudKeyFromInput() {
    const input = document.getElementById('cloudSyncIdInput');
    const key = normalizeSyncId(input.value);
    if (!key) return;
    if (key === cloudSyncId) {
      setCloudStatus('ok', '同步码没有变化');
      return;
    }
    await startCloudWithKey(key);
  }

  function parseCloudRow(row) {
    if (!row) return null;
    const raw = typeof row.state === 'string' ? JSON.parse(row.state) : row.state;
    const cloudState = normalizeState(raw);
    const rowUpdated = Date.parse(row.updated_at) || 0;
    cloudState.updatedAt = Math.max(Number(cloudState.updatedAt) || 0, rowUpdated);
    return {
      state: cloudState,
      updatedAt: cloudState.updatedAt,
      hasTasks: cloudState.accounts.some(a => a.tasks.length > 0)
    };
  }

  async function fetchCloudRow() {
    const url = `${CLOUD_ENDPOINT}?id=eq.${encodeURIComponent(cloudSyncId)}&select=id,state,updated_at`;
    const res = await fetch(url, { headers: CLOUD_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const rows = await res.json();
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  }

  async function pushCloudState(silent = false) {
    if (!cloudSyncId) { setCloudStatus('', '请先设置同步码'); return; }
    if (cloudSyncing) return;
    cloudSyncing = true;
    if (!silent) setCloudStatus('syncing', '正在上传到云端…');
    try {
      const now = Date.now();
      state.updatedAt = now;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const body = JSON.stringify([{
        id: cloudSyncId,
        state,
        updated_at: new Date(now).toISOString()
      }]);
      const res = await fetch(CLOUD_ENDPOINT, {
        method: 'POST',
        headers: { ...CLOUD_HEADERS, Prefer: 'resolution=merge-duplicates,return=minimal' },
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      setCloudStatus('ok', `云端已同步 ${formatCloudTime(now)}`);
    } catch (err) {
      failCloud(err);
    } finally {
      cloudSyncing = false;
    }
  }

  function scheduleCloudPush() {
    if (!cloudInitialized || !cloudSyncId) return;
    if (cloudPushTimer) clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(() => {
      cloudPushTimer = null;
      if (cloudSyncing) {
        scheduleCloudPush();
        return;
      }
      pushCloudState(true);
    }, 900);
  }

  async function pullCloudState(force = false) {
    if (!cloudSyncId) { setCloudStatus('', '请先设置同步码'); return false; }
    setCloudStatus('syncing', '正在读取云端…');
    try {
      const row = await fetchCloudRow();
      if (!row) {
        setCloudStatus('ok', '云端还没有数据');
        return false;
      }
      const info = parseCloudRow(row);
      const localUpdated = Number(state.updatedAt) || 0;
      if (!force && info.updatedAt <= localUpdated) {
        setCloudStatus('ok', `本地已是最新 ${formatCloudTime(localUpdated || Date.now())}`);
        return false;
      }
      state = info.state;
      saveState(false);
      lastDoneSignature = null;
      renderAll();
      setCloudStatus('ok', `已从云端更新 ${formatCloudTime(info.updatedAt)}`);
      return true;
    } catch (err) {
      console.warn('云端读取失败', err);
      failCloud(err);
      return false;
    }
  }

  async function syncNow() {
    if (!cloudSyncId) { setCloudStatus('', '请先设置同步码'); return; }
    setCloudStatus('syncing', '正在检查云端…');
    try {
      const row = await fetchCloudRow();
      if (!row) {
        await pushCloudState(true);
        return;
      }
      const info = parseCloudRow(row);
      const localUpdated = Number(state.updatedAt) || 0;
      const localHasTasks = state.accounts.some(a => a.tasks.length > 0);
      if (!info.hasTasks && localHasTasks) {
        await pushCloudState(true);
        return;
      }
      if ((info.hasTasks && !localHasTasks) || info.updatedAt > localUpdated) {
        await pullCloudState(true);
      } else {
        await pushCloudState(true);
      }
    } catch (err) {
      failCloud(err);
    }
  }

  async function initCloudSync() {
    if (!cloudSyncId) {
      setCloudStatus('', '本地模式，未设置同步码');
      return;
    }
    setCloudStatus('syncing', '正在连接云端…');
    try {
      const row = await fetchCloudRow();
      if (!row) {
        if (!state.updatedAt) {
          state.updatedAt = Date.now();
          saveState(false);
        }
        await pushCloudState(true);
        return;
      }
      const info = parseCloudRow(row);
      const localUpdated = Number(state.updatedAt) || 0;
      const localHasTasks = state.accounts.some(a => a.tasks.length > 0);
      if (!info.hasTasks && localHasTasks) {
        await pushCloudState(true);
        return;
      }
      if ((info.hasTasks && !localHasTasks) || info.updatedAt > localUpdated) {
        state = info.state;
        saveState(false);
        lastDoneSignature = null;
        renderAll();
        setCloudStatus('ok', `已从云端更新 ${formatCloudTime(info.updatedAt)}`);
      } else {
        await pushCloudState(true);
      }
    } catch (err) {
      failCloud(err);
    } finally {
      cloudInitialized = true;
    }
  }

  // ---------- 入口 ----------
  function renderAll() {
    lastDoneSignature = getDoneSignature();
    renderAccountFilter();
    renderCards();
    renderConfig();
  }

  document.getElementById('openConfigBtn').addEventListener('click', openConfig);
  document.getElementById('cloudPill').addEventListener('click', openConfig);
  document.getElementById('accountFilter').addEventListener('change', e => {
    filterAccountId = e.target.value;
    if (filterAccountId) {
      localStorage.setItem(FILTER_KEY, filterAccountId);
      state.activeAccountId = filterAccountId;
    } else {
      localStorage.removeItem(FILTER_KEY);
    }
    renderCards();
  });
  document.getElementById('closeConfigBtn').addEventListener('click', closeConfig);
  /* 配置弹窗也不响应遮罩点击：表单较长，误触关闭会丢失填写内容 */
  document.getElementById('taskEditCloseBtn').addEventListener('click', closeTaskForm);
  document.getElementById('villageCloseBtn').addEventListener('click', closeVillage);
  document.getElementById('villageTabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-vtab]');
    if (!btn) return;
    villageTab = btn.dataset.vtab;
    const acc = state.accounts.find(a => a.id === villageAccountId);
    if (acc) renderVillage(acc);
  });
  /* 任务编辑弹窗不响应遮罩点击：避免拖拽、误触时把正在填写的内容关掉 */
  document.addEventListener('keydown', e => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') {
      /* 正在输入框 / 下拉框里操作时，Esc 只用来取消输入法或下拉，不关闭弹窗 */
      const fields = ['INPUT', 'SELECT', 'TEXTAREA'];
      const tag = e.target && e.target.tagName;
      const activeTag = document.activeElement && document.activeElement.tagName;
      if (fields.includes(tag) || fields.includes(activeTag)) return;
      const setup = document.getElementById('syncSetupMask');
      if (setup && setup.classList.contains('show')) {
        postponeSyncSetup();
        return;
      }
      const taskEdit = document.getElementById('taskEditMask');
      if (taskEdit && taskEdit.classList.contains('show')) {
        closeTaskForm();
        return;
      }
      const village = document.getElementById('villageMask');
      if (village && village.classList.contains('show')) {
        closeVillage();
        return;
      }
      closeAccel();
      closeConfig();
    }
  });

  document.getElementById('cfgAccountSelect').addEventListener('change', e => {
    state.activeAccountId = e.target.value;
    saveState();
    closeTaskForm();
    renderAccountFields();
    renderConfigTasks();
  });

  document.getElementById('cfgAddAccountBtn').addEventListener('click', addAccount);
  document.getElementById('cfgDelAccountBtn').addEventListener('click', deleteAccount);
  document.getElementById('cfgMoveUpBtn').addEventListener('click', () => moveActiveAccount(-1));
  document.getElementById('cfgMoveDownBtn').addEventListener('click', () => moveActiveAccount(1));

  document.getElementById('cfgAccountName').addEventListener('change', e => {
    const acc = getActiveAccount();
    acc.name = e.target.value.trim() || `账号 ${state.accounts.indexOf(acc) + 1}`;
    saveState();
    renderAll();
  });

  document.getElementById('cfgBuilderCount').addEventListener('change', e => changeBuilderCount(e.target.value));

  document.getElementById('cfgTownHallLevel').addEventListener('change', e => {
    const acc = getActiveAccount();
    acc.townHallLevel = Math.min(19, Math.max(1, parseInt(e.target.value, 10) || 1));
    saveState();
    renderAll();
  });

  document.getElementById('cfgBuilderApprenticeLevel').addEventListener('change', e => {
    const acc = getActiveAccount();
    acc.builderApprenticeLevel = Math.min(8, Math.max(0, parseInt(e.target.value, 10) || 0));
    saveState();
    renderAccountFields();
    renderCards();
  });
  document.getElementById('cfgLabAssistantLevel').addEventListener('change', e => {
    const acc = getActiveAccount();
    acc.labAssistantLevel = Math.min(12, Math.max(0, parseInt(e.target.value, 10) || 0));
    saveState();
    renderAccountFields();
    renderCards();
  });

  document.querySelectorAll('.accel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      accelTab = tab.dataset.tab;
      renderAccel();
    });
  });
  document.getElementById('accelCloseBtn').addEventListener('click', closeAccel);
  /* 加速弹窗同样不响应遮罩点击，避免自定义加速填到一半被关掉 */

  document.getElementById('cfgAddTaskBtn').addEventListener('click', () => openTaskForm(null));
  document.getElementById('formCancelBtn').addEventListener('click', closeTaskForm);
  document.getElementById('formSaveBtn').addEventListener('click', saveTask);

  const itemSearchInput = document.getElementById('formItemSearch');
  itemSearchInput.addEventListener('focus', renderTaskItemResults);
  itemSearchInput.addEventListener('click', renderTaskItemResults);
  itemSearchInput.addEventListener('input', renderTaskItemResults);
  itemSearchInput.addEventListener('keydown', handleTaskItemSearchKeydown);
  document.addEventListener('click', event => {
    const picker = document.querySelector('.item-picker');
    if (!picker || picker.contains(event.target)) return;
    closeTaskItemResults();
  });
  document.getElementById('formCategory').addEventListener('change', () => {
    if (taskFormItem && taskFormItem.category !== document.getElementById('formCategory').value) {
      clearPickedTaskItem();
    }
  });

  document.getElementById('openCodexBtn').addEventListener('click', openCodex);
  document.getElementById('codexCloseBtn').addEventListener('click', closeCodex);
  document.getElementById('codexSearch').addEventListener('input', event => {
    codexKeyword = event.target.value;
    renderCodex();
  });
  document.querySelectorAll('#codexWorlds button').forEach(button => {
    button.addEventListener('click', () => setCodexWorld(button.dataset.world));
  });
  document.addEventListener('keydown', event => {
    const codexMask = document.getElementById('codexMask');
    if (event.key === 'Escape' && codexMask && codexMask.classList.contains('show')) {
      closeCodex();
    }
  });
  /* 不再用 Enter 直接保存：中文输入法选词、误按回车时容易把弹窗关掉 */
  document.addEventListener('mouseup', () => {
    if (dragAccountId) return;
    document.querySelectorAll('.card').forEach(card => { card.draggable = false; });
  });

  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importData(file);
    e.target.value = '';
  });

  document.getElementById('cocExportImportBtn').addEventListener('click', importCocExportData);

  document.getElementById('cloudPullBtn').addEventListener('click', () => {
    if (!confirm('从云端拉取会覆盖本地数据，确定继续吗？')) return;
    pullCloudState(true);
  });
  document.getElementById('cloudPushBtn').addEventListener('click', () => pushCloudState());
  document.getElementById('cloudSyncBtn').addEventListener('click', syncNow);
  document.getElementById('cloudApplyIdBtn').addEventListener('click', applyCloudKeyFromInput);
  document.getElementById('cloudCopyIdBtn').addEventListener('click', copyCloudId);
  document.getElementById('cloudSyncIdInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCloudKeyFromInput();
    }
  });

  document.getElementById('syncSetupRandomBtn').addEventListener('click', () => {
    document.getElementById('syncSetupInput').value = generateSyncId();
  });
  document.getElementById('syncSetupSaveBtn').addEventListener('click', saveSyncSetup);
  document.getElementById('syncSetupLaterBtn').addEventListener('click', postponeSyncSetup);
  document.getElementById('syncSetupInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveSyncSetup();
    }
  });

  loadCocCatalog();
  renderAll();
  renderCloudFields();
  if (cloudSyncId) {
    initCloudSync();
  } else {
    setCloudStatus('', '本地模式，未设置同步码');
    /* 嵌入博客时不自动弹出同步码设置窗，需要时在「配置 → 云端同步」里手动设置 */
  }
  setInterval(() => {
    checkCompletions();
    tick();
  }, 1000);
})();
