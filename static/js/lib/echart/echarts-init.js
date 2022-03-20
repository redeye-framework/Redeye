$(document).ready(function() {

    var dom = document.getElementById("gauge");
    var gaugeChart = echarts.init(dom);
    var time = document.getElementById("time");
    var days = document.getElementById("days");
    if(time.value > 100){
        time.value = 100;
        days.value = "No";
    }
    var app = {};
    option = null;
    option = {
        color: ['#62549a','#4aa9e9', '#ff6c60'],
        tooltip : {
            formatter: days.value + ' {a} {b}' 
        },
        series : [
            {
                name:'days left',
                type:'gauge',
                detail : {formatter:'{value}%'},
                data:[{value: time.value}]
            }
        ]
    };

    if (option && typeof option === "object") {
        gaugeChart.setOption(option, false);
    }

    /**
     * Resize chart on window resize
     * @return {void}
     */
    window.onresize = function() {
        gaugeChart.resize();
    };


});
