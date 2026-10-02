/*
 * =====================================================
 * JURKONCOMPANIES
 * MAP RENDERER v0.1
 * =====================================================
 *
 * Fondasi visual map perusahaan.
 *
 * Map ini bertanggung jawab untuk:
 * - Terrain
 * - Grid plot
 * - Jalan
 * - Building visual
 * - Dekorasi
 *
 * Map tidak menyimpan data bisnis.
 * Data building tetap berasal dari GameState.
 * =====================================================
 */

const MapRenderer = {

    canvas: null,
    ctx: null,

    width: 0,
    height: 0,

    tileWidth: 72,
    tileHeight: 36,

    mapWidth: 12,
    mapHeight: 12,

    originX: 0,
    originY: 0,

    buildings: [],

    init(canvasId = "companyMap") {

        this.canvas =
            document.getElementById(canvasId);

        if (!this.canvas) {

            console.warn(
                "MapRenderer: canvas tidak ditemukan."
            );

            return false;
        }

        this.ctx =
            this.canvas.getContext("2d");

        this.resize();

        window.addEventListener(
            "resize",
            () => this.resize()
        );

        this.createDemoLayout();

        this.render();

        console.log(
            "JurkonCompanies MapRenderer v0.1 aktif."
        );

        return true;
    },

    resize() {

        if (!this.canvas) return;

        const rect =
            this.canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        this.width =
            rect.width;

        this.height =
            rect.height;

        this.canvas.width =
            this.width * dpr;

        this.canvas.height =
            this.height * dpr;

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        this.originX =
            this.width / 2;

        this.originY =
            80;

        this.render();
    },

    createDemoLayout() {

        this.buildings = [

            {
                id: "demo_hq",
                type: "hq",
                name: "Headquarters",
                x: 5,
                y: 2
            },

            {
                id: "demo_farm",
                type: "farm",
                name: "Farm",
                x: 2,
                y: 6
            },

            {
                id: "demo_grocery",
                type: "grocery_store",
                name: "Grocery Store",
                x: 7,
                y: 6
            }

        ];
    },

    render() {

        if (!this.ctx) return;

        this.clear();

        this.drawTerrain();

        this.drawRoads();

        this.drawPlots();

        this.drawDecorations();

        this.drawBuildings();

    },

    clear() {

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.ctx.fillStyle =
            "#dfe5dc";

        this.ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    },

    isoToScreen(x, y) {

        return {

            x:
                this.originX +
                (x - y) *
                (this.tileWidth / 2),

            y:
                this.originY +
                (x + y) *
                (this.tileHeight / 2)

        };
    },

    drawTerrain() {

        for (
            let y = 0;
            y < this.mapHeight;
            y++
        ) {

            for (
                let x = 0;
                x < this.mapWidth;
                x++
            ) {

                const p =
                    this.isoToScreen(
                        x,
                        y
                    );

                this.drawTile(
                    p.x,
                    p.y
                );
            }
        }
    },

    drawTile(x, y) {

        const hw =
            this.tileWidth / 2;

        const hh =
            this.tileHeight / 2;

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            y
        );

        this.ctx.lineTo(
            x + hw,
            y + hh
        );

        this.ctx.lineTo(
            x,
            y + this.tileHeight
        );

        this.ctx.lineTo(
            x - hw,
            y + hh
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#cfd8c8";

        this.ctx.fill();

        this.ctx.strokeStyle =
            "#bcc6b7";

        this.ctx.lineWidth =
            1;

        this.ctx.stroke();
    },

    drawRoads() {

        /*
         * Jalan utama horizontal
         */

        for (
            let x = 0;
            x < this.mapWidth;
            x++
        ) {

            this.drawRoadTile(
                x,
                4
            );
        }

        /*
         * Jalan kedua
         */

        for (
            let x = 0;
            x < this.mapWidth;
            x++
        ) {

            this.drawRoadTile(
                x,
                8
            );
        }
    },

    drawRoadTile(x, y) {

        const p =
            this.isoToScreen(
                x,
                y
            );

        const hw =
            this.tileWidth / 2;

        const hh =
            this.tileHeight / 2;

        this.ctx.beginPath();

        this.ctx.moveTo(
            p.x,
            p.y
        );

        this.ctx.lineTo(
            p.x + hw,
            p.y + hh
        );

        this.ctx.lineTo(
            p.x,
            p.y + this.tileHeight
        );

        this.ctx.lineTo(
            p.x - hw,
            p.y + hh
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#aeb3ad";

        this.ctx.fill();

        this.ctx.strokeStyle =
            "#9ba19a";

        this.ctx.stroke();
    },

    drawPlots() {

        this.buildings.forEach(
            building => {

                const p =
                    this.isoToScreen(
                        building.x,
                        building.y
                    );

                this.drawPlot(
                    p.x,
                    p.y
                );
            }
        );
    },

    drawPlot(x, y) {

        const hw =
            this.tileWidth / 2 - 4;

        const hh =
            this.tileHeight / 2 - 3;

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            y + 3
        );

        this.ctx.lineTo(
            x + hw,
            y + hh
        );

        this.ctx.lineTo(
            x,
            y + this.tileHeight - 3
        );

        this.ctx.lineTo(
            x - hw,
            y + hh
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#b8c4ad";

        this.ctx.fill();

        this.ctx.strokeStyle =
            "#a4b099";

        this.ctx.stroke();
    },

    drawBuildings() {

        /*
         * Isometris harus menggambar
         * bangunan dari belakang ke depan.
         */

        const sorted =
            [...this.buildings]
                .sort(
                    (a, b) =>
                        (a.x + a.y) -
                        (b.x + b.y)
                );

        sorted.forEach(
            building => {

                const p =
                    this.isoToScreen(
                        building.x,
                        building.y
                    );

                this.drawBuilding(
                    building,
                    p.x,
                    p.y
                );
            }
        );
    },

    drawBuilding(
        building,
        x,
        y
    ) {

        switch (building.type) {

            case "hq":
                this.drawHQ(
                    x,
                    y,
                    building.name
                );
                break;

            case "farm":
                this.drawFarm(
                    x,
                    y,
                    building.name
                );
                break;

            case "grocery_store":
                this.drawGrocery(
                    x,
                    y,
                    building.name
                );
                break;

            default:
                this.drawGenericBuilding(
                    x,
                    y,
                    building.name
                );
        }
    },

    drawBuildingBase(
        x,
        y,
        width,
        height,
        depth
    ) {

        const hw =
            width / 2;

        const top =
            y - depth;

        /*
         * Top
         */

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            top
        );

        this.ctx.lineTo(
            x + hw,
            top + depth / 2
        );

        this.ctx.lineTo(
            x,
            top + depth
        );

        this.ctx.lineTo(
            x - hw,
            top + depth / 2
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#e8e5dc";

        this.ctx.fill();

        this.ctx.strokeStyle =
            "#858980";

        this.ctx.stroke();

        /*
         * Left wall
         */

        this.ctx.beginPath();

        this.ctx.moveTo(
            x - hw,
            top + depth / 2
        );

        this.ctx.lineTo(
            x,
            top + depth
        );

        this.ctx.lineTo(
            x,
            top + depth + height
        );

        this.ctx.lineTo(
            x - hw,
            top + depth / 2 + height
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#b8bbb4";

        this.ctx.fill();

        this.ctx.stroke();

        /*
         * Right wall
         */

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            top + depth
        );

        this.ctx.lineTo(
            x + hw,
            top + depth / 2
        );

        this.ctx.lineTo(
            x + hw,
            top + depth / 2 + height
        );

        this.ctx.lineTo(
            x,
            top + depth + height
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#999d96";

        this.ctx.fill();

        this.ctx.stroke();
    },

    drawHQ(x, y, name) {

        this.drawBuildingBase(
            x,
            y,
            58,
            48,
            34
        );

        /*
         * Antenna
         */

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            y - 82
        );

        this.ctx.lineTo(
            x,
            y - 108
        );

        this.ctx.strokeStyle =
            "#626861";

        this.ctx.lineWidth =
            3;

        this.ctx.stroke();

        /*
         * Logo/window
         */

        this.ctx.fillStyle =
            "#d7ded4";

        this.ctx.fillRect(
            x - 10,
            y - 56,
            20,
            12
        );

        this.drawLabel(
            name,
            x,
            y - 116
        );
    },

    drawFarm(x, y, name) {

        /*
         * Tanah farm
         */

        this.drawBuildingBase(
            x,
            y,
            62,
            28,
            30
        );

        /*
         * Barn roof
         */

        this.ctx.beginPath();

        this.ctx.moveTo(
            x,
            y - 68
        );

        this.ctx.lineTo(
            x + 34,
            y - 51
        );

        this.ctx.lineTo(
            x,
            y - 34
        );

        this.ctx.lineTo(
            x - 34,
            y - 51
        );

        this.ctx.closePath();

        this.ctx.fillStyle =
            "#b58d68";

        this.ctx.fill();

        this.ctx.strokeStyle =
            "#766955";

        this.ctx.stroke();

        /*
         * Crops
         */

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            this.ctx.beginPath();

            this.ctx.moveTo(
                x + i * 9,
                y - 18
            );

            this.ctx.lineTo(
                x + i * 9 + 3,
                y - 27
            );

            this.ctx.strokeStyle =
                "#65775c";

            this.ctx.lineWidth =
                2;

            this.ctx.stroke();
        }

        this.drawLabel(
            name,
            x,
            y - 78
        );
    },

    drawGrocery(x, y, name) {

        this.drawBuildingBase(
            x,
            y,
            64,
            42,
            32
        );

        /*
         * Store sign
         */

        this.ctx.fillStyle =
            "#e4e2d9";

        this.ctx.fillRect(
            x - 25,
            y - 61,
            50,
            17
        );

        this.ctx.fillStyle =
            "#515750";

        this.ctx.font =
            "bold 8px Arial";

        this.ctx.textAlign =
            "center";

        this.ctx.fillText(
            "MARKET",
            x,
            y - 49
        );

        /*
         * Door
         */

        this.ctx.fillStyle =
            "#646b65";

        this.ctx.fillRect(
            x - 7,
            y - 22,
            14,
            22
        );

        this.drawLabel(
            name,
            x,
            y - 76
        );
    },

    drawGenericBuilding(
        x,
        y,
        name
    ) {

        this.drawBuildingBase(
            x,
            y,
            54,
            42,
            30
        );

        this.drawLabel(
            name,
            x,
            y - 72
        );
    },

    drawLabel(
        text,
        x,
        y
    ) {

        this.ctx.font =
            "600 11px Arial";

        this.ctx.textAlign =
            "center";

        this.ctx.textBaseline =
            "middle";

        const padding = 5;

        const width =
            this.ctx.measureText(
                text
            ).width +
            padding * 2;

        this.ctx.fillStyle =
            "rgba(255,255,255,0.92)";

        this.ctx.fillRect(
            x - width / 2,
            y - 7,
            width,
            14
        );

        this.ctx.fillStyle =
            "#3e443f";

        this.ctx.fillText(
            text,
            x,
            y
        );
    }

};
