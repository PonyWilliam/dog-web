<template>
	<view>
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				摄像头：
			</view>
			<view class="uni-list-cell-db">
				<picker mode="selector" @change="onCameraIdxChange" :value="cameraIndex" :range="cameraArray" range-key="name">
					<view class="uni-input">{{cameraArray[cameraIndex].name}}</view>
				</picker>
			</view>
			<image class="arrow" src="https://healthtop.oss-cn-shanghai.aliyuncs.com/chumopin-app/youjiantou.png" />
		</view>
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				预览尺寸：
			</view>
			<view class="uni-list-cell-db">
				<picker mode="selector" @change="onPreviewSizeChange" :value="previewSizeIndex" :range="previewSizeArray" range-key="name">
					<view class="uni-input">{{previewSizeArray[previewSizeIndex].name}}</view>
				</picker>
			</view>
			<image class="arrow" src="https://healthtop.oss-cn-shanghai.aliyuncs.com/chumopin-app/youjiantou.png" />
		</view>
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				追加角度：
			</view>
			<view class="uni-list-cell-db">
				<picker mode="selector" @change="onDegreeChange" :value="degreeIndex" :range="degreeArray" range-key="name">
					<view class="uni-input">{{degreeArray[degreeIndex].name}}</view>
				</picker>
			</view>
			<image class="arrow" src="https://healthtop.oss-cn-shanghai.aliyuncs.com/chumopin-app/youjiantou.png" />
		</view>
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				检测方向：
			</view>
			<view class="uni-list-cell-db">
				<picker mode="selector" @change="onFtOrientChange" :value="ftOrientIndex" :range="ftOrientArray" range-key="name">
					<view class="uni-input">{{ftOrientArray[ftOrientIndex].name}}</view>
				</picker>
			</view>
			<image class="arrow" src="https://healthtop.oss-cn-shanghai.aliyuncs.com/chumopin-app/youjiantou.png" />
		</view>
		<view class="uni-list-cell">
			<view class="uni-list-cell-left">
				镜像设置：
			</view>
			<view class="uni-list-cell-db">
				<picker mode="selector" @change="onMirrorChange" :value="mirrorIndex" :range="mirrorArray" range-key="name">
					<view class="uni-input">{{mirrorArray[mirrorIndex].name}}</view>
				</picker>
			</view>
			<image class="arrow" src="https://healthtop.oss-cn-shanghai.aliyuncs.com/chumopin-app/youjiantou.png" />
		</view>
		
		<!-- <view class="uni-padding-wrap">
			<view class="uni-title">语音提示</view>
			<radio-group @change="onSoundChange">
				<view class="v-group">
					<label class="label-r"><radio value="false" checked="true" />关闭</label>
					<label class="label-r"><radio value="true" />开启</label>
				</view>
			</radio-group>
		</view> -->
		<button type="primary" @click="activeEngine">SDK激活</button>
		<button type="primary" @click="updateConfig">参数配置</button>
		<!-- <button type="primary" @click="getCameraSize">获取相机尺寸</button> -->
		<button type="primary" @click="faceCollect">人脸采集</button>
		<!-- <button type="primary" @click="testMethod">交互测试</button> -->
		<image :src="`data:image/jpeg;base64,${imageData}`" mode="widthFix" style="width: 400rpx;"></image>
	</view>

</template>

