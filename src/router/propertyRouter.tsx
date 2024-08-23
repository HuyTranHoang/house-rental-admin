
import PropertyList from '@/features/property/PropertyList';
import PropertyDetail from '@/features/property/PropertyDetail'; 
import { RouteObject } from 'react-router-dom';
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs';

const propertyRounter: RouteObject[] & BreadcrumbsRoute[] = [
  {
    path: '/property/list',
    element: <PropertyList />,
    breadcrumb: 'Danh Sách Bài Đăng',
  },
  {
    path: '/property/:id',
    element: <PropertyDetail />, 
    breadcrumb: 'Chi Tiết Bài Đăng',
  },
];

export default propertyRounter;