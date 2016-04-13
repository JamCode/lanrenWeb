
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var parse = require('url').parse;
var http = require('http');
var hostname = '112.74.102.178';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// app.use(express.static(__dirname+'/'));
app.use(express.static(__dirname+'/dist/css'));
app.use(express.static(__dirname+'/dist/css/skins/'));
app.use(express.static(__dirname+'/dist/imq/'));
app.use(express.static(__dirname+'/dist/img/'));

app.use(express.static(__dirname+'/bootstrap/css/'));
app.use(express.static(__dirname+'/bootstrap/fonts/'));
app.use(express.static(__dirname+'/bootstrap/'));
app.use(express.static(__dirname+'/bootstrap/js/'));
app.use(express.static(__dirname+'/plugins/iCheck'));
app.use(express.static(__dirname+'/plugins/jQuery'));
app.use(express.static(__dirname+'/plugins/morris/'));
app.use(express.static(__dirname+'/plugins/daterangepicker/'));
app.use(express.static(__dirname+'/plugins/jvectormap/'));
app.use(express.static(__dirname+'/plugins/iCheck/square'));
app.use(express.static(__dirname+'/plugins/datepicker/'));
app.use(express.static(__dirname+'/plugins/bootstrap-wysihtml5/'));
app.use(express.static(__dirname+'/dist/js/'));
app.use(express.static(__dirname+'/plugins/fastclick/'));
app.use(express.static(__dirname+'/plugins/slimScroll/'));
app.use(express.static(__dirname+'/plugins/sparkline/'));
app.use(express.static(__dirname+'/dist/js/pages/'));
app.use(express.static(__dirname+'/plugins/knob/'));
app.use(express.static(__dirname+'/node_modules/angular'));
app.use(express.static(__dirname+'/login'));
app.use(express.static(__dirname+'/index'));





//是否登录的验证
// app.use(function(req, res, next) {
//
// });


app.get('*', function(req, res, next){
    // console.log("session: ", req.session);
    var url = parse(req.url);
    // console.log('url ' + JSON.stringify(url));
    console.log(url.pathname);

    if(req.session.user_id === undefined){
        console.log('redirect login.html');
        if(url.pathname === '/login'){
            next();
        }else{
            res.redirect('/login');
        }
    }else{
        if(url.pathname === '/mypage'){
            next();
        }else{
            res.redirect('/mypage');
        }
    }
});


app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, 'login/login.html'));
});

//登录验证
app.post('/login', function(req, res){
    var returnData = {
        code: 0
    };
    if(req.body.username === 'wanghan'&&req.body.password === 'wanghan'){
        returnData.code = 0;
        var hour = 2*3600000
        req.session.cookie.expires = new Date(Date.now() + hour)
        req.session.cookie.maxAge = hour
        req.session.user_id = 'wanghan';
    }else{
        returnData.code = -1;
    }
    console.log(returnData);
    console.log(req.session);
    res.send(returnData);
});

app.get('/mypage', function(req, res){
    res.sendFile(path.join(__dirname, 'index/mypage.html'));
});

app.post('/logout', function(req, res){
    req.session.destroy(function(err) {
        // cannot access session here
        var returnData = {};
        if(err){
            returnData.code = -1;
            res.send(returnData);
        }else{
            returnData.code = 0;
            res.send(returnData);
        }
    });
});

app.post('/marketInfo', function(req, res){
    var returnData = {};
    var json = {};
    callAPI(json, '/stock/getAllMarketIndexNow', 'POST', function(err, data){
        if(err){
            returnData.code = -1;
        }else{
            returnData.code = 0;
            returnData.data = data.data;
            returnData.data.forEach(function(e){
                e.name = e.market_name;
                e.market_index = e.market_index_value_now;
                e.market_fluctuate = e.market_index_fluctuate;
                e.direct = parseFloat(e.market_fluctuate)>0;
            });
        }
        //console.log(returnData);
        res.send(returnData);
    });
});

app.post('/getMarketChart', function(req, res){
    console.log('getMarketChart'+JSON.stringify(req.body));

    var returnData = {};
    var json = {
        stock_code: req.body.stock_code,
        num_day: 66
    };

    callAPI(json, '/stock/getMarketDayInfo?stock_code='+json.stock_code+'&num_day='+json.num_day, 'GET', function(err, data){
        if(err){
            returnData.code = -1;
        }else {
            returnData.code = 0;
            returnData.data = data.data;
        }
        //console.log(data);
        //console.log(returnData);
        res.send(returnData);
    });
});

app.post('/getStockChart', function(req, res){
    var returnData = {};
    var json = {
        stock_code: req.body.stock_code,
        num_day: 66
    };
    callAPI(json, '/stock/getStockDayInfo?stock_code='+json.stock_code+'&num_day='+json.num_day, 'GET', function(err, data){
        if(err){
            returnData.code = -1;
        }else {
            returnData.code = 0;
            returnData.data = data.data;
        }
        //console.log(data);
        //console.log(returnData);
        res.send(returnData);
    });
});

app.post('/getChooseStockListInfo', function(req, res){
    var returnData = {};
    var json = {
        user_id: 'c186c03ba298bc3cc20490684010a353'
    };

    callAPI(json, '/stock/getChooseStockListInfo', 'POST', function(err, data){
        if(err){
            returnData.code = -1;
        }else{
            returnData.code = 0;
            returnData.data = [];
            for(var obj in data.data){
                data.data[obj].direct = data.data[obj].fluctuate>0;
                returnData.data.push(data.data[obj]);
            }

            returnData.data.sort(function(a, b){
                return a.add_timestamp_ms<b.add_timestamp_ms;
            });
        }
        console.log(returnData);
        //console.log(returnData);
        res.send(returnData);
    });
});

app.post('/getStock', function(req, res){
    var returnData = {};
    var json = {
        stock_alpha_info: req.body.stock_alpha_info
    };
    callAPI(json, '/stock/getStock', 'POST', function(err, data){
        if(err){
            returnData.code = -1;
        }else{
            returnData.code = 0;
            returnData.data = data.data;
        }
        console.log(returnData);
        res.send(returnData);
    });
});


app.post('/addstock', function(req, res){
    var returnData = {};
    var json = {
        stock_code: req.body.stock_code,
        user_id: 'c186c03ba298bc3cc20490684010a353'
    };
    callAPI(json, '/stock/addstock', 'POST', function(err, data){
        if(err){
            returnData.code = -1;
        }else{
            returnData.code = 0;
            returnData.data = data.data;
        }
        console.log(returnData);
        res.send(returnData);
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});



function callAPI(jsonObject, childpath, method, callback){
    var buf = new Buffer(JSON.stringify(jsonObject));
    var options = {
        port: 18000,
        hostname: hostname,
        method: method,
        path: childpath,
        timeout: 3000,
        headers: {
            'Content-Type': 'application/json; encoding=utf-8',
            'Accept': 'application/json',
            'Content-Length': buf.length
        }
    };

    var body = '';

    var req = http.request(options, function(res) {
        console.log("Got response: " + res.statusCode);
        if(res.statusCode!==200){
            callback(res.statusCode, 'error code: '+res.statusCode);
        }
        res.on('data', function(d) {
            body += d;
        }).on('end', function() {
            //console.log(res.headers);
            //console.log(body);
            callback(null, JSON.parse(body));
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(e, e.message);
    });

    req.setTimeout(3000, function(){
        callback('timeout', 'timeout');
    });

    req.write(JSON.stringify(jsonObject));
    req.end();
};
