import { Button, ConfigProvider, type GetProps } from 'antd'

interface configButton {
  linkHover?: string
  fontWeight?: string
  borderHoverColor?: string
  defaultHover?: string
  borderColor?: string
  defaultText?: string
  lineWidth?: number
}

type ColorButtonProps = GetProps<typeof Button> & configButton

function ColorButton({
  linkHover,
  fontWeight,
  borderHoverColor,
  defaultHover,
  borderColor,
  lineWidth,
  children,
  ...props
}: ColorButtonProps) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            //Default
            fontWeight: fontWeight || undefined,
            defaultBorderColor: borderColor || 'black',
            defaultHoverColor: defaultHover || 'black',
            defaultHoverBorderColor: borderHoverColor || 'black',
            //Text
            colorLink: 'black',
            colorLinkHover: linkHover || 'black',
            colorLinkActive: '#0499A8',
            linkFocusDecoration: 1,
            lineWidth: lineWidth || 2
          }
        }
      }}
    >
      <Button {...props}>{children}</Button>
    </ConfigProvider>
  )
}

export default ColorButton