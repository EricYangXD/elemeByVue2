<template>
	<div class="supports">
		<ul class="support-info" v-if="seller.supports">
			<li class="support-item" v-for="(item,index) in seller.supports">
				<span class="icon" :class="classMap[seller.supports[index].type]" key="index"></span>
				<span class="text" key="index">{{seller.supports[index].description}}</span>
			</li>
		</ul>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";

	.supports
		display: inline-block
		position: relative
		overflow: hidden
		padding:24px 12px 18px 40px
		font-size: 14px
		.support-info
			.icon
				display: inline-block
				vertical-align: top
				width: 12px
				height: 12px
				margin-right: 4px
				background-size: 12px 12px
				background-repeat: no-repeat
				&.decrease
					bg-image('decrease_1')
				&.discount
					bg-image('discount_1')
				&.guarantee
					bg-image('guarantee_1')
				&.invoice
					bg-image('invoice_1')
				&.special
					bg-image('special_1')
			.text
				line-height: 12px
				font-size: 10px

</style>