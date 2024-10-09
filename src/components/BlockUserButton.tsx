import { useLockUser } from '@/hooks/useUsers'
import useBoundStore from '@/store.ts'
import { UserDataSource } from '@/types/user.type'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { LockOutlined, UnlockOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Modal, Tooltip } from 'antd'
import { clsx } from 'clsx/lite'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface BlockUserButtonProps {
  record: UserDataSource
  hasText?: boolean
}

const BlockUserButton: React.FC<BlockUserButtonProps> = ({ record, hasText }) => {
  const currentUser = useBoundStore((state) => state.user)
  const { t } = useTranslation(['user', 'common'])
  const { lockUserMutate, lockUserIsPending } = useLockUser()

  const [open, setOpen] = useState(false)

  const modalTitle = (
    <Flex vertical align='center'>
      <Flex
        justify='center'
        align='center'
        className={clsx('size-10 rounded-full', record.nonLocked ? 'bg-orange-100' : 'bg-green-100')}
      >
        {record.nonLocked ? (
          <LockOutlined className='text-xl text-orange-500' />
        ) : (
          <UnlockOutlined className='text-xl text-green-500' />
        )}
      </Flex>
      <span className='m-2'>{record.nonLocked ? t('table.tooltips.lock') : t('table.tooltips.unlock')}</span>
    </Flex>
  )

  const handleOnOK = () => {
    lockUserMutate(record.id).then(() => {
      record.nonLocked
        ? toast.success(t('notification.lockSuccess', { username: record.username }))
        : toast.success(t('notification.unlockSuccess', { username: record.username }))

      record.nonLocked = !record.nonLocked
      setOpen(false)
    })
  }

  return (
    <>
      <Tooltip title={record.nonLocked ? t('table.tooltips.lock') : t('table.tooltips.unlock')}>
        <Button
          icon={record.nonLocked ? <LockOutlined /> : <UnlockOutlined />}
          disabled={record.roles.includes('Super Admin') || !hasAuthority(currentUser, 'user:update')}
          onClick={() => setOpen(true)}
          className={clsx(
            record.nonLocked &&
              !record.roles.includes('Super Admin') &&
              hasAuthority(currentUser, 'user:update') &&
              'border-orange-500 text-orange-500',
            !record.nonLocked &&
              !record.roles.includes('Super Admin') &&
              hasAuthority(currentUser, 'user:update') &&
              'border-green-500 text-green-500'
          )}
        >
          {hasText && (record.nonLocked ? t('button.lock') : t('button.unlock'))}
        </Button>
      </Tooltip>

      <Modal
        open={open}
        className='w-96'
        title={modalTitle}
        onCancel={() => setOpen(false)}
        maskClosable
        onOk={handleOnOK}
        okText={t('common:common.ok')}
        cancelText={t('common:common.cancel')}
        okButtonProps={{
          className: clsx(record.nonLocked ? 'bg-orange-500 border-orange-500' : 'bg-green-500 border-green-500'),
          loading: lockUserIsPending
        }}
        cancelButtonProps={{
          disabled: lockUserIsPending
        }}
      >
        <Flex vertical gap={8} style={{ marginBottom: 16 }}>
          <span>
            {record.nonLocked ? (
              <Trans
                ns='user'
                i18nKey='lockModal.title'
                values={{ username: record.username }}
                components={{ b: <b /> }}
              />
            ) : (
              <Trans
                ns='user'
                i18nKey='unlockModal.title'
                values={{ username: record.username }}
                components={{ b: <b /> }}
              />
            )}
          </span>
          <span className='text-red-500'>
            <WarningOutlined className='text-red-500' />{' '}
            {record.nonLocked ? t('lockModal.content') : t('unlockModal.content')}
          </span>
        </Flex>
      </Modal>
    </>
  )
}

export default BlockUserButton
