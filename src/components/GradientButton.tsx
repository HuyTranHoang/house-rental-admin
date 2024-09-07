import { useContext } from 'react'
import type { GetProps } from 'antd'
import { Button, ConfigProvider } from 'antd'
import { css } from '@emotion/css'

type GradientButton = GetProps<typeof Button>

function GradientButton({ children, ...props }: GradientButton) {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext)
  const rootPrefixCls = getPrefixCls()
  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `

  return (
    <ConfigProvider
      button={{
        className: linearGradientButton
      }}
    >
      <Button {...props}>{children}</Button>
    </ConfigProvider>
  )
}

export default GradientButton
