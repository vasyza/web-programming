const FCGI_URL = "/fcgi-bin/area.fcgi";

let graph;
let selectedX = null;

document.addEventListener("DOMContentLoaded", function () {
  graph = new Graph("graph");

  setupXRadios();
  setupForm();
  setupClearButton();

  window.onGraphClick = function (x, y) {
    const rSelect = document.getElementById("r-coord");
    const selectedOptions = rSelect.selectedOptions;

    if (selectedOptions.length === 0) {
      showError("r-error", "Сначала выберите радиус R");
      return;
    }

    document.getElementById("y-coord").value = y;
    selectedX = x;

    for (let option of selectedOptions) {
      submitFormWithValues(x, y, option.value);
    }
  };
});

function setupXRadios() {
  const radios = document.querySelectorAll('input[name="x"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", function () {
      selectedX = this.value;
      clearError("x-error");
      updatePreviewPoint();
    });
  });
}

function setupForm() {
  const form = document.getElementById("coordinateForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm();
  });

  document.getElementById("y-coord").addEventListener("input", function () {
    clearError("y-error");
    updatePreviewPoint();
  });

  document.getElementById("r-coord").addEventListener("change", function () {
    clearError("r-error");
    updateGraphForSelectedRadii();
  });
}

function updateGraphForSelectedRadii() {
  const rSelect = document.getElementById("r-coord");
  const selectedOptions = rSelect.selectedOptions;

  if (selectedOptions.length > 0) {
    const radii = Array.from(selectedOptions).map((opt) =>
      parseFloat(opt.value),
    );
    graph.setMultipleRadii(radii);
  } else {
    graph.setMultipleRadii([]);
  }
}

function updatePreviewPoint() {
  const checkedRadio = document.querySelector('input[name="x"]:checked');
  const xValue = checkedRadio ? checkedRadio.value : null;
  const yValue = document.getElementById("y-coord").value;

  if (xValue && yValue && !isNaN(parseFloat(yValue))) {
    graph.setPreviewPoint(xValue, yValue);
  } else {
    graph.setPreviewPoint(null, null);
  }
}

function setupClearButton() {
  document.getElementById("clearBtn").addEventListener("click", function () {
    document.getElementById("coordinateForm").reset();
    document
      .querySelectorAll('input[name="x"]')
      .forEach((radio) => (radio.checked = false));
    selectedX = null;
    clearAllErrors();
    graph.setMultipleRadii([]);
    graph.setPreviewPoint(null, null);
  });
}

function submitForm() {
  clearAllErrors();

  const checkedRadio = document.querySelector('input[name="x"]:checked');
  const xValue = checkedRadio ? checkedRadio.value : null;
  const yValue = document.getElementById("y-coord").value;
  const rSelect = document.getElementById("r-coord");
  const selectedOptions = rSelect.selectedOptions;

  const xValidation = validateX(xValue);
  const yValidation = validateY(yValue);
  const rValidation = validateR(selectedOptions);

  if (!xValidation.valid) {
    showError("x-error", xValidation.message);
    return;
  }

  if (!yValidation.valid) {
    showError("y-error", yValidation.message);
    return;
  }

  if (!rValidation.valid) {
    showError("r-error", rValidation.message);
    return;
  }

  const x = parseFloat(xValue);
  const y = yValidation.value || parseFloat(yValue);

  rValidation.values.forEach((r) => {
    sendRequest(x, y, r);
  });
}

function submitFormWithValues(x, y, r) {
  clearAllErrors();
  sendRequest(parseFloat(x), parseFloat(y), parseFloat(r));
}

function sendRequest(x, y, r) {
  const params = new URLSearchParams({
    x: x,
    y: y,
    r: r,
  });

  fetch(`${FCGI_URL}?${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка сервера");
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.error("Ошибка:", data.error);
        return;
      }

      if (data.currentResult) {
        addResultToTable(data.currentResult);
        graph.addPoint(x, y, data.currentResult.hit, r);
      }

      if (data.allResults && data.allResults.length > 0) {
        updateResultsTable(data.allResults);
      }
    })
    .catch((error) => {
      console.error("Ошибка запроса:", error);
    });
}

function addResultToTable(result) {
  const tbody = document.getElementById("resultsBody");
  const row = tbody.insertRow(0);

  row.innerHTML = `
        <td>${result.x.toFixed(2)}</td>
        <td>${result.y.toFixed(2)}</td>
        <td>${result.r.toFixed(2)}</td>
        <td class="${result.hit ? "hit-true" : "hit-false"}">${
          result.hit ? "Попадание" : "Промах"
        }</td>
        <td>${result.currentTime}</td>
        <td>${result.executionTime.toFixed(3)}</td>
    `;
}

function updateResultsTable(results) {
  const tbody = document.getElementById("resultsBody");
  tbody.innerHTML = "";

  results.reverse().forEach((result) => {
    const row = tbody.insertRow();
    row.innerHTML = `
            <td>${result.x.toFixed(2)}</td>
            <td>${result.y.toFixed(2)}</td>
            <td>${result.r.toFixed(2)}</td>
            <td class="${result.hit ? "hit-true" : "hit-false"}">${
              result.hit ? "Попадание" : "Промах"
            }</td>
            <td>${result.currentTime}</td>
            <td>${result.executionTime.toFixed(3)}</td>
        `;
  });
}
