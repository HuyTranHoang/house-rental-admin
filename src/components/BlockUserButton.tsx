import { useLockUser } from '@/hooks/useUsers'
import { UserDataSource } from '@/models/user.type'
import { green, red, volcano } from '@ant-design/colors'
import { LockOutlined, UnlockOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface BlockUserButtonProps {
  record: UserDataSource
  hasText?: boolean
}

const BlockUserButton: React.FC<BlockUserButtonProps> = ({ record, hasText }) => {
  const { t } = useTranslation(['user', 'common'])
  const { lockUserMutate, lockUserIsPending } = useLockUser()

  const [open, setOpen] = useState(false)

  const modalTitle = (
    <Flex vertical align='center'>
      <Flex
        justify='center'
        align='center'
        style={{
          backgroundColor: record.nonLocked ? volcano[0] : green[0],
          width: 44,
          height: 44,
          borderRadius: '100%'
        }}
      >
        {record.nonLocked ? (
          <LockOutlined style={{ color: volcano.primary, fontSize: 24 }} />
        ) : (
          <UnlockOutlined style={{ color: green.primary, fontSize: 24 }} />
        )}
      </Flex>
      <span style={{ margin: '6px 0' }}>
        {record.nonLocked ? t('table.tooltips.lock') : t('table.tooltips.unlock')}
      </span>
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
          disabled={record.username === 'admin'}
          onClick={() => setOpen(true)}
          style={
            record.username === 'admin'
              ? {}
              : {
                  color: record.nonLocked ? volcano.primary : green.primary,
                  borderColor: record.nonLocked ? volcano.primary : green.primary
                }
          }
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
          style: {
            backgroundColor: record.nonLocked ? volcano.primary : green.primary,
            borderColor: record.nonLocked ? volcano[5] : green[5]
          },
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
          <span style={{ color: red.primary }}>
            <WarningOutlined style={{ color: red.primary }} />{' '}
            {record.nonLocked ? t('lockModal.content') : t('unlockModal.content')}
          </span>
        </Flex>
      </Modal>
    </>
  )
}

export default BlockUserButton
