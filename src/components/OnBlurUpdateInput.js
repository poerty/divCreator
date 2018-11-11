import React, { Component, } from 'react';

class OnBlurUpdateInput extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: this.props.value, };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ inputValue: nextProps.value, });
  }
  onKeyDownHandler(e) {
    if (this.props.type === 'string') return;
    switch (e.keyCode) {
      case 37: {
        //left
        break;
      }
      case 38: {
        //up
        this.props.onBlur(this.props.name, parseInt(e.target.value, 10) + 1);
        break;
      }
      case 39: {
        //right
        break;
      }
      case 40: {
        //down
        this.props.onBlur(this.props.name, parseInt(e.target.value, 10) - 1);
        break;
      }
      default: {
        break;
      }
    }
  }
  onChangeHandler(e) {
    this.setState({ inputValue: e.target.value, });
  }

  render() {
    let inputStyle = {
      width: '55px',
    };
    let labelStyle = {
      order: '-1',
    };
    let containerStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    };
    return (
      <div style={containerStyle}>
        <input
          type='text'
          name={this.props.name}
          style={inputStyle}
          value={this.state.inputValue}
          onKeyDown={this.onKeyDownHandler}
          onChange={this.onChangeHandler}
          onBlur={e => this.props.onBlur(this.props.name, e.target.value)}
        />
        <label style={labelStyle} htmlFor={this.props.name}>
          {this.props.name}
        </label>
      </div>
    );
  }
}

export default OnBlurUpdateInput;
