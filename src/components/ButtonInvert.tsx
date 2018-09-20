import * as React from 'react'
import ArrowInvert from '../assets/arrow-invert.svg'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  handleClick: () => void
}

class ButtonInvert extends React.Component<IProps> {
  public render() {
    return (
      <div
        className="flex justify-center items-center lh-solid bg-white blue ba bw1 br-100 b--light-gray pointer fw1"
        style={{ width: 50, height: 50 }}
        onClick={this.props.handleClick}
      >
        <ArrowInvert fill="currentColor" className="w1 h1" />
      </div>
    )
  }
}

export default ButtonInvert
