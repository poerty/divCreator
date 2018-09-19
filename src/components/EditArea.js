import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changeProp } from './../actions'

class PropBox extends Component {
  constructor (props) {
    super(props)
    this.state={"inputValue":this.props.value}
    this.onChangeHandler=this.onChangeHandler.bind(this)
  }
  onChangeHandler (e) {
    this.setState({"inputValue":e.target.value})
  }
  componentWillReceiveProps (nextProps) {
    this.setState({"inputValue":nextProps.value})
  }
  render () {
    return (
      <div className="propBox">
        <input type="text" name={this.props.name} className="input" 
          value={this.state.inputValue}
          onChange={this.onChangeHandler} 
          onBlur={(e)=>this.props.onBlur(this.props.name,e.target.value)}></input>
        <label className="label" htmlFor={this.props.name}>{this.props.name}</label>
      </div>
    )
  }
}

const PropBoxContainer = ({ name, props, onBlur }) => {
  return (
    <div className="propBoxContainer">
      <div className="editBoxTitle">{name}</div>
      {props.map((prop)=>
      <PropBox key={prop[0]} name={prop[0]} value={prop[1]} onBlur={onBlur}/>
      )}
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
      let layout = Object.keys(boxInfo).forEach((key)=>{
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
