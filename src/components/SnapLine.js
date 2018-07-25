import React, { Component } from 'react';

class snapLine extends Component {
    render() {
        let styles={
        };
        if(this.props.direction==="top"||this.props.direction==="bottom"){
            styles.width="100%";
            styles.top=this.props.locate-1;
        }
        else if(this.props.direction==="left"||this.props.direction==="right"){
            styles.height="100%";
            styles.left=this.props.locate-1;
        }
        
        return (
            <div className={"snapLine"} style={styles}>
            </div>
        );
    }
}

export default snapLine;