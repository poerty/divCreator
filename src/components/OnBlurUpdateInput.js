import React, { Component } from 'react';
import PropTypes from 'prop-types';

const numPrettier = value => parseFloat(parseFloat(value).toFixed());

class OnBlurUpdateInput extends Component {
  constructor(props) {
    super(props);
    if (this.props.type === 'string') {
      this.state = { inputValue: this.props.value };
    } else {
      this.state = { inputValue: numPrettier(this.props.value) };
    }
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
  }
  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.type === 'string') {
      this.setState({ inputValue: nextProps.value });
    } else {
      this.setState({ inputValue: numPrettier(nextProps.value) });
    }
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
        const newValue = numPrettier(e.target.value) + 1;
        this.props.onBlur(this.props.name, newValue);
        break;
      }
      case 39: {
        //right
        break;
      }
      case 40: {
        //down
        const newValue = numPrettier(e.target.value).toFixed() - 1;
        this.props.onBlur(this.props.name, newValue);
        break;
      }
      default: {
        break;
      }
    }
  }
  onChangeHandler(e) {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    const inputStyle = {
      width: '55px',
    };
    const labelStyle = {
      order: '-1',
    };
    const containerStyle = {
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

OnBlurUpdateInput.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['string', 'number']).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default OnBlurUpdateInput;
