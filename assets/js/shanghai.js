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
   Q2. Landmark vs Consumption
========================================== */

(() => {
    'use strict';

    /* =========================================================
     * Configuration
     * ======================================================= */

    const CONFIG = {

        chartContainerId: 'placeTypeChart',

        // Same CSV used by Q5
        csvPath: 'assets/data/description.csv',

        // SVG height
        height: 540,
        maxWidth: 760,

        // Chart margins
        margin: {
            top: 70,
            right: 100,
            bottom: 50,
            left: 60
        },

        // Fixed coordinate range
        domain: [-1, 1],

        // Marker size
        minRadius: 7,
        maxRadius: 24,

        // Q1 marker visual language
        markerColor: '#35d0ff',
        markerFill: 'rgba(53,208,255,.40)',
        markerStroke: 'rgba(53,208,255,.28)',

        // Text
        textColor: '#f5f7fb',
        mutedColor: '#9db2c1',
        axisColor: 'rgba(157,178,193,.45)'

    };


    /* =========================================================
     * Container
     * ======================================================= */

    const container =
        document.getElementById(
            CONFIG.chartContainerId
        );

    if (!container) return;

    container.innerHTML = '';


    /* =========================================================
     * Load CSV
     * ======================================================= */

    d3.csv(CONFIG.csvPath)
        .then(rawData => {

            if (!rawData || !rawData.length) {

                console.warn(
                    'Q2: CSV contains no data.'
                );

                return;
            }


            /* =================================================
             * Aggregate POIs
             * ================================================= */

            const poiMap = new Map();

            rawData.forEach(row => {

                const poi =
                    String(row.POI || '').trim();

                if (!poi) return;


                const la =
                    Number(row.Q2_LA);

                const co =
                    Number(row.Q2_CO);


                /*
                 * Q2_LA and Q2_CO are expected
                 * to contain only 0 or 1.
                 */
                if (
                    !Number.isFinite(la) ||
                    !Number.isFinite(co)
                ) {
                    return;
                }


                if (!poiMap.has(poi)) {

                    poiMap.set(poi, {

                        name: poi,

                        N: 0,

                        laSum: 0,

                        coSum: 0

                    });

                }


                const item =
                    poiMap.get(poi);


                /*
                 * N = number of rows in CSV.
                 *
                 * If the same POI appears twice
                 * in the same video, both rows count.
                 */
                item.N += 1;

                item.laSum += la;

                item.coSum += co;

            });


            /* =================================================
             * Calculate POI Statistics
             * ================================================= */

            const poiData =
                Array.from(poiMap.values())
                .map(item => {

                    /*
                     * Average original 0–1 values
                     */
                    const q2LA =
                        item.laSum / item.N;

                    const q2CO =
                        item.coSum / item.N;


                    /*
                     * Transform:
                     *
                     * 0   → -1
                     * 0.5 →  0
                     * 1   →  1
                     */
                    const x =
                        q2LA * 2 - 1;

                    const y =
                        q2CO * 2 - 1;


                    return {

                        name: item.name,

                        N: item.N,

                        Q2_LA: q2LA,

                        Q2_CO: q2CO,

                        x: x,

                        y: y

                    };

                });


            if (!poiData.length) {

                console.warn(
                    'Q2: No valid POI data found.'
                );

                return;
            }


            /* =================================================
             * Console Output
             * ================================================= */

            console.table(

                poiData.map(d => ({

                    POI: d.name,

                    N: d.N,

                    Q2_LA:
                        Number(
                            d.Q2_LA.toFixed(2)
                        ),

                    Q2_CO:
                        Number(
                            d.Q2_CO.toFixed(2)
                        ),

                    X:
                        Number(
                            d.x.toFixed(2)
                        ),

                    Y:
                        Number(
                            d.y.toFixed(2)
                        )

                }))

            );


            /* =================================================
             * Draw Chart
             * ================================================= */

            drawChart(
                poiData,
                container
            );


            /* =================================================
             * Responsive Resize
             * ================================================= */

            let resizeTimer;

            window.addEventListener(
                'resize',
                () => {

                    clearTimeout(
                        resizeTimer
                    );

                    resizeTimer =
                        setTimeout(() => {

                            drawChart(
                                poiData,
                                container
                            );

                        }, 150);

                }
            );


        })
        .catch(error => {

            console.error(
                'Q2 CSV loading failed:',
                error
            );

        });


    /* =========================================================
     * Draw Chart
     * ======================================================= */

    function drawChart(
        poiData,
        container
    ) {

        if (!poiData.length) return;


        /* =====================================================
         * Remove Previous Chart
         * ===================================================== */

        d3.select(container)
            .selectAll('svg')
            .remove();

        d3.select('body')
            .selectAll('.q2-tooltip')
            .remove();


        /* =====================================================
         * Dimensions
         * ===================================================== */

        const width =
            Math.min(container.clientWidth, CONFIG.maxWidth);

        const height =
            CONFIG.height;


        const innerWidth =
            width -
            CONFIG.margin.left -
            CONFIG.margin.right;

        const innerHeight =
            height -
            CONFIG.margin.top -
            CONFIG.margin.bottom;


        /* =====================================================
         * SVG
         * ===================================================== */

        const svg =
            d3.select(container)
            .append('svg')
            .style('display', 'block')
            .style('margin', '0 auto')
            .attr(
                'width',
                '100%'
            )
            .attr(
                'height',
                height
            )
            .attr(
                'viewBox',
                `0 0 ${width} ${height}`
            )
            .attr(
                'preserveAspectRatio',
                'xMidYMid meet'
            )
            .style(
                'display',
                'block'
            );


        const chart =
            svg.append('g')
            .attr(
                'transform',
                `translate(
                    ${CONFIG.margin.left},
                    ${CONFIG.margin.top}
                )`
            );


        /* =====================================================
         * Scales
         * ===================================================== */

        const xScale =
            d3.scaleLinear()
            .domain(CONFIG.domain)
            .range([
                0,
                innerWidth
            ]);


        const yScale =
            d3.scaleLinear()
            .domain(CONFIG.domain)
            .range([
                innerHeight,
                0
            ]);


        const originX =
            xScale(0);

        const originY =
            yScale(0);



        /* =====================================================
         * Grid Lines
         * ===================================================== */

        const gridColor =
            'rgba(255,255,255,.055)';

        [-0.5, 0.5].forEach(value => {

            /* Vertical grid */
            chart.append('line')
                .attr(
                    'x1',
                    xScale(value)
                )
                .attr(
                    'x2',
                    xScale(value)
                )
                .attr(
                    'y1',
                    0
                )
                .attr(
                    'y2',
                    innerHeight
                )
                .attr(
                    'stroke',
                    gridColor
                )
                .attr(
                    'stroke-width',
                    1
                );


            /* Horizontal grid */
            chart.append('line')
                .attr(
                    'x1',
                    0
                )
                .attr(
                    'x2',
                    innerWidth
                )
                .attr(
                    'y1',
                    yScale(value)
                )
                .attr(
                    'y2',
                    yScale(value)
                )
                .attr(
                    'stroke',
                    gridColor
                )
                .attr(
                    'stroke-width',
                    1
                );

        });


        /* =====================================================
         * Main Axes
         * ===================================================== */

        /*
         * Horizontal axis
         * y = 0
         */
        chart.append('line')
            .attr(
                'x1',
                0
            )
            .attr(
                'x2',
                innerWidth
            )
            .attr(
                'y1',
                originY
            )
            .attr(
                'y2',
                originY
            )
            .attr(
                'stroke',
                CONFIG.axisColor
            )
            .attr(
                'stroke-width',
                1
            );


        /*
         * Vertical axis
         * x = 0
         */
        chart.append('line')
            .attr(
                'x1',
                originX
            )
            .attr(
                'x2',
                originX
            )
            .attr(
                'y1',
                0
            )
            .attr(
                'y2',
                innerHeight
            )
            .attr(
                'stroke',
                CONFIG.axisColor
            )
            .attr(
                'stroke-width',
                1
            );


        /* =====================================================
         * Axis Tick Labels
         * ===================================================== */

        const tickValues = [
            -1,
            -0.5,
            0,
            0.5,
            1
        ];


        /* X-axis ticks */

        tickValues.forEach(value => {

            chart.append('text')
                .attr(
                    'x',
                    xScale(value)
                )
                .attr(
                    'y',
                    originY + 28
                )
                .attr(
                    'text-anchor',
                    'middle'
                )
                .attr(
                    'fill',
                    CONFIG.mutedColor
                )
                .attr(
                    'font-size',
                    12
                )
                .text(value);

        });


        /* Y-axis ticks */

        tickValues.forEach(value => {

            chart.append('text')
                .attr(
                    'x',
                    originX - 15
                )
                .attr(
                    'y',
                    yScale(value) + 4
                )
                .attr(
                    'text-anchor',
                    'end'
                )
                .attr(
                    'fill',
                    CONFIG.mutedColor
                )
                .attr(
                    'font-size',
                    12
                )
                .text(value);

        });


        /* =====================================================
         * Axis Labels
         * ===================================================== */

        /*
         * Landmark
         * → right side of horizontal axis
         */
        chart.append('text')
            .attr(
                'x',
                innerWidth + 18
            )
            .attr(
                'y',
                originY + 5
            )
            .attr(
                'text-anchor',
                'start'
            )
            .attr(
                'fill',
                CONFIG.textColor
            )
            .attr(
                'font-size',
                16
            )
            .attr(
                'font-weight',
                600
            )
            .text('Landmark');


        /*
         * Consumption
         * → above vertical axis
         */
        chart.append('text')
            .attr(
                'x',
                originX
            )
            .attr(
                'y',
                -28
            )
            .attr(
                'text-anchor',
                'middle'
            )
            .attr(
                'fill',
                CONFIG.textColor
            )
            .attr(
                'font-size',
                16
            )
            .attr(
                'font-weight',
                600
            )
            .text('Consumption');


        /* =====================================================
         * Quadrant Labels
         * ===================================================== */

        const quadrantStyle = {

            fill:
                'rgba(157,178,193,.42)',

            size: 12

        };


        /*
         * II
         */
        chart.append('text')
            .attr(
                'x',
                innerWidth * 0.25
            )
            .attr(
                'y',
                innerHeight * 0.20
            )
            .attr(
                'text-anchor',
                'middle'
            )
            .attr(
                'fill',
                quadrantStyle.fill
            )
            .attr(
                'font-size',
                quadrantStyle.size
            )
            .text('II');


        /*
         * I
         */
        chart.append('text')
            .attr(
                'x',
                innerWidth * 0.75
            )
            .attr(
                'y',
                innerHeight * 0.20
            )
            .attr(
                'text-anchor',
                'middle'
            )
            .attr(
                'fill',
                quadrantStyle.fill
            )
            .attr(
                'font-size',
                quadrantStyle.size
            )
            .text('I');


        /*
         * III
         */
        chart.append('text')
            .attr(
                'x',
                innerWidth * 0.25
            )
            .attr(
                'y',
                innerHeight * 0.84
            )
            .attr(
                'text-anchor',
                'middle'
            )
            .attr(
                'fill',
                quadrantStyle.fill
            )
            .attr(
                'font-size',
                quadrantStyle.size
            )
            .text('III');


        /*
         * IV
         */
        chart.append('text')
            .attr(
                'x',
                innerWidth * 0.75
            )
            .attr(
                'y',
                innerHeight * 0.84
            )
            .attr(
                'text-anchor',
                'middle'
            )
            .attr(
                'fill',
                quadrantStyle.fill
            )
            .attr(
                'font-size',
                quadrantStyle.size
            )
            .text('IV');


        /* =====================================================
         * Origin
         * ===================================================== */

        chart.append('circle')
            .attr(
                'cx',
                originX
            )
            .attr(
                'cy',
                originY
            )
            .attr(
                'r',
                3
            )
            .attr(
                'fill',
                CONFIG.markerColor
            );


        /* =====================================================
         * Marker Size Scale
         * ===================================================== */

        const counts =
            poiData.map(
                d => d.N
            );

        const minN =
            Math.min(...counts);

        const maxN =
            Math.max(...counts);


        const radiusScale =
            d3.scaleSqrt()
            .domain([
                minN,
                maxN
            ])
            .range([
                CONFIG.minRadius,
                CONFIG.maxRadius
            ]);


        function getRadius(N) {

            if (minN === maxN) {

                return (
                    CONFIG.minRadius +
                    CONFIG.maxRadius
                ) / 2;

            }

            return radiusScale(N);

        }


        /* =====================================================
         * Tooltip
         * ===================================================== */

        const tooltip =
            d3.select('body')
            .append('div')
            .attr(
                'class',
                'q2-tooltip'
            )
            .style(
                'position',
                'fixed'
            )
            .style(
                'pointer-events',
                'none'
            )
            .style(
                'opacity',
                0
            )
            .style(
                'z-index',
                9999
            )
            .style(
                'padding',
                '12px 15px'
            )
            .style(
                'background',
                '#08141f'
            )
            .style(
                'border',
                '1px solid rgba(53,208,255,.35)'
            )
            .style(
                'box-shadow',
                '0 0 18px rgba(53,208,255,.12)'
            )
            .style(
                'color',
                '#f5f7fb'
            )
            .style(
                'font-size',
                '13px'
            )
            .style(
                'line-height',
                '1.7'
            );


        /* =====================================================
         * Marker Group
         * ===================================================== */

        const markerGroup =
            chart.append('g')
            .attr(
                'class',
                'q2-markers'
            );


        const markers =
            markerGroup
            .selectAll('.q2-marker')
            .data(
                poiData
            )
            .enter()
            .append('g')
            .attr(
                'class',
                'q2-marker'
            )
            .attr(
                'transform',
                d =>
                    `translate(
                        ${xScale(d.x)},
                        ${yScale(d.y)}
                    )`
            )
            .style(
                'cursor',
                'pointer'
            );


        /* =====================================================
         * Ripple
         * ===================================================== */

        markers.each(function(d) {

            const marker =
                d3.select(this);

            const baseRadius =
                getRadius(d.N);


            const ripple =
                marker.append('circle')
                .attr(
                    'class',
                    'q2-ripple'
                )
                .attr(
                    'r',
                    baseRadius
                )
                .attr(
                    'fill',
                    'none'
                )
                .attr(
                    'stroke',
                    CONFIG.markerStroke
                )
                .attr(
                    'stroke-width',
                    1
                )
                .attr(
                    'opacity',
                    0.55
                );


            function animateRipple() {

                ripple
                    .interrupt()
                    .attr(
                        'r',
                        baseRadius
                    )
                    .attr(
                        'opacity',
                        0.55
                    )
                    .transition()
                    .duration(2800)
                    .ease(d3.easeLinear)
                    .attr(
                        'r',
                        baseRadius * 2.3
                    )
                    .attr(
                        'opacity',
                        0
                    )
                    .on(
                        'end',
                        animateRipple
                    );

            }


            animateRipple();

        });


        /* =====================================================
         * Marker Core
         * ===================================================== */

        markers.append('circle')
            .attr(
                'class',
                'q2-marker-core'
            )
            .attr(
                'r',
                d => getRadius(d.N)
            )
            .attr(
                'fill',
                CONFIG.markerFill
            )
            .attr(
                'stroke',
                'none'
            )
            .style(
                'filter',
                'drop-shadow(0 0 7px rgba(53,208,255,.20))'
            );


        /* =====================================================
         * POI Labels
         * ===================================================== */

        markers.append('text')
            .attr(
                'class',
                'q2-poi-label'
            )
            .attr(
                'x',
                d =>
                    getRadius(d.N) + 10
            )
            .attr(
                'y',
                4
            )
            .attr(
                'fill',
                CONFIG.textColor
            )
            .attr(
                'font-size',
                12
            )
            .attr(
                'font-weight',
                600
            )
            .style(
                'text-shadow',
                '0 0 8px black'
            )
            .text(
                d => d.name
            );


        /* =====================================================
         * Hover
         * ===================================================== */

        markers

            .on(
                'mouseenter',
                function(event, d) {

                    const marker =
                        d3.select(this);


                    /*
                     * Bring selected marker to front
                     */
                    this.parentNode
                        .appendChild(this);


                    /*
                     * Enlarge marker
                     */
                    marker
                        .select(
                            '.q2-marker-core'
                        )
                        .transition()
                        .duration(200)
                        .attr(
                            'r',
                            getRadius(d.N) * 1.25
                        )
                        .attr(
                            'fill',
                            'rgba(53,208,255,.65)'
                        );


                    /*
                     * Highlight label
                     */
                    marker
                        .select(
                            '.q2-poi-label'
                        )
                        .transition()
                        .duration(200)
                        .attr(
                            'fill',
                            CONFIG.markerColor
                        );


                    /*
                     * Tooltip content
                     */
                    tooltip
                        .html(`
                            <strong>
                                ${d.name}
                            </strong>
                            <div>
                                N: ${d.N}
                            </div>
                            <div>
                                Landmark:
                                ${d3.format('.2f')(d.Q2_LA)}
                            </div>
                            <div>
                                Consumption:
                                ${d3.format('.2f')(d.Q2_CO)}
                            </div>
                        `)
                        .style(
                            'opacity',
                            1
                        );

                }
            )


            .on(
                'mousemove',
                function(event) {

                    tooltip
                        .style(
                            'left',
                            `${event.clientX + 16}px`
                        )
                        .style(
                            'top',
                            `${event.clientY + 16}px`
                        );

                }
            )


            .on(
                'mouseleave',
                function(event, d) {

                    const marker =
                        d3.select(this);


                    /*
                     * Restore marker
                     */
                    marker
                        .select(
                            '.q2-marker-core'
                        )
                        .transition()
                        .duration(200)
                        .attr(
                            'r',
                            getRadius(d.N)
                        )
                        .attr(
                            'fill',
                            CONFIG.markerFill
                        );


                    /*
                     * Restore label
                     */
                    marker
                        .select(
                            '.q2-poi-label'
                        )
                        .transition()
                        .duration(200)
                        .attr(
                            'fill',
                            CONFIG.textColor
                        );


                    /*
                     * Hide tooltip
                     */
                    tooltip
                        .transition()
                        .duration(150)
                        .style(
                            'opacity',
                            0
                        );

                }
            );


        /* =====================================================
         * Initial Animation
         * ===================================================== */

        markers
            .style(
                'opacity',
                0
            )
            .attr(
                'transform',
                d =>
                    `translate(
                        ${xScale(d.x)},
                        ${yScale(d.y)}
                    ) scale(0.5)`
            )
            .transition()
            .delay(
                (d, i) => i * 45
            )
            .duration(500)
            .ease(
                d3.easeCubicOut
            )
            .style(
                'opacity',
                1
            )
            .attr(
                'transform',
                d =>
                    `translate(
                        ${xScale(d.x)},
                        ${yScale(d.y)}
                    ) scale(1)`
            );

    }

})();

















