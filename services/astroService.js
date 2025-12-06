const moment = require('moment-timezone');
const config = require('../config/config');

let swisseph = null;
try { swisseph = require('swisseph'); } catch (e) { /* optional */ }

const PLANETS = {
  "சூரி": "SUN",
  "சந்": "MOON",
  "செவ்": "MARS",
  "புத": "MERCURY",
  "குரு": "JUPITER",
  "சுக்": "VENUS",
  "சனி": "SATURN",
  "ரா": "RAHU"
};

const RASI_TA = ["மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"];
const NAKSHATRA_TA = [ /* same 27 names */ 
  "அசுவினி","பரணி","கார்த்திகை","ரோஹிணி","மிருகசீரிஷம்","திருவாதிரை",
  "புனர்பூசம்","பூசம்","ஆயில்யம்","மகம்","பூரம்","உத்திரம்","ஹஸ்தம்",
  "சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை","மூலம்","பூராடம்",
  "உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி"
];

function norm360(x) { return ((x % 360) + 360) % 360; }
function signIndex(lon) { return Math.floor(lon / 30); }

const MOVABLE = new Set([0,3,6,9]);
const FIXED = new Set([1,4,7,10]);

function navamsaSign(lon) {
  const rasiIdx = signIndex(lon);
  const degInSign = lon % 30.0;
  const navIdxInSign = Math.floor(degInSign / (30.0 / 9.0));
  let start;
  if (MOVABLE.has(rasiIdx)) start = rasiIdx;
  else if (FIXED.has(rasiIdx)) start = (rasiIdx + 4) % 12;
  else start = (rasiIdx + 8) % 12;
  return (start + navIdxInSign) % 12;
}

function nakshatraInfo(lon) {
  const nak = Math.floor(lon / (360/27));
  const degInNak = lon % (360/27);
  const pada = Math.floor(degInNak / (360/108)) + 1;
  return { nakshatra: NAKSHATRA_TA[nak], pada };
}

function formatDeg(lon) {
  const sign = signIndex(lon);
  const degInSign = lon % 30;
  return `${RASI_TA[sign]} ${degInSign.toFixed(2)}°`;
}

// Basic fallback approximations
function calculateBasicPositions(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return {
    SUN: norm360(280.46646 + 36000.76983 * T),
    MOON: norm360(218.3165 + 481267.8813 * T),
    MARS: norm360(355.43 + 19140.3 * T),
    MERCURY: norm360(252.25 + 149472.67 * T),
    JUPITER: norm360(34.35 + 3034.91 * T),
    VENUS: norm360(181.98 + 58517.82 * T),
    SATURN: norm360(50.08 + 1222.11 * T),
    RAHU: norm360(125.04 - 1934.14 * T)
  };
}

async function calcPlanet(jd, planetName) {
  if (!swisseph) {
    const basic = calculateBasicPositions(jd);
    return basic[planetName];
  }

  if (swisseph.swe_set_ephe_path) swisseph.swe_set_ephe_path(config.ephePath || config.ephePath);

  const planetCodes = {
    SUN: swisseph.SE_SUN,
    MOON: swisseph.SE_MOON,
    MERCURY: swisseph.SE_MERCURY,
    VENUS: swisseph.SE_VENUS,
    MARS: swisseph.SE_MARS,
    JUPITER: swisseph.SE_JUPITER,
    SATURN: swisseph.SE_SATURN,
    RAHU: config.useTrueNode ? swisseph.SE_TRUE_NODE : swisseph.SE_MEAN_NODE
  };

  const code = planetCodes[planetName];
  if (!code) throw new Error('Unknown planet code');

  const flags = (swisseph.SEFLG_SPEED || 0) | (swisseph.SEFLG_MOSEPH || 0);

  return new Promise((resolve) => {
    try {
      swisseph.swe_calc_ut(jd, code, flags, (result) => {
        if (result.error) {
          const basic = calculateBasicPositions(jd);
          return resolve(basic[planetName]);
        }
        let lon = result.longitude || (result.data && result.data[0]) || 0;
        const ayan = (swisseph.swe_get_ayanamsa) ? swisseph.swe_get_ayanamsa(jd) : 24.0;
        if (typeof ayan === 'object') lon = norm360(lon - (ayan.ayanamsa || ayan));
        else lon = norm360(lon - (ayan || 24.0));
        resolve(lon);
      });
    } catch (e) {
      const basic = calculateBasicPositions(jd);
      resolve(basic[planetName]);
    }
  });
}

async function calculateAll(jd) {
  const results = [];
  for (const [tamil, eng] of Object.entries(PLANETS)) {
    const lon = await calcPlanet(jd, eng);
    const rasi = RASI_TA[signIndex(lon)];
    const nav = RASI_TA[navamsaSign(lon)];
    const { nakshatra, pada } = nakshatraInfo(lon);
    results.push({ name: tamil, rasi, navamsa: nav, nakshatra, pada, degree: formatDeg(lon), longitude: lon });
  }
  return results;
}

async function calculateKetuFromRahu(jd) {
  const rahu = await calcPlanet(jd, 'RAHU');
  const ketuLon = norm360(rahu + 180);
  return {
    name: 'கே',
    rasi: RASI_TA[signIndex(ketuLon)],
    navamsa: RASI_TA[navamsaSign(ketuLon)],
    ...nakshatraInfo(ketuLon),
    degree: formatDeg(ketuLon),
    longitude: ketuLon
  };
}

async function calculateAscendant(jd, lat, lon) {
  if (swisseph && swisseph.swe_houses) {
    return new Promise((resolve) => {
      try {
        swisseph.swe_houses(jd, lat, lon, 'P', (res) => {
          if (res.error) return resolve(null);
          const ayan = (swisseph.swe_get_ayanamsa) ? swisseph.swe_get_ayanamsa(jd) : 24.0;
          const asc = norm360(res.ascendant - (ayan || 24.0));
          resolve(asc);
        });
      } catch (e) { resolve(null); }
    });
  }

  const T = (jd - 2451545.0) / 36525.0;
  const LST = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + lon);
  const asc = norm360(LST + lat);
  return asc;
}

module.exports = {
  calculateAll,
  calculateKetuFromRahu,
  calculateAscendant,
  formatDeg,
  nakshatraInfo,
  navamsaSign,
  RASI_TA
};
