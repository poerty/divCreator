import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TabArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.props.tabNames[0],
    };
    this.tabClick = this.tabClick.bind(this);
  }

  tabClick(name) {
    this.setState({
      currentTab: name,
    });
  }

  render() {
    const tabs = this.props.tabNames.map(name => {
      const className =
        this.props.tabClassName +
        (name === this.state.currentTab ? ' selected' : '');
      return (
        <div
          key={name}
          className={className}
          onClick={() => this.tabClick(name)}
        >
          {name}
        </div>
      );
    });
    const content = this.props.tabContents[
      this.props.tabNames.indexOf(this.state.currentTab)
    ];

    return (
      <div>
        <div className={this.props.tabAreaClassName}>{tabs}</div>
        {content}
      </div>
    );
  }
}

TabArea.propTypes = {
  tabContents: PropTypes.arrayOf(PropTypes.element).isRequired,
  tabNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  tabAreaClassName: PropTypes.string.isRequired,
  tabClassName: PropTypes.string.isRequired,
};

export default TabArea;
