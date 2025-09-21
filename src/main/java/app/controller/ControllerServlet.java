package app.controller;

import app.util.Validator;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "ControllerServlet", urlPatterns = { "/controller" })
public class ControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
        String x = req.getParameter("x");
        String y = req.getParameter("y");
        String r = req.getParameter("r");
        String clear = req.getParameter("clear");

        if ("1".equals(clear)) {
            var session = req.getSession(false);
            if (session != null) {
                session.removeAttribute("results");
            }
            req.setAttribute("message", "История очищена");
            req
                .getRequestDispatcher("/WEB-INF/views/index.jsp")
                .forward(req, resp);
            return;
        }

        if (Validator.hasParams(x, y, r)) {
            req.getRequestDispatcher("/area-check").forward(req, resp);
        } else {
            req
                .getRequestDispatcher("/WEB-INF/views/index.jsp")
                .forward(req, resp);
        }
    }
}
