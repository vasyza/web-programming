package app.controller;

import app.model.Result;
import app.model.ResultsBean;
import app.util.Geometry;
import app.util.Validator;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@WebServlet(name = "AreaCheckServlet", urlPatterns = { "/area-check" })
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
        long start = System.nanoTime();
        String sx = req.getParameter("x");
        String sy = req.getParameter("y");
        String sr = req.getParameter("r");

        try {
            Double xVal = Validator.parseDoubleNormalized(sx);
            Double yVal = Validator.parseDoubleNormalized(sy);
            Integer rVal = Validator.parseIntNormalized(sr);

            if (xVal == null || yVal == null || rVal == null) {
                req.setAttribute(
                    "error",
                    "Параметры x, y, r должны быть числами (допустима запятая)"
                );
                req
                    .getRequestDispatcher("/WEB-INF/views/index.jsp")
                    .forward(req, resp);
                return;
            }

            double x = xVal;
            double y = yVal;
            int r = rVal;

            if (
                !Validator.isValidX(x) ||
                !Validator.isValidY(y) ||
                !Validator.isValidR(r)
            ) {
                req.setAttribute(
                    "error",
                    "Диапазоны: X∈[-5;3], Y∈[-3;5], R∈{1..5}"
                );
                req
                    .getRequestDispatcher("/WEB-INF/views/index.jsp")
                    .forward(req, resp);
                return;
            }

            boolean hit = Geometry.checkHit(x, y, r);
            double execMs = (System.nanoTime() - start) / 1_000_000.0;
            String now = LocalDateTime.now().format(
                DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            );

            Result result = new Result(x, y, r, hit, now, execMs);

            HttpSession session = req.getSession(true);
            ResultsBean bean = (ResultsBean) session.getAttribute("results");
            if (bean == null) {
                bean = new ResultsBean();
                session.setAttribute("results", bean);
            }
            bean.add(result);

            req.setAttribute("result", result);
            req.setAttribute("allResults", bean.getAll());
            req
                .getRequestDispatcher("/WEB-INF/views/result.jsp")
                .forward(req, resp);
        } catch (Exception ex) {
            req.setAttribute("error", "Ошибка обработки запроса");
            req
                .getRequestDispatcher("/WEB-INF/views/index.jsp")
                .forward(req, resp);
        }
    }
}
