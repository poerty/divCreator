import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';
import './css/box.css';
 
class Resizer extends Component {
    render() {
        return (
            <div
                id={this.props.id} 
                className={this.props.className}
                style={this.props.style}>
                
            </div>
        );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
    }
}

Resizer = connect(undefined, mapDispatchToProps)(Resizer);
 
export default Resizer;