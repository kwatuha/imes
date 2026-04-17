/**
 * Normalization helpers for project import ward matching (central /data-import).
 * Handles direction abbreviations (S.E → South East) and loose equality via alphanumeric fingerprint
 * so "South West Nyakach", "S.W Nyakach", "SouthWestnyakach", and "South Westnyakach" align.
 */

function normalizeStrForImport(v) {
    if (typeof v !== 'string') return v;
    let normalized = v.trim();
    normalized = normalized.replace(/[''"`\u0027\u2018\u2019\u201A\u201B\u2032\u2035]/g, '');
    normalized = normalized.replace(/\s*\/\s*/g, '/');
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
}

/**
 * Expands common compass abbreviations used in Kenyan ward names.
 */
function expandWardDirectionAbbreviations(s) {
    if (!s || typeof s !== 'string') return s;
    let t = s;
    // Longer / dotted forms first (S.West / S.East before S.W / S.E)
    const pairs = [
        [/\bS\.\s*West\b/gi, 'south west'],
        [/\bS\.West\b/gi, 'south west'],
        [/\bS\.\s*East\b/gi, 'south east'],
        [/\bS\.East\b/gi, 'south east'],
        [/\bN\.\s*West\b/gi, 'north west'],
        [/\bN\.West\b/gi, 'north west'],
        [/\bN\.\s*East\b/gi, 'north east'],
        [/\bN\.East\b/gi, 'north east'],
        [/\bS\.\s*W\.\b/gi, 'south west'],
        [/\bS\.\s*W\b/gi, 'south west'],
        [/\bS\.\s*E\.\b/gi, 'south east'],
        [/\bS\.\s*E\b/gi, 'south east'],
        [/\bN\.\s*W\.\b/gi, 'north west'],
        [/\bN\.\s*W\b/gi, 'north west'],
        [/\bN\.\s*E\.\b/gi, 'north east'],
        [/\bN\.\s*E\b/gi, 'north east'],
    ];
    for (const [re, repl] of pairs) {
        t = t.replace(re, repl);
    }
    return t;
}

/**
 * Fixes frequent spreadsheet typos so fingerprints align with canonical ward names.
 */
function correctCommonWardTypos(s) {
    if (!s || typeof s !== 'string') return s;
    let t = s;
    t = t.replace(/\bsoth\b/g, 'south');
    t = t.replace(/\bsme\b/g, 'seme');
    return t;
}

/**
 * Normalized ward string after typo fixes and direction expansion (still has spaces/slashes).
 */
function wardNormalizedForFingerprint(raw) {
    let s = normalizeStrForImport(typeof raw === 'string' ? raw : String(raw || ''));
    if (!s) return '';
    s = s.toLowerCase();
    s = s.replace(/\s+ward\s*$/i, '').trim();
    s = correctCommonWardTypos(s);
    s = expandWardDirectionAbbreviations(s);
    s = s.replace(/\s+/g, ' ');
    return s;
}

/**
 * Dense fingerprint: all non-alphanumerics removed.
 * Hyphens, slashes, and spaces are removed, so e.g. Kaloleni-Shaurimoyo, Kaloleni/Shauri Moyo, and
 * Kaloleni/Shaurimoyo share the same fingerprint when there is no "/" reordering.
 */
function wardImportFingerprint(raw) {
    const s = wardNormalizedForFingerprint(raw);
    return s ? s.replace(/[^a-z0-9]/g, '') : '';
}

/**
 * All keys to try when matching an import ward to DB wards.
 * - Dense key (full string, alnum-only).
 * - Slash-compound key: if the name contains "/", parts are alnum-collapsed per segment, sorted, and joined
 *   so "Kaloleni/Shauri Moyo" and "Shaurimoyo/Kaloleni" align.
 */
function wardImportFingerprintKeys(raw) {
    const s = wardNormalizedForFingerprint(raw);
    if (!s) return [];
    const keys = new Set();
    const dense = s.replace(/[^a-z0-9]/g, '');
    if (dense) keys.add(dense);

    if (s.includes('/')) {
        const parts = s.split('/').map((p) => p.replace(/[^a-z0-9]/g, '')).filter(Boolean);
        if (parts.length >= 2) {
            const slashKey = parts.slice().sort().join('');
            if (slashKey) keys.add(slashKey);
        }
    }
    return Array.from(keys);
}

module.exports = {
    normalizeStrForImport,
    expandWardDirectionAbbreviations,
    correctCommonWardTypos,
    wardNormalizedForFingerprint,
    wardImportFingerprint,
    wardImportFingerprintKeys,
};
