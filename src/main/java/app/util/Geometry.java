package app.util;

public final class Geometry {

    private Geometry() {}

    public static boolean checkHit(double x, double y, int r) {
        double R = r;

        if (x <= 0 && y >= 0) {
            return x * x + y * y <= R * R;
        }

        if (x <= 0 && y <= 0) {
            return x >= -R && y >= -R;
        }

        if (x >= 0 && y <= 0) {
            return y >= (x / 2.0 - R / 2.0);
        }

        return false;
    }
}
