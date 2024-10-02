import { TransactionDataSource, TransactionStatus, TransactionTypes } from '@/types/transaction.type'
import { formatCurrency } from '@/utils/formatCurrentcy'
import { Badge, Table, TablePaginationConfig, TableProps, Tag } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { useTranslation } from 'react-i18next'

interface TransactionTableProps {
  dataSource: TransactionDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<TransactionDataSource>['onChange']
  sortedInfo: SorterResult<TransactionDataSource>
}

function TransactionTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  sortedInfo
}: TransactionTableProps) {
  const { t } = useTranslation(['common', 'transaction'])

  const columns: TableProps<TransactionDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('transaction:table.transactionId'),
      width: 400,
      dataIndex: 'transactionId',
      key: 'transactionId'
    },
    {
      title: t('transaction:table.userName'),
      width: 400,
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: t('transaction:table.amount'),
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      sortOrder: sortedInfo.field === 'amount' ? sortedInfo.order : null,
      width: 200,
      render: (value) => formatCurrency(value)
    },
    {
      title: t('transaction:table.type'),
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 150,
      sorter: true,
      sortOrder: sortedInfo.field === 'transactionType' ? sortedInfo.order : null,
      render: (value) => {
        if (value === TransactionTypes.DEPOSIT) {
          return <Tag color='green'>{t('transaction:type.DEPOSIT')}</Tag>
        } else {
          return <Tag color='red'>{t('transaction:type.WITHDRAWAL')}</Tag>
        }
      }
    },
    {
      title: t('transaction:table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      sorter: true,
      sortOrder: sortedInfo.field === 'status' ? sortedInfo.order : null,
      render: (value) => {
        switch (value) {
          case TransactionStatus.SUCCESS:
            return <Badge status='success' text={t('transaction:status.SUCCESS')} />
          case TransactionStatus.FAILED:
            return <Badge status='error' text={t('transaction:status.FAILED')} />
          default:
            return <Badge status='warning' text={t('transaction:status.PENDING')} />
        }
      }
    },
    {
      title: t('transaction:table.transactionDate'),
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      sorter: true,
      sortOrder: sortedInfo.field === 'transactionDate' ? sortedInfo.order : null,
      fixed: 'right',
      width: 155
    }
  ]

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
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
    </>
  )
}

export default TransactionTable
