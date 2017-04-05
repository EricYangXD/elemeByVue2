<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score"></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorite">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">
					<p class="content" >{{seller.bulletin}}</p>
				</div>
				<ul class="supports" v-if="seller.supports">
					<li class="support-item border-1px" v-for="(item,index) in seller.supports">
						<span class="icon" :class="classMap[seller.supports[index].type]" key="index"></span>
						<span class="text" key="index">{{seller.supports[index].description}}</span>
					</li>
				</ul>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="(pic,index) in seller.pics">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<split></split>
			<div class="info">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li class="info-item" v-for="(info,index) in seller.infos">{{info}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import star from "../star/star.vue";
	import split from "../split/split.vue";
	import BScroll from "better-scroll";
	import {saveToLocal,loadFromLocal} from "../../common/js/store.js";

	export default {
		props:{
			seller:{
				type:Object
			}
		},
		components:{
			star,
			split
		},
		created(){//定义图片的数组
			this.classMap=['decrease','discount','special','invoice','guarantee'];
		},
		computed: {
			favoriteText() {//根据是否收藏的标识显示
				return this.favorite ? '已收藏' : '收藏';
			}
		},
		data() {
			return {
				favorite: (() => {//从本地缓存取出是否收藏的标识
					return loadFromLocal(this.seller.id, 'favorite', false);
				})()
			};
		},
		watch: {//一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。
			'seller'() {//观察seller对象，刷新页面	统一观察
				this.$nextTick(() => {
					this._initScroll();
					this._initPics();
				});
			}
		},
		mounted() {//el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。该钩子在服务器端渲染期间不被调用。
			this.$nextTick(() => {
				this._initScroll();
				this._initPics();
			});
		},
		methods:{
			toggleFavorite(event) {
				if (!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id, 'favorite', this.favorite);
			},
			// toast(){
			// 	if (!event._constructed) {
			// 		return;
			// 	}
			// 	alert("toast:1111111111");
			// 	this.$emit('test');
			// },
			_initScroll(){
				if(!this.scroll){
					this.scroll=new BScroll(this.$refs.seller,{
						click:true
					});
				}else{//如果已经初始化，则刷新
					this.scroll.refresh();
				}
			},
			_initPics(){//图片横向滚动compromise妥协
				if (this.seller.pics) {
					let picWidth = 120;
					let margin = 6;
					let width = (picWidth + margin) * this.seller.pics.length - margin;
					this.$refs.picList.style.width = width + 'px';//设置ul的宽度，当ul的宽度大于外层div宽度时，BS才能滚动
					this.$nextTick(() => {
						if (!this.picScroll) {//定义一个picScroll对象
							this.picScroll = new BScroll(this.$refs.picWrapper, {
								scrollX: true,//横向滚动，默认纵向
								eventPassthrough: 'vertical'	//忽略垂直方向的滚动
							});
						} else {
							this.picScroll.refresh();
						}
					});
				}
			}
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";

	.seller
		position:absolute
		top:174px
		width:100%
		bottom:0
		left:0
		overflow:hidden
		.overview
			position:relative
			padding:18px
			.title
				margin-bottom:8px
				font-size:14px
				line-height:14px
				color:rgb(7,17,27)
			.desc
				font-size:0
				padding-bottom:18px
				border-1px(rgba(7,17,27,0.1))
				.star
					display:inline-block
					vertical-align:top
					margin-right:8px
				.text
					display:inline-block
					vertical-align:top
					margin-right:12px
					line-height:18px
					font-size:10px
					color:rgb(77,85,93)
			.remark
				display:flex
				padding-top:18px
				.block
					flex:1
					text-align:center
					border-right: 1px solid rgba(7, 17, 27, 0.1)
					&:last-child
						border:none
					h2
						font-size:10px
						line-height:10px
						margin-bottom:4px
						color: rgb(147, 153, 159)
					.content
						font-size:10px
						line-height:24px
						color: rgb(7, 17, 27)
						.stress
							font-size:24px
			.favorite
				position:absolute
				top:18px
				width:50px/*设置宽度，防止图标位置移动*/
				right:18px
				text-align:center
				.icon-favorite
					display:block
					margin-bottom:4px
					line-height:24px
					color:#d4d6d9
					font-size:24px
					&.active
						color:rgb(240,20,20)
				.text
					font-size:10px
					color:rgb(77,85,93)
					line-height:10px
		.bulletin
			padding:18px 18px 0 18px
			.title
				margin-bottom:8px
				font-size:14px
				line-height:14px
				color:rgb(7,17,27)
			.content-wrapper
				padding:0 12px 16px 12px
				border-1px(rgba(7, 17, 27, 0.1))
				.content
					font-size:12px
					font-weight:200
					line-height:24px
					color:rgb(240,20,20)
			.supports
				.support-item
					padding: 16px 12px
					border-1px(rgba(7, 17, 27, 0.1))
					font-size: 0
					&:last-child
						border-none()
				.icon
					width: 16px
					height: 16px
					display: inline-block
					vertical-align: top
					margin-right: 6px
					background-size: 16px 16px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_4')
					&.discount
						bg-image('discount_4')
					&.guarantee
						bg-image('guarantee_4')
					&.invoice
						bg-image('invoice_4')
					&.special
						bg-image('special_4')
				.text
					line-height: 16px
					font-size: 12px
					color: rgb(7, 17, 27)
		.pics
			padding:18px
			.title
				margin-bottom:8px
				font-size:14px
				line-height:14px
				color:rgb(7,17,27)
			.pic-wrapper
				width:100%
				overflow: hidden
				white-space: nowrap/*不换行*/
				.pic-list
					font-size:0
					.pic-item
						display: inline-block
						margin-right: 6px
						width: 120px
						height: 90px
						&:last-child
							margin: 0
		.info
			padding:18px 18px 0 18px
			color: rgb(7, 17, 27)
			.title
				padding-bottom:12px
				font-size:14px
				line-height:14px
				border-1px(rgba(7, 17, 27, 0.1))
			.info-item
				padding:16px 12px
				font-size:12px
				line-height:16px
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
</style>