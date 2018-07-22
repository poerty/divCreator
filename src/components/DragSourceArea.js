import React, { Component } from 'react';
import { connect } from 'react-redux';

import BoxSource from './BoxSource';

class DragSourceArea extends Component {
    render() {
        let rows=[]
        for(let i=0;i<this.props.list_len;i++){
            rows.push(<BoxSource key={i} index={i} />);
        }
        return (
            <div id="dragSourceArea" class="area">
                {rows}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        list_len: state.drag.boxSourceList.length
    }
}

DragSourceArea = connect(mapStateToProps)(DragSourceArea);


export default DragSourceArea;