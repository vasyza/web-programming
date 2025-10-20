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
    const rEl = document.querySelector('input[name="r"]:checked');
    if (rEl) {
      return Number(rEl.value);
    }
    if (typeof window.SELECTED_R === "number" && isFinite(window.SELECTED_R)) {
      return window.SELECTED_R;
    }
    return 1;
  }

  init() {
    this.draw();
    this.canvas.addEventListener("click", this.handleClick.bind(this));

    const attachRadioListeners = () => {
      const radios = document.querySelectorAll('input[name="r"]');
      radios.forEach((radio) => {
        radio.addEventListener("change", () => {
          const rr = document.getElementById("r-error");
          if (rr) rr.textContent = "";
          this.draw();
        });
        radio.addEventListener("click", () => {
          const rr = document.getElementById("r-error");
          if (rr) rr.textContent = "";
          this.draw();
        });
      });
    };

    attachRadioListeners();

    setTimeout(attachRadioListeners, 100);
    setTimeout(attachRadioListeners, 300);
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
    const scale = this.scale;

    ctx.fillStyle = "rgba(102,126,234,0.25)";
    ctx.strokeStyle = "rgba(102,126,234,0.8)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.center.x - R * scale, this.center.y);
    ctx.arc(this.center.x, this.center.y, R * scale, Math.PI, 3 * Math.PI / 2);
    ctx.lineTo(this.center.x, this.center.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(
      this.center.x - R * scale,
      this.center.y,
      R * scale,
      R * scale
    );
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.center.x + R * scale, this.center.y);
    ctx.lineTo(this.center.x, this.center.y + (R / 2) * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
      if (Number(p.r) === Number(activeR)) {
        const x = this.center.x + p.x * this.scale;
        const y = this.center.y - p.y * this.scale;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = p.hit ? "#27ae60" : "#e74c3c";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  handleClick(ev) {
    const rect = this.canvas.getBoundingClientRect();
    const xRaw = (ev.clientX - rect.left - this.center.x) / this.scale;
    const yRaw = (this.center.y - (ev.clientY - rect.top)) / this.scale;

    const x = Math.round(xRaw * 10) / 10;
    const y = Math.round(yRaw * 10) / 10;

    const rEl = document.querySelector('input[name="r"]:checked');
    if (!rEl) {
      const rr = document.getElementById("r-error");
      if (rr) rr.textContent = "Сначала выберите R";
      return;
    }

    const xInput = document.getElementById("x");
    const yInput = document.getElementById("y");
    const xSlider = document.getElementById("x-slider");
    const xValue = document.getElementById("x-value");

    xInput.value = String(x);
    yInput.value = String(y);

    if (xSlider) xSlider.value = String(x);
    if (xValue) xValue.textContent = String(x);

    const clearFlag = document.getElementById("clear-flag");
    if (clearFlag) clearFlag.value = "0";

    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.click();
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
