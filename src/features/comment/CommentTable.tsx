import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useDeleteComment } from '@/hooks/useComments.ts'
import { CommentDataSource } from '@/types/comment.type.ts'
import { blue } from '@ant-design/colors'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Descriptions, DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useBoundStore from '@/store.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'

interface ReviewTableProps {
  dataSource: CommentDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<CommentDataSource>['onChange']
  rowSelection: TableRowSelection<CommentDataSource> | undefined
  sortedInfo: SorterResult<CommentDataSource>
}

function CommentTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo
}: ReviewTableProps) {
  const currentUser = useBoundStore((state) => state.user)

  const { t } = useTranslation(['common', 'comment'])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentComment, setCurrentComment] = useState<CommentDataSource | null>(null)

  const handleView = (record: CommentDataSource) => {
    setCurrentComment(record)
    setIsModalOpen(true)
  }

  const { deleteCommentMutate } = useDeleteComment()

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Id',
      children: <span>{currentComment?.id}</span>,
      span: 3
    },
    {
      key: '2',
      label: t('comment:table.userName'),
      children: <span>{currentComment?.userName}</span>,
      span: 3
    },
    {
      key: '3',
      label: t('comment:table.comment'),
      children: <span>{currentComment?.comment}</span>,
      span: 3
    },
    {
      key: '4',
      label: t('common.table.createdAt'),
      children: <span>{currentComment?.createdAt}</span>,
      span: 3
    }
  ]

  const columns: TableProps<CommentDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('comment:table.userName'),
      width: 200,
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: t('comment:table.propertyTitle'),
      dataIndex: 'propertyTitle',
      key: 'propertyTitle'
    },
    {
      title: t('comment:table.comment'),
      dataIndex: 'comment',
      key: 'comment',
      width: 400
    },
    {
      title: t('common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 150
    },
    {
      title: t('common.table.action'),
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record: CommentDataSource) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Button
            icon={<EyeOutlined />}
            type='default'
            style={{ borderColor: blue.primary, color: blue.primary, marginRight: '1rem' }}
            onClick={() => handleView(record)}
          >
            {t('common.detail')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type='default'
            onClick={() => {
              setCurrentComment(record)
              setIsDeleteModalOpen(true)
            }}
            disabled={!hasAuthority(currentUser, 'comment:delete')}
            danger
          >
            {t('common.delete')}
          </Button>
        </div>
      )
    }
  ]

  const detailItems: DescriptionsProps['items'] = [
    {
      key: 'userName',
      label: t('comment:table.userName'),
      children: <span>{currentComment?.userName}</span>,
      span: 2
    },
    {
      key: 'createdAt',
      label: t('common.table.createdAt'),
      children: <span>{currentComment?.createdAt}</span>,
      span: 1
    },
    {
      key: 'propertyTitle',
      label: t('comment:table.propertyTitle'),
      children: <span>{currentComment?.propertyTitle}</span>,
      span: 3
    },
    {
      key: 'comment',
      label: t('comment:table.comment'),
      children: <span>{currentComment?.comment}</span>
    }
  ]

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        pagination={{
          position: ['bottomCenter'],
          pageSizeOptions: ['5', '10', '20'],
          locale: { items_per_page: `/ ${t('common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterConfirm: t('common.table.filterConfirm'),
          filterReset: t('common.table.filterReset')
        }}
      />

      <Modal
        title={t('comment:detailModal.title')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={
          <>
            <Button onClick={() => setIsModalOpen(false)}>{t('common.back')}</Button>
            <Button
              type='primary'
              danger
              onClick={() => {
                setIsDeleteModalOpen(true)
                setIsModalOpen(false)
              }}
              disabled={!hasAuthority(currentUser, 'comment:delete')}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <Descriptions bordered items={detailItems} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title={t('comment:deleteModal.title')} />}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={() => {
          deleteCommentMutate(currentComment!.id)
          setIsDeleteModalOpen(false)
        }}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default CommentTable
