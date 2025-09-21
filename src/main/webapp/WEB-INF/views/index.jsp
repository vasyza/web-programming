<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8"/>
    <title>Проверка попадания — Форма</title>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/static/css/styles.css"/>
    <script defer src="<%=request.getContextPath()%>/static/js/validation.js"></script>
    <script defer src="<%=request.getContextPath()%>/static/js/graph.js"></script>
</head>
<body>
<header class="header">
    <h1>Лабораторная 2</h1>
    <div>Студент: Яременко Владимир Михайлович | Группа: P3220 | Вариант: 5768</div>
    <a class="small" href="<%=request.getContextPath()%>/controller">Главная</a>
    <hr/>
</header>
<main class="container">
    <section class="form-section">
        <% String error = (String) request.getAttribute("error"); if (error != null) { %>
        <div class="error" id="global-error"><%= error %></div>
        <% } else { String message = (String) request.getAttribute("message"); if (message != null) { %>
        <div class="message" id="global-message"><%= message %></div>
        <% } } %>
        <form id="hitForm" method="get" action="<%=request.getContextPath()%>/controller" onsubmit="return validateForm();">
            <fieldset>
                <legend>Координаты</legend>
                <div class="field">
                    <label>X:</label>
                    <% for (int i = -5; i <= 3; i++) { %>
                        <button type="button" class="x-btn" onclick="selectX(<%=i%>)"><%=i%></button>
                    <% } %>
                    <input type="hidden" id="x" name="x"/>
                    <div class="field-error" id="x-error"></div>
                </div>

                <div class="field">
                    <label for="y">Y (-3..5):</label>
                    <input id="y" name="y" type="text" placeholder="-3 .. 5"/>
                    <div class="field-error" id="y-error"></div>
                </div>

                <div class="field">
                    <label>R:</label>
                    <% for (int r = 1; r <= 5; r++) { %>
                        <label class="radio"><input type="radio" name="r" value="<%=r%>"> <%=r%></label>
                    <% } %>
                    <div class="field-error" id="r-error"></div>
                </div>

                <div class="actions">
                    <button type="submit">Проверить</button>
                    <button type="button" onclick="clearForm()">Сбросить</button>
                    <button type="button" onclick="clearHistory()">Очистить историю</button>
                </div>
            </fieldset>
        </form>
        <section class="results-section">
            <h2>Предыдущие результаты</h2>
            <table>
                <thead>
                <tr><th>X</th><th>Y</th><th>R</th><th>Попадание</th><th>Время</th><th>Вып., мс</th></tr>
                </thead>
                <tbody>
                <%
                    app.model.ResultsBean bean = (app.model.ResultsBean) session.getAttribute("results");
                    if (bean != null) {
                        java.util.List<app.model.Result> __list = bean.getAll();
                        for (int __i = __list.size() - 1; __i >= 0; __i--) {
                            app.model.Result r = __list.get(__i);
                %>
                <tr>
                    <td><%= String.format("%.2f", r.getX()) %></td>
                    <td><%= String.format("%.2f", r.getY()) %></td>
                    <td><%= r.getR() %></td>
                    <td class="<%= r.isHit() ? "hit-true" : "hit-false" %>"><%= r.isHit() ? "Да" : "Нет" %></td>
                    <td><%= r.getCurrentTime() %></td>
                    <td><%= String.format("%.3f", r.getExecutionMs()) %></td>
                </tr>
                <%      }
                    }
                %>
                </tbody>
            </table>
        </section>
    </section>

    <section class="graph-section">
        <canvas id="graph" width="500" height="500"></canvas>
    </section>
</main>

<script>
  window.ALL_RESULTS = [
    <% if (session.getAttribute("results") != null) {
         app.model.ResultsBean b = (app.model.ResultsBean) session.getAttribute("results");
         java.util.List<app.model.Result> list = b.getAll();
         for (int i = 0; i < list.size(); i++) {
           app.model.Result rr = list.get(i);
    %>
    {x:<%=rr.getX()%>, y:<%=rr.getY()%>, r:<%=rr.getR()%>, hit:<%=rr.isHit()%>}<%= (i+1<list.size()? "," : "") %>
    <%   }
       }
    %>
  ];
</script>

</body>
</html>
