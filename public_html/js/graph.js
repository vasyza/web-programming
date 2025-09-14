class Graph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.center = {x: this.width / 2, y: this.height / 2};
        this.scale = 50;
        this.currentR = 1;
        this.multipleRadii = [];
        this.points = [];
        this.previewPoint = null;

        this.init();
    }

    init() {
        this.draw();
        this.canvas.addEventListener("click", this.handleClick.bind(this));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw() {
        this.clear();
        this.drawGrid();
        this.drawAxes();
        this.drawArea();
        this.drawLabels();
        this.drawPoints();
        this.drawPreviewPoint();
    }

    drawGrid() {
        this.ctx.strokeStyle = "#f0f0f0";
        this.ctx.lineWidth = 0.5;

        for (let i = -10; i <= 10; i++) {
            const x = this.center.x + i * this.scale;
            const y = this.center.y - i * this.scale;

            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    drawAxes() {
        this.ctx.strokeStyle = "#333";
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.center.y);
        this.ctx.lineTo(this.width, this.center.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x, 0);
        this.ctx.lineTo(this.center.x, this.height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.width - 10, this.center.y - 5);
        this.ctx.lineTo(this.width, this.center.y);
        this.ctx.lineTo(this.width - 10, this.center.y + 5);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.center.x - 5, 10);
        this.ctx.lineTo(this.center.x, 0);
        this.ctx.lineTo(this.center.x + 5, 10);
        this.ctx.stroke();
    }

    drawArea() {
        const radiiToDraw = this.multipleRadii.length > 0 ? this.multipleRadii : [this.currentR];

        radiiToDraw.forEach((radius, index) => {
            const r = Math.abs(radius) * this.scale;
            const colors = [
                'rgba(102, 126, 234, 0.25)',
                'rgba(234, 102, 126, 0.25)',
                'rgba(126, 234, 102, 0.25)',
                'rgba(234, 194, 102, 0.25)',
                'rgba(194, 102, 234, 0.25)'
            ];
            this.ctx.fillStyle = colors[index % colors.length];
            this.ctx.strokeStyle = colors[index % colors.length].replace('0.25', '0.8');
            this.ctx.lineWidth = 1;

            this.ctx.beginPath();
            this.ctx.rect(this.center.x - r, this.center.y - r / 2, r, r / 2);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.center.x, this.center.y);
            this.ctx.lineTo(this.center.x - r / 2, this.center.y);
            this.ctx.lineTo(this.center.x, this.center.y + r / 2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(this.center.x, this.center.y, r / 2, 0, Math.PI / 2);
            this.ctx.lineTo(this.center.x, this.center.y);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        });
    }

    drawLabels() {
        this.ctx.fillStyle = "#333";
        this.ctx.font = "12px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "top";

        for (let i = -5; i <= 5; i++) {
            if (i !== 0) {
                const x = this.center.x + i * this.scale;
                this.ctx.fillText(i.toString(), x, this.center.y + 5);
            }
        }

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";

        for (let i = -5; i <= 5; i++) {
            if (i !== 0) {
                const y = this.center.y - i * this.scale;
                this.ctx.fillText(i.toString(), this.center.x + 5, y);
            }
        }

        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText("X", this.width - 5, this.center.y - 5);

        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("Y", this.center.x + 5, 5);
    }

    drawPoints() {
        this.points.forEach((point) => {
            const x = this.center.x + point.x * this.scale;
            const y = this.center.y - point.y * this.scale;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = point.hit ? "#27ae60" : "#e74c3c";
            this.ctx.fill();
            this.ctx.strokeStyle = "#fff";
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    drawPreviewPoint() {
        if (this.previewPoint) {
            const x = this.center.x + this.previewPoint.x * this.scale;
            const y = this.center.y - this.previewPoint.y * this.scale;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(102, 126, 234, 0.5)";
            this.ctx.fill();
            this.ctx.strokeStyle = "#667eea";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            this.ctx.strokeStyle = "rgba(102, 126, 234, 0.5)";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 10, y);
            this.ctx.lineTo(x + 10, y);
            this.ctx.moveTo(x, y - 10);
            this.ctx.lineTo(x, y + 10);
            this.ctx.stroke();
        }
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left - this.center.x) / this.scale).toFixed(2);
        const y = ((this.center.y - (event.clientY - rect.top)) / this.scale).toFixed(2);

        if (window.onGraphClick) {
            window.onGraphClick(x, y);
        }
    }

    setPreviewPoint(x, y) {
        if (x !== null && y !== null && !isNaN(x) && !isNaN(y)) {
            this.previewPoint = {x: parseFloat(x), y: parseFloat(y)};
        } else {
            this.previewPoint = null;
        }
        this.draw();
    }

    addPoint(x, y, hit, r) {
        this.points.push({x, y, hit, r});
        this.previewPoint = null;
        this.draw();
    }

    setMultipleRadii(radii) {
        this.multipleRadii = radii.sort((a, b) => b - a);
        this.draw();
    }
}
