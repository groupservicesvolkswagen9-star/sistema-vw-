const {
  ChartJSNodeCanvas
} = require(
  "chartjs-node-canvas"
);

const width = 800;
const height = 500;

const chartCanvas =
  new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour:
      "white"
  });

//////////////////////////////////////////////////////
// GRAFICA OKR
//////////////////////////////////////////////////////

async function generarGraficaOKR(
  okrs
) {

  return await chartCanvas
    .renderToBuffer({

      type: "bar",

      data: {

        labels:
          okrs.map(
            item =>
              item.objetivo
          ),

        datasets: [

          {

            label:
              "Avance OKR",

            data:
              okrs.map(
                item =>
                  item.avance
              ),

            backgroundColor:
              "#003366"

          }

        ]

      },

      options: {

        responsive:
          false,

        plugins: {

          legend: {

            display:
              true

          }

        },

        scales: {

          y: {

            beginAtZero:
              true,

            max:
              100

          }

        }

      }

    });

}

//////////////////////////////////////////////////////
// GRAFICA SEMAFORO
//////////////////////////////////////////////////////

async function generarGraficaSemaforo(
  okrs
) {

  const verdes =
    okrs.filter(
      item =>
        item.avance >= 80
    ).length;

  const amarillos =
    okrs.filter(
      item =>
        item.avance >= 50 &&
        item.avance < 80
    ).length;

  const rojos =
    okrs.filter(
      item =>
        item.avance < 50
    ).length;

  return await chartCanvas
    .renderToBuffer({

      type: "pie",

      data: {

        labels: [

          "Verde",
          "Amarillo",
          "Rojo"

        ],

        datasets: [

          {

            data: [

              verdes,
              amarillos,
              rojos

            ],

            backgroundColor: [

              "#28a745",
              "#ffc107",
              "#dc3545"

            ]

          }

        ]

      },

      options: {

        responsive:
          false,

        plugins: {

          legend: {

            position:
              "bottom"

          }

        }

      }

    });

}

module.exports = {

  generarGraficaOKR,

  generarGraficaSemaforo

};