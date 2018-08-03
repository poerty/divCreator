import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';
 
class Box extends Component {
    render() {
        return (
            <div
                id={this.props.dataKey}
                className="box"
                style={this.props.style}
                
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