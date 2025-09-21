package app.util;

public final class Validator {

    private Validator() {}

    public static boolean hasParams(String x, String y, String r) {
        return (
            x != null &&
            y != null &&
            r != null &&
            !x.isBlank() &&
            !y.isBlank() &&
            !r.isBlank()
        );
    }

    public static boolean isValidX(double x) {
        return x >= -5 && x <= 3;
    }

    public static boolean isValidY(double y) {
        return y >= -3 && y <= 5;
    }

    public static boolean isValidR(int r) {
        return r >= 1 && r <= 5;
    }

    public static Double parseDoubleNormalized(String s) {
        if (s == null) return null;
        s = s.trim().replace(',', '.');
        try {
            return Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static Integer parseIntNormalized(String s) {
        if (s == null) return null;
        s = s.trim();
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
