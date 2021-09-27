<template>
	<view class="wrap">
		
		<echarts :option="option" id="canvas"></echarts>
		
		<view class="line">
			<view class="line1"></view>
			<view class="line2"></view>
			<view class="line3"></view>
			<view class="line4"></view>
		</view>
		<view class="header">
			<view class="logo">
				
			</view>
			<view class="time">
				{{now_time}}
			</view>
			<view class="single">
				
			</view>
		</view>
		<view class="container">
			<view class="fps">fps:{{fps}}</view>
			<view class="record" @click="transform_control()">
				
			</view>
			<view class="button_group">
				<button type="default" @click="feel">感知模式</button>
				<button type="default" @click="performance">性能模式</button>
				<button type="default" @click="uhd">高清模式</button>
			</view>
			<view class="compass">
				
			</view>
		</view>
		<view class="footer">
			<view class="left_show">
				<view class="temprature">
					{{temprature}}摄氏度
				</view>
				<view class="wist">
					{{wist}}%
				</view>
				<view class="qiya">
					{{qiya}}hpa
				</view>
				<view class="other">
					so2:{{so2}}
				</view>
			</view>
			<map id="map" style="border-radius:100%;opacity:0.9;30vw;height:180px;" :latitude="28.231921" :longitude="112.935873"></map>
		</view>
	</view>
	
</template>

<script>
	const facecollectSdk = uni.requireNativePlugin('sqym-arc-face-plugin');
	const modal = uni.requireNativePlugin('modal');
	//modal
	import Echarts from '@/components/echarts/echarts.vue'
	import EchartsEl from '@/components/echarts/echarts-el.vue'
	const baseurl = "http://localhost:9999"
	
	export default{
		data(){
			return{
				now_time:'',
				temprature:'15.5',
				wist:'30',
				qiya:'1013',
				so2:'无',
				control:false,//代表是圆形
				count:0,
				fps:0,
				videoflag:1,
				row:[],
				col:[],
				min:0,
				max:100,
				tempdata:[],
				option:{}
			}
		},
		onLoad() {
			let predata = null
			let that = this
			let timer1 = setInterval(function(){
				that.now_time = that.$u.timeFormat(Date.parse(new Date()),"hh:MM:ss")
				that.fps = that.count
				that.count = 0
			},1000)
			uni.setKeepScreenOn({})
			
			let socket = new WebSocket("ws://192.168.146.127:22222/photo")
			socket.onopen = function(){
				console.log('connect success')
				let timer2 = setInterval(function(){
					socket.send("2")
				},20)
			}
			socket.onmessage = function(msg){
				document.getElementsByClassName("wrap")[0].style.backgroundImage = `url("data:image/gif;base64,${msg.data}")`
				that.count += 1
			}
			
		},
		onReady() {
			for(let x = 1;x<=32;x++){
			    this.col[x - 1] = x;
			}
			for(let x = 1;x<=24;x++){
			    this.row[x - 1] = x;
			}
			this.getTemp()
		},
		methods:{
			delay(time){
				return new Promise(resolve=>{
					setTimeout(()=>{
						resolve('resolve')
					},time)
				})
			},
			getTemp(){
				let that = this
				//获取红外点阵
				uni.request({
					url:baseurl,
					method:"POST",
					success:async function (res){
						    let min = null,max = null
							let temp = new Array()
							res = res.data
						    for(let i = 0;i<768;i++){
						        //倒着接入数组
						        //[0,0,x],[0,31]
						        if(min == null){
						            min = res.data[i]
						        }else{
						            min = res.data[i] < min ? res.data[i] : min
						        }
						        if(max == null){
						            max = res.data[i]
						        }else{
						            max = res.data[i] > max ? res.data[i] : max
						        }
						        temp[i] = new Array()
						        temp[i][0] = Math.floor(i/32)
						        temp[i][1] = 31-(i%32);
						        temp[i][2] = res.data[i]
						    }
							that.tempdata = temp
							that.min = min
							that.max = max
							that.option = {
								tooltip: {
								    position: 'top'
								  },
								  grid: {
								    height: '100%',
								    width: '100%',
								    top: '0%',
								    left: '0%',
								  },
								  xAxis: {
								    type: 'category',
								    data: that.row,
								    splitArea: {
								      show: true
								    }
								  },
								  yAxis: {
								    type: 'category',
								    data: that.col,
								    splitArea: {
								      show: true
								    }
								  },
								  visualMap: {
								    min: res.avg - (that.max - that.min) / 2,
								    max: res.avg + (that.max - that.min) / 2,
								    calculable: true,
								    orient: 'horizontal',
								    left: 'center',
								    bottom: '0%',
								    inRange: {
								
								      color: ['Blue','Green','Orange','red']
								      
								      }
								  },
								  series: [
								    {
								      name: 'temprature',
								      type: 'heatmap',
								      data: that.tempdata,
								    }
								  ]
								
							}
							// that.getTemp()//继续调用
							console.log(res.data)
							await that.delay(200)
							that.getTemp()
					}
				})
			},
			transform_control(){
				if(!this.control){
					document.getElementsByClassName("record")[0].classList.add("record_hover")
				}else{
					document.getElementsByClassName("record")[0].classList.remove("record_hover")
				}
				this.control = !this.control
			},
			feel(){
				uni.showLoading({
					title:'切换模式中···'
				})
				uni.request({
					method:"GET",
					url:"http://192.168.146.127:22222/mode/1",
					success:res=>{
						uni.hideLoading()
					},
					fail:err=>{
						console.log(err)
						uni.hideLoading()
					}
				})
			},
			performance(){
				uni.showLoading({
					title:'切换模式中···'
				})
				uni.request({
					method:"GET",
					url:"http://192.168.146.127:22222/mode/2",
					success:res=>{
						uni.hideLoading()
					},
					fail:err=>{
						console.log(err)
						uni.hideLoading()
					}
				})
			},
			uhd(){
				uni.showLoading({
					title:'切换模式中···'
				})
				uni.request({
					method:"GET",
					url:"http://192.168.146.127:22222/mode/3",
					success:res=>{
						uni.hideLoading()
					},
					fail:err=>{
						console.log(err)
						uni.hideLoading()
					}
				})
			}
		},
		components: {
			Echarts,
			EchartsEl
		},
	}
