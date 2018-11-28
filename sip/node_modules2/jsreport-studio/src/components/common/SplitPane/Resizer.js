import React from 'react'

export default React.createClass({

  onMouseDown (event) {
    if (!this.props.collapsed) {
      this.props.onMouseDown(event)
    }
  },

  render () {
    const {split, className, collapsed, collapse, collapsedText, collapsable} = this.props
    const classes = ['Resizer', split, className]

    return (
      <div className={classes.join(' ') + (collapsed ? ' collapsed' : '')} onMouseDown={this.onMouseDown}>
        <div className='resizer-line'></div>
        {collapsed
          ? <div className='pane-holder' onClick={(e) => collapse(false)}>{collapsedText}</div>
          : <div className={'docker ' + (collapsable === 'first' ? 'left' : '')}
                 onClick={(e) => collapse(true)}><i className={'fa ' + (collapsable === 'first' ? 'fa-long-arrow-left' : 'fa-long-arrow-right')}></i></div>
        }
      </div>)
  }
})
