import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mouseDown } from '../../actions'

class Box extends Component {
  constructor(props) {
    super(props)

    this.onMouseDownHandler = this.onMouseDownHandler.bind(this)
  }
  onMouseDownHandler(e) {
    const { onMouseDown, dataKey } = this.props
    onMouseDown(dataKey + '', e.shiftKey)
    e.stopPropagation()
  }
  render() {
    const style = this.props.style.toJS()
    const dataKey = this.props.dataKey
    return (
      <div
        id={dataKey}
        className='box'
        style={style}

        onMouseDown={this.onMouseDownHandler} />
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    style: state.mainReducer.getIn(['boxs', 'byId', ownProps.dataKey])
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    onMouseDown: (id, shiftKey) => dispatch(mouseDown(id, shiftKey))
  }
}

Box = connect(mapStateToProps, mapDispatchToProps)(Box)

export default Box
