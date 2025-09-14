package fcgi;

import com.fastcgi.FCGIInterface;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class AreaCheckServlet {
    private static final List<Result> results = new ArrayList<>();
    private static final Gson gson = new GsonBuilder()
        .setPrettyPrinting()
        .create();

    public static void main(String[] args) {
        FCGIInterface fcgi = new FCGIInterface();

        while (fcgi.FCGIaccept() >= 0) {
            try {
                long startTime = System.nanoTime();

                String queryString = System.getProperty("QUERY_STRING");
                Map<String,String> queryParams = parseQueryString(queryString);

                double x = Double.parseDouble(
                    queryParams.getOrDefault("x", "0")
                );
                double y = Double.parseDouble(
                    queryParams.getOrDefault("y", "0")
                );
                double r = Double.parseDouble(
                    queryParams.getOrDefault("r", "1")
                );

                if (!validateParams(x, y, r)) {
                    sendErrorResponse("Invalid parameters");
                    continue;
                }

                boolean hit = checkHit(x, y, r);

                long endTime = System.nanoTime();
                double executionTime = (endTime - startTime) / 1_000_000.0;

                Result result = new Result(
                    x,
                    y,
                    r,
                    hit,
                    LocalDateTime.now().format(
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                    ),
                    executionTime
                );

                results.add(result);

                sendJsonResponse(result);
            } catch (Exception e) {
                sendErrorResponse("Error: " + e.getMessage());
            }
        }
    }

    private static Map<String, String> parseQueryString(String queryString) {
        Map<String, String> params = new HashMap<>();
        if (queryString != null && !queryString.isEmpty()) {
            String[] pairs = queryString.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(
                        keyValue[0],
                        URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8)
                    );
                }
            }
        }
        return params;
    }

    private static boolean validateParams(double x, double y, double r) {
        double[] validX = { -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2 };
        boolean xValid = false;
        for (double val : validX) {
            if (Math.abs(x - val) < 0.001) {
                xValid = true;
                break;
            }
        }

        boolean yValid = y >= -3 && y <= 5;

        double[] validR = { 1, 1.5, 2, 2.5, 3 };
        boolean rValid = false;
        for (double val : validR) {
            if (Math.abs(r - val) < 0.001) {
                rValid = true;
                break;
            }
        }

        return xValid && yValid && rValid;
    }

    private static boolean checkHit(double x, double y, double r) {
        if (x >= -r && x <= 0 && y >= 0 && y <= r / 2) {
            return true;
        }

        if (x <= 0 && y <= 0 && x >= -r / 2 && y >= -r / 2) {
            if (x + y >= -r / 2) {
                return true;
            }
        }

        return x >= 0 && y <= 0 && (x * x + y * y <= (r / 2) * (r / 2));
    }

    private static void sendJsonResponse(Result result) {
        Response response = new Response();
        response.currentResult = result;
        response.allResults = new ArrayList<>(results);

        String json = gson.toJson(response);
        byte[] body = json.getBytes(StandardCharsets.UTF_8);

        PrintStream out = System.out;
        out.print("Status: 200 OK\r\n");
        out.print("Content-Type: application/json; charset=utf-8\r\n");
        out.print("Access-Control-Allow-Origin: *\r\n");
        out.print("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
        out.print("Access-Control-Allow-Headers: Content-Type\r\n");
        out.print("Content-Length: " + body.length + "\r\n");
        out.print("\r\n");
        out.write(body, 0, body.length);
        out.flush();
    }

    private static void sendErrorResponse(String error) {
        Map<String, String> m = new HashMap<>();
        m.put("error", error == null ? "unknown" : error);
        String json = gson.toJson(m);
        byte[] body = json.getBytes(StandardCharsets.UTF_8);

        PrintStream out = System.out;
        out.print("Status: 400 Bad Request\r\n");
        out.print("Content-Type: application/json; charset=utf-8\r\n");
        out.print("Access-Control-Allow-Origin: *\r\n");
        out.print("Content-Length: " + body.length + "\r\n");
        out.print("\r\n");
        out.write(body, 0, body.length);
        out.flush();
    }

    static class Result {

        double x, y, r;
        boolean hit;
        String currentTime;
        double executionTime;

        Result(
            double x,
            double y,
            double r,
            boolean hit,
            String currentTime,
            double executionTime
        ) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.hit = hit;
            this.currentTime = currentTime;
            this.executionTime = executionTime;
        }
    }

    static class Response {

        Result currentResult;
        List<Result> allResults;
    }
}
