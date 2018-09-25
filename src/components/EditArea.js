import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changeProp } from './../actions'

import OnBlurUpdateInput from './OnBlurUpdateInput'

const PropBoxContainer = ({ name, props, onBlur }) => {
  let containerStyle={
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "10px",
    border: "1px solid lightgray",
    padding: "5px",
    paddingLeft: "10px"
  }
  let titleStyle={
    color: "darkgray",
    marginTop: "5px",
    marginBottom: "5px"
  }
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{name}</div>
      {props.map((prop)=>{
        if(["top","left","width","height"].includes(prop[0])){
          return <OnBlurUpdateInput key={prop[0]} name={prop[0]} type={"number"} value={prop[1]} onBlur={onBlur}/>
        }
        else{
          return <OnBlurUpdateInput key={prop[0]} name={prop[0]} type={"string"} value={prop[1]} onBlur={onBlur}/>
        }
      })}
    </div>
  )
}

class EditArea extends Component {
  render () {
    let defaultProps={"top":0,"left":0,"width":0,"height":0,"background":"gray","border":"none"}
    let layoutProps=[]
    let styleProps=[]
    let boxId=0
    if(this.props.selectedBoxIds.size===1){
      boxId=this.props.selectedBoxIds.get(0)
      let boxInfo=Object.assign({},defaultProps,this.props.boxList.get(boxId).toJS())
      Object.keys(boxInfo).forEach((key)=>{
        if(["top","left","width","height"].includes(key)) layoutProps.push([key, boxInfo[key]])
        else if(["background","border"].includes(key)) styleProps.push([key, boxInfo[key]])
      })
    }

    return (
      <div id='EditArea' className='source-area area'>
        <PropBoxContainer name="LAYOUT" props={layoutProps} onBlur={(name,value)=>this.props.onBlur(boxId,name,parseInt(value,10))}/>
        <PropBoxContainer name="STYLE" props={styleProps} onBlur={(name,value)=>this.props.onBlur(boxId,name,value)}/>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    selectedBoxIds: state.boxReducer.get('selectedBoxIds'),
    boxList: state.boxReducer.getIn(['boxData','boxList'])
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onBlur: (boxId, propName, propValue) => dispatch(changeProp(boxId, propName, propValue))
  }
}

EditArea = connect(mapStateToProps,mapDispatchToProps)(EditArea)

export default EditArea
