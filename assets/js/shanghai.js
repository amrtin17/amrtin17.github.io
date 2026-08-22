/* ==========================================
   Load CSV Data
========================================== */
console.log("Shanghai JS Loaded");


/* ==========================================
   Initialize Charts
========================================== */



/* ==========================================
   KPI
========================================== */



/* ==========================================
   Map
========================================== */

(() => {
    'use strict';

    /* =========================================================
     * Configuration
     * ======================================================= */

    const CONFIG = {
        mapContainerId: 'mapChart',
        findingPanelId: 'findingPanel',
        center: [31.2304, 121.4737],
        zoom: 12,
        tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        tileOptions: {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }
    };

    /* =========================================================
     * Dataset
     * ======================================================= */

    const poiData = [
        {
            id: 1,
            name: 'The Bund',
            latitude: 31.2400,
            longitude: 121.4905,
            videoCount: 58,
            topActivity: 'Sightseeing',
            averageLikes: 48200,
            description: 'Iconic waterfront skyline and the most frequently visited filming location.',
            category: 'Landmark',
            countryCoverage: 31
        },
        {
            id: 2,
            name: 'Yuyuan Garden',
            latitude: 31.2273,
            longitude: 121.4926,
            videoCount: 34,
            topActivity: 'Cultural Exploration',
            averageLikes: 31500,
            description: 'Historic garden featuring traditional Chinese architecture.',
            category: 'Heritage',
            countryCoverage: 22
        },
        {
            id: 3,
            name: 'Nanjing Road',
            latitude: 31.2348,
            longitude: 121.4753,
            videoCount: 41,
            topActivity: 'Shopping',
            averageLikes: 36400,
            description: 'Busy commercial street known for shopping and vibrant nightlife.',
            category: 'Commercial',
            countryCoverage: 27
        },
        {
            id: 4,
            name: 'Lujiazui',
            latitude: 31.2363,
            longitude: 121.4997,
            videoCount: 52,
            topActivity: 'City Skyline',
            averageLikes: 45800,
            description: 'Modern financial district dominated by Shanghai skyscrapers.',
            category: 'Modern City',
            countryCoverage: 30
        },
        {
            id: 5,
            name: 'Former French Concession',
            latitude: 31.2144,
            longitude: 121.4547,
            videoCount: 29,
            topActivity: 'Walking',
            averageLikes: 28600,
            description: 'Tree-lined historic neighbourhood popular for lifestyle content.',
            category: 'Neighbourhood',
            countryCoverage: 19
        },
        {
            id: 6,
            name: 'Xintiandi',
            latitude: 31.2205,
            longitude: 121.4757,
            videoCount: 37,
            topActivity: 'Dining',
            averageLikes: 33700,
            description: 'Lifestyle district combining heritage buildings with modern retail.',
            category: 'Lifestyle',
            countryCoverage: 24
        }
    ];

    /* =========================================================
     * Helper Functions
     * ======================================================= */

    const mapContainer = document.getElementById(CONFIG.mapContainerId);

    if (!mapContainer) return;

    mapContainer.innerHTML = '';

    const getMarkerSize = (count) => {
        const counts = poiData.map(d => d.videoCount);
        const min = Math.min(...counts);
        const max = Math.max(...counts);

        if (min === max) return 24;

        return Math.round(
            18 + ((count - min) / (max - min)) * 18
        );
    };

    const createPopupHTML = (poi) => `
        <div class="poi-popup">
            <strong>${poi.name}</strong><br>
            <div>Videos: ${poi.videoCount}</div>
            <div>Top Activity: ${poi.topActivity}</div>
            <div>Average Likes: ${poi.averageLikes.toLocaleString()}</div>
            <div style="margin-top:6px;">
                ${poi.description}
            </div>
        </div>
    `;

    const createMarkerHTML = (poi, size) => `
        <div class="research-marker" data-id="${poi.id}">
            <div class="marker-core" style="
                width:${size}px;
                height:${size}px;
            ">
                <span class="visitor-indicator"></span>
            </div>
            <div class="marker-label">
                ${poi.name}
            </div>
        </div>
    `;

    const updateFindingPanel = (poi) => {
        const panel = document.getElementById(CONFIG.findingPanelId);

        if (!panel) return;

        panel.innerHTML = `
            <h3>${poi.name}</h3>
            <p><strong>Videos:</strong> ${poi.videoCount}</p>
            <p><strong>Top Activity:</strong> ${poi.topActivity}</p>
            <p><strong>Average Likes:</strong> ${poi.averageLikes.toLocaleString()}</p>
        `;
    };

    /* =========================================================
     * Map Rendering
     * ======================================================= */

    const map = L.map(CONFIG.mapContainerId, {
        zoomControl: true,
        attributionControl: true
    }).setView(CONFIG.center, CONFIG.zoom);

    L.tileLayer(CONFIG.tileUrl, CONFIG.tileOptions).addTo(map);

    /* =========================================================
     * Marker Creation
     * ======================================================= */

    const markers = [];

    poiData.forEach((poi, index) => {

        const markerSize = getMarkerSize(poi.videoCount);

        const icon = L.divIcon({
            className: 'research-div-icon',
            html: createMarkerHTML(poi, markerSize),
            iconSize: [120, 120],
            iconAnchor: [60, 60]
        });

        const marker = L.marker(
            [poi.latitude, poi.longitude],
            {
                icon
            }
        );

        marker.bindPopup(createPopupHTML(poi));

        marker.addTo(map);

        markers.push(marker);

        /* -----------------------------
         * Hover animation
         * --------------------------- */

        marker.on('add', () => {
            const el = marker.getElement();

            if (!el) return;

            el.style.opacity = '0';

            setTimeout(() => {
                el.style.opacity = '1';
            }, index * 120);

            el.addEventListener('mouseenter', () => {
                el.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                el.classList.remove('hover');
            });
        });

        /* -----------------------------
         * Popup + Finding Panel
         * --------------------------- */

        marker.on('click', () => {
            updateFindingPanel(poi);
        });

    });

    /* =========================================================
     * Events
     * ======================================================= */

    window.addEventListener('resize', () => {
        map.invalidateSize();
    });

    /* =========================================================
     * Initialisation
     * ======================================================= */

    setTimeout(() => {
        map.invalidateSize();
    }, 100);

})();


