<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<p class="title">综合评分</p>
					<p class="rank">高于周边商家{{seller.rankRate}}%</p>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star :size="36" :score="seller.serviceScore"></star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评价</span>
						<star :size="36" :score="seller.foodScore"></star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li class="rating-item" v-for="(rating,index) in ratings" v-show="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star :size="24" :score="rating.score"></star>
								<span class="delivery">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend&&rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span class="item" v-for="(item,index) in rating.recommend">{{item}}</span>
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import split from "../split/split.vue";
	import star from "../star/star.vue";
	import ratingselect from "../ratingselect/ratingselect.vue";
	import BScroll from "better-scroll";
	import {formatDate} from "../../common/js/date.js";

	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;
	const ERR_OK = 0;

	export default {
		props:{
			seller:{//父组件中传入的数据对象，要先在props中注册
				type:Object
			}
		},
		components:{
			split,
			star,
			ratingselect
		},
		data(){
			return {
				ratings:[],
				selectType:ALL,
				onlyContent:true
			}
		},
		methods:{
			toggleContent(){
				this.onlyContent=!this.onlyContent;
				this.$nextTick(()=>{
					this.scroll.refresh();
				});
			},
			selectRating(type){//把子组件值的改变传递给父组件
				this.selectType=type;
				this.$nextTick(()=>{//更新DOM，异步
					this.scroll.refresh();
				});
			},
			needShow(type,text){
				if(this.onlyContent&&!text){
					return false;
				}
				if(this.selectType===ALL){
					return true;
				}else{
					return type===this.selectType;//要查看的类型是否与评价的类型一致,若一致就返回true,显示
				}
			}
		},
		filters:{
			formatDate(time){
				let date=new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');//格式化日期
			}
		},
		created() {
			this.$http.get('/api/ratings').then((response) => {//通过路由获取ratings对象
				response = response.body;
				if (response.errno === ERR_OK) {
					this.ratings = response.data;
					this.$nextTick(() => {//获取对象后使页面可以滚动
						this.scroll = new BScroll(this.$refs.ratings, {
							click: true
						});
					});
				}
			});
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";

	.ratings
		position:absolute
		top:174px
		width:100%
		bottom:0
		left:0
		overflow:hidden
		.overview
			display:flex
			padding:18px 0
			.overview-left
				flex:0 0 137px
				padding:6px 0
				width:137px
				text-align:center
				border-right:1px solid rgba(7, 17, 27, 0.1)
				@media only screen and (max-width: 320px)
					flex:0 0 120px
					width:120px
				.score
					line-height: 28px
					font-size: 24px
					color:rgb(255,153,0)
					margin-bottom:6px
				.title
					line-height: 12px
					font-size: 12px
					color:rgb(7,17,27)
					margin-bottom:8px
				.rank
					line-height: 10px
					font-size: 10px
					color:rgb(147, 153, 159)
			.overview-right
				flex:1
				padding: 6px 0 6px 24px
				@media only screen and (max-width: 320px)
					padding-left:6px
				.score-wrapper
					margin-bottom:8px
					font-size: 0
					.title
						font-size:12px
						display: inline-block
						line-height: 18px
						vertical-align: top
						color: rgb(7,17,27)
					.star
						display: inline-block
						margin:0 0 0 12px
						vertical-align: top
					.score
						font-size:12px
						display: inline-block
						line-height: 18px
						vertical-align: top
						color: rgb(255,153,0)
				.delivery-wrapper
					font-size:0
					.title
						font-size:12px
						line-height: 18px
						color: rgb(7,17,27)
					.delivery
						font-size:12px
						margin:0 12px
						color: rgb(147,153,159)
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.avatar
					flex:0 0 28px
					width: 28px
					margin-right: 12px
					img
						border-radius: 50%
				.content
					position:relative
					flex:1
					.name
						margin-bottom:4px
						font-size:10px
						line-height:12px
						color:rgb(7,17,27)
					.star-wrapper
						margin-bottom:6px
						font-size:0
						.star
							display: inline-block
							margin-right:6px
							vertical-align: top
						.delivery
							display: inline-block
							line-height:12px
							vertical-align: top
							font-size:10px
							color:rgb(147,153,159)
					.text
						font-size:12px
						margin-bottom:8px
						line-height: 18px
						color:rgb(7,17,27)
					.recommend
						font-size:0
						line-height:16px
						.icon-thumb_up, .item
							display: inline-block
							margin:0 8px 4px 0
							font-size:9px
							text-align: justify
						.icon-thumb_up
							color:rgb(0,160,220)
						.item
							padding: 0 6px
							border:1px solid rgba(7,17,27,0.1)
							border-radius: 1px
							background-color:#fff
							color: rgb(147, 153, 159)
					.time
						position: absolute
						top:0
						right: 0
						font-size:10px
						font-weight: 200
						line-height:12px
</style>