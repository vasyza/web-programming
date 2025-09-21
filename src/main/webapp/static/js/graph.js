class Graph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.center = { x: this.width / 2, y: this.height / 2 };
    this.scale = 40;
    this.points = Array.isArray(window.ALL_RESULTS) ? window.ALL_RESULTS : [];

    this.init();
  }

  getSelectedR() {
    if (typeof window.SELECTED_R === "number" && isFinite(window.SELECTED_R)) {
      return window.SELECTED_R;
    }
    const rEl = document.querySelector('input[name="r"]:checked');
    return rEl ? Number(rEl.value) : 1;
  }

  init() {
    this.draw();
    this.canvas.addEventListener("click", this.handleClick.bind(this));
    document.addEventListener("change", (e) => {
      if (e.target && e.target.name === "r") {
        const rr = document.getElementById("r-error");
        if (rr) rr.textContent = "";
        this.draw();
      }
    });
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
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 0.5;
    for (let i = -10; i <= 10; i++) {
      const x = this.center.x + i * this.scale;
      const y = this.center.y - i * this.scale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  drawAxes() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.center.y);
    ctx.lineTo(this.width, this.center.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.center.x, 0);
    ctx.lineTo(this.center.x, this.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.width - 10, this.center.y - 5);
    ctx.lineTo(this.width, this.center.y);
    ctx.lineTo(this.width - 10, this.center.y + 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.center.x - 5, 10);
    ctx.lineTo(this.center.x, 0);
    ctx.lineTo(this.center.x + 5, 10);
    ctx.stroke();
  }

  drawArea() {
    const ctx = this.ctx;
    const R = Math.abs(this.getSelectedR());
    const sx = (R / 7) * this.scale;
    const sy = (R / 6) * this.scale;
    const X = (xb) => this.center.x + xb * sx;
    const Y = (yb) => this.center.y - yb * sy;

    const abs = Math.abs;
    const sqrt = (t) => Math.sqrt(Math.max(0, t));
    const sgn = (t) => (t > 0 ? 1 : t < 0 ? -1 : 0);

    const w = (x) => 3 * sqrt(1 - (x / 7) ** 2);
    const l = (x) =>
      0.5 * (x + 3) -
      ((3 * Math.sqrt(10)) / 7) * sqrt(4 - (x + 1) ** 2) +
      (6 * Math.sqrt(10)) / 7;
    const r = (x) =>
      0.5 * (3 - x) -
      ((3 * Math.sqrt(10)) / 7) * sqrt(4 - (x - 1) ** 2) +
      (6 * Math.sqrt(10)) / 7;
    const h = (x) => {
      const ax = abs(x);
      if (ax < 0.5) return 2.25;
      if (ax < 0.75) return 3 * ax + 0.75;
      if (ax <= 1) return 9 - 8 * ax;
      return NaN;
    };
    const fTop = (x) =>
      x < -3 ? w(x) : x < -1 ? l(x) : x <= 1 ? h(x) : x < 3 ? r(x) : w(x);

    const gBottom = (x) => {
      const ax = abs(x);
      const t2i = abs(ax - 2) - 1;
      const t2 = sqrt(1 - t2i * t2i);
      const ell = 3 * sqrt(1 - (x / 7) ** 2);
      const bracket =
        0.5 * ax + t2 - ((3 * Math.sqrt(33) - 7) / 112) * x * x + ell - 3;
      const window = sgn(x + 4) - sgn(x - 4);
      return 0.5 * bracket * window - ell;
    };

    ctx.fillStyle = "rgba(102,126,234,0.25)";
    ctx.strokeStyle = "rgba(102,126,234,0.8)";
    ctx.lineWidth = 1;

    const path = new Path2D();
    const XMIN = -7,
      XMAX = 7;
    const steps = 800;
    const dx = (XMAX - XMIN) / steps;

    let xb = XMIN;
    path.moveTo(X(xb), Y(fTop(xb)));
    for (xb = XMIN + dx; xb <= XMAX + 1e-9; xb += dx) {
      path.lineTo(X(xb), Y(fTop(xb)));
    }

    for (xb = XMAX; xb >= XMIN - 1e-9; xb -= dx) {
      path.lineTo(X(xb), Y(gBottom(xb)));
    }
    path.closePath();
    ctx.fill(path);
    ctx.stroke(path);
  }

  drawLabels() {
    const ctx = this.ctx;
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = -5; i <= 5; i++)
      if (i !== 0)
        ctx.fillText(
          String(i),
          this.center.x + i * this.scale,
          this.center.y + 5,
        );
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let i = -5; i <= 5; i++)
      if (i !== 0)
        ctx.fillText(
          String(i),
          this.center.x + 5,
          this.center.y - i * this.scale,
        );
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("X", this.width - 5, this.center.y - 5);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Y", this.center.x + 5, 5);
  }

  drawPoints() {
    const ctx = this.ctx;
    const activeR = this.getSelectedR();
    (this.points || []).forEach((p) => {
      if (Number(p.r) === activeR) {
        const x = this.center.x + p.x * this.scale;
        const y = this.center.y - p.y * this.scale;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = p.hit ? "#27ae60" : "#e74c3c";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  handleClick(ev) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left - this.center.x) / this.scale;
    const y = (this.center.y - (ev.clientY - rect.top)) / this.scale;
    const rEl = document.querySelector('input[name="r"]:checked');
    if (!rEl) {
      const rr = document.getElementById("r-error");
      if (rr) rr.textContent = "Сначала выберите R";
      return;
    }

    const xInput = document.getElementById("x");
    const yInput = document.getElementById("y");
    xInput.value = String(x);
    yInput.value = String(y);
    if (typeof validateForm === "function" ? validateForm() : true) {
      document.getElementById("hitForm").submit();
    }
  }

  setPoints(points) {
    this.points = Array.isArray(points) ? points : [];
    this.draw();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const graph = new Graph("graph");

  window.__graph = graph;
});
