import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';
 
class Box extends Component {
    
    render() {
        let childBoxList=[]
        if(this.props.style.childBoxList!==undefined){
            for(let childBoxId in this.props.style.childBoxList){
                childBoxList.push(<div key={this.props.dataKey+"-"+childBoxId} className="box" style={this.props.style.childBoxList[childBoxId]}/>);
            }
        }
        return (
            <div
                id={this.props.dataKey}
                className="box"
                style={this.props.style}
                
                onMouseDown={this.props.onMouseDown.bind(this,this.props.dataKey)}>
                {childBoxList}
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
        onMouseDown: (id,e)=>{
            dispatch(mouseDown(id+"",e.shiftKey))
            e.stopPropagation();
        }
    }
}

Box = connect(undefined, mapDispatchToProps)(Box);
 
export default Box;