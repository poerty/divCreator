import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';
import './css/box.css';
 
class Box extends Component {
    render() {
        return (
            <div
                id={this.props.id} 
                className={this.props.className}
                style={this.props.style}
                
                onMouseDown={this.props.onMouseDown.bind(this)}>
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onMouseDown: (e)=>dispatch(mouseDown(e.target.id,e.shiftKey))
    }
}

Box = connect(undefined, mapDispatchToProps)(Box);
 
export default Box;