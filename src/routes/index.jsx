import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Dashboard Routes
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'));
const Categories = lazy(() => import('@/app/(admin)/categories/page'));
const SubCategories = lazy(() => import('@/app/(admin)/subcategories/page'));
const SizeCharts = lazy(() => import('@/app/(admin)/sizechart/page'));

// Products
const ProductsLists= lazy(() => import('@/app/(admin)/products/list'));
const ProductsAdd= lazy(() => import('@/app/(admin)/products/add'));

// const Finance = lazy(() => import('@/app/(admin)/dashboard/finance/page'))
// const Sales = lazy(() => import('@/app/(admin)/dashboard/sales/page'))

// const Maintenance = lazy(() => import('@/app/(other)/maintenance/page'));
// const ComingSoon = lazy(() => import('@/app/(other)/coming-soon/page'));

// Auth Routes
const AuthSignIn2 = lazy(() => import('@/app/(other)/auth/sign-in-2/page'));
// const AuthSignUp2 = lazy(() => import('@/app/(other)/auth/sign-up-2/page'));

// Apps Routes
// const EcommerceProducts = lazy(() => import('@/app/(admin)/ecommerce/products/page'))
// const EcommerceProductDetails = lazy(() => import('@/app/(admin)/ecommerce/products/[productId]/page'))
// const EcommerceProductCreate = lazy(() => import('@/app/(admin)/ecommerce/products/create/page'))
// const EcommerceCustomers = lazy(() => import('@/app/(admin)/ecommerce/customers/page'))
// const EcommerceSellers = lazy(() => import('@/app/(admin)/ecommerce/sellers/page'))
// const EcommerceOrders = lazy(() => import('@/app/(admin)/ecommerce/orders/page'))
// const EcommerceOrderDetails = lazy(() => import('@/app/(admin)/ecommerce/orders/[orderId]/page'))
// const EcommerceInventory = lazy(() => import('@/app/(admin)/ecommerce/inventory/page'))

export const authRoutes = [{
  name: 'Sign In',
  path: '/auth/sign-in',
  element: <AuthSignIn2 />
}];

const initialRoutes = [{
  path: '/',
  name: 'root',
  element: <Navigate to="/dashboard" />
}];
const generalRoutes = [{
  path: '/dashboard',
  name: 'Analytics',
  element: <Analytics />
},
{
  path: '/categories',
  name: 'Categories',
  element: <Categories />
},
{
  path: '/categories/:categoryId/:id',
  name: 'Sub Categories',
  element: <SubCategories />
},
{
  path: '/sizeCharts',
  name: 'SizeCharts',
  element: <SizeCharts />
},
{
  path: '/products-list',
  name: 'Products',
  element: <ProductsLists />
},
{
  path: '/products-add',
  name: 'Products',
  element: <ProductsAdd />
},
];


// const appsRoutes = [];
// const customRoutes = [];
// const baseUIRoutes = [];
// const tableRoutes = [];
// const iconRoutes = [];
// const advancedUIRoutes = [];
// export const appRoutes = [...initialRoutes, ...generalRoutes, ...appsRoutes, ...customRoutes, ...baseUIRoutes, ...advancedUIRoutes, ...tableRoutes, ...iconRoutes, ...authRoutes];
export const appRoutes = [...initialRoutes, ...generalRoutes,  ...authRoutes];