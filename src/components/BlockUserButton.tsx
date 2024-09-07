import { Button, Flex, Modal, Tooltip } from 'antd'
import { LockOutlined, UnlockOutlined, WarningOutlined } from '@ant-design/icons'
import { gray, green, red, volcano } from '@ant-design/colors'
import { useLockUser } from '@/hooks/useUsers'
import { UserDataSource } from '@/models/user.type'
import React from 'react'

interface BlockUserButtonProps {
  record: UserDataSource
  hasText?: boolean
}

const { confirm } = Modal

const BlockUserButton: React.FC<BlockUserButtonProps> = ({ record, hasText }) => {
  const { lockUserMutate } = useLockUser()

  const handleBlockUser = () => {
    confirm({
      icon: null,
      title: (
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
          <span style={{ margin: '6px 0' }}>{record.nonLocked ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</span>
        </Flex>
      ),
      content: (
        <Flex vertical gap={8} style={{ marginBottom: 16 }}>
          <span>
            {record.nonLocked ? `Bạn có chắc chắn muốn khóa tài khoản ` : `Bạn có chắc chắn muốn mở khóa tài khoản `}
            <b style={{ color: gray.primary }}>{record.username}</b> không?
          </span>
          <span style={{ color: red.primary }}>
            <WarningOutlined style={{ color: red.primary }} />{' '}
            {record.nonLocked
              ? 'Khóa tài khoản sẽ không cho phép người dùng đăng nhập vào hệ thống.'
              : 'Mở khóa tài khoản sẽ cho phép người dùng đăng nhập vào hệ thống.'}
          </span>
        </Flex>
      ),
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        lockUserMutate(record.id)
        record.nonLocked = !record.nonLocked
      },
      okButtonProps: {
        style: {
          backgroundColor: record.nonLocked ? volcano.primary : green.primary,
          borderColor: record.nonLocked ? volcano[0] : green[0]
        }
      }
    })
  }

  return (
    <Tooltip title={record.nonLocked ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
      <Button
        icon={record.nonLocked ? <LockOutlined /> : <UnlockOutlined />}
        disabled={record.username === 'admin'}
        onClick={handleBlockUser}
        style={
          record.username === 'admin'
            ? {}
            : {
                color: record.nonLocked ? volcano.primary : green.primary,
                borderColor: record.nonLocked ? volcano.primary : green.primary
              }
        }
      >
        {hasText && (record.nonLocked ? 'Khóa' : 'Mở khóa')}
      </Button>
    </Tooltip>
  )
}

export default BlockUserButton