import { Modal, DescriptionsProps } from 'antd';
import ConfirmModalTitle from '../components/ConfirmModalTitle';
import ConfirmModalContent from '../components/ConfirmModalContent';

const { confirm } = Modal;

export const showMultipleDeleteConfirm = (
  deleteIdList: number[],
  title: string,
  onOk: () => void
) => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Số lượng đã chọn',
      children: <span>{deleteIdList.length}</span>
    }
  ];

  confirm({
    icon: null,
    title: <ConfirmModalTitle title={title} />,
    content: <ConfirmModalContent items={items} />,
    okText: 'Xác nhận',
    okType: 'danger',
    cancelText: 'Hủy',
    maskClosable: true,
    onOk
  });
};