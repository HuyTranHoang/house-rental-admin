import styled from 'styled-components'

const IndicatorStyle = styled.span`
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;
  border: 4px solid #fff;
  box-sizing: border-box;
  animation: fill 1s linear infinite alternate;
  color: #91caff;
  border-radius: 0 0 4px 4px;

  &:after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid #fff;
    width: 20px;
    height: 25px;
    border-radius: 0 4px 4px 0;
  }

  @keyframes fill {
    0% {
      box-shadow: 0 0 inset;
    }
    100% {
      box-shadow: 0 -48px inset;
    }
  }
`

function CustomIndicator() {
  return <IndicatorStyle />
}

export default CustomIndicator
