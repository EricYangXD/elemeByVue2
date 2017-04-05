import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes =
[{
	path: '/',
	component: seller
},{
	path: '/goods',
	component: goods
},{
	path: '/ratings',
	component: ratings
},{
	path: '/seller',
	component: seller
}];


const router = new VueRouter({
	linkActiveClass: 'active',
	routes
});

/*  eslint-disable no-new  */
new Vue({
	el: '#app',
	router,
	render: h => h(App)
});

// var MyComponent = Vue.extend({
//   template: '<div id="test">Hello!</div>'
// });
// 创建并挂载到 #app (会替换 #app)
// new MyComponent().$mount('#app');

// new MyComponent({ el: '#apps' });