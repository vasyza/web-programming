package app.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "results")
public class ResultRecord implements Serializable {

    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 128)
    private String sessionId;

    @Column(nullable = false)
    private double x;

    @Column(nullable = false)
    private double y;

    @Column(nullable = false)
    private int r;

    @Column(nullable = false)
    private boolean hit;

    @Column(name = "checked_at", nullable = false)
    private LocalDateTime checkedAt;

    @Column(name = "execution_ms", nullable = false)
    private double executionMs;

    public ResultRecord() {
    }

    public ResultRecord(
            String sessionId,
            double x,
            double y,
            int r,
            boolean hit,
            LocalDateTime checkedAt,
            double executionMs
    ) {
        this.sessionId = sessionId;
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.checkedAt = checkedAt;
        this.executionMs = executionMs;
    }

    public Long getId() {
        return id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public int getR() {
        return r;
    }

    public boolean isHit() {
        return hit;
    }

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public double getExecutionMs() {
        return executionMs;
    }

    public String getCheckedAtFormatted() {
        return checkedAt != null ? checkedAt.format(DATE_TIME_FORMATTER) : "";
    }

    public String getXFormatted() {
        return String.format("%.2f", x);
    }

    public String getYFormatted() {
        return String.format("%.2f", y);
    }

    public String getExecutionMsFormatted() {
        return String.format("%.3f", executionMs);
    }
}
