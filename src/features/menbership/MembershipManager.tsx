import ErrorFetching from '@/components/ErrorFetching.tsx'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useDeleteMutiMemberShip, useMembershipFilters, useMemberShips } from '@/hooks/useMemberships.ts'
import useBoundStore from '@/store.ts'
import { MemberShip, MemberShipDataSource } from '@/types/membership.type.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import MembershipForm from './MembershipForm.tsx'
import MembershipTable from './MembershipTable.tsx'
import { useNavigate } from 'react-router-dom'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const { Search } = Input

type OnChange = NonNullable<TableProps<MemberShipDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function MembershipManager() {
  const currentUser = useBoundStore((state) => state.user)
  const navigate = useNavigate()

  const [editId, setEditId] = useState(0)
  const [formOpen, setFormOpen] = useState(false)

  const { search, sortBy, pageSize, pageNumber, setFilters } = useMembershipFilters()
  const formatDate = useCustomDateFormatter()

  const [isOpen, setIsOpen] = useState(false)
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const { t } = useTranslation(['common', 'membership'])

  const { data, isLoading, isError } = useMemberShips(search, pageNumber, pageSize, sortBy)
  const { deleteMemberShipsMutate, deleteMemberShipsIsPending } = useDeleteMutiMemberShip()

  const handleTableChange: TableProps<MemberShipDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      if (`${sorter.field}${order}` !== sortBy) setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }
  }

  const dataSource: MemberShipDataSource[] = data
    ? data.data.map((membership: MemberShip, idx) => ({
        ...membership,
        key: membership.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: formatDate(membership.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<MemberShipDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: MemberShipDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  const handleOpenForm = (id: number) => {
    setEditId(id)
    setFormOpen(true)
  }

  useEffect(() => {
    if (!hasAuthority(currentUser,'membership:read')) {
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
      <Flex align='center' justify='space-between' className='mb-3'>
        <Flex align='center'>
          <Typography.Title level={2} className='m-0'>
            {t('membership:title')}
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          <Form
            name='searchMemberShipForm'
            initialValues={{
              search: search
            }}
            layout='inline'
          >
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('membership:searchPlaceholder')}
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button
              shape='round'
              type='primary'
              danger
              disabled={!hasAuthority(currentUser, 'membership:delete')}
              onClick={() => setIsOpen(true)}
            >
              {t('common.multipleDelete')}
            </Button>
          )}
        </Space>
      </Flex>

      <MembershipTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => (
            <Trans
              ns={'membership'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        sortedInfo={sortedInfo}
        onEdit={(id: number) => handleOpenForm(id)}
      />

      <MembershipForm id={editId} formOpen={formOpen} setFormOpen={setFormOpen} />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        pending={deleteMemberShipsIsPending}
        setIsModalOpen={setIsOpen}
        title={t('membership:deleteModal.titleMultiple')}
        onOk={() => {
          deleteMemberShipsMutate(deleteIdList).then(() => {
            console.log('Delete ID List:', deleteIdList)
            deleteIdList.length > 1
              ? toast.success(t('membership:notification.deleteSuccessMultiple'))
              : toast.success(t('membership:notification.deleteSuccess'))
            setDeleteIdList([])
            setIsOpen(false)
          })
        }}
      />
    </>
  )
}

export default MembershipManager
