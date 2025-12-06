const { Meta, RasiChart, NavamsaChart, sequelize } = require('../Models');
const geocoder = require('node-geocoder')({ provider: 'openstreetmap', timeout: 10000 });
const moment = require('moment-timezone');
const astro = require('../services/astroService');

// Check Swiss Ephemeris
let swissephLoaded = false;
try { require('swisseph'); swissephLoaded = true; } 
catch (e) { swissephLoaded = false; }

async function toJulianDayFromUtc(dateObj) {
    return (dateObj.valueOf() / 86400000.0) + 2440587.5;
}

// ------------------ Main Calculation ------------------
exports.calculateChart = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { date, time, place, name = 'Unknown' } = req.body;

        if (!date || !time || !place) {
            await t.rollback();
            return res.status(400).json({ error: 'date, time, place required' });
        }

        const dtLocalRaw = moment.tz(`${date} ${time}`, 'DD-MM-YYYY HH:mm', moment.tz.guess());
        if (!dtLocalRaw.isValid()) {
            await t.rollback();
            return res.status(400).json({ error: 'Invalid date/time format' });
        }

        const geoRes = await geocoder.geocode(place);
        if (!geoRes || geoRes.length === 0) {
            await t.rollback();
            return res.status(400).json({ error: 'Location not found' });
        }
        const { latitude, longitude } = geoRes[0];

        const dtLocal = dtLocalRaw;
        const dtUtc = dtLocal.clone().utc();
        const jd = await toJulianDayFromUtc(dtUtc);

        // Save Meta info
        const meta = await Meta.create({
            place, latitude, longitude,
            local_time: dtLocal.toDate(),
            utc_time: dtUtc.toDate()
        }, { transaction: t });

        // Calculate planets
        let planets = await astro.calculateAll(jd);

        // Add Ketu
        const ketu = await astro.calculateKetuFromRahu(jd);
        planets.push({
            name: ketu.name,
            rasi: ketu.rasi,
            navamsa: ketu.navamsa,
            nakshatra: ketu.nakshatra,
            pada: ketu.pada,
            degree: ketu.degree,
            longitude: ketu.longitude
        });

        // Save Rasi and Navamsa charts
        const rasiRows = planets.map(p => ({
            meta_id: meta.id,
            name: p.name,
            rasi: p.rasi,
            degree: p.degree,
            nakshatra: p.nakshatra,
            pada: p.pada,
            longitude: p.longitude,
            latitude
        }));
        const navRows = planets.map(p => ({
            meta_id: meta.id,
            name: p.name,
            navamsa: p.navamsa,
            nakshatra: p.nakshatra,
            pada: p.pada,
            longitude: p.longitude,
            latitude
        }));

        await RasiChart.bulkCreate(rasiRows, { transaction: t });
        await NavamsaChart.bulkCreate(navRows, { transaction: t });

        // Calculate Lagna (Ascendant)
        const asc = await astro.calculateAscendant(jd, latitude, longitude);
        let lagna = null;
        if (asc !== null) {
            const ascNakshatra = astro.nakshatraInfo(asc);
            lagna = {
                meta_id: meta.id,
                name: 'ল',
                rasi: astro.RASI_TA[Math.floor(asc / 30)],
                navamsa: astro.RASI_TA[astro.navamsaSign(asc)],
                degree: astro.formatDeg(asc),
                nakshatra: ascNakshatra.nakshatra,
                pada: ascNakshatra.pada,
                longitude: asc,
                latitude
            };
            await RasiChart.create(lagna, { transaction: t });
            await NavamsaChart.create({
                meta_id: meta.id,
                name: lagna.name,
                navamsa: lagna.navamsa,
                nakshatra: lagna.nakshatra,
                pada: lagna.pada,
                longitude: asc,
                latitude
            }, { transaction: t });
        }

        await t.commit();

        return res.json({
            success: true,
            message: "Birth chart calculated successfully",
            chart_info: {
                name,
                place,
                coordinates: { latitude, longitude },
                timezone: moment.tz.guess(),
                local_time: dtLocal.toISOString(),
                utc_time: dtUtc.toISOString(),
                julian_day: jd,
                calculation_method: swissephLoaded ? "Swiss Ephemeris" : "Basic Calculations"
            },
            planets,
            lagna,
            meta_id: meta.id
        });

    } catch (err) {
        console.error('calculateChart error', err);
        if (!t.finished) await t.rollback();
        return res.status(500).json({ error: err.message });
    }
};

// ------------------ Other Endpoints ------------------
exports.getChart = async (req, res) => {
    const { id } = req.params;
    const chart = await Meta.findByPk(id, { include: [RasiChart, NavamsaChart] });
    if (!chart) return res.status(404).json({ error: 'Chart not found' });
    res.json(chart);
};

exports.listCharts = async (req, res) => {
    const charts = await Meta.findAll({ include: [RasiChart, NavamsaChart] });
    res.json(charts);
};

exports.deleteChart = async (req, res) => {
    const { id } = req.params;
    const chart = await Meta.findByPk(id);
    if (!chart) return res.status(404).json({ error: 'Chart not found' });
    await chart.destroy();
    res.json({ message: 'Chart deleted successfully' });
};
