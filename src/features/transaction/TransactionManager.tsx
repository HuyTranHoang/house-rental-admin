import ErrorFetching from '@/components/ErrorFetching'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter'
import { useTransactionFilters, useTransactions } from '@/hooks/useTransactions'
import { Transaction, TransactionDataSource, TransactionStatus, TransactionTypes } from '@/types/transaction.type'
import { InfoOutlined, SwapOutlined } from '@ant-design/icons'
import { Divider, Flex, Form, Input, Select, TableProps, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import TransactionTable from './TransactionTable'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import useBoundStore from '@/store.ts'
import { useNavigate } from 'react-router-dom'
const { Search } = Input

type OnChange = NonNullable<TableProps<TransactionDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function TransactionManager() {
  const currentUser = useBoundStore((state) => state.user)
  const navigate = useNavigate()

  const formatDate = useCustomDateFormatter()
  const { t } = useTranslation(['common', 'transaction'])
  const { search, userId, amount, transactionType, status, pageNumber, pageSize, sortBy, setFilters } =
    useTransactionFilters()

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const { data, isLoading, isError } = useTransactions(
    search,
    userId,
    amount,
    transactionType,
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

  const handleTableChange: TableProps<TransactionDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }
  }

  useEffect(() => {
    if (!hasAuthority(currentUser,'transaction:read')) {
      navigate(ROUTER_NAMES.DASHBOARD)
    }
  },[currentUser, navigate])

  useEffect(() => {
    if (sortBy) {
      const match = sortBy.match(/(.*?)(Asc|Desc)$/)
      if (match) {
        const [, field, order] = match
        setSortedInfo({
          field,
          order: order === 'Asc' ? 'ascend' : 'descend'
        })
      }
    }
  }, [sortBy])

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
            <Form.Item>
              <Select
                placeholder={t('transaction:filters.type')}
                className="w-36"
                suffixIcon={<SwapOutlined className="text-base" />}
                onChange={(value) => setFilters({ transactionType: value })}
                value={transactionType || undefined}
              >
                <Select.Option value="">{t('transaction:type.ALL')}</Select.Option>
                <Select.Option value={TransactionTypes.DEPOSIT}>{t('transaction:type.DEPOSIT')}</Select.Option>
                <Select.Option value={TransactionTypes.WITHDRAWAL}>{t('transaction:type.WITHDRAWAL')}</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Select
                placeholder={t('transaction:filters.status')}
                className="w-36"
                suffixIcon={<InfoOutlined className="text-base" />}
                onChange={(value) => setFilters({ status: value })}
                value={status || undefined}
              >
                <Select.Option value="">{t('transaction:status.ALL')}</Select.Option>
                <Select.Option value={TransactionStatus.SUCCESS}>{t('transaction:status.SUCCESS')}</Select.Option>
                <Select.Option value={TransactionStatus.FAILED}>{t('transaction:status.FAILED')}</Select.Option>
                <Select.Option value={TransactionStatus.PENDING}>{t('transaction:status.PENDING')}</Select.Option>
              </Select>
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
        sortedInfo={sortedInfo}
        handleTableChange={handleTableChange}
      />
    </>
  )
}

export default TransactionManager
