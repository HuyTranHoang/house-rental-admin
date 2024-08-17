import { Button, Tooltip } from 'antd'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { green, volcano } from '@ant-design/colors'
import { UserDataSource } from '@/models/user.type.ts'
import styled from 'styled-components'

interface LockButtonProps {
  isNonLocked: boolean
  record: UserDataSource
  handleBlockUser: (record: UserDataSource) => void
}

const StyledButton = styled(Button)<{ isNonLocked: boolean; isAdmin: boolean }>`
    color: ${({ isNonLocked, isAdmin }) =>
  (isAdmin ? 'inherit' : isNonLocked ? volcano.primary : green.primary)};
    border-color: ${({ isNonLocked, isAdmin }) =>
  (isAdmin ? 'inherit' : isNonLocked ? volcano.primary : green.primary)};

    &:hover {
        color: ${({ isNonLocked, isAdmin }) =>
  (isAdmin ? 'rgba(0, 0, 0, 0.25)' : isNonLocked ? volcano[3] : green[3])} !important;
        border-color: ${({ isNonLocked, isAdmin }) =>
  (isAdmin ? 'rgba(0, 0, 0, 0.25)' : isNonLocked ? volcano[3] : green[3])} !important;
    }
`

function LockButton({ isNonLocked, record, handleBlockUser }: LockButtonProps) {
  return (
    <Tooltip title={isNonLocked ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
      <StyledButton
        icon={
          isNonLocked ? (
            <LockOutlined style={{ color: record.username === 'admin' ? 'inherit' : volcano.primary }} />
          ) : (
            <UnlockOutlined style={{ color: record.username === 'admin' ? 'inherit' : green.primary }} />
          )
        }
        disabled={record.username === 'admin'}
        onClick={() => handleBlockUser(record)}
        isNonLocked={isNonLocked}
        isAdmin={record.username === 'admin'}
      />
    </Tooltip>
  )
}

export default LockButton
