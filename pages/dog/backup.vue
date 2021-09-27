<template>
	<view class="wrap">
		
		<uni-ec-canvas
		  class="uni-canvas"
		  id="canvas"
		  ref="canvas"
		  canvas-id="canvas"
		  :ec="ec"
		></uni-ec-canvas>
		
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
	import uniEcCanvas from '../uni-ec-canvas/uni-ec-vans.vue'
	
	const hours = [
	    '12a', '1a', '2a', '3a', '4a', '5a', '6a',
	    '7a', '8a', '9a', '10a', '11a',
	    '12p', '1p', '2p', '3p', '4p', '5p',
	    '6p', '7p', '8p', '9p', '10p', '11p'
	];
	// prettier-ignore
	const days = [
	    'Saturday', 'Friday', 'Thursday',
	    'Wednesday', 'Tuesday', 'Monday', 'Sunday'
	];
	// prettier-ignore
	const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]
	    .map(function (item) {
	    return [item[1], item[0], item[2] || '-'];
	});
	
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
				ec: {
				        lazyLoad:true,
				        option: {
				          title: {
				            text: ''
				          },
				          tooltip: {
				            trigger: 'axis',
				            formatter: '{b}\r\n{c0}人',
				            axisPointer: {
				              type: 'line',
				              axis: 'x',
				              label: {
				                backgroundColor: '#000000'
				              }
				            }
				          },
				          grid: {
				            left: '6%',
				            right: '6%',
				            top: '6%',
				            bottom: '6%',
				            containLabel: true
				          },
				          xAxis: {
				            type: 'category',
				            boundaryGap: false,
				            data: ['2-12', '2-14', '2-16', '2-18', '2-20', '2-22', '2-24'],
				            axisLine: {
				              // y轴
				              show: false
				            },
				            axisTick: {
				              // y轴刻度线
				              show: false
				            },
				            splitLine: {
				              // 网格线
				              show: false
				            }
				          },
				          yAxis: {
				            type: 'value',
				            axisLine: {
				              // y轴
				              show: false
				            },
				            axisTick: {
				              // y轴刻度线
				              show: false
				            },
				            splitLine: {
				              // 网格线
				              show: false
				            }
				          },
				          series: [
				            {
				              name: '浏览量',
				              type: 'line',
				              smooth: true,
				              lineStyle: {
				                color: '#EF5959'
				              },
				              data: [120, 132, 101, 134, 90, 230, 210]
				            }
				          ]
				        }
				      }
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
			
			
			// this.$refs['canvas'].init()
			//控制矩阵
			// this.getTemp()
			
		},
		onReady() {
			for(let x = 1;x<=32;x++){
			    this.col[x - 1] = x;
			}
			for(let x = 1;x<=24;x++){
			    this.row[x - 1] = x;
			}
			// this.getTemp()
			this.$refs['canvas'].init()
		},
		methods:{
			getTemp(){
				let that = this
				//获取红外点阵
				uni.request({
					url:"http://localhost:9999",
					method:"POST",
					success:res=>{
						console.log(res.data)
						    let min = null,max = null
							let temp = new Array()
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
						that.getTemp()//继续调用
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
		components:{
			uniEcCanvas
		}
	}
</script>

<style lang="scss">
	$camera:2px;
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