/* ==========================================
   Emotion sankey
========================================== */

// Load Sankey data from CSV and build nodes/links dynamically
const csvPath = "assets/data/experience.csv";
const nodePalette = {
    poi: "#35d0ff",
    interaction: "#44d68a",
    emotion: "#ff9f43"
};

function buildSankeyData(rows) {
    const poiNames = [];
    const interactionNames = [];
    const emotionNames = [];
    const nodeSet = new Set();
    const pathCounts = new Map();

    const addNode = (name, layer) => {
        if (!name) return;

        const targetList = layer === "poi"
            ? poiNames
            : layer === "interaction"
                ? interactionNames
                : emotionNames;

        if (!nodeSet.has(name)) {
            nodeSet.add(name);
            targetList.push(name);
        }
    };

    rows.forEach((row) => {
        const poi = (row.POI || "").trim();
        const interaction = (row.Interaction || "").trim();
        const emotion = (row.Emotion || "").trim();

        if (!poi || !interaction || !emotion) return;

        addNode(poi, "poi");
        addNode(interaction, "interaction");
        addNode(emotion, "emotion");

        const pathKey = `${poi}::${interaction}::${emotion}`;
        pathCounts.set(pathKey, (pathCounts.get(pathKey) || 0) + 1);
    });

    const nodeNames = [...poiNames, ...interactionNames, ...emotionNames];
    const nodes = nodeNames.map((name) => ({ name }));

    const links = [];
    const linkCounts = new Map();

    pathCounts.forEach((count, pathKey) => {
        const [poi, interaction, emotion] = pathKey.split("::");

        const addLink = (source, target) => {
            const key = `${source}::${target}`;
            linkCounts.set(key, (linkCounts.get(key) || 0) + count);
        };

        addLink(poi, interaction);
        addLink(interaction, emotion);
    });

    linkCounts.forEach((value, key) => {
        const [source, target] = key.split("::");
        links.push({ source, target, value });
    });

    return { nodes, links, poiCount: poiNames.length, interactionCount: interactionNames.length, emotionCount: emotionNames.length };
}

function createStyledNodes(nodes, poiCount, interactionCount) {
    return nodes.map((node, index) => {
        let category = "poi";

        if (index >= poiCount && index < poiCount + interactionCount) {
            category = "interaction";
        } else if (index >= poiCount + interactionCount) {
            category = "emotion";
        }

        return {
            ...node,
            itemStyle: {
                color: nodePalette[category],
                borderColor: "rgba(255,255,255,0.18)",
                borderWidth: 1
            },
            label: {
                color: "#f5f7fb",
                fontSize: 12,
                fontWeight: 500
            }
        };
    });
}

function createStyledLinks(links) {
    return links.map((link) => ({
        ...link,
        lineStyle: {
            color: "gradient",
            opacity: 0.8,
            curveness: 0.55
        }
    }));
}

function renderEmotionChart(rows) {
    const { nodes, links, poiCount, interactionCount } = buildSankeyData(rows);

    if (!nodes.length || !links.length) {
        console.log("No Sankey data found.");
        return;
    }

    const styledNodes = createStyledNodes(nodes, poiCount, interactionCount);
    const styledLinks = createStyledLinks(links);

    emotionChart.setOption({
        series: [{
            type: "sankey",
            top: 80,
            bottom: 24,
            left: 24,
            right: 56,
            nodeWidth: 20,
            nodeGap: 24,
            nodeAlign: "justify",
            layoutIterations: 72,
            draggable: false,
            data: styledNodes,
            links: styledLinks,

            focusNodeAdjacency: true,
            emphasis: {
                focus: "adjacency",
                scale: true
            },

            label: {
                color: "#f5f7fb",
                fontSize: 12,
                fontWeight: 500,
                overflow: "break"
            },

            labelLayout: {
                moveOverlap: "shiftY"
            },

            lineStyle: {
                color: "gradient",
                curveness: 0.55,
                width: 1.2,
                opacity: 0.8
            },

            itemStyle: {
                borderColor: "rgba(255,255,255,0.18)",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0,0,0,0.3)"
            }
        }]
    });
}

function loadEmotionData() {
    if (window.Papa) {
        Papa.parse(csvPath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => renderEmotionChart(results.data),
            error: (error) => console.error("Failed to load Sankey CSV:", error)
        });
        return;
    }

    const scriptId = "papaparse-script";
    if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
        script.async = true;
        script.onload = () => {
            Papa.parse(csvPath, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: (results) => renderEmotionChart(results.data),
                error: (error) => console.error("Failed to load Sankey CSV:", error)
            });
        };
        script.onerror = () => console.error("PapaParse failed to load.");
        document.head.appendChild(script);
        return;
    }

    console.warn("PapaParse is still loading. Please wait.");
}

const emotionChart = echarts.init(document.getElementById("emotionChart"));

