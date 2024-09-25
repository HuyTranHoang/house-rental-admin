import ErrorFetching from '@/components/ErrorFetching'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter'
import { useTransactionFilters, useTransactions } from '@/hooks/useTransactions'
import { Transaction, TransactionDataSource } from '@/models/transaction.type'
import { Divider, Flex, Form, Input, Typography } from 'antd'
import { Trans, useTranslation } from 'react-i18next'
import TransactionTable from './TransactionTable'
const { Search } = Input

function ListTransaction() {
  const formatDate = useCustomDateFormatter()
  const { t } = useTranslation(['common', 'transaction'])
  const { search, userId, amount, type, status, pageNumber, pageSize, sortBy, setFilters } = useTransactionFilters()
  const { data, isLoading, isError } = useTransactions(
    search,
    userId,
    amount,
    type,
    status,
    pageNumber,
    pageSize,
    sortBy
  )

  const dataSource: TransactionDataSource[] = data
    ? data.data.map((transaction: Transaction, idx) => ({
        ...transaction,
        key: transaction.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        transactionDate: formatDate(transaction.transactionDate)
      }))
    : []

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {t('transaction:title')}
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form
            name='serachReviewForm'
            initialValues={{
              search: search
            }}
            layout='inline'
          >
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('transaction:searchPlaceholder')}
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>
      </Flex>

      <TransactionTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => (
            <Trans
              ns={'transaction'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
      />
    </>
  )
}

export default ListTransaction
