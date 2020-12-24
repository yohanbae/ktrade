import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/trade/Trade.vue'),
    meta: {
      title: 'K-Trader',
      // metaTags: [
      //   {
      //     name: 'description',
      //     content: 'The home page of our example app.'
      //   },
      //   {
      //     property: 'og:description',
      //     content: 'The home page of our example app.'
      //   }
      // ]
    }  
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '/register', name: 'Register', component: () => import('../views/auth/Register.vue'), meta: { title: 'K-Trade' } },
  { path: '/account', name: 'Account', component: () => import('../views/auth/Account.vue'), meta: { title: 'K-Trade' } },
  { path: '/trade', name: 'Trade', component: () => import('../views/trade/Trade.vue'), meta: { title: 'K-Trade' }},
  { path: '/post', name: 'TradePost', component: () => import('../views/trade/TradePost.vue'), meta: { title: 'K-Trade' } },
  { path: '/trade/:id', name: 'TradeView', component: () => import('../views/trade/TradeView.vue'), meta: { title: 'K-Trade' } },
  { path: '/mytrade', name: 'MyTrade', component: () => import('../views/trade/MyTrade.vue'), meta: { title: 'K-Trade' } }, // Trade Item List I Posted
  { path: '/transaction/:id', name: 'TransactionView', component: () => import('../views/transaction/TransactionView.vue'), meta: { title: 'K-Trade' } }, // Transaction List 
  { path: '/transactionlist', name: 'TransactionList', component: () => import('../views/transaction/TransactionList.vue'), meta: { title: 'K-Trade' } }, // Transaction: message happen here
  { path: '/feedback', name: 'Feedback', component: () => import('../views/Feedback.vue'), meta: { title: 'K-Trade' } } // Transaction: message happen here
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  // https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  // const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  if(!nearestWithMeta) return next();
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    tag.setAttribute('data-vue-router-controlled', '');
    return tag;
  })
  .forEach(tag => document.head.appendChild(tag));
  next();
});

export default router
