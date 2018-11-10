import React, { Component } from 'react';

class TabArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.props.tabNames[0]
    };
    this.tabClick = this.tabClick.bind(this);
  }

  tabClick(name) {
    this.setState({
      currentTab: name
    });
  }

  render() {
    let tabs = this.props.tabNames.map(name => {
      let className =
        this.props.tabClassName +
        (name === this.state.currentTab ? ' selected' : '');
      return (
        <div
          key={name}
          className={className}
          onClick={e => this.tabClick(name)}
        >
          {name}
        </div>
      );
    });
    let content = this.props.tabContents[
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

export default TabArea;
