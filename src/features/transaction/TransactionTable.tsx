import { TransactionDataSource, TransactionStatus, TransactionTypes } from '@/models/transaction.type'
import { formatCurrency } from '@/utils/formatCurrentcy'
import { Table, TablePaginationConfig, TableProps } from 'antd'
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
      title: t('transaction:table.transactionId'),
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
      width: 200,
      sorter: true,
      sortOrder: sortedInfo.field === 'transactionType' ? sortedInfo.order : null,
      render: (value) => {
        if (value === TransactionTypes.DEPOSIT) {
          return <strong className='text-green-600'>{t('transaction:type.DEPOSIT')}</strong>
        } else {
          return <strong className='text-red-600'>{t('transaction:type.WITHDRAWAL')}</strong>
        }
      }
    },
    {
      title: t('transaction:table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 200,
      sorter: true,
      sortOrder: sortedInfo.field === 'status' ? sortedInfo.order : null,
      render: (value) => {
        if (value === TransactionStatus.SUCCESS) {
          return <strong className='text-blue-600'>{t('transaction:stasus.SUCCESS')}</strong>
        }
        if (value === TransactionStatus.FAILED) {
          return <strong className='text-red-600'>{t('transaction:stasus.FAILED')}</strong>
        } else {
          return <strong className='text-yellow-500'>{t('transaction:stasus.PENDING')}</strong>
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
      width: 250
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
