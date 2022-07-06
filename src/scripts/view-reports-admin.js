google.charts.load('current', { 'packages': ['corechart'] });
google.charts.load('current', { 'packages': ['bar'] });


let buildings = [
    { name: 'B1', occupied: 13, unOccupied: 7, Total: 20 },
    { name: 'B2', occupied: 19, unOccupied: 1, Total: 20 },
    { name: 'B3', occupied: 10, unOccupied: 10, Total: 20 },
    { name: 'B4', occupied: 6, unOccupied: 14, Total: 20 },
    { name: 'B5', occupied: 15, unOccupied: 5, Total: 20 },
    { name: 'B6', occupied: 12, unOccupied: 8, Total: 20 },
    { name: 'B7', occupied: 10, unOccupied: 10, Total: 20 },
    { name: 'B8', occupied: 3, unOccupied: 17, Total: 20 },
]

let visits = [
    { buildingName: 'B1', visitorsCount: 20 },
    { buildingName: 'B2', visitorsCount: 15 },
    { buildingName: 'B3', visitorsCount: 12 },
    { buildingName: 'B4', visitorsCount: 1 },
    { buildingName: 'B5', visitorsCount: 30 },
    { buildingName: 'B6', visitorsCount: 50 },
    { buildingName: 'B7', visitorsCount: 21 },
    { buildingName: 'B8', visitorsCount: 5 },
]
document.getElementById('filter1').onchange = function () {
    document.getElementById("building-reports").style.display = 'none';
    document.getElementById("visit-reports").style.display = 'none';
    document.getElementById("empty").style.display = "none";
    let option = document.getElementById('filter1').value;
    if (option == 'building') {
        document.getElementById("building-reports").style.display = 'block';
        google.charts.setOnLoadCallback(drawBuildingChart);
    }
    else if (option == 'visits') {
        document.getElementById("visit-reports").style.display = 'block';
        google.charts.setOnLoadCallback(drawVisitChart);
    }
}
function drawBuildingChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Building');
    data.addColumn('number', 'Total');
    data.addColumn('number', 'Occupied');
    data.addColumn('number', 'Unoccupied');
    for (i = 0; i < buildings.length; i++) {
        data.addRow([buildings[i].name, buildings[i].Total, buildings[i].occupied, buildings[i].unOccupied]);
    }
    var options = {
        'title': 'Occupancy',
        colors: ['#7570b3', '#1b9e77', 'rgb(219, 68, 55)']
    };
    var chart = new google.charts.Bar(document.getElementById('building-reports'));

    chart.draw(data, google.charts.Bar.convertOptions(options));

}

function drawVisitChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Building');
    data.addColumn('number', 'Visitor Count');
    for (i = 0; i < visits.length; i++) {
        data.addRow([visits[i].buildingName, visits[i].visitorsCount]);
    }
    var options = {
        'title': "Visits",
        'width': 600, 'height': 400
    };

    var chart = new google.visualization.PieChart(document.getElementById('visit-reports'));
    chart.draw(data, options);

}

