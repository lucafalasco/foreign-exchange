import * as React from 'react'
import classNames from 'classnames'
import { noop } from 'lodash'
import Scrollbars from 'react-custom-scrollbars'
import ArrowDropdown from '../assets/arrow-dropdown.svg'

const disabledStyle = 'o-50 pointer-events-none'
const defaultStyle = 'b--dark br1'
const defaultChildrenStyle = 'shadow-4 bg-white'

interface IProps {
  className?: string
  style?: { [key: string]: string | number }
  label: string
  autoclose?: boolean
  disabled?: boolean
  children: React.ReactNode
  childrenClassName?: string
  scrollable?: boolean
  open?: boolean
  reset?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

interface IState {
  open: boolean
}

class Select extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    className: '',
    childrenClassName: '',
    autoclose: true,
    reset: false,
    onClick: noop,
  }

  public state = {
    open: this.props.open,
  }

  private wrapperElement = React.createRef<HTMLDivElement>()

  public componentDidMount() {
    document.body.addEventListener('mouseup', this.handleOutsideClick, {
      passive: true,
    })
    document.body.addEventListener('touchend', this.handleOutsideClick, {
      passive: true,
    })
  }

  public componentWillUnmount() {
    document.body.removeEventListener('mouseup', this.handleOutsideClick)
    document.body.removeEventListener('touchend', this.handleOutsideClick)
  }

  public setOpen = () => this.setState({ open: true })

  public setClose = () => this.setState({ open: false })

  public toggleOpen = () => this.setState({ open: !this.state.open })

  public handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    this.toggleOpen()
    this.props.onClick(event)
  }

  public handleOutsideClick = (event: Event) => {
    if (this.wrapperElement.current && this.wrapperElement.current.contains(event.target as Node)) {
      return
    }
    this.setClose()
  }

  public render() {
    const {
      children,
      className,
      childrenClassName,
      style,
      label,
      scrollable,
      autoclose,
      disabled,
      reset,
    } = this.props
    const { open } = this.state

    const classes = classNames(className, 'flex justify-between items-center pointer pa2', {
      [disabledStyle]: disabled,
      [defaultStyle]: !reset,
    })

    const childrenClasses = classNames(childrenClassName, 'absolute z-5', {
      dn: !open,
      'w-100': scrollable,
      h5: open && scrollable,
      [defaultChildrenStyle]: !reset,
    })

    return (
      <div ref={this.wrapperElement} className="relative">
        <div onClick={this.handleClick} className={classes} style={style}>
          <span>{label}</span>
          <div className={`flex justify-center ml2 ${open ? 'rotate-180' : ''}`}>
            <ArrowDropdown className="w2 h2" fill="currentColor" />
          </div>
        </div>
        <div className={childrenClasses}>
          {scrollable ? (
            <Scrollbars className="h-100">
              {React.Children.map(children, (child, i) => (
                <div key={i} onClick={autoclose ? this.setClose : noop}>
                  {child}
                </div>
              ))}
            </Scrollbars>
          ) : (
            React.Children.map(children, (child, i) => (
              <div key={i} onClick={autoclose ? this.setClose : noop}>
                {child}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }
}

export default Select
