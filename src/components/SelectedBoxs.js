import React, { Component } from 'react';
import { connect } from 'react-redux';

import TargetBox from './TargetBox';
 
class SelectedBoxs extends Component {
    render() {
        let top=10000,bottom=-1,left=10000,right=-1;
        for(let boxId in this.props.boxList){
            if(this.props.selectedBoxIdList.includes(boxId)){
                top=Math.min(top,this.props.boxList[boxId].top);
                bottom=Math.max(bottom,this.props.boxList[boxId].top+this.props.boxList[boxId].height);
                left=Math.min(left,this.props.boxList[boxId].left);
                right=Math.max(right,this.props.boxList[boxId].left+this.props.boxList[boxId].width);
            }
        }
        let height=bottom-top,width=right-left;
        let styles={
            width: width,
            height: height,
            top: top,
            left: left,
            position: "absolute"
        }
        return (
            <TargetBox
                key={"0"}
                id={this.props.id}
                className={"box targetBox"}
                draggable={true}
                style={styles}
                resizerSize={8}>
                click this
            </TargetBox>
        );
    }
}

let mapStateToProps = (state,ownProps) => {
    return {
        selectedBoxIdList: state.drag.selectedBoxIdList,
        boxList: state.drag.boxList
    }
}

SelectedBoxs = connect(mapStateToProps)(SelectedBoxs);

export default SelectedBoxs;