/**
 * @authors EricYang (ericyangxinde@gmail.com)
 * @date    2017-03-10 18:09:28
 * @version $Id$
 * 创建一个测试用的httpServer
 **/

var express=require("express");
var config=require('./config/index');

var port=process.env.PORT||config.build.port;
var app=express();

var router=express.Router();

router.get('/',function(req,rsp,next){
	req.url='./index.html';
	next();
});

app.use(router);


var appData = require('./data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
	res.json({
		errno: 0,
		data: seller
	});
});

apiRoutes.get('/goods', function (req, res) {
	res.json({
		errno: 0,
		data: goods
	});
});

apiRoutes.get('/ratings', function (req, res) {
	res.json({
		errno: 0,
		data: ratings
	});
});

app.use('/api', apiRoutes);
//build之后的项目代码
app.use(express.static('./dist'));
//启动
module.exports = app.listen(port, function (err) {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:' + port + '\n')
});

//hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh