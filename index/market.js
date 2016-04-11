console.log('init myApp');
angular.module('myApp', []).run(function($rootScope, $window) {
    console.log($window.localStorage['user']);
    $rootScope.user = {
        username: $window.localStorage['user'],
        err_code: 0
    };
}).controller('navController',function($scope, $http, $location, $window) {
    console.log('init navController');
    console.log($window.localStorage['user']);
    // $scope.user = {
    //
    // };
    // $scope.user.username = $window.localStorage['user'];
    $scope.logoutClick = function(){
        console.log('logout');
        $http.post('logout', {
            username:$scope.user.username
        }).success(function(data){
            console.log(data);
            $window.location.href = '/login';
        });
    };
}).controller('contentController', function($scope, $http, $interval){

    console.log('init contentController');

    //获取大盘指数
    $scope.marketdata = [];

    getMarketInfo($http, function(data){
        if(data.code === 0){
            $scope.marketdata = data.data;
            $scope.marketdata.forEach(function(e){
                e.market_fluctuate = e.market_fluctuate+'%';
            });

            $scope.selected = {
                name: $scope.marketdata[0].name+'('+$scope.marketdata[0].market_code+')',
                stock_code: $scope.marketdata[0].market_code
            };

            //获取大盘指数走势图信息
            getMarketChart($http, $scope);

        }else{
            $scope.err_code = data.code;
        }
    });

    $interval(function () {
        getMarketInfo($http, function(data){
            if(data.code === 0){
                $scope.marketdata = data.data;
                $scope.marketdata.forEach(function(e){
                    e.market_fluctuate = e.market_fluctuate+'%';
                });
            }else{
                $scope.err_code = data.code;
            }
        });
        console.log($scope.marketdata);
    }, 10*1000);

    //获取自选股票
    console.log($scope.marketdata);


    //大盘指数点击事件
    $scope.marketInfoClick = function(market_code){
        console.log(market_code);
        $scope.marketdata.forEach(function(e){
            if(e.market_code === market_code){
                $scope.selected = {
                    name: e.name+'('+e.market_code+')',
                    stock_code: market_code
                };
            }
        });

        getMarketChart($http, $scope);
    };
});

function getMarketInfo(http, callback){
    console.log('call getMarketInfo');
    http.post('marketInfo', {
    }).success(function(data){
        callback(data);
    });
}


function getMarketChart(http, scope){
    console.log('call getMarketChart');
    http.post('getMarketChart', {
        stock_code:scope.selected.stock_code
    }).success(function(data){
        console.log(data);
        showChart(data);
    });
}


function showChart(data) {
    Highcharts.setOptions({
        lang: {
            rangeSelectorFrom: '从',
            rangeSelectorTo: '到',
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            weekdays: ['周末', '周一', '周二', '周三', '周四', '周五', '周六']
        }
    });

    if (data.code == 0) {
        var ohlc = [];
        var volume = [];
        var colors = [];
        var fiveAvPrices = [];
        var tenAvPrices = [];
        var twentyAvPrices = [];
        var dataLength = data.data.length;
        var now = data.now;

        for (i = 0; i < dataLength; i++) {
            ohlc.push([data.data[i].timestamp_ms, // the date
            data.data[i].open_price, // open
            data.data[i].high_price, // high
            data.data[i].low_price, // low
            data.data[i].price // close
            ]);

            volume.push([data.data[i].timestamp_ms, // the date
            data.data[i].amount // the volume
            ]);

            if (data.data[i].open_price - data.data[i].price > 0) {
                colors.push('#388e3c');
            } else {
                colors.push('#d32f2f');
            }

            if (data.data[i].fiveday_av_price != 0 && data.data[i].fiveday_av_price != null) {
                fiveAvPrices.push([data.data[i].timestamp_ms, data.data[i].fiveday_av_price]);
            }
            if (data.data[i].tenday_av_price != 0 && data.data[i].tenday_av_price != null) {
                tenAvPrices.push([data.data[i].timestamp_ms, data.data[i].tenday_av_price]);
            }
            if (data.data[i].twentyday_av_price != 0 && data.data[i].twentyday_av_price != null) {
                twentyAvPrices.push([data.data[i].timestamp_ms, data.data[i].twentyday_av_price]);
            }
            console.log(data.data[i].timestamp_ms);
        }

        if (now != null) {
            if (dataLength > 0 && now.date === data.data[dataLength - 1].date) {

            } else {
                ohlc.push([now.timestamp_ms, // the date
                now.open_price, // open
                now.high_price, // high
                now.low_price, // low
                now.price // close
                ]);

                volume.push([now.timestamp_ms, // the date
                now.amount // the volume
                ]);

                if (now.open_price - now.price > 0) {
                    colors.push('#388e3c');
                } else {
                    colors.push('#d32f2f');
                }
                console.log(now.timestamp_ms);
            }
        }

        $('#stockChart').highcharts('StockChart', {
            yAxis: [{
                labels: {
                    style: {
                        'fontSize': '28px'
                    },
                    align: 'left',
                    //x: -3,
                    // x: -<%=width % >+5,
                    step: 2
                },

                height: '65%',
                lineWidth: 2
            },
            {
                labels: {
                    enabled: false
                },

                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],

            xAxis: {
                labels: {
                    style: {
                        'fontSize': '28px'
                    },
                    step: 2
                }
            },

            // chart: {
            //     height: <%=height % >
            // },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            credits: {
                enabled: false
            },

            rangeSelector: {
                enabled: false
            },
            colors: ['#E91E63', '#FFC107', '#2196F3'],
            plotOptions: {
                candlestick: {
                    color: '#388e3c',
                    //下降块颜色
                    lineColor: '#388e3c',
                    //下降块线条颜色
                    upColor: '#d32f2f',
                    //上升块颜色
                    upLineColor: "#d32f2f" //上升块线条颜色
                },
                column: {
                    colorByPoint: true,
                    colors: colors
                },
                // series: {
                //     marker: {
                //         enabled: false,
                //         states: {
                //             hover: {
                //                 enabled: false
                //             }
                //         }
                //     }
                // }

            },
            series: [{
                type: 'candlestick',
                name: '股价',
                data: ohlc,
                // dataGrouping: {
                //     units: groupingUnits
                // }
            },
            {
                type: 'column',
                name: '成交量',
                data: volume,
                yAxis: 1,
                // dataGrouping: {
                //     units: groupingUnits
                // }
            },
            {
                name: 'MA5',
                data: fiveAvPrices,
                tooltip: {
                    valueDecimals: 2
                }
            },
            {
                name: 'MA10',
                data: tenAvPrices,
                tooltip: {
                    valueDecimals: 2
                }
            },
            {
                name: 'MA20',
                data: twentyAvPrices,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    } else {
        $("#stockChart").html("<h1>ERROR:" + data.code + "</h1>");
    }
}
