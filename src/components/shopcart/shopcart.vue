<template>
	<div>
		<div class="shopcart">
			<div class="content" >
				<div class="content-left" @click="toggleList">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
					<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right">
					<div class="pay" :class="payClass" @click.stop.prevent="pay">
						{{payDesc}}<!--@click.stop.prevent:阻止事件冒泡-->
					</div>
				</div>
			</div>
			<div class="ball-container">
				<div v-for="ball in balls">
					<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
						<div class="ball" v-show="ball.show">
							<div class="inner inner-hook"></div>
						</div>
					</transition>
				</div>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.count*food.price}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade"><!--模糊背景  hideList()目的是点击背景时收起购物车-->
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import cartcontrol from "../cartcontrol/cartcontrol.vue";
	export default {
		props: {
			selectFoods:{//存放选中的food
				type:Array,
				default(){
					return [];
				}
			},
			deliveryPrice:{
				type:Number,
				default:0
			},
			minPrice:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				balls:[
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls:[],
				fold:true
			};
		},
		computed:{
			totalPrice(){
				let total=0;
				this.selectFoods.forEach((food)=>{
					total+=food.price*food.count;
				});
				return total;
			},
			totalCount() {
				let count=0;
				this.selectFoods.forEach((food) => {//从goods作为参数组件中传入selectFoods
					count += food.count;
				});
				return count;
			},
			payDesc(){
				if(this.totalPrice===0){
					return `￥${this.minPrice}元起送`;
				}else if(this.totalPrice<this.minPrice){
					let diff=this.minPrice-this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return '去结算';
				}
			},
			payClass(){
				if(this.totalPrice>=this.minPrice){
					return 'enough';
				}else{
					return 'not-enough';
				}
			},
			listShow(){
				if(!this.totalCount){
					this.fold=true;
					return false;
				}
				let show=!this.fold;
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll){
							this.scroll=new BScroll(this.$refs.listContent,{click:true});
						}else{
							this.scroll.refresh();
						}
					})
				}
				return show;
			}
		},
		methods:{
			toggleList(){
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			empty(){
				this.selectFoods.forEach((food)=>{
					food.count=0;
				});
			},
			hideList(){
				this.fold = true;
			},
			pay(){
				if(this.totalPrice<this.minPrice){
					return;
				}
				alert(`支付${this.totalPrice}元`);
			},
			drop(el){
				//console.log(el);
				for(let i=0;i<this.balls.length;i++){
					let ball=this.balls[i];
					if(!ball.show){
						ball.show=true;
						ball.el=el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeDrop(el){
				let count=this.balls.length;
				while(count--){
					let ball=this.balls[count];
					if(ball.show){
						let rect=ball.el.getBoundingClientRect();//获取小球的相对于视口的位置
						let x=rect.left-32;//32px是CSS样式中小球的偏移量
						let y=-(window.innerHeight-rect.top-22);
						el.style.display='';//显示小球
						el.style.webkitTransform=`translate3d(0,${y}px,0)`;//横纵轴平移
						el.style.transform=`translate3d(0,${y}px,0)`;
						let inner=el.getElementsByClassName("inner-hook")[0];
						//console.log(inner);
						inner.style.webkitTransform=`translate3d(${x}px,0,0)`;
						inner.style.transform=`translate3d(${x}px,0,0)`;
					}
				}
			},
			dropping(el,done){
				let rf=el.offsetHeight;
				this.$nextTick(()=>{
					el.style.webkitTransform='translate3d(0,0,0)';//横纵轴平移
					el.style.transform='translate3d(0,0,0)';
					let inner=el.getElementsByClassName("inner-hook")[0];
					inner.style.webkitTransform='translate3d(0,0,0)';
					inner.style.transform='translate3d(0,0,0)';
					el.addEventListener('transitionend', done);
				});
			},
			afterDrop(el){//将小球状态重置，使之可以被重新利用
				let ball=this.dropBalls.shift();
				if(ball){
					ball.show=false;
					el.style.display='none';
				}
			}

		},
		components: {
			cartcontrol
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";

	.shopcart
		position:fixed
		bottom:0
		height:48px
		z-index:50
		left:0
		width:100%
		.content
			display:flex
			background:#141d27
			.content-left
				flex:1
				.logo-wrapper,.price,.desc
					display:inline-block
				.logo-wrapper
					margin:0 12px
					padding:6px
					width:56px
					height:56px
					box-sizing:border-box
					vertical-align:top
					border-radius:50%
					position:relative
					top:-10px
					background:#141d27
					.num
						position:absolute
						width:24px
						height:16px
						top:0
						right:0
						background:rgb(240,20,20)
						color:#fff
						line-height:16px
						text-align:center
						border-radius:16px
						font-size:9px
						font-weight:700
						box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
					.logo
						width:100%
						height:100%
						border-radius:50%
						text-align:center
						background:#2b343c
						&.highlight
							background:rgb(0,160,220)
						.icon-shopping_cart
							font-size:24px
							line-height:44px
							color:#80858a
							&.highlight
								color:#fff
				.price
					line-height:24px
					color:rgba(255,255,255,0.4)
					font-size:16px
					vertical-align:top
					box-sizing:border-box
					font-weight:700
					margin-top:12px
					padding-right:12px
					border-right:1px solid rgba(255,255,255,0.1)
					&.highlight
						color:#fff
				.desc
					font-size:10px
					color:rgba(255,255,255,0.4)
					vertical-align:top
					line-height:24px
					font-weight:700
					margin:12px 0 0 12px
			.content-right
				flex:0 0 105px
				width:105px
				.pay
					font-size:14px
					line-height:48px
					height:48px
					text-align:center
					font-weight:700
					color:rgba(255,255,255,0.4)
					&.not-enough
						background:#2b333b
					&.enough
						background:#00b43c
						color:#fff
		.ball-container
			.ball
				position:fixed
				left:32px
				bottom:22px
				z-index:200
				transition:all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
				.inner
					width:16px
					height:16px
					border-radius:50%
					background:rgb(0,160,220)
					transition:all 0.4s linear
		.shopcart-list
			position:absolute
			top:0
			left:0
			z-index:-1
			width:100%

			transform: translate3d(0, -100%, 0)
			&.fold-enter-active,&.fold-leave-active
				transition:all 0.3s
			&.fold-enter,&.fold-leave-active
				translate3d(0,0,0)

			.list-header
				height:40px
				line-height:40px
				padding:0 18px
				background:#f3f5f7
				border-bottom:1px solid rgba(7,17,27,0.1)
				.title
					font-size:14px
					float:left
					font-weight:200
					color:rgb(7,17,27)
				.empty
					font-size:12px
					float:right
					color:rgb(0,160,220)
			.list-content
				padding:18px
				max-height:217px
				overflow:hidden
				background:#fff
				.food
					position:relative
					padding:12px 0
					box-sizing:border-box
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height:24px
						font-size:14px
						color:rgb(7,17,27)
					.price
						position:absolute
						right:90px
						bottom:12px
						line-height:24px
						font-size:14px
						font-weight:700
						color:#f01414
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:6px
	.list-mask
		position:fixed
		top:0
		left:0
		height:100%
		width:100%
		z-index:40
		backdrop-filter:blur(10px)
		opacity:1
		background:rgba(7,17,27,0.6)
		&.fade-enter-active,&.fade-leave-active
			transition:all 0.5s
		&.fade-enter,&.fade-leave-active
			opacity:0
			background:rgba(7,17,27,0)

	</style>