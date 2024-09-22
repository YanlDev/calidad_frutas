if (window.location.pathname === "/analisis") {
  // Solo registrar ChartDataLabels y cargar los gráficos en la página analytics.html
  Chart.register(ChartDataLabels);
}
// Lógica para 'index.html'
if (
  window.location.pathname === "/" ||
  window.location.pathname === "/index"
) {
  const formDatos = document.getElementById("formulario-datos");
  const formExcel = document.getElementById("formulario-excel");
  const fileInput = document.getElementById("archivo-excel");
  const formInputs = document.querySelectorAll(
    "#formulario-datos input, #formulario-datos select"
  );
  const submitManualButton = document.querySelector(
    '#formulario-datos button[type="submit"]'
  );
  const submitExcelButton = document.querySelector(
    '#formulario-excel button[type="submit"]'
  );

  // Manejo del formulario de datos manuales
  if (formDatos) {
    formDatos.addEventListener("submit", function (event) {
      event.preventDefault();

      let valid = true;
      formInputs.forEach((input) => {
        if (input.value === "") {
          valid = false;
          input.classList.add("border-red-500");
        } else {
          input.classList.remove("border-red-500");
        }
      });

      if (!valid) {
        alert("Por favor, complete todos los campos antes de enviar.");
        return;
      }

      const formData = new FormData(this);

      // Convertir valores numéricos antes de enviarlos
      const brix = parseFloat(formData.get("brix"));
      const temperatura = parseFloat(formData.get("temperatura"));
      const tamano = parseFloat(formData.get("tamano"));

      const data = {
        brix: brix,
        temperatura: temperatura,
        tamano: tamano,
        inspeccion_visual: formData.get("inspeccion_visual"),
        color: formData.get("color"),
        fecha_evaluacion: new Date().toISOString(), // Agregar la fecha actual en formato ISO
      };

      fetch("/guardar_datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          formDatos.reset();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Ocurrió un error al enviar los datos");
        });
    });
  }

  // Manejo del formulario de carga de Excel
  if (formExcel) {
    formExcel.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!fileInput.files.length) {
          alert("Por favor, seleccione un archivo Excel antes de cargar.");
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let jsonData = XLSX.utils.sheet_to_json(worksheet);
        const baseDate = new Date();
        jsonData = jsonData.map((item, index) => {
          const fechaEvaluacion = new Date(
            baseDate.getTime() + index * 30 * 60 * 1000
          );
          return { ...item, fecha_evaluacion: fechaEvaluacion.toISOString() };
        });

        // Deshabilitar el botón de envío mientras se procesa
        submitExcelButton.disabled = true;

        fetch("/subir_excel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            formExcel.reset();
            formInputs.forEach((input) => (input.disabled = false)); // Rehabilitar inputs manuales
            submitManualButton.disabled = false;  // Rehabilitar el botón manual
          })
          .catch((error) => {
            console.error("Error al enviar los datos:", error);
            alert("Ocurrió un error al subir el archivo Excel");
          })
          .finally(() => {
            submitExcelButton.disabled = false;  // Rehabilitar el botón de Excel
          });
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Lógica para habilitar/deshabilitar botones según el uso de los formularios
  if (fileInput && formInputs) {
    formInputs.forEach((input) => {
      input.addEventListener("input", function () {
        let isFilled = false;
        formInputs.forEach((i) => {
          if (i.value !== "") {
            isFilled = true;
          }
        });
        submitExcelButton.disabled = isFilled;
        submitManualButton.disabled = false;
      });
    });

    fileInput.addEventListener("change", function () {
      if (fileInput.files.length > 0) {
        formInputs.forEach((input) => (input.disabled = true));
        submitExcelButton.disabled = false;
        submitManualButton.disabled = true;
      } else {
        formInputs.forEach((input) => (input.disabled = false));
        submitExcelButton.disabled = true;
        submitManualButton.disabled = false;
      }
    });
  }
}

function limpiarDatos() {
  fetch('/limpiar_datos', {
      method: 'POST'
  })
  .then(response => {
      if (response.ok) {
          alert("Datos limpiados con éxito");
      } else {
          alert("Error al limpiar los datos");
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("Error al intentar limpiar los datos");
  });
}


// Función genérica para obtener los datos desde un endpoint y graficar
function fetchDataAndRenderChart(endpoint, chartId, dataProcessor, interpretationId) {
  fetch(endpoint)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert("Error: " + data.error);
              return;
          }
          // Procesar los datos para el gráfico
          const chartData = dataProcessor(data);
          // Crear el gráfico
          renderChart(chartId, chartData);
          // Mostrar la interpretación
          document.getElementById(interpretationId).innerText = `Interpretación: ${data.interpretation}`;
      })
      .catch(error => {
          console.error("Error al cargar los datos:", error);
      });
}

// Función genérica para obtener los datos desde un endpoint y graficar
function fetchDataAndRenderChart(endpoint, chartId, dataProcessor, interpretationId) {
  fetch(endpoint)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              alert("Error: " + data.error);
              return;
          }
          // Procesar los datos para el gráfico
          const chartData = dataProcessor(data);
          // Crear el gráfico
          renderChart(chartId, chartData);
          // Mostrar la interpretación
          document.getElementById(interpretationId).innerText = `Interpretación: ${data.interpretation}`;
      })
      .catch(error => {
          console.error("Error al cargar los datos:", error);
      });
}

