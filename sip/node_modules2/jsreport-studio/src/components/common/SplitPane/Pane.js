import React from 'react'

export default React.createClass({
  getInitialState () {
    return {}
  },

  render () {
    const split = this.props.split
    const classes = [ 'Pane', split, this.props.className ]

    let style = {
      flex: 1,
      display: 'flex',
      outline: 'none'
    }

    if (this.state.size !== undefined) {
      if (split === 'vertical') {
        style.width = this.state.size
      } else {
        style.height = this.state.size
        style.display = 'flex'
      }
      style.flex = 'none'
    }

    style.minHeight = 0
    style.minWidth = 0
    //console.log('style', style.width, style.flex)

    return (<div className={classes.join(' ')} style={style}>{this.props.children}</div>)
  }
})
