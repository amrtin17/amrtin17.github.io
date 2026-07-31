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
   Mobility
========================================== */