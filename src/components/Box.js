import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mouseDown } from '../actions';
 
class Box extends Component {
    getChildBox(key,boxStyle){
        let boxList=[]
        for(let boxId in boxStyle){
            let childBoxList=[]
            if(boxStyle[boxId].childBoxList!==undefined){
                childBoxList=this.getChildBox(key+"-"+boxId,boxStyle[boxId].childBoxList);
            }
            boxList.push(<div key={key+"-"+boxId} className="box" style={boxStyle[boxId]}>{childBoxList}</div>);
        }

        return boxList;
    }
    render() {
        let childBoxList=[]
        if(this.props.style.childBoxList!==undefined){
            childBoxList=this.getChildBox(this.props.dataKey,this.props.style.childBoxList);
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