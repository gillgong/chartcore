define(['pieChart',
        'axis_x',
        'axis_y',
        'pieChartData',
        'pieChartConf',
        'css!pieChartCss'
    ],
    function(PieChart, AxisX, AxisY, pieChartData, pieChartConf) {

        var container = $(".web-chart-wrapper");
        var chart_conf = {
            'container': container,
            'axis_x': [new AxisX(container, pieChartConf.x)],
            'axis_y': [new AxisY(container, pieChartConf.y)]
        };

        var Chart = new PieChart(chart_conf);
        Chart.setData(pieChartData);

        return Chart;
    });
