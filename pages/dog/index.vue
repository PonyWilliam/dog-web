<template>
	<view class="wrap">
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
			<view class="record" @click="transform_control()">
				
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
	export default{
		data(){
			return{
				now_time:'',
				temprature:'15.5',
				wist:'30',
				qiya:'1013',
				so2:'无',
				control:false,//代表是圆形
				
			}
		},
		onLoad() {
			let that = this
			let timer1 = setInterval(function(){
				that.now_time = that.$u.timeFormat(Date.parse(new Date()),"hh:MM:ss")
			},1000)
		},
		methods:{
			transform_control(){
				if(!this.control){
					document.getElementsByClassName("record")[0].classList.add("record_hover")
				}else{
					document.getElementsByClassName("record")[0].classList.remove("record_hover")
				}
				this.control = !this.control
			}
		}
	}
</script>

<style>
	.line{
		z-index:1;
	}
	.line1{
		position: absolute;
		height:2px;
		background:white;
		width:100vw;
		top:calc(100vh / 3);
	}
	.line2{
		position: absolute;
		height:2px;
		background:white;
		width:100vw;
		left:0;
		top:calc(100vh / 3 * 2);
	}
	.line3{
		position:absolute;
		top:0;
		left:calc(100vw / 3);
		height:100vh;
		width:2px;
		background:white;
	}
	.line4{
		position:absolute;
		top:0;
		left:calc(100vw / 3 * 2);
		height:100vh;
		width:2px;
		background:white;
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
		background-image: url("../../static/images/background.jpg");
		background-position: fixed;
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
		top:calc(50% - 25px);
		transition:all 1s;
	}
	.container .record_hover{
		width:25px!important;
		height:25px!important;
		top:calc(50% - 12.5px)!important;
		left:10px!important;
		border-radius: 0;
		
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
		width:20%;
		box-sizing: border-box;
	}
	
</style>
