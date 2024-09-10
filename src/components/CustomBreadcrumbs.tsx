import { HomeOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { routerList } from '../router/router.tsx'

const CustomBreadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routerList)
  const { t } = useTranslation('breadcrumbs')

  const breadcrumbItems = breadcrumbs.map(({ match, breadcrumb }) => {
    let breadcrumbText

    if (breadcrumb) {
      if (typeof breadcrumb === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        breadcrumbText = t(breadcrumb)
      } else if (React.isValidElement(breadcrumb) && breadcrumb.key === '/') {
        breadcrumbText = (
          <>
            <HomeOutlined /> {t('dashboard')}
          </>
        )
      } else if (React.isValidElement(breadcrumb)) {
        const element = breadcrumb as React.ReactElement<{ children: string }>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        breadcrumbText = t(element.props.children)
      }
    }

    return {
      title: <NavLink to={match.pathname}>{breadcrumbText as ReactNode}</NavLink>,
      key: match.pathname
    }
  })

  return <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
}

export default CustomBreadcrumbs