// Función para renderizar el gráfico usando Chart.js con porcentajes en los gráficos de pastel
// Función para renderizar el gráfico usando Chart.js con porcentajes solo en gráficos de pastel
function renderChart(chartId, chartData) {
  const ctx = document.getElementById(chartId).getContext('2d');

  // Verificar si es un gráfico de tipo 'pie' o 'doughnut' para aplicar los porcentajes
  const isPieChart = chartData.type === 'pie' || chartData.type === 'doughnut';

  new Chart(ctx, {
      type: chartData.type,
      data: {
          labels: chartData.labels,
          datasets: chartData.datasets
      },
      options: {
        ...chartData.options,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                // Si es un gráfico de pastel, calcular y mostrar los porcentajes
                if (isPieChart) {
                  let total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
                  let value = tooltipItem.raw;
                  let percentage = ((value / total) * 100).toFixed(2) + '%';
                  return `${tooltipItem.label}: ${value} (${percentage})`;
                } else {
                  // Para gráficos que no son de pastel, mostrar el valor normal
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                }
              }
            }
          },
          // Solo aplicar las etiquetas en el gráfico de pastel
          datalabels: isPieChart ? {
            formatter: (value, context) => {
              let total = context.dataset.data.reduce((acc, val) => acc + val, 0);
              let percentage = ((value / total) * 100).toFixed(2) + '%';
              return percentage;  // Mostrar el porcentaje en cada sección
            },
            color: '#000',  // Cambiar color a negro
            font: {
              size: 16,  // Aumentar el tamaño del texto
              weight: 'bold'}
            
          } : false
        }
      }
  });
}



// Función para procesar los datos de Brix con títulos de ejes
function processBrixData(data) {
  return {
      type: 'line',
      labels: data.brix.map((_, i) => i + 1),  // Índices para el eje X
      datasets: [{
          label: 'Grados Brix',
          data: data.brix,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
      }],
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Muestras'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Grados Brix'
            }
          }
        }
      }
  };
}

// Función para procesar los datos de temperatura con títulos de ejes
function processTemperatureData(data) {
  return {
      type: 'line',
      labels: data.temperatura.map((_, i) => i + 1),
      datasets: [{
          label: 'Temperatura',
          data: data.temperatura,
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
      }],
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Muestras'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperatura (°C)'
            }
          }
        }
      }
  };
}

// Función para procesar los datos de outliers en tamaño con títulos de ejes
function processSizeOutliersData(data) {
  return {
      type: 'scatter',
      labels: data.tamano.map((_, i) => i + 1),
      datasets: [{
          label: 'Tamaño',
          data: data.tamano.map((size, i) => ({ x: i + 1, y: size })),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
      }, {
          label: 'Outliers',
          data: data.outliers.map((outlier, i) => ({ x: i + 1, y: outlier })),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
      }],
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Muestras'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Tamaño'
            }
          }
        }
      }
  };
}

// Función para procesar la correlación Brix-Temperatura con títulos de ejes
function processBrixTempCorrelationData(data) {
  return {
      type: 'scatter',
      labels: data.brix.map((_, i) => i + 1),
      datasets: [{
          label: 'Brix vs Temperatura',
          data: data.brix.map((brix, index) => ({ x: brix, y: data.temperatura[index] })),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
      }],
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Grados Brix'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperatura (°C)'
            }
          }
        }
      }
  };
}

// Función para procesar la distribución de colores con porcentajes
function processColorDistributionData(data) {
  return {
      type: 'pie',
      labels: Object.keys(data.color),
      datasets: [{
          label: 'Distribución de Colores',
          data: Object.values(data.color),
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  };
}

// Función para procesar la distribución de defectos visuales con porcentajes
// Función para procesar la distribución de defectos visuales con porcentajes
function processDefectsDistributionData(data) {
  return {
      type: 'pie',
      labels: Object.keys(data.defectos),
      datasets: [{
          label: 'Distribución de Defectos Visuales',
          data: Object.values(data.defectos),
          backgroundColor: [
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
      }]
  };
}


// Función para procesar la distribución de calidad con porcentajes
function processQualityDistributionData(data) {
  return {
      type: 'pie',
      labels: ['Alta', 'Media', 'Baja'],
      datasets: [{
          label: 'Distribución de Calidad',
          data: [data.alta, data.media, data.baja],
          backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
      }]
  };
}

// Llamadas para cargar los datos y graficarlos
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname === "/analisis") {
    // Solo hacer las llamadas a los endpoints de análisis en la página analytics.html
    fetchDataAndRenderChart("/analisis/brix", "brixChart", processBrixData, "brixInterpretation");
    fetchDataAndRenderChart("/analisis/temperatura", "temperatureChart", processTemperatureData, "temperatureInterpretation");
    fetchDataAndRenderChart("/analisis/outliers_tamano", "sizeOutliersChart", processSizeOutliersData, "sizeInterpretation");
    fetchDataAndRenderChart("/analisis/correlacion_brix_temp", "brixTempVariabilityChart", processBrixTempCorrelationData, "brixTempVariabilityInterpretation");
    fetchDataAndRenderChart("/analisis/distribucion_colores", "colorDistributionChart", processColorDistributionData, "colorInterpretation");
    fetchDataAndRenderChart("/analisis/distribucion_defectos", "defectsChart", processDefectsDistributionData, "defectsInterpretation");
    fetchDataAndRenderChart("/analisis/calidad", "qualityChart", processQualityDistributionData, "qualityInterpretation");
}

});

function fetchDataAndRenderChart(endpoint, chartId, dataProcessor, interpretationId) {
  fetch(endpoint)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              console.log("Error: " + data.error); // Manejo silencioso del error
              return;
          }

          // Procesar los datos para el gráfico
          const chartData = dataProcessor(data);
          // Crear el gráfico
          renderChart(chartId, chartData);
          // Mostrar la interpretación
          document.getElementById(interpretationId).innerText = `Interpretación: ${data.interpretation}`;
      })
      .catch(error => {
          console.error("Error al cargar los datos:", error);
      });
}