<script>
// 获取 module
const facecollectSdk = uni.requireNativePlugin('sqym-arc-face-plugin');
const modal = uni.requireNativePlugin('modal');
export default {

	data() {
		return {
			imageData:'',
			enableSound: true,
			
			cameraIndex:0,
			previewSizeIndex:0,
			degreeIndex:0,
			ftOrientIndex:0,
			mirrorIndex:0,
			
			cameraArray:[{name:'彩色',code:'0'},{name:'黑白',code:'1'}],
			previewSizeArray:[{name:'未获取到相机尺寸', code:'0*0'}],
			degreeArray:[{name:'0度', code:'0'},{name:'90度', code:'90'},{name:'180度',code:'180'},{name:'270度', code: '270'}],
			ftOrientArray:[{name:'逆时针0度',code:'ASF_OP_0_ONLY'},
							{name:'逆时针90度',code:'ASF_OP_90_ONLY'},
							{name:'逆时针180度',code:'ASF_OP_180_ONLY'},
							{name:'逆时针270度',code:'ASF_OP_270_ONLY'},
							{name:'全角度检测',code:'ASF_OP_ALL_OUT'}],
			mirrorArray:[{name:'关闭',code:'false'},{name:'开启',code:'true'}]
		}
	},
	onLoad() {
		//监听数据更新进度信息
		var globalEvent = uni.requireNativePlugin('globalEvent');
		globalEvent.addEventListener('faceApiEvent', function(result) {
			modal.toast({
				message: result.status,
				duration: 3
			});
		});
		
	},
	onShow() {

		this.enableSound = uni.getStorageSync("arc_face_enableSound");
		if("" === this.enableSound){
			this.enableSound = true;
		}
		
		this.cameraIndex = uni.getStorageSync('arc_face_cameraIndex');
		if("" === this.cameraIndex){
			this.cameraIndex = 0;
		}
		this.degreeIndex = uni.getStorageSync("arc_face_degreeIndex");
		if("" === this.degreeIndex){
			this.degreeIndex = 0;
		}
		this.mirrorIndex = uni.getStorageSync("arc_face_mirrorIndex");
		if("" === this.mirrorIndex){
			this.mirrorIndex = 0;
		}
		this.ftOrientIndex = uni.getStorageSync("arc_face_ftOrientIndex");
		if("" === this.ftOrientIndex){
			this.ftOrientIndex = 0
		}
		this.previewSizeIndex = uni.getStorageSync("arc_face_previewSizeIndex");
		if("" === this.previewSizeIndex){
			this.previewSizeIndex = 0;
		}
		
		this.initSdkConf();
		this.getCameraSize();
	},
	methods: {
		initSdkConf(){
			facecollectSdk.initSdkConf({});
		},
		engineActiveStatus(){
			var ret = facecollectSdk.engineActiveStatus({});
			uni.showToast({
				icon:'none',
				title:ret
			});
		},
		activeEngine(){
			facecollectSdk.activeEngine({},
			(ret) => {
				modal.toast({
					message: ret,
					duration: 3
				});
			});
		},
		updateConfig(){
			uni.setStorageSync("arc_face_enableSound", this.enableSound);
			uni.setStorageSync('arc_face_cameraIndex', this.cameraIndex);
			uni.setStorageSync("arc_face_degreeIndex", this.degreeIndex);
			uni.setStorageSync("arc_face_mirrorIndex", this.mirrorIndex);
			uni.setStorageSync("arc_face_ftOrientIndex", this.ftOrientIndex);
			uni.setStorageSync("arc_face_previewSizeIndex", this.previewSizeIndex);
			
			var ret = facecollectSdk.updateConfig({
				  enableSound: this.enableSound,//声音提示开关
				  cameraIdx: this.cameraArray[this.cameraIndex].code,// 1前置摄像头  0后置摄像头
				  additionalRotation: this.degreeArray[this.degreeIndex].code, //追加旋转角度
				  mirror: this.mirrorArray[this.mirrorIndex].code ,//预览镜像
				  ftOrient: this.ftOrientArray[this.ftOrientIndex].code,//人脸检测角度
				  previewSize: this.previewSizeArray[this.previewSizeIndex].code//预览尺寸
				});
			uni.showToast({
				icon:'none',
				title:ret.msg
			});
		},
		updateConfigExt(){
			var ret = facecollectSdk.updateConfigExt({
			  /***
			   * 跳过相机帧数据，fps降速
			   * 如果每一帧都进行检测，cpu较差的设备可能会很卡，建议适当降速
			   */
			  fpsStep : 3,
			  /**
			   * 有效人脸检测次数
			   * 防止人体移动过快，导致图片模糊
			   * 推荐值 5 - 10
			   */
			  detectFaceTimesWhenCrop : 5,
			  /****
			   * 相机预览宽度与屏幕宽度的比例
			   *  预览视图是正方形
			   *
			   *  最大值不能超过1
			   */
			  cameraPreviewWithScale : 0.9,
			  /***
			   * 人脸角度阈值
			   *  左右偏角和上下仰角
			   *
			   *  推荐 15到25之间
			   *
			   */
			  faceAngle : 25,
			  /**
			   *  宽度占比
			   *  人脸检测区域与整个预览区域占比
			   *  最大值不能超过1
			   */
			  detectAreaWidthInScreen : 1.0,
			  /**
			   *  高度占比
			   *  人脸检测区域与整个预览区域占比
			   *  最大值不能超过1
			   */
			  detectAreaHeightInScreen : 1.0,
			  /***
			   *  最小人脸宽度
			   *
			   *  不能小于0
			   */
			  miniFaceWidthScale : 0.15,
			  /***
			   *  最大人脸宽度
			   *
			   *  不能大于1
			   */
			  maxFaceWidthScale : 0.8,
			  /**
			   *  人脸框厚度
			   *
			   *  推荐 4 - 6
			   */
			  faceRectThickness : 6,
			  /***
			   *  预览区域向上移动比例
			   *
			   *  预览画面默认上下居中，可适当调整向下位置
			   */
			  moveCameraPreviewUpInScreen : 0.08,
			  /***
			   *  相机预览画面圆角
			   *  画面优化，视频区域圆角处理
			   *
			   */
			  previewRadius : 30

			});
			uni.showToast({
				icon:'none',
				title:ret.msg
			});
		},
		faceCollect(){
			facecollectSdk.faceCollect({},(ret) => {
				console.log(ret)
				if(ret.status){
					this.imageData = ret.base64Image;
				}
				modal.toast({
					message: ret.message,
					duration: 3
				});
			})
		},
		getCameraSize(){
			facecollectSdk.loadCameraPreviewSize({cameraIdx: this.cameraArray[this.cameraIndex].code},
				(result) => {
					console.log(result)
					if(result.sizeList){
						this.previewSizeArray = JSON.parse(result.sizeList);
					}else{
						this.previewSizeArray = [{name:'未选择尺寸', code:'0*0'}];
						this.previewSizeIndex = 0;
						uni.showToast({
							icon:'none',
							title:result.message
						});
					}
				});
			
		},
		testMethod(){
			facecollectSdk.testMethod({
					'mac': '1111111',
					'template': 'bbbbbbbbb'
				},
				(ret) => {
					modal.toast({
						message: ret,
						duration: 3
					});
				})
		},
		onCameraIdxChange: function(evt){
			this.cameraIndex =evt.detail.value;
			this.getCameraSize();
		},
		onDegreeChange: function(evt){
			this.degreeIndex = evt.detail.value;
		},
		onSoundChange: function(evt){
			this.enableSound = evt.detail.value;
		},
		onMirrorChange: function(evt){
			this.mirrorIndex = evt.detail.value;
		},
		onFtOrientChange: function(evt){
			this.ftOrientIndex = evt.detail.value;
		},
		onPreviewSizeChange: function(evt){
			this.previewSizeIndex = evt.detail.value;
		}
	}
};
</script>
<style>

.uni-list-cell {
	margin: 0rpx;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	height: 100rpx;
	/* background-color: #09BB07; */
	border-bottom-color: #CCCCCC;
	border-bottom-width: 1rpx;
}
.uni-list-cell-left {
	margin: 0rpx;
	padding: 0rpx;
}
.uni-list-cell-db {
	margin: 0rpx;
	padding-left: 20rpx;
	flex: 1;
	justify-content: flex-end;
}
.arrow {

	margin-top: 4rpx;
	width: 16rpx;
	height: 28rpx;
	margin-left: 0rpx;
	margin-right: 30rpx;
}
.uni-input{
	justify-content: flex-end;
}
</style>

