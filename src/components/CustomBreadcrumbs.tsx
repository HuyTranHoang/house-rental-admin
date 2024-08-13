import { Breadcrumb } from 'antd';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { NavLink } from 'react-router-dom';
import { routerList } from '../router/router.tsx';

const CustomBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routerList);

  const breadcrumbItems = breadcrumbs.map(({ match, breadcrumb }) => ({
    title: <NavLink to={match.pathname}>{breadcrumb}</NavLink>,
    key: match.pathname,
  }));

  return (
    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
  );
};

export default CustomBreadcrumbs;