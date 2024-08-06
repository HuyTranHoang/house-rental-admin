import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { setBreadcrumb } from '../ui/uiSlice.ts'


export const useSetBreadcrumb = (items: BreadcrumbItemType[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumb(items));
  }, [items, dispatch]);
};