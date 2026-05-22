import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SupermarketsView from '../views/SupermarketsView.vue'
import CatalogView from '../views/CatalogView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import RecipesView from '../views/RecipesView.vue'
import RecipeDetailView from '../views/RecipeDetailView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import OrdersView from '../views/OrdersView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/supermarkets',
      name: 'supermarkets',
      component: SupermarketsView,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogView,
    },
    {
      path: '/catalog/:id',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
    },
    {
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: RecipeDetailView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
    },
    {
      path: '/cart/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: OrderDetailView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactView,
    },
  ],
})

export default router
