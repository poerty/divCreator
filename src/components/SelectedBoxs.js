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
        let styles={
            width: this.props.targetBox.width,
            height: this.props.targetBox.height,
            top: this.props.targetBox.top,
            left: this.props.targetBox.left,
            position: "absolute"
        }
        if(styles.width===0 && styles.height===0){
            styles={...styles,...{display: "none"}};
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
        boxList: state.drag.boxList,
        targetBox: state.drag.targetBox
    }
}

SelectedBoxs = connect(mapStateToProps)(SelectedBoxs);

export default SelectedBoxs;