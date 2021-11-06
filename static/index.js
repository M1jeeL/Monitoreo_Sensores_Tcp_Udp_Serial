function tiempo_real() {
  moment().format();
  var socket = io();
  socket.on("sensor_temperatura", function (data) {
    // Se genera el manómetro
    google.charts.load("current", { packages: ["gauge"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      // Rellena los datos con la data recibida desde el sensor tcp
      var datosRecibidos = google.visualization.arrayToDataTable([
        ["Label", "Value"],
        ["Temperatura", parseInt(data)],
      ]);
      // Configuración de parámetros para estilos y rangos del manómetro
      var options = {
        width: 380,
        height: 400,
        redFrom: 60,
        redTo: 100,
        yellowFrom: 40,
        yellowTo: 60,
        greenFrom: 0,
        greenTo: 40,
        minorTicks: 5,
        animation: {
          duration: 250,
          easing: "ease",
        },
      };
      var chart = new google.visualization.Gauge(
        document.getElementById("temperatura")
      );
      // Redibuja el manómetro
      chart.draw(datosRecibidos, options);
    }
  });

  socket.on("sensor_calidad", function (data) {
    // Se genera el tubo de ensayo en el DOM
    var tube = document.getElementsByClassName("tube")[0];
    tube.style.setProperty("--tube-percentage", data + "%");
    tube.style.setProperty("--tube-title", `"${data}%"`);

    if (data > 0 && data < 50) {
      tube.style.setProperty("--tube-color", "#DE3516");
    } else if (data > 50 && data <= 80) {
      tube.style.setProperty("--tube-color", "#049DD9");
    } else if (data > 80 && data <= 100) {
      tube.style.setProperty("--tube-color", "#9DDE16");
    }
  });

  const footer = (tooltipItems) => {
    let sum = 0;

    tooltipItems.forEach(function (tooltipItem) {
      sum += tooltipItem.parsed.y;
    });
    return `$1 PEN = $${sum} CLP`;
  };
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Valor de Moneda PEN",
          data: [],
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        interaction: {
          intersect: false,
          mode: "index",
        },
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            footer: footer,
          },
        },
      },
    },
  });

  socket.on("sensor_arduino", function (datos) {
    currentDate = new Date();

    const data = myChart.data;
    if (data.datasets.length > 0) {
      data.labels.push(moment(currentDate).format("LTS"));

      for (let index = 0; index < data.datasets.length; ++index) {
        data.datasets[index].data.push(parseInt(datos));
      }

      if (data.datasets[0].data.length > 10) {
        data.labels.shift();
        data.datasets[0].data.shift();
      }
      myChart.update();
    }
  });
}