/* ==========================================
   Q4.Emotion sankey
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

    // ==========================================
    // 1. Count POI frequency
    // ==========================================
    const poiFrequency = new Map();

    rows.forEach((row) => {
        const poi = (row.POI || "").trim();

        if (!poi) return;

        poiFrequency.set(
            poi,
            (poiFrequency.get(poi) || 0) + 1
        );
    });

    // ==========================================
    // 2. Keep Top 20 POIs
    // ==========================================
    const topPOIs = new Set(
        [...poiFrequency.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([poi]) => poi)
    );

    // ==========================================
    // 3. Add nodes
    // ==========================================
    const addNode = (name, layer) => {
        if (!name) return;

        const targetList =
            layer === "poi"
                ? poiNames
                : layer === "interaction"
                    ? interactionNames
                    : emotionNames;

        if (!nodeSet.has(name)) {
            nodeSet.add(name);
            targetList.push(name);
        }
    };

    // ==========================================
    // 4. Build paths
    // ==========================================
    rows.forEach((row) => {
        const poi = (row.POI || "").trim();
        const interaction = (row.Interaction || "").trim();
        const emotion = (row.Emotion || "").trim();

        if (!poi || !interaction || !emotion) return;

        // Only Top 20 POIs are displayed
        if (!topPOIs.has(poi)) {
            return;
        }

        // Only add interactions and emotions
        // that are connected to Top 20 POIs
        addNode(poi, "poi");
        addNode(interaction, "interaction");
        addNode(emotion, "emotion");

        const pathKey =
            `${poi}::${interaction}::${emotion}`;

        pathCounts.set(
            pathKey,
            (pathCounts.get(pathKey) || 0) + 1
        );
    });

    // ==========================================
    // 5. Create nodes
    // ==========================================
    const nodeNames = [
        ...poiNames,
        ...interactionNames,
        ...emotionNames
    ];

    const nodes = nodeNames.map((name) => ({
        name
    }));

    // ==========================================
    // 6. Create links
    // ==========================================
    const links = [];
    const linkCounts = new Map();

    pathCounts.forEach((count, pathKey) => {
        const [poi, interaction, emotion] =
            pathKey.split("::");

        const addLink = (source, target) => {
            const key = `${source}::${target}`;

            linkCounts.set(
                key,
                (linkCounts.get(key) || 0) + count
            );
        };

        addLink(poi, interaction);
        addLink(interaction, emotion);
    });

    linkCounts.forEach((value, key) => {
        const [source, target] = key.split("::");

        links.push({
            source,
            target,
            value
        });
    });

    return {
        nodes,
        links,
        poiCount: poiNames.length,
        interactionCount: interactionNames.length,
        emotionCount: emotionNames.length
    };
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
            nodeGap: 8,
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
   Q5.Description
========================================== */

