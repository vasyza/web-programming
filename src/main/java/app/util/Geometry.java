package app.util;

public final class Geometry {

    private Geometry() {}

    public static boolean checkHit(double x, double y, int r) {
        double R = r;
        if (x >= -R && x <= 0 && y >= 0 && y <= R / 2.0) return true;
        if (x <= 0 && y <= 0 && x >= -R / 2.0 && y >= -R / 2.0) {
            if (x + y >= -R / 2.0) return true;
        }
        return x >= 0 && y <= 0 && (x * x + y * y <= (R / 2.0) * (R / 2.0));
    }
}