emotionChart.setOption({
    backgroundColor: "transparent",

    title: {
        text: "How visitors experience Shanghai",
        subtext: "From places to embodied interactions and emotional responses",
        left: "center",
        top: 10,
        textStyle: {
            color: "#f5f7fb",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "Inter, Segoe UI, sans-serif"
        },
        subtextStyle: {
            color: "#8ba6bb",
            fontSize: 12,
            fontWeight: 500
        }
    },

    tooltip: {
        trigger: "item",
        backgroundColor: "rgba(4, 10, 18, 0.95)",
        borderColor: "rgba(53,208,255,0.35)",
        borderWidth: 1,
        textStyle: {
            color: "#f5f7fb"
        },
        formatter: function (params) {
            if (params.dataType === "node") {
                return `${params.name}`;
            }
            return `Source → Target<br/>${params.data.source} → ${params.data.target}<br/>Count: ${params.value}`;
        }
    },

    series: [{
        type: "sankey",
        top: 80,
        bottom: 24,
        left: 24,
        right: 56,
        nodeWidth: 20,
        nodeGap: 24,
        nodeAlign: "justify",
        layoutIterations: 72,
        draggable: true,
        data: [],
        links: [],

        focusNodeAdjacency: true,
        emphasis: {
            focus: "adjacency",
            scale: true
        },

        label: {
            color: "#f5f7fb",
            fontSize: 12,
            fontWeight: 500,
            overflow: "break"
        },

        labelLayout: {
            moveOverlap: "shiftY"
        },

        lineStyle: {
            color: "gradient",
            curveness: 0.55,
            width: 1.2,
            opacity: 0.8
        },

        itemStyle: {
            borderColor: "rgba(255,255,255,0.18)",
            borderWidth: 1,
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.3)"
        }
    }],

    animationDuration: 800,
    animationEasing: "cubicOut"
});

loadEmotionData();

window.addEventListener("resize", () => {
    emotionChart.resize();
});


/* ==========================================
   Experience
========================================== */



/* ==========================================
   Description
========================================== */
/* ============================================================
   PLACE → IMPRESSION VISUALIZATION
   Shanghai Digital Humanities Dashboard
   ------------------------------------------------------------
   Relationship:
       POI → Impression

   Assumptions:
   - D3.js is already loaded.
   - HTML contains:
       <div id="placePerceptionChart"></div>
   - Existing project dataset is available globally as one of:
       DATA
       data
       codingData
       placePerceptionData
       window.DATA
       window.codingData
       window.placePerceptionData

   No semantic words are generated by this module.
   Every displayed impression comes from the dataset.
============================================================ */