</script>

<style lang="scss">
	$camera:2px;
	#canvas{
		position:fixed;
		width:320px;
		height:240px;
		right:0;
		bottom:220px;
		opacity: 0.75;
	}
	.fps{
		color:white;
		font-size: 16px;
		position: absolute;
		left:15px;
		top:75px;
	}
	.line view{
		z-index:1;
		background:rgba(255,255,255,.65);
	}
	.line1{
		position: absolute;
		height:$camera;
		width:100vw;
		top:calc(100vh / 3);
	}
	.line2{
		position: absolute;
		height:$camera;
		width:100vw;
		left:0;
		top:calc(100vh / 3 * 2);
	}
	.line3{
		position:absolute;
		top:0;
		left:calc(100vw / 3);
		height:100vh;
		width:$camera;
	}
	.line4{
		position:absolute;
		top:0;
		left:calc(100vw / 3 * 2);
		height:100vh;
		width:$camera;
	}
	.header{
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		width:100%;
		height:40px;
		flex-wrap: nowrap;
		justify-content: space-between;
	}
	.header view{
		display: flex;
		width:33.3%;
		box-sizing: border-box;
		height:100%;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		color:white;
		background:rgba(0,0,0,.65);
		z-index: 3;
	}
	.header view:nth-child(1){
		align-items: flex-start;
		justify-content: left;
	}
	.header view:nth-child(2){
		height:40px;
	}
	.header view:nth-child(3){
		align-items: flex-end;
		justify-content: right;
	}
	.wrap{
		height:100vh;
		width:100vw;
		box-sizing: border-box;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.container{
		height:calc(100vh - 220px);
		width:100vw;
		box-sizing: border-box;
	}
	.container .record{
		background:red;
		width:50px;
		height:50px;
		position:fixed;
		box-sizing: border-box;
		border-radius: 100%;
		border: 5px solid #fff;
		left:10px;
		top:calc(30% - 25px);
		transition:all 1s;
	}
	.container .record_hover{
		width:25px!important;
		height:25px!important;
		top:calc(30% - 12.5px)!important;
		left:22.5px!important;
		border:0;
		background:white;
		border-radius: 0;
		
	}
	.container .button_group{
		display: flex;
		position: fixed;
		flex-direction: column;
		top:40%;
		left:10px;
	}
	.cntainer .button_group button{
		border-radius: 15px;
		padding:10px 20px;
	}
	.container .record_hover::after{
		position: absolute;
		clear: both;
		width:50px;
		height:50px;
		border-radius: 100%;
		background:red;
		top:calc(50% - 12.5px)!important;
		left:22.5px!important;
	}
	.footer{
		display: flex;
		width:100vw;
		height:180px;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: space-between;
	}
	.footer .left_show{
		margin-top:120px;
		display: flex;
		width:70%;
		box-sizing: border-box;
		height:60px;
		z-index:2;
	}
	.footer .left_show view{
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: center;
		box-sizing: border-box;
		width:25%;
		height:60px;
		align-items: center;
		color:white;
		background:rgba(0,0,0,.65);
		font-size:16px;
		
	}
	.footer .map{
		width:30%;
		box-sizing: border-box;
	}
	
</style>
