<template>
	<div>
		<v-header :seller="seller"></v-header>
		<div class="tab border-1px">
			<div class="tab-item">
				<router-link to="/goods">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/ratings">评价</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/seller">卖家</router-link>
			</div>
		</div>
		<keep-alive><!-- 保持状态不变，不会每次都刷新或者重复请求接口等 -->
			<router-view :seller="seller"></router-view>
		</keep-alive>
	</div>
</template>

<script type="text/ecmascript-6">
	import {urlParse} from 'common/js/utils.js';
	import header from "./components/header/header.vue";

	const ERR_OK = 0;

	export default {
		data(){
			return {
				seller: {
					id:(()=>{
						let queryParam=urlParse();
						return queryParam.id;
					})()
				}
			};
		},
		created() {
			this.$http.get('/api/seller?id='+this.seller.id).then((response) => {
				response = response.body;
				if(response.errno === ERR_OK){
					//this.seller = response.data;
					this.seller=Object.assign({},this.seller,response.data);//给对象扩展属性的方法,避免覆盖
					//console.log(this.seller.id);

				}
			});
		},
		components: {
			'v-header': header
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "./common/stylus/mixin.styl"

	.tab
		display:flex
		width:100%
		height:40px
		line-height:40px
		border-bottom: 1px solid rgba(1,17,27,0.1)
		border-1px(rgba(1,17,27,0.1))
		.tab-item
			flex: 1
			text-align: center
			& > a
				display: block
				font-size:14px
				color:rgb(77,85,93)
				&.active
					color:rgb(220,20,20)

</style>
