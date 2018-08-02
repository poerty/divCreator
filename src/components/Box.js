import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';
 
class Box extends Component {
    render() {
        let style={
            width: this.props.style.width,
            height: this.props.style.height,
            top: this.props.style.top,
            left: this.props.style.left,
        }
        return (
            <div
                id={this.props.dataKey}
                className="box"
                style={style}
                
                onMouseDown={this.props.onMouseDown.bind(this)}>
            </div>
        );
    }
}

let mapStateToProps = (state,ownProps) => {
    return {
        style: state.drag.boxList[ownProps.dataKey]
    }
}

Box = connect(mapStateToProps)(Box);


let mapDispatchToProps = (dispatch) => {
    return {
        onMouseDown: (e)=>dispatch(mouseDown(e.target.id,e.shiftKey))
    }
}

Box = connect(undefined, mapDispatchToProps)(Box);
 
export default Box;