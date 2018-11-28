import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Pane from './Pane'
import Resizer from './Resizer'

export default class SplitPane extends Component {
  constructor () {
    super()
    this.state = {
      active: false,
      resized: false
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  static propTypes = {
    primary: React.PropTypes.oneOf(['first', 'second']),
    minSize: React.PropTypes.number,
    defaultSize: React.PropTypes.string,
    size: React.PropTypes.number,
    allowResize: React.PropTypes.bool,
    resizerClassName: React.PropTypes.string,
    split: React.PropTypes.oneOf(['vertical', 'horizontal']),
    onDragStarted: React.PropTypes.func,
    onDragFinished: React.PropTypes.func
  }

  static defaultProps = {
    split: 'vertical',
    minSize: 50,
    allowResize: true,
    rimary: 'first',
    defaultSize: '50%'
  }

  componentDidMount () {
    this.setSize(this.props, this.state)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
  }

  componentWillReceiveProps (props) {
  }


  setSize (props, state) {
    const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2
    let newSize
    if (ref) {
      newSize = props.size || (state && state.draggedSize) || props.defaultSize || props.minSize
      ref.setState({
        size: newSize
      })
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('mousemove', this.onMouseMove)
  }

  onMouseDown (event) {
    if (this.props.allowResize && !this.props.size) {
      this.unFocus()
      let position = this.props.split === 'vertical' ? event.clientX : event.clientY
      if (typeof this.props.onDragStarted === 'function') {
        this.props.onDragStarted()
      }
      this.setState({
        active: true,
        position: position
      })
    }
  }

  onMouseMove (event, force) {
    if (this.props.allowResize && !this.props.size && !this.state.collapsed) {
      if (this.state.active || force) {
        this.unFocus()
        const ref = this.props.primary === 'first' ? this.refs.pane1 : this.refs.pane2
        if (ref) {
          const node = ReactDOM.findDOMNode(ref)

          if (node.getBoundingClientRect) {
            const width = node.getBoundingClientRect().width
            const height = node.getBoundingClientRect().height
            const current = this.props.split === 'vertical' ? event.clientX : event.clientY
            const size = this.props.split === 'vertical' ? width : height
            const position = this.state.position
            const newPosition = this.props.primary === 'first' ? (position - current) : (current - position)

            let newSize = size - newPosition

            if (newSize < this.props.minSize) {
              newSize = this.props.minSize
            } else {
              this.setState({
                position: current,
                resized: true
              })
            }

            if (this.props.onChange) {
              this.props.onChange(newSize)
            }
            this.setState({
              draggedSize: newSize
            })
            ref.setState({
              size: newSize
            })
          }
        }
      }
    }
  }

  onMouseUp () {
    if (this.props.allowResize && !this.props.size) {
      if (this.state.active) {
        if (typeof this.props.onDragFinished === 'function') {
          this.props.onDragFinished()
        }
        this.setState({
          active: false
        })
      }
    }
  }

  unFocus () {
    if (document.selection) {
      document.selection.empty()
    } else {
      window.getSelection().removeAllRanges()
    }
  }

  merge (into, obj) {
    for (let attr in obj) {
      into[attr] = obj[attr]
    }
  }

  collapse (v) {
    let ref1 = this.props.collapsable === 'first' ? this.refs.pane2 : this.refs.pane1
    const ref2 = this.props.collapsable === 'first' ? this.refs.pane1 : this.refs.pane2

    if (!v) {
      ref1.setState({
        size: this.lastSize
      })

      ref2.setState({
        size: undefined
      })

      this.setState({
        resized: true,
        collapsed: v,
        draggedSize: this.lastSize,
        position: this.lastSize
      })
    } else {
      this.lastSize = ref1.state.size
      ref1.setState({
        size: undefined
      })

      ref2.setState({
        size: 0
      })

      this.setState({
        collapsed: v,
        resized: true,
        draggedSize: undefined,
        position: undefined
      })
    }

    if (typeof this.props.onDragFinished === 'function') {
      this.props.onDragFinished()
    }
  }

  render () {
    const {split, allowResize, resizerClassName, collapsedText, collapsable} = this.props
    const { collapsed } = this.state
    let disabledClass = allowResize ? '' : 'disabled'

    let style = {
      display: 'flex',
      flex: 1,
      outline: 'none',
      overflow: 'hidden',
      MozUserSelect: 'text',
      WebkitUserSelect: 'text',
      msUserSelect: 'text',
      userSelect: 'text'
    }

    if (split === 'vertical') {
      this.merge(style, {
        flexDirection: 'row'
      })
    } else {
      this.merge(style, {
        flexDirection: 'column',
        width: '100%'
      })
    }

    const children = this.props.children
    const classes = ['SplitPane', this.props.className, split, disabledClass]

    return (
      <div className={classes.join(' ')} style={style} ref='splitPane'>
        <Pane ref='pane1' key='pane1' className='Pane1' split={split}>{children[0]}</Pane>
        <Resizer
          ref='resizer' key='resizer' collapsable={collapsable} collapsedText={collapsedText}
          className={disabledClass + ' ' + resizerClassName}
          onMouseDown={this.onMouseDown} collapsed={collapsed} split={split} collapse={(v) => this.collapse(v)} />
        <Pane ref='pane2' key='pane2' className='Pane2' split={split}>{children[1]}</Pane>
      </div>
    )
  }
}
