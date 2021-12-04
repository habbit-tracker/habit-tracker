import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, PieController } from 'chart.js';



const args = JSON.parse(document.getElementById("data").text);
let pieChartData = args.pie_chart_data;
ChartJS.register(PieController, Tooltip, Legend);

var data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
            fill: true,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            data: pieChartData,
        }
    ]
};

var options = {
        rotation: -0.7 * Math.PI,
        //responsive: false,
        //radius: '200',
        //maintainAspectRatio: false
};


window.onload=function() {
  var canvas = document.getElementById("habitPie");
  var ctx = canvas.getContext('2d');
  var habitPie= new ChartJS(ctx, {
    type: 'pie',
    data: data,
    options: options
  });
}
