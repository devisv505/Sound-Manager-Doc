import path from 'node:path';
const number = (value) => Number(value.toFixed(3));
export function normalizeDemoAudit(audit) {
  return {
    sourceRevision: audit.sourceRevision,
    events: audit.events.map((event) => {
      const s = JSON.parse(event.settings);
      return {
        demo: event.folder.toLowerCase(),
        name: event.name,
        key: event.key,
        path: event.path,
        parameters: event.parameters.map((p) => ({
          name: p.name,
          type: p.type,
          default:
            p.type === 'Float'
              ? p.defaultFloat
              : p.type === 'Int'
                ? p.defaultInt
                : p.type === 'Bool'
                  ? p.defaultBool
                  : path.parse(p.defaultAsset).name,
          range:
            p.type === 'Float'
              ? `${p.minimum}–${p.maximum}`
              : p.type === 'Int'
                ? `${p.minimumInt}–${p.maximumInt}`
                : p.type === 'Bool'
                  ? 'false / true'
                  : 'Allowed clips below',
          rise: p.riseRate,
          fall: p.fallRate,
          allowed: p.allowedAssets,
        })),
        signals: event.signals,
        spatial:
          s.spatialBlend === 0
            ? '2D'
            : `3D · ${number(s.minDistance)}–${number(s.maxDistance)} units`,
        maxInstances: s.maxInstances,
        concurrency: s.concurrency === 0 ? 'ReplaceOldest' : 'RejectNew',
        cooldown: number(s.cooldown),
        ownerLoss: s.ownerLoss === 0 ? 'Stop' : 'Detach',
        keepAlive: s.keepAlive,
        ignorePause: s.ignoreListenerPause,
        protected: s.protectedFromStealing,
        priority: s.priority,
      };
    }),
  };
}
