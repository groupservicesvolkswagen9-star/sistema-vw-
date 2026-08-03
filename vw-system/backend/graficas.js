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

async function generarGraficaOKR(
  okrs
) {

  const labels =
    okrs.map(
      item => item.objetivo
    );

  const valores =
    okrs.map(
      item => item.avance
    );

  const configuration = {

    type: "bar",

    data: {

      labels,

      datasets: [

        {

          label:
            "Avance OKR",

          data:
            valores,

          backgroundColor:
            "#003366"

        }

      ]

    },

    options: {

      responsive:
        false,

      scales: {

        y: {

          beginAtZero:
            true,

          max:
            100

        }

      }

    }

  };

  return await chartCanvas
    .renderToBuffer(
      configuration
    );
}

module.exports = {
  generarGraficaOKR
};