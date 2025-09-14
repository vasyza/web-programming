const isNumericStrict = (s) => {
    const t = String(s).trim();
    if (t === "") return false;
    const n = Number(t);
    return Number.isFinite(n);
};

function validateX(value) {
    if (value === "" || value === null) {
        return {valid: false, message: "Выберите значение X"};
    }
    const x = parseFloat(value);
    if (isNaN(x)) {
        return {valid: false, message: "X должен быть числом"};
    }
    const validValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
    if (!validValues.includes(x)) {
        return {
            valid: false,
            message: "Выберите одно из предложенных значений X",
        };
    }
    return {valid: true, message: ""};
}

function validateY(value) {
    if (value === "") {
        return {valid: false, message: "Введите значение Y"};
    }

    value = value.replace(",", ".");

    if (!isNumericStrict(value)) {
        return {valid: false, message: "Y должен быть числом"};
    }

    const y = parseFloat(value);

    if (isNaN(y)) {
        return {valid: false, message: "Y должен быть числом"};
    }
    if (y < -3 || y > 5) {
        return {valid: false, message: "Y должен быть от -3 до 5"};
    }
    return {valid: true, message: "", value: y};
}

function validateR(selectedOptions) {
    if (!selectedOptions || selectedOptions.length === 0) {
        return {
            valid: false,
            message: "Выберите хотя бы одно значение R",
            values: [],
        };
    }

    const validValues = [1, 1.5, 2, 2.5, 3];
    const values = [];

    for (let i = 0; i < selectedOptions.length; i++) {
        const option = selectedOptions[i];
        const r = parseFloat(option.value);
        if (isNaN(r)) {
            return {valid: false, message: "R должен быть числом", values: []};
        }
        if (!validValues.includes(r)) {
            return {
                valid: false,
                message: "Выберите только из предложенных значений R",
                values: [],
            };
        }
        values.push(r);
    }

    return {valid: true, message: "", values: values};
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function clearAllErrors() {
    clearError("x-error");
    clearError("y-error");
    clearError("r-error");
    clearError("global-error");
}
