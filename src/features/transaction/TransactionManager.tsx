import ErrorFetching from '@/components/ErrorFetching'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter'
import { useTransactionFilters, useTransactions } from '@/hooks/useTransactions'
import useBoundStore from '@/store.ts'
import { Transaction, TransactionDataSource, TransactionStatus, TransactionTypes } from '@/types/transaction.type'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { InfoOutlined, SwapOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Form, Input, Select, TableProps, Typography } from 'antd'
import { FilterX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import TransactionTable from './TransactionTable'

const { Search } = Input

type OnChange = NonNullable<TableProps<TransactionDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function TransactionManager() {
  const currentUser = useBoundStore((state) => state.user)
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const formatDate = useCustomDateFormatter()
  const { t } = useTranslation(['common', 'transaction'])
  const { search, transactionType, status, pageNumber, pageSize, sortBy, setFilters } = useTransactionFilters()

  const haveFilterActive = search || transactionType || status

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const { data, isLoading, isError } = useTransactions(
    search,
    transactionType || '',
    status || '',
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
    if (!hasAuthority(currentUser, 'transaction:read')) {
      navigate(ROUTER_NAMES.DASHBOARD)
    }
  }, [currentUser, navigate])

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

  useEffect(() => {
    form.setFieldsValue({
      search,
      transactionType,
      status
    })
  }, [form, search, status, transactionType])

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
          <Form form={form} name='serachReviewForm' layout='inline'>
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('transaction:searchPlaceholder')}
                className='w-72'
              />
            </Form.Item>
            <Form.Item name='transactionType'>
              <Select
                onChange={(value) => setFilters({ transactionType: value as TransactionTypes })}
                placeholder={t('transaction:filters.type')}
                suffixIcon={<SwapOutlined className='text-base' />}
                options={[
                  { label: t('transaction:type.ALL'), value: '' },
                  { label: t('transaction:type.DEPOSIT'), value: TransactionTypes.DEPOSIT },
                  { label: t('transaction:type.WITHDRAWAL'), value: TransactionTypes.WITHDRAWAL }
                ]}
                className='w-48'
              />
            </Form.Item>

            <Form.Item name='status'>
              <Select
                placeholder={t('transaction:filters.status')}
                className='w-36'
                suffixIcon={<InfoOutlined className='text-base' />}
                onChange={(value) => setFilters({ status: value as TransactionStatus })}
                options={[
                  { label: t('transaction:status.ALL'), value: '' },
                  { label: t('transaction:status.SUCCESS'), value: TransactionStatus.SUCCESS },
                  { label: t('transaction:status.FAILED'), value: TransactionStatus.FAILED },
                  { label: t('transaction:status.PENDING'), value: TransactionStatus.PENDING }
                ]}
              />
            </Form.Item>
          </Form>

          {haveFilterActive && (
            <Button icon={<FilterX size={16} />} type='text' onClick={() => setFilters({ reset: true })} />
          )}
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
