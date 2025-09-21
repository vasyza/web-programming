package app.util;

public final class Geometry {

    private Geometry() {}

    public static boolean checkHit(double x, double y, int r) {
        double R = r;

        double xb = (x * 7.0) / R;
        double yb = (y * 6.0) / R;

        double fTop = top(xb);
        double fBottom = bottom(xb);

        return yb <= fTop && yb >= fBottom;
    }

    private static double top(double x) {
        double ax = Math.abs(x);
        if (x < -7 || x > 7) return Double.NaN;

        if (x < -3) {
            return 3 * Math.sqrt(1 - (x / 7.0) * (x / 7.0));
        } else if (x < -1) {
            return (
                0.5 * (x + 3) -
                ((3 * Math.sqrt(10)) / 7.0) * Math.sqrt(4 - (x + 1) * (x + 1)) +
                ((6 * Math.sqrt(10)) / 7.0)
            );
        } else if (x <= 1) {
            if (ax < 0.5) return 2.25;
            if (ax < 0.75) return 3 * ax + 0.75;
            return 9 - 8 * ax;
        } else if (x < 3) {
            return (
                0.5 * (3 - x) -
                ((3 * Math.sqrt(10)) / 7.0) * Math.sqrt(4 - (x - 1) * (x - 1)) +
                ((6 * Math.sqrt(10)) / 7.0)
            );
        } else {
            return 3 * Math.sqrt(1 - (x / 7.0) * (x / 7.0));
        }
    }

    private static double bottom(double x) {
        double ax = Math.abs(x);
        if (Math.abs(x) > 7) return Double.NaN;

        double t2i = Math.abs(ax - 2) - 1;
        double t2 = 0;
        if (1 - t2i * t2i >= 0) {
            t2 = Math.sqrt(1 - t2i * t2i);
        }
        double ell = 3 * Math.sqrt(1 - (x / 7.0) * (x / 7.0));
        double bracket =
            0.5 * ax + t2 - ((3 * Math.sqrt(33) - 7) / 112.0) * x * x + ell - 3;
        int window = (x > -4 ? 1 : -1) - (x > 4 ? 1 : -1);

        return 0.5 * bracket * window - ell;
    }
}
