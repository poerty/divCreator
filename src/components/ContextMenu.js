import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeGroup } from '../actions';

 
class ContextMenu extends Component {
    
    render() {
        if(this.props.style.visible===false) return null;
        
        return (
            <div style={this.props.style} className="contextMenu">
                <div className="contextMenu--option" onMouseDown={this.props.onMouseDown.bind(this)}>make group</div>
                <div className="contextMenu--option contextMenu--option__disabled">make to component</div>
                <div className="contextMenu--option contextMenu--option__disabled">copy</div>
                <div className="contextMenu--option contextMenu--option__disabled">View full version</div>
                <div className="contextMenu--option contextMenu--option__disabled">Settings</div>
                <div className="contextMenu--separator" />
                <div className="contextMenu--option contextMenu--option__disabled">About this app</div>
            </div>
        );
    }
}

let mapStateToProps = (state,ownProps) => {
    return {
        style: state.drag.contextMenu
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        onMouseDown: (e)=>{
            dispatch(makeGroup())
            e.stopPropagation();
        }
    }
}

ContextMenu = connect(mapStateToProps, mapDispatchToProps)(ContextMenu);

export default ContextMenu;