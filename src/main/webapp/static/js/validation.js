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
  if (window.__skipValidation) {
    window.__skipValidation = false;
    return true;
  }
  clearErrors();
  const xStr = document.getElementById("x").value;
  const yStrRaw = document.getElementById("y").value;
  const yStr = yStrRaw.replace(",", ".").trim();
  const rEl = document.querySelector('input[name="r"]:checked');

  if (!xStr) {
    setError("x-error", "Выберите X слайдером или кликните по графику");
    return false;
  }
  const x = Number(xStr);
  if (!isFinite(x) || x < -3 || x > 3) {
    setError("x-error", "X должен быть в диапазоне [-3; 3]");
    return false;
  }

  if (yStr === "" || !isFinite(Number(yStr))) {
    setError("y-error", "Y должен быть числом");
    return false;
  }
  const y = Number(yStr);
  if (y < -5 || y > 5) {
    setError("y-error", "Y должен быть в диапазоне [-5; 5]");
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
  const xSlider = document.getElementById("x-slider");
  const xValue = document.getElementById("x-value");
  if (xSlider) xSlider.value = "0";
  if (xValue) xValue.textContent = "0";
  const clearFlag = document.getElementById("clear-flag");
  if (clearFlag) clearFlag.value = "0";
  clearErrors();
}

function clearHistory() {
  const form = document.getElementById("hitForm");
  if (!form) return;
  const clearFlag = document.getElementById("clear-flag");
  if (clearFlag) {
    clearFlag.value = "1";
  }
  window.__skipValidation = true;
  form.submit();
  setTimeout(() => {
    if (clearFlag) clearFlag.value = "0";
  }, 0);
}