(function () {
    "use strict";

    /* ==========================================================
       CONFIGURATION
    ========================================================== */

    const CONFIG = {
        container: "#placePerceptionChart",

        maxPOIs: 6,

        minWordsPerPOI: 3,
        maxWordsPerPOI: 10,

        poiLabelSize: 13,

        minWordSize: 13,
        maxWordSize: 34,

        accent: "#55e6ff",
        textPrimary: "#e8f7fb",
        textSecondary: "#8faeb8",

        /*
        * ======================================================
        * FIBER OPTIC / CLUSTER VISUAL SYSTEM
        * ======================================================
        */

        lineColor: "#4db8ca",

        fiberGlowColor: "#18dfff",
        fiberCoreColor: "#b9f7ff",
        fiberHighlightColor: "#ffffff",

        /*
        * Size of each semantic cluster.
        */
        clusterWidth: 190,
        clusterHeight: 185,

        /*
        * Very subtle cluster atmosphere.
        */
        clusterZoneOpacity: 0.065,

        /*
        * Main POI → cluster hub fiber.
        */
        trunkOpacity: 0.62,
        trunkWidth: 1.15,

        /*
        * Hub → word fibers.
        */
        lineOpacity: 0.42,
        activeLineOpacity: 0.95,
        branchWidth: 0.82,

        /*
        * Optical fiber glow layers.
        */
        fiberGlowWidth: 5.5,
        fiberGlowOpacity: 0.10,

        fiberHaloWidth: 2.6,
        fiberHaloOpacity: 0.22,

        /*
        * Sharp bright fiber core.
        */
        fiberCoreWidth: 0.72,
        fiberCoreOpacity: 0.82,

        /*
        * Moving light pulse.
        */
        fiberPulseWidth: 1.35,
        fiberPulseOpacity: 0.95,

        /*
        * Cluster hub.
        */
        hubRadius: 3.2,

        background: "transparent",

        anchorHeight: 92,

        transitionDuration: 350,

        seed: 20260822
    };


    /* ==========================================================
       DATA RESOLUTION
    ========================================================== */

    const DATA_PATH = "assets/data/description.csv";

    async function resolveDataset() {
        try {
            const dataset = await d3.csv(DATA_PATH);

            const valid = dataset.some(row =>
                row &&
                Object.prototype.hasOwnProperty.call(row, "POI") &&
                Object.prototype.hasOwnProperty.call(row, "Impression")
            );

            if (!valid) {
                console.warn(
                    "[PlacePerception] CSV loaded, but POI / Impression fields were not found."
                );
                return [];
            }

            console.log(
                "[PlacePerception] Loaded:",
                dataset.length,
                "rows from",
                DATA_PATH
            );

            return dataset;

        } catch (error) {
            console.error(
                "[PlacePerception] Failed to load CSV:",
                DATA_PATH,
                error
            );

            return [];
        }
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
        const rankedPOIs = Array.from(poiMap.values())
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
            });

        console.table(
            rankedPOIs.slice(0, 10).map((poi, index) => ({
                Rank: index + 1,
                POI: poi.label,
                Videos: poi.videoCount,
                "Impression Count": poi.impressionCount,
                Impressions: Array.from(poi.impressions.values())
                    .sort((a, b) => {
                        if (b.frequency !== a.frequency) {
                            return b.frequency - a.frequency;
                        }

                        return a.label.localeCompare(b.label);
                    })
                    .slice(0, CONFIG.maxWordsPerPOI)
                    .map(word => `${word.label} (${word.frequency})`)
                    .join(", ")
            }))
        );

        const pois = rankedPOIs
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
    function calculateWordLayout(
        poi,
        index,
        width,
        height,
        wordScale
    ) {

        /*
        * ======================================================
        * CLUSTERED WORD LAYOUT
        *
        * Each POI owns one compact semantic cluster.
        *
        * Structure:
        *
        *             WORD
        *        WORD       WORD
        *
        *             MAIN WORD
        *
        *        WORD       WORD
        *             WORD
        *              |
        *             HUB
        *              |
        *             POI
        * ======================================================
        */

        const words = [...(poi.words || [])]
            .sort((a, b) => {

                if (b.frequency !== a.frequency) {
                    return b.frequency - a.frequency;
                }

                return a.label.localeCompare(b.label);
            });


        if (!words.length) {
            return [];
        }


        /*
        * ======================================================
        * CLUSTER VERTICAL POSITION
        *
        * Different POIs float at different heights.
        * This keeps the "balloon" feeling.
        * ======================================================
        */

        const clusterRatios = [
            0.27,
            0.39,
            0.25,
            0.40,
            0.29,
            0.42,
            0.33,
            0.38
        ];


        const ratio =
            clusterRatios[
                index % clusterRatios.length
            ];


        let clusterCenterY =
            height * ratio;


        /*
        * ======================================================
        * CLUSTER SIZE
        * ======================================================
        */

        const clusterWidth =
            Math.min(
                CONFIG.clusterWidth,
                Math.max(
                    150,
                    width * 0.18
                )
            );


        const clusterHeight =
            Math.min(
                CONFIG.clusterHeight,
                Math.max(
                    150,
                    height * 0.32
                )
            );


        /*
        * Keep the entire cluster inside the upper space.
        */

        const minClusterY =
            70 +
            clusterHeight / 2;


        const maxClusterY =
            height -
            CONFIG.anchorHeight -
            clusterHeight / 2 -
            95;


        clusterCenterY =
            Math.max(
                minClusterY,
                Math.min(
                    maxClusterY,
                    clusterCenterY
                )
            );


        const clusterCenterX =
            poi.x;


        /*
        * ======================================================
        * CLUSTER HUB
        *
        * All word fibers eventually connect to this point.
        * ======================================================
        */

        const hubX =
            clusterCenterX;


        const hubY =
            clusterCenterY +
            clusterHeight * 0.53;


        /*
        * ======================================================
        * FIXED SEMANTIC SLOTS
        *
        * Strongest impression goes in the centre.
        * Other impressions orbit around it.
        *
        * This prevents the words from scattering randomly.
        * ======================================================
        */

        const slots = [

            /* strongest / central impression */
            [0, -4],

            /* upper-left / upper-right */
            [-46, -43],
            [46, -39],

            /* middle-left / middle-right */
            [-68, 13],
            [68, 16],

            /* lower-left / lower-right */
            [-39, 62],
            [39, 64],

            /* bottom centre */
            [0, 88]
        ];


        /*
        * Adapt cluster slightly to available screen size.
        */

        const slotScale =
            Math.min(
                clusterWidth / 190,
                clusterHeight / 185
            );


        const placed = [];


        /*
        * ======================================================
        * PLACE WORDS
        * ======================================================
        */

        words.forEach(
            (word, wordIndex) => {

                const fontSize =
                    wordScale(
                        word.frequency
                    );


                const textWidth =
                    estimateWordWidth(
                        word.label,
                        fontSize
                    );


                const textHeight =
                    estimateWordHeight(
                        fontSize
                    );


                const slot =
                    slots[
                        wordIndex %
                        slots.length
                    ];


                const baseX =
                    clusterCenterX +
                    slot[0] *
                    slotScale;


                const baseY =
                    clusterCenterY +
                    slot[1] *
                    slotScale;


                /*
                * --------------------------------------------------
                * LIMITED COLLISION AVOIDANCE
                *
                * Important:
                *
                * Words can move only slightly.
                * They cannot escape the cluster.
                * --------------------------------------------------
                */

                const nudges = [

                    [0, 0],

                    [0, -16],
                    [0, 16],

                    [-18, 0],
                    [18, 0],

                    [-24, -15],
                    [24, -15],

                    [-24, 15],
                    [24, 15],

                    [0, -28],
                    [0, 28]

                ];


                let x =
                    baseX;

                let y =
                    baseY;


                for (
                    let attempt = 0;
                    attempt < nudges.length;
                    attempt++
                ) {

                    const candidateX =
                        baseX +
                        nudges[attempt][0];


                    const candidateY =
                        baseY +
                        nudges[attempt][1];


                    const collision =
                        placed.some(
                            existing => {

                                const horizontalOverlap =
                                    Math.abs(
                                        existing.x -
                                        candidateX
                                    ) <
                                    (
                                        existing.width +
                                        textWidth
                                    ) *
                                    0.46;


                                const verticalOverlap =
                                    Math.abs(
                                        existing.y -
                                        candidateY
                                    ) <
                                    (
                                        existing.height +
                                        textHeight
                                    ) *
                                    0.62;


                                return (
                                    horizontalOverlap &&
                                    verticalOverlap
                                );
                            }
                        );


                    if (!collision) {

                        x =
                            candidateX;

                        y =
                            candidateY;

                        break;
                    }
                }


                /*
                * ==================================================
                * CLUSTER BOUNDARY
                *
                * The word is not allowed to escape its POI's
                * semantic zone.
                * ==================================================
                */

                const leftBoundary =
                    clusterCenterX -
                    clusterWidth / 2;


                const rightBoundary =
                    clusterCenterX +
                    clusterWidth / 2;


                const topBoundary =
                    clusterCenterY -
                    clusterHeight / 2;


                const bottomBoundary =
                    clusterCenterY +
                    clusterHeight / 2;


                const minX =
                    Math.max(
                        textWidth / 2 + 8,
                        leftBoundary +
                        textWidth / 2
                    );


                const maxX =
                    Math.min(
                        width -
                        textWidth / 2 -
                        8,
                        rightBoundary -
                        textWidth / 2
                    );


                const minY =
                    Math.max(
                        45,
                        topBoundary +
                        textHeight / 2
                    );


                const maxY =
                    Math.min(
                        height -
                        CONFIG.anchorHeight -
                        55,
                        bottomBoundary -
                        textHeight / 2
                    );


                x =
                    Math.max(
                        minX,
                        Math.min(
                            maxX,
                            x
                        )
                    );


                y =
                    Math.max(
                        minY,
                        Math.min(
                            maxY,
                            y
                        )
                    );


                /*
                * ==================================================
                * SAVE WORD POSITION
                *
                * The fiber system uses these coordinates later.
                * ==================================================
                */

                placed.push({

                    ...word,

                    poiKey:
                        poi.key,

                    poiLabel:
                        poi.label,

                    x,
                    y,

                    width:
                        textWidth,

                    height:
                        textHeight,

                    fontSize,

                    /*
                    * Cluster information
                    */
                    clusterX:
                        clusterCenterX,

                    clusterY:
                        clusterCenterY,

                    /*
                    * Common fiber hub
                    */
                    hubX,
                    hubY
                });
            }
        );


        return placed;
    }


    /* ==========================================================
    POI SILHOUETTES
    ========================================================== */

    /* ---------- Bund ---------- */

    function drawBundSilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        /*
        * Bund silhouette
        *
        * Visual idea:
        * Oriental Pearl Tower + dense Lujiazui skyline
        *
        * Unlike an icon:
        * - buildings are filled masses
        * - skyline forms one continuous visual silhouette
        * - Oriental Pearl is the dominant landmark
        */


        /* ======================================================
        Lujiazui skyline masses
        ====================================================== */

        const skyline = [

            /* far-left low buildings */
            {
                d: "M-54,50 L-54,30 L-46,30 L-46,24 L-38,24 L-38,50 Z"
            },

            /* rounded old-style tower */
            {
                d: "M-39,50 L-39,29 Q-39,22 -32,20 Q-25,22 -25,29 L-25,50 Z"
            },

            /* mid-rise */
            {
                d: "M-28,50 L-28,20 L-18,20 L-18,14 L-8,14 L-8,50 Z"
            },

            /* building with antenna */
            {
                d: "M-10,50 L-10,22 L-4,22 L-4,17 L2,17 L2,50 Z"
            },

            /* Shanghai Tower-like curved tower */
            {
                d: "M7,50 L9,18 Q11,10 16,5 Q21,10 23,18 L25,50 Z"
            },

            /* Shanghai World Financial Center */
            {
                d: "M27,50 L27,13 L31,10 L39,10 L39,50 Z"
            },

            /* Jin Mao Tower */
            {
                d: "M41,50 L41,19 L44,15 L47,19 L47,50 Z"
            },

            /* right-side building */
            {
                d: "M49,50 L49,24 L55,20 L58,23 L58,50 Z"
            }
        ];


        g.selectAll(".bund-skyline")
            .data(skyline)
            .enter()
            .append("path")
            .attr("class", "bund-skyline")
            .attr("d", d => d.d)
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.16);


        /* ======================================================
        Architectural cuts / roof details
        These are subtle — not icon outlines.
        ====================================================== */

        // Jin Mao stepped roof
        g.append("path")
            .attr(
                "d",
                "M41,19 L43,15 L45,11 L47,15 L49,19"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.16);


        // Shanghai Tower antenna
        g.append("path")
            .attr(
                "d",
                "M15.5,6 L16,-8 L16.8,-15 L17.5,-8 L18,6 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.16);


        /* ======================================================
        Oriental Pearl Tower
        Main visual anchor
        ====================================================== */

        const tower = g.append("g")
            .attr("class", "oriental-pearl-silhouette");


        /*
        * Tower legs
        */
        tower.append("path")
            .attr(
                "d",
                "M-8,50 L-3,26 L0,22 L3,26 L8,50 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.20);


        /*
        * Lower sphere
        */
        tower.append("circle")
            .attr("cx", 0)
            .attr("cy", 27)
            .attr("r", 8)
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.20);


        /*
        * Tower shaft
        */
        tower.append("path")
            .attr(
                "d",
                "M-2.4,27 L-1.5,5 L1.5,5 L2.4,27 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.22);


        /*
        * Main upper sphere
        */
        tower.append("circle")
            .attr("cx", 0)
            .attr("cy", 4)
            .attr("r", 7)
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.22);


        /*
        * Upper shaft
        */
        tower.append("path")
            .attr(
                "d",
                "M-1.6,0 L-1,-15 L1,-15 L1.6,0 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.20);


        /*
        * Small upper sphere
        */
        tower.append("circle")
            .attr("cx", 0)
            .attr("cy", -17)
            .attr("r", 3.2)
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.22);


        /*
        * Antenna
        */
        tower.append("path")
            .attr(
                "d",
                "M-0.7,-19 L-0.35,-31 L0,-37 L0.35,-31 L0.7,-19 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.20);


        /* ======================================================
        Subtle architectural negative spaces
        Gives the silhouette some recognisable structure.
        ====================================================== */

        // Shanghai World Financial Center opening
        g.append("path")
            .attr(
                "d",
                "M31,17 L35,15 L38,17 L38,21 L31,21 Z"
            )
            .attr("fill", "#04070d")
            .attr("fill-opacity", 0.75);


        // Oriental Pearl tower openings
        tower.append("rect")
            .attr("x", -0.8)
            .attr("y", 10)
            .attr("width", 1.6)
            .attr("height", 5)
            .attr("fill", "#04070d")
            .attr("fill-opacity", 0.75);


        tower.append("rect")
            .attr("x", -0.8)
            .attr("y", 34)
            .attr("width", 1.6)
            .attr("height", 7)
            .attr("fill", "#04070d")
            .attr("fill-opacity", 0.75);


        /* ======================================================
        Ground / river edge
        ====================================================== */

        g.append("rect")
            .attr("x", -58)
            .attr("y", 49)
            .attr("width", 118)
            .attr("height", 2)
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.18);


        g.append("line")
            .attr("x1", -58)
            .attr("x2", 60)
            .attr("y1", 52)
            .attr("y2", 52)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.22)
            .attr("stroke-width", 1);
    }


    /* ---------- Nanjing Road ---------- */

    function drawNanjingSilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        // Layered commercial buildings
        g.append("path")
            .attr(
                "d",
                "M-48,48 L-48,17 L-38,17 L-38,9 L-25,9 L-25,15 L-10,15 L-10,4 L5,4 L5,14 L20,14 L20,8 L34,8 L34,18 L48,18 L48,48 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.14)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.38)
            .attr("stroke-width", 0.9);

        // Storefront rhythm
        [-35, -17, 0, 17, 34].forEach(x => {
            g.append("line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 27)
                .attr("y2", 48)
                .attr("stroke", CONFIG.accent)
                .attr("stroke-opacity", 0.3)
                .attr("stroke-width", 0.8);
        });

        // Ground
        g.append("line")
            .attr("x1", -53)
            .attr("x2", 53)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.32)
            .attr("stroke-width", 1);
    }


    /* ---------- Yu Yuan Garden ---------- */

    function drawYuYuanSilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        // Traditional roof silhouette
        g.append("path")
            .attr(
                "d",
                "M-45,17 Q-35,11 -25,4 L-12,-8 Q0,-17 12,-8 L25,4 Q35,11 45,17 L34,17 L25,11 L0,-2 L-25,11 L-34,17 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.16)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.42)
            .attr("stroke-width", 0.9);

        // Columns
        [-27, -9, 9, 27].forEach(x => {
            g.append("rect")
                .attr("x", x - 2)
                .attr("y", 15)
                .attr("width", 4)
                .attr("height", 34)
                .attr("fill", CONFIG.accent)
                .attr("fill-opacity", 0.16);
        });

        // Base
        g.append("path")
            .attr("d", "M-38,49 L38,49 L31,44 L-31,44 Z")
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.18);

        g.append("line")
            .attr("x1", -47)
            .attr("x2", 47)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.32)
            .attr("stroke-width", 1);
    }


    /* ---------- French Concession ---------- */

    function drawFrenchConcessionSilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        // Old villa
        g.append("path")
            .attr(
                "d",
                "M-38,48 L-38,14 L-25,14 L-25,7 L-10,7 L-10,14 L10,14 L10,4 L25,4 L25,14 L38,14 L38,48 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.13)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.36)
            .attr("stroke-width", 0.9);

        // Tree canopy
        g.append("path")
            .attr(
                "d",
                "M-53,29 Q-48,18 -39,21 Q-35,8 -24,15 Q-18,4 -10,14 Q-5,8 0,18 L0,34 L-53,34 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.10);

        // Tree trunk
        g.append("path")
            .attr(
                "d",
                "M-29,31 Q-28,40 -32,50 M-25,32 Q-24,41 -21,50"
            )
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 1.2);

        // Ground
        g.append("line")
            .attr("x1", -53)
            .attr("x2", 53)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.32)
            .attr("stroke-width", 1);
    }


    /* ---------- Bakery ---------- */

    function drawBakerySilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        // Small shop
        g.append("path")
            .attr(
                "d",
                "M-38,48 L-38,18 L-30,8 L30,8 L38,18 L38,48 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.13)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.36)
            .attr("stroke-width", 0.9);

        // Awning
        g.append("path")
            .attr(
                "d",
                "M-42,18 L42,18 L35,27 L-35,27 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.18);

        // Bread / pastry symbol
        g.append("path")
            .attr(
                "d",
                "M-10,40 Q-5,31 0,40 Q5,31 10,40"
            )
            .attr("fill", "none")
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.38)
            .attr("stroke-width", 1);

        // Ground
        g.append("line")
            .attr("x1", -46)
            .attr("x2", 46)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.32)
            .attr("stroke-width", 1);
    }


    /* ---------- Tianzifang ---------- */

    function drawTianzifangSilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        // Shikumen-style layered houses
        g.append("path")
            .attr(
                "d",
                "M-48,48 L-48,17 L-35,17 L-35,7 L-18,7 L-18,14 L-3,14 L-3,2 L14,2 L14,12 L29,12 L29,7 L42,7 L42,18 L48,18 L48,48 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.14)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.38)
            .attr("stroke-width", 0.9);

        // Alley / doorway rhythm
        [-32, -11, 10, 31].forEach(x => {
            g.append("path")
                .attr(
                    "d",
                    `M${x - 5},48 L${x - 5},32 Q${x},25 ${x + 5},32 L${x + 5},48`
                )
                .attr("fill", "none")
                .attr("stroke", CONFIG.accent)
                .attr("stroke-opacity", 0.3)
                .attr("stroke-width", 0.8);
        });

        // Ground
        g.append("line")
            .attr("x1", -53)
            .attr("x2", 53)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.32)
            .attr("stroke-width", 1);
    }


    /* ---------- Generic ---------- */

    function drawGenericSilhouette(group, scale = 1) {
        const g = group.append("g")
            .attr("transform", `scale(${scale})`);

        // Abstract urban mass
        g.append("path")
            .attr(
                "d",
                "M-35,48 L-35,20 L-18,20 L-18,9 L0,9 L0,16 L18,16 L18,4 L35,4 L35,48 Z"
            )
            .attr("fill", CONFIG.accent)
            .attr("fill-opacity", 0.13)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 0.8);

        g.append("line")
            .attr("x1", -42)
            .attr("x2", 42)
            .attr("y1", 50)
            .attr("y2", 50)
            .attr("stroke", CONFIG.accent)
            .attr("stroke-opacity", 0.3)
            .attr("stroke-width", 1);
    }


    /* ==========================================================
    POI → SILHOUETTE MAPPING
    ========================================================== */

    function selectSilhouette(label) {
        const value = normalizeKey(label);

        if (
            value.includes("bund") ||
            value.includes("waitan") ||
            value.includes("外滩")
        ) {
            return "bund";
        }

        if (
            value.includes("nanjing road") ||
            value.includes("nanjing")
        ) {
            return "nanjing";
        }

        if (
            value.includes("yu yuan") ||
            value.includes("yuyuan") ||
            value.includes("garden") ||
            value.includes("豫园")
        ) {
            return "yuyuan";
        }

        if (
            value.includes("french concession") ||
            value.includes("法租界")
        ) {
            return "french";
        }

        if (
            value.includes("bakery") ||
            value.includes("面包")
        ) {
            return "bakery";
        }

        if (
            value.includes("tianzifang") ||
            value.includes("田子坊")
        ) {
            return "tianzifang";
        }

        return "generic";
    }


    /* ==========================================================
    DRAW POI SILHOUETTE
    ========================================================== */

    function drawPOIAnchor(group, poi) {
        const type = selectSilhouette(poi.label);

        const iconGroup = group
            .append("g")
            .attr("class", "poi-silhouette");

        const scale =
            poi.label.length > 16
                ? 0.82
                : 1;

        if (type === "bund") {
            drawBundSilhouette(iconGroup, scale);

        } else if (type === "nanjing") {
            drawNanjingSilhouette(iconGroup, scale);

        } else if (type === "yuyuan") {
            drawYuYuanSilhouette(iconGroup, scale);

        } else if (type === "french") {
            drawFrenchConcessionSilhouette(iconGroup, scale);

        } else if (type === "bakery") {
            drawBakerySilhouette(iconGroup, scale);

        } else if (type === "tianzifang") {
            drawTianzifangSilhouette(iconGroup, scale);

        } else {
            drawGenericSilhouette(iconGroup, scale);
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

        const poiLookup =
            new Map(
                poiPositions.map(
                    poi => [poi.key, poi]
                )
            );


        /* ======================================================
        SVG FILTERS
        ====================================================== */

        const defs =
            svgGlobal
                .append("defs");


        /*
        * Outer optical glow.
        */
        const glowFilter =
            defs
                .append("filter")
                .attr("id", "fiber-optic-glow")
                .attr("x", "-100%")
                .attr("y", "-100%")
                .attr("width", "300%")
                .attr("height", "300%");

        glowFilter
            .append("feGaussianBlur")
            .attr("stdDeviation", 3.2);


        /*
        * Inner optical halo.
        */
        const innerGlowFilter =
            defs
                .append("filter")
                .attr("id", "fiber-optic-inner-glow")
                .attr("x", "-100%")
                .attr("y", "-100%")
                .attr("width", "300%")
                .attr("height", "300%");

        innerGlowFilter
            .append("feGaussianBlur")
            .attr("stdDeviation", 1.05);


        /* ======================================================
        GROUP WORDS BY POI
        ====================================================== */

        const groupedWords =
            d3.group(
                words,
                d => d.poiKey
            );


        /* ======================================================
        DRAW EACH POI CLUSTER
        ====================================================== */

        groupedWords.forEach(
            (clusterWords, poiKey) => {

                const poi =
                    poiLookup.get(poiKey);


                if (
                    !poi ||
                    !clusterWords.length
                ) {
                    return;
                }


                const firstWord =
                    clusterWords[0];


                const clusterX =
                    firstWord.clusterX;

                const clusterY =
                    firstWord.clusterY;

                const hubX =
                    firstWord.hubX;

                const hubY =
                    firstWord.hubY;


                /* ==================================================
                CLUSTER ATMOSPHERE
                ================================================== */

                lineLayerGlobal
                    .append("ellipse")
                    .attr("class", "poi-cluster-zone")
                    .attr("cx", clusterX)
                    .attr("cy", clusterY)
                    .attr(
                        "rx",
                        CONFIG.clusterWidth / 2 + 10
                    )
                    .attr(
                        "ry",
                        CONFIG.clusterHeight / 2 + 8
                    )
                    .attr(
                        "fill",
                        CONFIG.fiberGlowColor
                    )
                    .attr(
                        "fill-opacity",
                        0.008
                    )
                    .attr(
                        "stroke",
                        CONFIG.fiberGlowColor
                    )
                    .attr(
                        "stroke-opacity",
                        CONFIG.clusterZoneOpacity
                    )
                    .attr(
                        "stroke-width",
                        0.7
                    )
                    .attr(
                        "stroke-dasharray",
                        "1 8"
                    )
                    .attr(
                        "pointer-events",
                        "none"
                    );


                /* ==================================================
                MAIN POI → HUB FIBER
                ================================================== */

                const startX =
                    poi.x;

                const startY =
                    poi.y - 51;


                const trunkPath = `
                    M ${startX} ${startY}

                    C
                    ${startX} ${startY - 48},
                    ${hubX} ${hubY + 58},
                    ${hubX} ${hubY}
                `;


                /* ==================================================
                TRUNK — OUTER GLOW
                ================================================== */

                lineLayerGlobal
                    .append("path")
                    .attr("class", "fiber-trunk-glow")
                    .attr("d", trunkPath)
                    .attr("fill", "none")
                    .attr(
                        "stroke",
                        CONFIG.fiberGlowColor
                    )
                    .attr(
                        "stroke-width",
                        CONFIG.fiberGlowWidth
                    )
                    .attr(
                        "stroke-opacity",
                        CONFIG.fiberGlowOpacity
                    )
                    .attr(
                        "filter",
                        "url(#fiber-optic-glow)"
                    )
                    .attr(
                        "stroke-linecap",
                        "round"
                    )
                    .attr(
                        "pointer-events",
                        "none"
                    );


                /* ==================================================
                TRUNK — INNER HALO
                ================================================== */

                lineLayerGlobal
                    .append("path")
                    .attr("class", "fiber-trunk-halo")
                    .attr("d", trunkPath)
                    .attr("fill", "none")
                    .attr(
                        "stroke",
                        CONFIG.fiberGlowColor
                    )
                    .attr(
                        "stroke-width",
                        CONFIG.fiberHaloWidth
                    )
                    .attr(
                        "stroke-opacity",
                        CONFIG.fiberHaloOpacity
                    )
                    .attr(
                        "filter",
                        "url(#fiber-optic-inner-glow)"
                    )
                    .attr(
                        "stroke-linecap",
                        "round"
                    )
                    .attr(
                        "pointer-events",
                        "none"
                    );


                /* ==================================================
                TRUNK — BRIGHT CORE
                ================================================== */

                lineLayerGlobal
                    .append("path")
                    .attr("class", "fiber-trunk-core")
                    .attr("d", trunkPath)
                    .attr("fill", "none")
                    .attr(
                        "stroke",
                        CONFIG.fiberCoreColor
                    )
                    .attr(
                        "stroke-width",
                        CONFIG.fiberCoreWidth
                    )
                    .attr(
                        "stroke-opacity",
                        CONFIG.fiberCoreOpacity
                    )
                    .attr(
                        "stroke-linecap",
                        "round"
                    )
                    .attr(
                        "pointer-events",
                        "none"
                    );


                /* ==================================================
                TRUNK — MOVING LIGHT
                ================================================== */

                const trunkPulse =
                    lineLayerGlobal
                        .append("path")
                        .attr(
                            "class",
                            "fiber-trunk-pulse"
                        )
                        .attr(
                            "d",
                            trunkPath
                        )
                        .attr(
                            "fill",
                            "none"
                        )
                        .attr(
                            "stroke",
                            CONFIG.fiberHighlightColor
                        )
                        .attr(
                            "stroke-width",
                            CONFIG.fiberPulseWidth
                        )
                        .attr(
                            "stroke-opacity",
                            CONFIG.fiberPulseOpacity
                        )
                        .attr(
                            "stroke-linecap",
                            "round"
                        )
                        .attr(
                            "stroke-dasharray",
                            "1 42"
                        )
                        .attr(
                            "stroke-dashoffset",
                            0
                        )
                        .attr(
                            "pointer-events",
                            "none"
                        );


                /*
                * Infinite-looking pulse animation.
                * One transition repeats itself instead of recursively
                * dispatching events.
                */
                function animateTrunkPulse() {

                    trunkPulse
                        .attr(
                            "stroke-dashoffset",
                            0
                        )
                        .transition()
                        .duration(3200)
                        .ease(d3.easeLinear)
                        .attr(
                            "stroke-dashoffset",
                            -84
                        )
                        .on(
                            "end",
                            animateTrunkPulse
                        );
                }


                animateTrunkPulse();


                /* ==================================================
                BRANCH FIBERS
                HUB → WORD
                ================================================== */

                clusterWords.forEach(
                    (word, wordIndex) => {

                        const endX =
                            word.x;

                        const endY =
                            word.y +
                            word.height * 0.28;


                        const dx =
                            endX - hubX;

                        const dy =
                            endY - hubY;


                        const bend =
                            Math.min(
                                Math.abs(dx) * 0.22,
                                38
                            );


                        const direction =
                            dx >= 0
                                ? 1
                                : -1;


                        const control1X =
                            hubX +
                            dx * 0.18 +
                            direction * bend;


                        const control2X =
                            endX -
                            dx * 0.20 -
                            direction * bend;


                        const control1Y =
                            hubY +
                            dy * 0.35;


                        const control2Y =
                            endY -
                            dy * 0.22;


                        const branchPath = `
                            M ${hubX} ${hubY}

                            C
                            ${control1X} ${control1Y},
                            ${control2X} ${control2Y},
                            ${endX} ${endY}
                        `;


                        /* ==================================================
                        BRANCH — OUTER GLOW
                        ================================================== */

                        lineLayerGlobal
                            .append("path")
                            .attr(
                                "class",
                                "fiber-branch-glow"
                            )
                            .attr(
                                "d",
                                branchPath
                            )
                            .attr(
                                "fill",
                                "none"
                            )
                            .attr(
                                "stroke",
                                CONFIG.fiberGlowColor
                            )
                            .attr(
                                "stroke-width",
                                CONFIG.fiberGlowWidth
                            )
                            .attr(
                                "stroke-opacity",
                                CONFIG.fiberGlowOpacity * 0.72
                            )
                            .attr(
                                "filter",
                                "url(#fiber-optic-glow)"
                            )
                            .attr(
                                "stroke-linecap",
                                "round"
                            )
                            .attr(
                                "pointer-events",
                                "none"
                            );


                        /* ==================================================
                        BRANCH — INNER HALO
                        ================================================== */

                        lineLayerGlobal
                            .append("path")
                            .attr(
                                "class",
                                "fiber-branch-halo"
                            )
                            .attr(
                                "d",
                                branchPath
                            )
                            .attr(
                                "fill",
                                "none"
                            )
                            .attr(
                                "stroke",
                                CONFIG.fiberGlowColor
                            )
                            .attr(
                                "stroke-width",
                                CONFIG.fiberHaloWidth
                            )
                            .attr(
                                "stroke-opacity",
                                CONFIG.fiberHaloOpacity * 0.82
                            )
                            .attr(
                                "filter",
                                "url(#fiber-optic-inner-glow)"
                            )
                            .attr(
                                "stroke-linecap",
                                "round"
                            )
                            .attr(
                                "pointer-events",
                                "none"
                            );


                        /* ==================================================
                        BRANCH — BRIGHT CORE
                        ================================================== */

                        lineLayerGlobal
                            .append("path")
                            .attr(
                                "class",
                                "poi-word-line"
                            )
                            .attr(
                                "d",
                                branchPath
                            )
                            .attr(
                                "fill",
                                "none"
                            )
                            .attr(
                                "stroke",
                                CONFIG.fiberCoreColor
                            )
                            .attr(
                                "stroke-width",
                                CONFIG.branchWidth
                            )
                            .attr(
                                "stroke-opacity",
                                CONFIG.lineOpacity
                            )
                            .attr(
                                "stroke-linecap",
                                "round"
                            )
                            .attr(
                                "pointer-events",
                                "none"
                            );


                        /* ==================================================
                        BRANCH — MOVING LIGHT
                        ================================================== */

                        const branchPulse =
                            lineLayerGlobal
                                .append("path")
                                .attr(
                                    "class",
                                    "fiber-branch-pulse"
                                )
                                .attr(
                                    "d",
                                    branchPath
                                )
                                .attr(
                                    "fill",
                                    "none"
                                )
                                .attr(
                                    "stroke",
                                    CONFIG.fiberHighlightColor
                                )
                                .attr(
                                    "stroke-width",
                                    CONFIG.fiberPulseWidth
                                )
                                .attr(
                                    "stroke-opacity",
                                    CONFIG.fiberPulseOpacity
                                )
                                .attr(
                                    "stroke-linecap",
                                    "round"
                                )
                                .attr(
                                    "stroke-dasharray",
                                    "1 36"
                                )
                                .attr(
                                    "stroke-dashoffset",
                                    wordIndex * 9
                                )
                                .attr(
                                    "pointer-events",
                                    "none"
                                );


                        /*
                        * Stagger the pulses so that the whole cluster
                        * does not flash at once.
                        */
                        function animateBranchPulse() {

                            branchPulse
                                .attr(
                                    "stroke-dashoffset",
                                    wordIndex * 9
                                )
                                .transition()
                                .delay(
                                    wordIndex * 160
                                )
                                .duration(2800)
                                .ease(d3.easeLinear)
                                .attr(
                                    "stroke-dashoffset",
                                    -72
                                )
                                .on(
                                    "end",
                                    animateBranchPulse
                                );
                        }


                        animateBranchPulse();
                    }
                );


                /* ==================================================
                CLUSTER HUB
                ================================================== */

                /*
                * Main glowing hub.
                */
                lineLayerGlobal
                    .append("circle")
                    .attr(
                        "class",
                        "poi-cluster-hub"
                    )
                    .attr(
                        "cx",
                        hubX
                    )
                    .attr(
                        "cy",
                        hubY
                    )
                    .attr(
                        "r",
                        CONFIG.hubRadius
                    )
                    .attr(
                        "fill",
                        CONFIG.fiberCoreColor
                    )
                    .attr(
                        "fill-opacity",
                        0.88
                    )
                    .attr(
                        "pointer-events",
                        "none"
                    );


                /*
                * Hub glow.
                */
                lineLayerGlobal
                    .append("circle")
                    .attr(
                        "class",
                        "poi-cluster-hub-glow"
                    )
                    .attr(
                        "cx",
                        hubX
                    )
                    .attr(
                        "cy",
                        hubY
                    )
                    .attr(
                        "r",
                        CONFIG.hubRadius * 2.8
                    )
                    .attr(
                        "fill",
                        CONFIG.fiberGlowColor
                    )
                    .attr(
                        "fill-opacity",
                        0.10
                    )
                    .attr(
                        "filter",
                        "url(#fiber-optic-glow)"
                    )
                    .attr(
                        "pointer-events",
                        "none"
                    );
            }
        );


        /* ======================================================
        INTERACTION SELECTION
        ====================================================== */

        /*
        * Only the bright branch cores are part of the normal
        * highlight system.
        */
        lineSelectionGlobal =
            lineLayerGlobal
                .selectAll(
                    ".poi-word-line"
                );
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

    async function renderPlacePerception() {
        const container = d3.select(CONFIG.container);

        if (container.empty()) {
            console.warn(
                "[PlacePerception] #placePerceptionChart not found."
            );
            return;
        }

        const rawData = await resolveDataset();

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