function selectX(val) {
  document.getElementById("x").value = String(val);

  document
    .querySelectorAll(".x-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const btns = Array.from(document.querySelectorAll(".x-btn"));
  const target = btns.find((b) => b.textContent.trim() === String(val));
  if (target) target.classList.add("active");
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg || "";
}

function clearErrors() {
  setError("x-error", "");
  setError("y-error", "");
  setError("r-error", "");
  const ge = document.getElementById("global-error");
  if (ge) ge.textContent = "";
  const gm = document.getElementById("global-message");
  if (gm) gm.textContent = "";
}

function validateForm() {
  clearErrors();
  const xStr = document.getElementById("x").value;
  const yStrRaw = document.getElementById("y").value;
  const yStr = yStrRaw.replace(",", ".").trim();
  const rEl = document.querySelector('input[name="r"]:checked');

  if (!xStr) {
    setError("x-error", "Выберите X кнопкой или кликните по графику");
    return false;
  }
  const x = Number(xStr);
  if (!isFinite(x) || x < -5 || x > 3) {
    setError("x-error", "X должен быть в диапазоне [-5; 3]");
    return false;
  }

  if (yStr === "" || !isFinite(Number(yStr))) {
    setError("y-error", "Y должен быть числом");
    return false;
  }
  const y = Number(yStr);
  if (y < -3 || y > 5) {
    setError("y-error", "Y должен быть в диапазоне [-3; 5]");
    return false;
  }

  if (!rEl) {
    setError("r-error", "Выберите R");
    return false;
  }
  const r = Number(rEl.value);
  if (!(r >= 1 && r <= 5)) {
    setError("r-error", "R должен быть от 1 до 5");
    return false;
  }

  return true;
}

function clearForm() {
  document.getElementById("hitForm").reset();
  document.getElementById("x").value = "";
  document
    .querySelectorAll(".x-btn")
    .forEach((btn) => btn.classList.remove("active"));
  clearErrors();
}

function clearHistory() {
  const form = document.createElement("form");
  form.method = "get";
  form.action =
    window.location.pathname.replace(/\/[^/]*$/, "") + "/controller";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "clear";
  input.value = "1";
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