(function () {
    "use strict";

    /* ==========================================================
       CONFIGURATION
    ========================================================== */

    const CONFIG = {
        container: "#placePerceptionChart",

        maxPOIs: 8,

        minWordsPerPOI: 3,
        maxWordsPerPOI: 8,

        poiLabelSize: 13,
        minWordSize: 13,
        maxWordSize: 38,

        accent: "#55e6ff",
        textPrimary: "#e8f7fb",
        textSecondary: "#8faeb8",
        lineColor: "#4db8ca",

        lineOpacity: 0.16,
        activeLineOpacity: 0.78,

        background: "transparent",

        anchorHeight: 92,

        transitionDuration: 350,

        seed: 20260822
    };


    /* ==========================================================
       DATA RESOLUTION
    ========================================================== */

    function resolveDataset() {
        const candidates = [];

        try {
            if (typeof DATA !== "undefined") candidates.push(DATA);
        } catch (e) {}

        try {
            if (typeof data !== "undefined") candidates.push(data);
        } catch (e) {}

        try {
            if (typeof codingData !== "undefined") candidates.push(codingData);
        } catch (e) {}

        try {
            if (typeof placePerceptionData !== "undefined") {
                candidates.push(placePerceptionData);
            }
        } catch (e) {}

        if (Array.isArray(window.DATA)) {
            candidates.push(window.DATA);
        }

        if (Array.isArray(window.data)) {
            candidates.push(window.data);
        }

        if (Array.isArray(window.codingData)) {
            candidates.push(window.codingData);
        }

        if (Array.isArray(window.placePerceptionData)) {
            candidates.push(window.placePerceptionData);
        }

        const dataset = candidates.find(
            candidate =>
                Array.isArray(candidate) &&
                candidate.length > 0 &&
                candidate.some(row =>
                    row &&
                    Object.prototype.hasOwnProperty.call(row, "POI") &&
                    Object.prototype.hasOwnProperty.call(row, "Impression")
                )
        );

        if (!dataset) {
            console.warn(
                "[PlacePerception] No compatible dataset found. " +
                "Expected fields: POI and Impression."
            );
            return [];
        }

        return dataset;
    }


    /* ==========================================================
       UTILITIES
    ========================================================== */

    function cleanString(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    function normalizeKey(value) {
        return cleanString(value)
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function titleCase(value) {
        return cleanString(value)
            .replace(/\s+/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    function safeNumber(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    /*
     * Deterministic pseudo-random generator.
     * The visualization therefore remains stable between renders.
     */
    function seededRandom(seed) {
        let state = seed >>> 0;

        return function () {
            state += 0x6D2B79F5;

            let t = state;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    const random = seededRandom(CONFIG.seed);


    /*
     * Impression values may occasionally contain multiple coded
     * values. Split only obvious delimiters. Ordinary spaces are
     * preserved because they may form meaningful expressions.
     */
    function parseImpressions(value) {
        const raw = cleanString(value);

        if (!raw) return [];

        return raw
            .split(/\s*[;|]\s*/)
            .map(item => item.trim())
            .filter(Boolean);
    }


    /* ==========================================================
       DATA TRANSFORMATION
    ========================================================== */

    function prepareData(rawData) {
        const poiMap = new Map();

        rawData.forEach(row => {
            const poiRaw = cleanString(row.POI);
            const impressionValues = parseImpressions(row.Impression);

            if (!poiRaw || impressionValues.length === 0) return;

            const poiKey = normalizeKey(poiRaw);

            if (!poiMap.has(poiKey)) {
                poiMap.set(poiKey, {
                    key: poiKey,
                    label: poiRaw,
                    videos: new Set(),
                    impressions: new Map()
                });
            }

            const poi = poiMap.get(poiKey);

            const videoId =
                cleanString(row.Video_ID) ||
                `row-${rawData.indexOf(row)}`;

            poi.videos.add(videoId);

            impressionValues.forEach(impressionRaw => {
                const display = cleanString(impressionRaw);
                const key = normalizeKey(display);

                if (!key) return;

                if (!poi.impressions.has(key)) {
                    poi.impressions.set(key, {
                        key,
                        label: display,
                        frequency: 0,
                        videos: new Set()
                    });
                }

                const impression = poi.impressions.get(key);

                impression.frequency += 1;
                impression.videos.add(videoId);
            });
        });

        /*
         * Rank POIs by unique videos rather than raw rows.
         * This prevents one creator/video with many coded rows from
         * disproportionately dominating the visual.
         */
        const pois = Array.from(poiMap.values())
            .map(poi => ({
                ...poi,
                videoCount: poi.videos.size,
                impressionCount: Array.from(poi.impressions.values())
                    .reduce((sum, item) => sum + item.frequency, 0)
            }))
            .sort((a, b) => {
                if (b.videoCount !== a.videoCount) {
                    return b.videoCount - a.videoCount;
                }

                return b.impressionCount - a.impressionCount;
            })
            .slice(0, CONFIG.maxPOIs);

        /*
         * Only retain the most frequent impressions for each POI.
         * Importantly, these are still 100% dataset-derived values.
         */
        pois.forEach(poi => {
            poi.words = Array.from(poi.impressions.values())
                .sort((a, b) => {
                    if (b.frequency !== a.frequency) {
                        return b.frequency - a.frequency;
                    }

                    return a.label.localeCompare(b.label);
                })
                .slice(0, CONFIG.maxWordsPerPOI);
        });

        return pois;
    }


    /* ==========================================================
       SVG INITIALISATION
    ========================================================== */

    function createSVG(container, width, height) {
        container.selectAll("*").remove();

        const svg = container
            .append("svg")
            .attr("class", "place-perception-svg")
            .attr("width", "100%")
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("display", "block")
            .style("overflow", "visible")
            .style("background", CONFIG.background);

        /*
         * Subtle upper atmospheric geometry.
         * This is decorative only and carries no quantitative meaning.
         */
        const atmosphere = svg
            .append("g")
            .attr("class", "pp-atmosphere")
            .attr("pointer-events", "none");

        atmosphere
            .append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.04)
            .attr("stroke-width", 1);

        return svg;
    }


    /* ==========================================================
       LAYOUT
    ========================================================== */

    function calculatePOIPositions(pois, width, height) {
        const usableWidth = width * 0.90;
        const startX = width * 0.05;

        const spacing =
            pois.length > 1
                ? usableWidth / (pois.length - 1)
                : usableWidth;

        return pois.map((poi, index) => ({
            ...poi,
            x:
                pois.length === 1
                    ? width / 2
                    : startX + spacing * index,
            y: height - CONFIG.anchorHeight / 2 - 10
        }));
    }


    /*
     * Approximate text dimensions without requiring DOM measurement.
     * This makes the layout deterministic and responsive.
     */
    function estimateWordWidth(label, fontSize) {
        return Math.max(
            35,
            label.length * fontSize * 0.56
        );
    }

    function estimateWordHeight(fontSize) {
        return fontSize * 1.25;
    }


    /*
     * Organic semantic layout.
     *
     * Instead of a rectangular word cloud:
     * - every POI gets a vertical semantic "column"
     * - words drift sideways around that column
     * - height is decorative
     * - a deterministic jitter produces an organic atmosphere
     */
    function calculateWordLayout(poi, index, width, height, wordScale) {
        const words = poi.words || [];

        const clusterCenterX = poi.x;

        /*
         * Keep semantic clouds mostly above their own POI,
         * while allowing limited horizontal drift.
         */
        const availableDrift = Math.min(
            width / Math.max(poiCountGlobal, 1) * 0.34,
            115
        );

        const placed = [];

        words.forEach((word, wordIndex) => {
            const fontSize = wordScale(word.frequency);

            const textWidth =
                estimateWordWidth(word.label, fontSize);

            const textHeight =
                estimateWordHeight(fontSize);

            /*
             * Deterministic radial/organic arrangement.
             */
            const angle =
                (wordIndex * 2.399963) +
                index * 0.77;

            const radius =
                25 +
                wordIndex * 15 +
                random() * 20;

            let x =
                clusterCenterX +
                Math.cos(angle) *
                Math.min(radius, availableDrift);

            let y =
                poi.y -
                105 -
                wordIndex * 43 -
                Math.sin(angle) * 24 -
                random() * 35;

            /*
             * Keep text within viewport.
             */
            const halfWidth = textWidth / 2;

            x = Math.max(
                halfWidth + 8,
                Math.min(width - halfWidth - 8, x)
            );

            y = Math.max(
                35,
                Math.min(height - CONFIG.anchorHeight - 15, y)
            );

            /*
             * Lightweight deterministic collision avoidance.
             *
             * We only adjust words belonging to the same POI.
             * This keeps clusters organic without turning the whole
             * visualization into a force-directed network.
             */
            let attempts = 0;

            while (
                placed.some(existing =>
                    Math.abs(existing.x - x) <
                        (existing.width + textWidth) * 0.43 &&
                    Math.abs(existing.y - y) <
                        (existing.height + textHeight) * 0.55
                ) &&
                attempts < 12
            ) {
                y -= 14;

                if (attempts % 2 === 0) {
                    x += 13;
                } else {
                    x -= 18;
                }

                attempts++;
            }

            placed.push({
                ...word,
                poiKey: poi.key,
                poiLabel: poi.label,
                x,
                y,
                width: textWidth,
                height: textHeight,
                fontSize
            });
        });

        return placed;
    }


    /* ==========================================================
       POI SILHOUETTES
    ========================================================== */

    function drawSkyline(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        const buildings = [
            { x: -42, y: 23, w: 15, h: 37 },
            { x: -23, y: 10, w: 17, h: 50 },
            { x: -2, y: 29, w: 13, h: 31 },
            { x: 14, y: -2, w: 16, h: 62 },
            { x: 34, y: 19, w: 13, h: 41 }
        ];

        g.selectAll("rect")
            .data(buildings)
            .enter()
            .append("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.w)
            .attr("height", d => d.h)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.72)
            .attr("stroke-width", 1);

        g.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", -14)
            .attr("y2", 3)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", 1);

        g.append("circle")
            .attr("cx", 0)
            .attr("cy", -17)
            .attr("r", 3)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.8);
    }


    function drawPavilion(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        g.append("path")
            .attr("d", "M-43,10 L0,-15 L43,10 L34,10 L0,-6 L-34,10 Z")
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.82)
            .attr("stroke-width", 1.3);

        [-25, -8, 8, 25].forEach(x => {
            g.append("line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 9)
                .attr("y2", 49)
                .attr("stroke", CONFIG.accent)
                .attr("stroke-opacity", 0.68)
                .attr("stroke-width", 1);
        });

        g.append("line")
            .attr("x1", -35)
            .attr("x2", 35)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", 1);
    }


    function drawCastle(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        g.append("rect")
            .attr("x", -34)
            .attr("y", 18)
            .attr("width", 68)
            .attr("height", 34)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.75)
            .attr("stroke-width", 1.2);

        [-27, 0, 27].forEach((x, i) => {
            const towerHeight = i === 1 ? 55 : 45;

            g.append("rect")
                .attr("x", x - 9)
                .attr("y", 52 - towerHeight)
                .attr("width", 18)
                .attr("height", towerHeight)
                .attr("fill", "none")
                .attr("stroke", CONFIG.accent)
                .attr("stroke-opacity", 0.75)
                .attr("stroke-width", 1);

            g.append("path")
                .attr(
                    "d",
                    `M${x - 12},${52 - towerHeight}
                     L${x},${42 - towerHeight}
                     L${x + 12},${52 - towerHeight}`
                )
                .attr("fill", "none")
                .attr("stroke", CONFIG.accent)
                .attr("stroke-opacity", 0.8)
                .attr("stroke-width", 1);
        });

        g.append("path")
            .attr("d", "M-8,52 L-8,34 Q0,25 8,34 L8,52")
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", 1);
    }


    function drawStorefront(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        g.append("rect")
            .attr("x", -43)
            .attr("y", 4)
            .attr("width", 86)
            .attr("height", 47)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.72)
            .attr("stroke-width", 1);

        g.append("path")
            .attr("d", "M-48,5 L48,5 L40,20 L-40,20 Z")
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.65)
            .attr("stroke-width", 1);

        g.append("rect")
            .attr("x", -10)
            .attr("y", 29)
            .attr("width", 20)
            .attr("height", 22)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.62)
            .attr("stroke-width", 1);

        g.append("line")
            .attr("x1", -30)
            .attr("x2", -17)
            .attr("y1", 30)
            .attr("y2", 30)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.6);

        g.append("line")
            .attr("x1", 17)
            .attr("x2", 30)
            .attr("y1", 30)
            .attr("y2", 30)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.6);
    }


    function drawCafe(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        g.append("rect")
            .attr("x", -37)
            .attr("y", 8)
            .attr("width", 74)
            .attr("height", 43)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.7);

        g.append("path")
            .attr("d", "M-42,8 L42,8")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.9);

        g.append("circle")
            .attr("cx", -19)
            .attr("cy", 29)
            .attr("r", 7)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.7);

        g.append("path")
            .attr("d", "M-12,29 Q0,17 12,29")
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.7);

        g.append("rect")
            .attr("x", 20)
            .attr("y", 25)
            .attr("width", 10)
            .attr("height", 26)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.65);
    }


    function drawRestaurant(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        g.append("path")
            .attr("d", "M-44,4 L0,-13 L44,4")
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.8);

        g.append("rect")
            .attr("x", -39)
            .attr("y", 4)
            .attr("width", 78)
            .attr("height", 47)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.68);

        g.append("rect")
            .attr("x", -9)
            .attr("y", 28)
            .attr("width", 18)
            .attr("height", 23)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.65);
    }


    function drawGenericAnchor(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        g.append("rect")
            .attr("x", -34)
            .attr("y", 3)
            .attr("width", 68)
            .attr("height", 48)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.65);

        g.append("line")
            .attr("x1", -42)
            .attr("x2", 42)
            .attr("y1", 3)
            .attr("y2", 3)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.8);

        g.append("circle")
            .attr("cx", 0)
            .attr("cy", 27)
            .attr("r", 9)
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.65);
    }


    function selectAnchorType(label) {
        const value = normalizeKey(label);

        if (
            value.includes("bund") ||
            value.includes("waitan") ||
            value.includes("lujiazui") ||
            value.includes("pudong")
        ) {
            return "skyline";
        }

        if (
            value.includes("yuyuan") ||
            value.includes("yu yuan") ||
            value.includes("garden")
        ) {
            return "pavilion";
        }

        if (
            value.includes("disney") ||
            value.includes("castle")
        ) {
            return "castle";
        }

        if (
            value.includes("cafe") ||
            value.includes("coffee") ||
            value.includes("咖啡")
        ) {
            return "cafe";
        }

        if (
            value.includes("restaurant") ||
            value.includes("dining") ||
            value.includes("food") ||
            value.includes("餐厅")
        ) {
            return "restaurant";
        }

        if (
            value.includes("nanjing") ||
            value.includes("xintiandi") ||
            value.includes("shopping") ||
            value.includes("mall")
        ) {
            return "storefront";
        }

        return "generic";
    }


    function drawPOIAnchor(group, poi) {
        const type = selectAnchorType(poi.label);

        const iconGroup = group
            .append("g")
            .attr("class", "poi-icon");

        const scale =
            poi.label.length > 16
                ? 0.82
                : 1;

        if (type === "skyline") {
            drawSkyline(iconGroup, scale);
        } else if (type === "pavilion") {
            drawPavilion(iconGroup, scale);
        } else if (type === "castle") {
            drawCastle(iconGroup, scale);
        } else if (type === "storefront") {
            drawStorefront(iconGroup, scale);
        } else if (type === "cafe") {
            drawCafe(iconGroup, scale);
        } else if (type === "restaurant") {
            drawRestaurant(iconGroup, scale);
        } else {
            drawGenericAnchor(iconGroup, scale);
        }
    }


    /* ==========================================================
       GLOBAL STATE
    ========================================================== */

    let svgGlobal = null;
    let poiLayerGlobal = null;
    let lineLayerGlobal = null;
    let wordLayerGlobal = null;

    let poiSelectionGlobal = null;
    let lineSelectionGlobal = null;
    let wordSelectionGlobal = null;

    let currentPOIs = [];
    let currentWords = [];

    let poiCountGlobal = 1;

    let tooltipGlobal = null;


    /* ==========================================================
       TOOLTIP
    ========================================================== */

    function createTooltip() {
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "place-perception-tooltip")
            .style("position", "fixed")
            .style("z-index", "99999")
            .style("pointer-events", "none")
            .style("display", "none")
            .style("padding", "10px 13px")
            .style("background", "rgba(4, 10, 18, 0.96)")
            .style("border", `1px solid ${CONFIG.accent}`)
            .style("border-radius", "2px")
            .style("box-shadow", "0 0 18px rgba(0, 220, 255, 0.12)")
            .style("font-family", "inherit")
            .style("font-size", "12px")
            .style("line-height", "1.5")
            .style("color", CONFIG.textPrimary)
            .style("white-space", "nowrap");

        return tooltip;
    }

    function showTooltip(event, html) {
        if (!tooltipGlobal) return;

        tooltipGlobal
            .html(html)
            .style("display", "block")
            .style("left", `${event.clientX + 14}px`)
            .style("top", `${event.clientY + 14}px`);
    }

    function moveTooltip(event) {
        if (!tooltipGlobal) return;

        tooltipGlobal
            .style("left", `${event.clientX + 14}px`)
            .style("top", `${event.clientY + 14}px`);
    }

    function hideTooltip() {
        if (!tooltipGlobal) return;

        tooltipGlobal.style("display", "none");
    }


    /* ==========================================================
       INTERACTION
    ========================================================== */

    function clearHighlight() {
        if (!poiSelectionGlobal) return;

        poiSelectionGlobal
            .transition()
            .duration(CONFIG.transitionDuration)
            .style("opacity", 1);

        wordSelectionGlobal
            .transition()
            .duration(CONFIG.transitionDuration)
            .style("opacity", 1)
            .attr("fill", CONFIG.textPrimary)
            .attr("font-weight", d =>
                d.frequency >= 2 ? 600 : 400
            );

        lineSelectionGlobal
            .transition()
            .duration(CONFIG.transitionDuration)
            .attr("stroke-opacity", CONFIG.lineOpacity)
            .attr("stroke-width", 0.8);
    }


    function highlightPOI(poiKey) {
        poiSelectionGlobal
            .transition()
            .duration(CONFIG.transitionDuration)
            .style("opacity", d =>
                d.key === poiKey ? 1 : 0.18
            );

        wordSelectionGlobal
            .transition()
            .duration(CONFIG.transitionDuration)
            .style("opacity", d =>
                d.poiKey === poiKey ? 1 : 0.12
            )
            .attr("fill", d =>
                d.poiKey === poiKey
                    ? CONFIG.textPrimary
                    : CONFIG.textSecondary
            )
            .attr("font-weight", d =>
                d.poiKey === poiKey
                    ? 650
                    : 400
            );

        lineSelectionGlobal
            .transition()
            .duration(CONFIG.transitionDuration)
            .attr("stroke-opacity", d =>
                d.poiKey === poiKey
                    ? CONFIG.activeLineOpacity
                    : 0.035
            )
            .attr("stroke-width", d =>
                d.poiKey === poiKey
                    ? 1.15
                    : 0.5
            );
    }


    function highlightWord(word) {
        highlightPOI(word.poiKey);

        wordSelectionGlobal
            .filter(d => d.key === word.key && d.poiKey === word.poiKey)
            .transition()
            .duration(CONFIG.transitionDuration)
            .attr("fill", CONFIG.accent)
            .attr("font-weight", 700);
    }


    function attachInteractions() {
        poiSelectionGlobal
            .on("mouseenter", function (event, d) {
                highlightPOI(d.key);

                showTooltip(
                    event,
                    `<strong>${d.label}</strong><br>
                     ${d.videoCount} video${d.videoCount === 1 ? "" : "s"}<br>
                     ${d.impressionCount} impression coding${d.impressionCount === 1 ? "" : "s"}`
                );
            })
            .on("mousemove", moveTooltip)
            .on("mouseleave", function () {
                clearHighlight();
                hideTooltip();
            })
            .on("click", function (event, d) {
                event.stopPropagation();
                highlightPOI(d.key);
            });

        wordSelectionGlobal
            .on("mouseenter", function (event, d) {
                highlightWord(d);

                showTooltip(
                    event,
                    `<strong>${d.label}</strong><br>
                     Frequency: ${d.frequency}<br>
                     Videos: ${d.videos.size}<br>
                     Source: ${d.poiLabel}`
                );
            })
            .on("mousemove", moveTooltip)
            .on("mouseleave", function () {
                clearHighlight();
                hideTooltip();
            })
            .on("click", function (event, d) {
                event.stopPropagation();
                highlightWord(d);
            });

        svgGlobal.on("click", function () {
            clearHighlight();
            hideTooltip();
        });
    }


    /* ==========================================================
       DRAW TETHER LINES
    ========================================================== */

    function drawTetherLines(words, poiPositions) {
        const poiLookup = new Map(
            poiPositions.map(poi => [poi.key, poi])
        );

        lineLayerGlobal
            .selectAll(".poi-word-line")
            .data(words, d => `${d.poiKey}__${d.key}`)
            .enter()
            .append("path")
            .attr("class", "poi-word-line")
            .attr("d", d => {
                const poi = poiLookup.get(d.poiKey);

                const startX = poi.x;
                const startY = poi.y - 47;

                const endX = d.x;
                const endY = d.y + d.height * 0.25;

                const midpointY =
                    startY +
                    (endY - startY) * 0.52;

                const curveOffset =
                    (endX - startX) * 0.15;

                return `
                    M ${startX} ${startY}
                    C
                    ${startX + curveOffset} ${midpointY},
                    ${endX - curveOffset} ${midpointY},
                    ${endX} ${endY}
                `;
            })
            .attr("fill", "none")
            .attr("stroke", CONFIG.lineColor)
            .attr("stroke-width", 0.8)
            .attr("stroke-opacity", CONFIG.lineOpacity)
            .attr("pointer-events", "none");
    }


    /* ==========================================================
       DRAW WORDS
    ========================================================== */

    function drawWords(words) {
        wordSelectionGlobal = wordLayerGlobal
            .selectAll(".impression-word")
            .data(
                words,
                d => `${d.poiKey}__${d.key}`
            )
            .enter()
            .append("text")
            .attr("class", "impression-word")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-family", "inherit")
            .attr("font-size", d => `${d.fontSize}px`)
            .attr("font-weight", d =>
                d.frequency >= 3 ? 650 : 450
            )
            .attr("letter-spacing", "0.01em")
            .attr("fill", CONFIG.textPrimary)
            .attr("fill-opacity", 0.94)
            .style("cursor", "pointer")
            .style("user-select", "none")
            .text(d => d.label);

        /*
         * Tiny semantic halo.
         * It visually separates the words from the background
         * without converting them into conventional bubbles.
         */
        wordSelectionGlobal
            .each(function (d) {
                const text = d3.select(this);

                text.clone(true)
                    .lower()
                    .attr("class", "impression-word-halo")
                    .attr("fill", "none")
                    .attr("stroke", CONFIG.accent)
                    .attr("stroke-opacity", 0.035)
                    .attr("stroke-width", 5)
                    .attr("pointer-events", "none");
            });
    }


    /* ==========================================================
       DRAW POI ANCHORS
    ========================================================== */

    function drawPOIs(poiPositions) {
        poiSelectionGlobal = poiLayerGlobal
            .selectAll(".poi-anchor")
            .data(
                poiPositions,
                d => d.key
            )
            .enter()
            .append("g")
            .attr("class", "poi-anchor")
            .attr(
                "transform",
                d => `translate(${d.x},${d.y})`
            )
            .style("cursor", "pointer");

        /*
         * Grounding line.
         */
        poiSelectionGlobal
            .append("line")
            .attr("x1", -48)
            .attr("x2", 48)
            .attr("y1", 53)
            .attr("y2", 53)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.14)
            .attr("stroke-width", 1);

        /*
         * Anchor marker.
         */
        poiSelectionGlobal
            .append("circle")
            .attr("class", "poi-node")
            .attr("cx", 0)
            .attr("cy", -51)
            .attr("r", 2.2)
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.72);

        poiSelectionGlobal.each(function (d) {
            drawPOIAnchor(
                d3.select(this),
                d
            );
        });

        /*
         * POI label.
         */
        poiSelectionGlobal
            .append("text")
            .attr("class", "poi-label")
            .attr("x", 0)
            .attr("y", 72)
            .attr("text-anchor", "middle")
            .attr("font-family", "inherit")
            .attr("font-size", `${CONFIG.poiLabelSize}px`)
            .attr("font-weight", 550)
            .attr("letter-spacing", "0.035em")
            .attr("fill", CONFIG.textPrimary)
            .attr("fill-opacity", 0.9)
            .text(d => d.label);

        /*
         * Frequency metadata — intentionally subtle.
         */
        poiSelectionGlobal
            .append("text")
            .attr("class", "poi-meta")
            .attr("x", 0)
            .attr("y", 89)
            .attr("text-anchor", "middle")
            .attr("font-family", "inherit")
            .attr("font-size", "9px")
            .attr("letter-spacing", "0.12em")
            .attr("fill", CONFIG.textSecondary)
            .attr("fill-opacity", 0.62)
            .text(d =>
                `${d.videoCount} VIDEO${d.videoCount === 1 ? "" : "S"}`
            );
    }


    /* ==========================================================
       WORD SCALE
    ========================================================== */

    function createWordScale(pois) {
        const frequencies = pois
            .flatMap(poi =>
                poi.words.map(word => word.frequency)
            );

        const minFrequency =
            d3.min(frequencies) || 1;

        const maxFrequency =
            d3.max(frequencies) || 1;

        /*
         * Square-root scaling prevents one highly frequent word
         * from overwhelming the whole composition.
         */
        return d3.scaleSqrt()
            .domain([
                minFrequency,
                Math.max(minFrequency, maxFrequency)
            ])
            .range([
                CONFIG.minWordSize,
                CONFIG.maxWordSize
            ]);
    }


    /* ==========================================================
       RESPONSIVE HEIGHT
    ========================================================== */

    function calculateHeight(width) {
        /*
         * Wide screens:
         *      ~560–650 px
         *
         * Narrow screens:
         *      increase height so semantic clusters remain readable.
         */
        if (width >= 1200) return 590;
        if (width >= 900) return 620;
        if (width >= 700) return 690;

        return Math.max(
            760,
            width * 0.92
        );
    }


    /* ==========================================================
       MAIN RENDER FUNCTION
    ========================================================== */

    function renderPlacePerception() {
        const container = d3.select(CONFIG.container);

        if (container.empty()) {
            console.warn(
                "[PlacePerception] #placePerceptionChart not found."
            );
            return;
        }

        const rawData = resolveDataset();

        if (!rawData.length) {
            container
                .html("")
                .append("div")
                .style("padding", "30px")
                .style("font-family", "inherit")
                .style("font-size", "12px")
                .style("letter-spacing", "0.08em")
                .style("color", CONFIG.textSecondary)
                .text("NO PLACE–IMPRESSION DATA AVAILABLE");

            return;
        }

        const pois = prepareData(rawData);

        if (!pois.length) {
            container
                .html("")
                .append("div")
                .style("padding", "30px")
                .style("font-family", "inherit")
                .style("font-size", "12px")
                .style("color", CONFIG.textSecondary)
                .text("NO VALID POI / IMPRESSION RELATIONSHIPS FOUND");

            return;
        }

        currentPOIs = pois;
        poiCountGlobal = pois.length;

        const node = container.node();

        const width =
            node.getBoundingClientRect().width ||
            1100;

        const height =
            calculateHeight(width);

        /*
         * Re-seed on every render so resizing does not produce
         * a different semantic composition.
         */
        random.seed = CONFIG.seed;

        svgGlobal =
            createSVG(container, width, height);

        /*
         * Three explicit visual layers:
         *
         * 1. POI anchors
         * 2. Tether lines
         * 3. Floating impressions
         */
        lineLayerGlobal = svgGlobal
            .append("g")
            .attr("class", "pp-tether-layer");

        wordLayerGlobal = svgGlobal
            .append("g")
            .attr("class", "pp-word-layer");

        poiLayerGlobal = svgGlobal
            .append("g")
            .attr("class", "pp-poi-layer");

        const poiPositions =
            calculatePOIPositions(
                pois,
                width,
                height
            );

        const wordScale =
            createWordScale(pois);

        let allWords = [];

        poiPositions.forEach((poi, index) => {
            const words =
                calculateWordLayout(
                    poi,
                    index,
                    width,
                    height,
                    wordScale
                );

            allWords.push(...words);
        });

        currentWords = allWords;

        drawTetherLines(
            allWords,
            poiPositions
        );

        drawWords(allWords);

        drawPOIs(poiPositions);

        attachInteractions();

        /*
         * Small descriptive baseline.
         * This is not a quantitative axis.
         */
        svgGlobal
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 7)
            .attr("text-anchor", "middle")
            .attr("font-family", "inherit")
            .attr("font-size", "9px")
            .attr("letter-spacing", "0.16em")
            .attr("fill", CONFIG.textSecondary)
            .attr("fill-opacity", 0.42)
            .text("PLACE → DESCRIPTION");


        /*
         * Gentle entrance animation.
         * No data meaning is encoded by the animation.
         */
        wordLayerGlobal
            .selectAll(".impression-word")
            .attr(
                "transform",
                "translate(0, 12)"
            )
            .attr("opacity", 0)
            .transition()
            .delay((d, i) => i * 25)
            .duration(650)
            .ease(d3.easeCubicOut)
            .attr("transform", "translate(0, 0)")
            .attr("opacity", 1);

        lineLayerGlobal
            .selectAll(".poi-word-line")
            .attr("stroke-dasharray", "2 5")
            .attr("stroke-dashoffset", 8)
            .transition()
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr("stroke-dashoffset", 0);
    }


    /* ==========================================================
       RESPONSIVE RESIZE
    ========================================================== */

    let resizeTimer = null;

    function handleResize() {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            renderPlacePerception();
        }, 180);
    }


    /* ==========================================================
       INITIALISATION
    ========================================================== */

    tooltipGlobal = createTooltip();

    /*
     * Public API for the existing dashboard.
     *
     * Other modules can call:
     *
     *     window.initPlacePerception();
     *
     * after loading or replacing the dataset.
     */
    window.initPlacePerception = renderPlacePerception;

    window.renderPlacePerception = renderPlacePerception;

    window.addEventListener(
        "resize",
        handleResize,
        { passive: true }
    );


    /*
     * Render after D3 / existing DATA are available.
     *
     * requestAnimationFrame allows this module to coexist with
     * other dashboard modules that initialise during page load.
     */
    requestAnimationFrame(() => {
        renderPlacePerception();
    });

})();