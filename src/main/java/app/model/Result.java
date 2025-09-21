package app.model;

import java.io.Serializable;

public class Result implements Serializable {
    private double x;
    private double y;
    private int r;
    private boolean hit;
    private String currentTime;
    private double executionMs;

    public Result(double x, double y, int r, boolean hit, String currentTime, double executionMs) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.currentTime = currentTime;
        this.executionMs = executionMs;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public int getR() { return r; }
    public boolean isHit() { return hit; }
    public String getCurrentTime() { return currentTime; }
    public double getExecutionMs() { return executionMs; }
}

