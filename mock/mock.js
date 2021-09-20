const Mock = require('mockjs')
module.exports = function(app){
	app.get('/temprature',function(req,res){
		//模拟温度数据
		res.json(Mock.mock({
			"temprature|5-35.1":1
		}))
	})
}