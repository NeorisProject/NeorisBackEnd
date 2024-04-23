const ctx = document.getElementById('line');

  const line = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [{
        label: 'Actividad de Sesión',
        data: [8, 10, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
        maintainAspectRatio: false, // Esto permite que el gráfico ignore el aspect ratio del canvas
        responsive: true, // Asegura que el gráfico sea responsive
        aspectRatio: 1, // Cambia esto para afectar la relación de aspecto del gráfico
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });