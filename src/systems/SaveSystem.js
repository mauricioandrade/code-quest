const KEY = 'code-quest-save';

export const SaveSystem = {
  save(registry) {
    const fields = [
      'playerName', 'sprite', 'visualClass', 'stack', 'stackName', 'stackIcon',
      'framework', 'frameworkName',
      'hp', 'maxHp', 'xp', 'xpNext', 'int', 'def', 'luck', 'titleIndex',
      'currentDistrict', 'districtsUnlocked', 'districtsDone',
    ];
    const data = {};
    fields.forEach(f => { data[f] = registry.get(f); });
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[SaveSystem] Falha ao salvar:', e);
    }
  },

  load(registry) {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([k, v]) => registry.set(k, v));
      return true;
    } catch (e) {
      console.warn('[SaveSystem] Falha ao carregar:', e);
      return false;
    }
  },

  clear() {
    localStorage.removeItem(KEY);
  },
};
