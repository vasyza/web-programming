<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8"/>
    <title>Результат проверки</title>
    <link rel="stylesheet" href="<%=request.getContextPath()%>/static/css/styles.css"/>
    <script defer src="<%=request.getContextPath()%>/static/js/validation.js"></script>
    <script defer src="<%=request.getContextPath()%>/static/js/graph.js"></script>
</head>
<body>
<header class="header">
    <h1>Результат проверки</h1>
    <a class="small" href="<%=request.getContextPath()%>/controller">Новый запрос</a>
    <hr/>
    <div>Студент: Яременко Владимир Михайлович | Группа: P3220 | Вариант: 5768</div>
    <hr/>
  </header>

<main class="container">
    <section style="flex: 1;">
        <table>
            <thead>
            <tr><th>X</th><th>Y</th><th>R</th><th>Попадание</th><th>Время</th><th>Вып., мс</th></tr>
            </thead>
            <tbody>
            <%
                app.model.Result res = (app.model.Result) request.getAttribute("result");
                if (res != null) {
            %>
            <tr>
                <td><%= String.format("%.2f", res.getX()) %></td>
                <td><%= String.format("%.2f", res.getY()) %></td>
                <td><%= res.getR() %></td>
                <td class="<%= res.isHit() ? "hit-true" : "hit-false" %>"><%= res.isHit() ? "Да" : "Нет" %></td>
                <td><%= res.getCurrentTime() %></td>
                <td><%= String.format("%.3f", res.getExecutionMs()) %></td>
            </tr>
            <% } %>
            </tbody>
        </table>
    </section>

    <section class="graph-section">
        <canvas id="graph" width="500" height="500"></canvas>
    </section>
</main>
<p><a href="<%=request.getContextPath()%>/controller">Вернуться к форме</a></p>

<script>
  window.SELECTED_R = (function(){
    try {
      <% app.model.Result _resR = (app.model.Result) request.getAttribute("result"); %>
      <% if (_resR != null) { %>
      return <%= _resR.getR() %>;
      <% } else if (request.getParameter("r") != null) { %>
      return <%= Integer.parseInt(request.getParameter("r")) %>;
      <% } else { %>
      return 1;
      <% } %>
    } catch(e){ return 1; }
  })();
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
