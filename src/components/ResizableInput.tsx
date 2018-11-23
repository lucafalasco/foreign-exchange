import * as React from 'react'
import classNames from 'classnames'
import { omit, noop } from 'lodash'

const disabledStyle = 'o-50 pointer-events-none'
const defaultStyle = 'b--black black bg-white'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  style?: { [key: string]: string | number }
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'time' | 'date' | 'datetime-local'
  value: number | undefined
  disabled?: boolean
  reset?: boolean
  focus?: boolean
  minWidth?: number
  handleChange?: (amount: string) => void
}

interface IState {
  inputWidth: number
}

class ResizableInput extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    className: '',
    style: {},
    type: 'text',
    reset: false,
    handleChange: noop,
    focus: false,
    minWidth: 45,
    value: undefined,
  }

  public state = {
    inputWidth: this.props.minWidth,
  }

  private input = React.createRef<HTMLInputElement>()
  private sizer = React.createRef<HTMLDivElement>()

  public componentDidMount() {
    this.updateInputWidth()
  }

  public componentDidUpdate() {
    this.updateInputWidth()
    if (this.props.focus) {
      this.input.current.focus()
    }
  }

  public updateInputWidth() {
    const newInputWidth = Math.max(this.sizer.current.scrollWidth + 40, this.props.minWidth)
    if (newInputWidth !== this.state.inputWidth) {
      this.setState({
        inputWidth: newInputWidth,
      })
    }
  }

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    this.props.handleChange(value)
    this.forceUpdate(this.updateInputWidth)
  }

  public render() {
    const { className, style, type, value, disabled, reset, focus } = this.props

    const classes = classNames(className, 'bn input-reset outline-transparent bg-transparent', {
      [disabledStyle]: disabled,
      [defaultStyle]: !reset,
    })

    const props = omit(this.props, Object.keys(ResizableInput.defaultProps))
    const { inputWidth } = this.state
    const displayValue = value || 0

    return (
      <React.Fragment>
        <input
          {...props}
          ref={this.input}
          className={classes}
          style={{ ...style, font: 'inherit', color: 'inherit', width: inputWidth }}
          type={type}
          value={displayValue.toString()}
          autoFocus={focus}
          disabled={disabled}
          onChange={this.handleChange}
        />
        <div ref={this.sizer} className="absolute top-2 left-2 h0 overflow-scroll pre">
          {displayValue.toString()}
        </div>
      </React.Fragment>
    )
  }
}

export default ResizableInput
