
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var parse = require('url').parse;


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
app.use(express.static(__dirname+'/login'));
app.use(express.static(__dirname+'/index'));
app.use(express.static(__dirname+'/node_modules/angular'));





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
        if(url.pathname === '/index'){
            next();
        }else{
            res.redirect('/index');
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
        var hour = 3600000
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

app.get('/index', function(req, res){
    res.sendFile(path.join(__dirname, 'index/index.html'));
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
    var returnData = [
        {
            name: '上证指数',
            market_index: (2985.49+Math.random()).toFixed(2),
            market_code: 'sh000001',
            market_fluctuate: (-0.5+Math.random()).toFixed(2),
            direct: (-0.5+Math.random()).toFixed(2)>0
        },
        {
            name: '深证成指',
            market_index: (10413.21+Math.random()).toFixed(2),
            market_code: 'sz399001',
            market_fluctuate: (-0.5+Math.random()).toFixed(2),
            direct: (-0.5+Math.random()).toFixed(2)>0
        },
        {
            name: '创业板指',
            market_index: (2229.49+Math.random()).toFixed(2),
            market_code: 'sz399006',
            market_fluctuate: (-0.5+Math.random()).toFixed(2),
            direct: (-0.5+Math.random()).toFixed(2)>0
        }
    ];

    console.log(returnData);
    res.send(returnData);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
