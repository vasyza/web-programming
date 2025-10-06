package app.util;

public final class Converter {

    private Converter() {}

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
