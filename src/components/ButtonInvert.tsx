import * as React from 'react'
import ArrowInvert from '../assets/arrow-invert.svg'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleClick: () => void
}

class ButtonInvert extends React.Component<IProps> {
  public render() {
    return (
      <div
        className="flex justify-center items-center lh-solid blue bg-white br-100 pointer fw1 shadow-1"
        style={{ width: 50, height: 50 }}
        onClick={this.props.handleClick}
      >
        <ArrowInvert fill="currentColor" className="w1 h1" />
      </div>
    )
  }
}

export default ButtonInvert
