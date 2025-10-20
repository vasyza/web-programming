package app.beans;

import app.model.ResultRecord;
import app.persistence.RepositoryException;
import app.persistence.ResultRepository;
import app.util.Converter;
import app.util.Geometry;
import app.util.Validator;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Named
@SessionScoped
public class ResultsBean implements Serializable {

    private static final AtomicInteger SESSION_COUNTER = new AtomicInteger();
    private static final int[] R_OPTIONS = { 1, 2, 3, 4, 5 };

    private final ResultRepository repository = ResultRepository.getInstance();

    private String sessionId;
    private List<ResultRecord> results = new ArrayList<>();
    private String globalMessage;
    private String globalError;
    private String formX;
    private String formY;
    private Integer formR;
    private int sessionCount;

    @PostConstruct
    public void init() {
        ExternalContext externalContext =
            FacesContext.getCurrentInstance().getExternalContext();
        this.sessionId = externalContext.getSessionId(true);
        this.sessionCount = SESSION_COUNTER.incrementAndGet();

        if (!repository.isAvailable()) {
            this.globalError =
                "Подключение к базе данных недоступно. Проверьте настройки.";
            return;
        }

        try {
            this.results = new ArrayList<>(
                repository.findBySessionId(sessionId)
            );
        } catch (RepositoryException ex) {
            this.globalError = ex.getMessage();
        }

        if (!results.isEmpty()) {
            this.formR = results.get(results.size() - 1).getR();
        } else {
            this.formR = 1;
        }
    }

    public String submit() {
        if (!repository.isAvailable()) {
            setError(
                "Подключение к базе данных недоступно. Проверьте настройки."
            );
            return null;
        }

        Map<String, String> params = FacesContext.getCurrentInstance()
            .getExternalContext()
            .getRequestParameterMap();

        if ("1".equals(params.get("clear"))) {
            clear();
            return null;
        }

        long start = System.nanoTime();
        String sx = params.get("x");
        String sy = params.get("y");
        String sr = params.get("r");

        this.formX = sx;
        this.formY = sy;
        this.formR = Converter.parseIntNormalized(sr);

        Double xVal = Converter.parseDoubleNormalized(sx);
        Double yVal = Converter.parseDoubleNormalized(sy);
        Integer rVal = Converter.parseIntNormalized(sr);

        if (xVal == null || yVal == null || rVal == null) {
            setError(
                "Параметры x, y, r должны быть числами (допустима запятая)."
            );
            return null;
        }

        double x = xVal;
        double y = yVal;
        int r = rVal;

        if (
            !Validator.isValidX(x) ||
            !Validator.isValidY(y) ||
            !Validator.isValidR(r)
        ) {
            setError("Диапазоны: X∈[-3;3], Y∈[-5;5], R∈{1..5}.");
            return null;
        }

        boolean hit = Geometry.checkHit(x, y, r);
        double execMs = (System.nanoTime() - start) / 1_000_000.0;
        ResultRecord record = new ResultRecord(
            sessionId,
            x,
            y,
            r,
            hit,
            LocalDateTime.now(),
            execMs
        );

        try {
            repository.save(record);
            results.add(record);
            setMessage("Результат добавлен.");
        } catch (RepositoryException ex) {
            setError(ex.getMessage());
            return null;
        }

        this.formX = String.format(Locale.US, "%.5f", x);
        this.formY = String.format(Locale.US, "%.5f", y);
        this.formR = r;

        return null;
    }

    public void clear() {
        if (!repository.isAvailable()) {
            setError(
                "Подключение к базе данных недоступно. Проверьте настройки."
            );
            return;
        }
        try {
            repository.deleteBySessionId(sessionId);
            results.clear();
            formX = null;
            formY = null;
            formR = 1;
            setMessage("История очищена.");
        } catch (RepositoryException ex) {
            setError(ex.getMessage());
        }
    }

    public List<ResultRecord> getResults() {
        return Collections.unmodifiableList(results);
    }

    public List<Map<String, Object>> getResultsForTable() {
        List<Map<String, Object>> rows = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
            "yyyy-MM-dd HH:mm:ss"
        );

        for (ResultRecord record : results) {
            Map<String, Object> row = new java.util.HashMap<>();
            row.put("xFormatted", String.format("%.2f", record.getX()));
            row.put("yFormatted", String.format("%.2f", record.getY()));
            row.put("r", record.getR());
            row.put("hit", record.isHit());
            row.put(
                "checkedAtFormatted",
                record.getCheckedAt() != null
                    ? record.getCheckedAt().format(formatter)
                    : ""
            );
            row.put(
                "executionMsFormatted",
                String.format("%.3f", record.getExecutionMs())
            );
            rows.add(row);
        }
        Collections.reverse(rows);
        return rows;
    }

    public String getResultsJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < results.size(); i++) {
            ResultRecord record = results.get(i);
            sb
                .append("{\"x\":")
                .append(String.format(Locale.US, "%.5f", record.getX()))
                .append(",\"y\":")
                .append(String.format(Locale.US, "%.5f", record.getY()))
                .append(",\"r\":")
                .append(record.getR())
                .append(",\"hit\":")
                .append(record.isHit())
                .append("}");
            if (i + 1 < results.size()) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    public Integer getSelectedR() {
        if (formR != null) {
            return formR;
        }
        if (!results.isEmpty()) {
            return results.get(results.size() - 1).getR();
        }
        return 1;
    }

    public String getGlobalMessage() {
        return globalMessage;
    }

    public String getGlobalError() {
        return globalError;
    }

    public String getFormX() {
        return formX != null ? formX : "";
    }

    public String getFormY() {
        return formY != null ? formY : "";
    }

    public Integer getFormR() {
        return formR;
    }

    public void setFormR(Integer formR) {
        this.formR = formR;
    }

    public int getSessionCount() {
        return sessionCount;
    }

    public List<Integer> getROptions() {
        return Arrays.stream(R_OPTIONS).boxed().collect(Collectors.toList());
    }

    public boolean isCurrentR(int value) {
        return formR != null && formR == value;
    }

    private void setMessage(String message) {
        this.globalMessage = message;
        this.globalError = null;
    }

    private void setError(String error) {
        this.globalError = error;
        this.globalMessage = null;
    }
}
