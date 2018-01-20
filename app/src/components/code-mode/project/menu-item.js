import React, { Component } from 'react';
import './style.scss';

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  loadProject (id) {

  }

  edit () {
    console.log('edit');
  }

  delete () {
    console.log('delete');
  }

  render() {
    let item = this.props.projectData;
    return (
        <li key={item.name} onTouchStart={this.loadProject.bind(this, item.id)} className="menu-item">
          <div className="name">
            {this.props.projectData.name}
          </div>
          <div className="opt">
            <i className="fa fa-edit icon-edit" onTouchStart={this.edit.bind(this, item.id)}></i>
            <i className="fa fa-trash-o icon-delete" onTouchStart={this.delete.bind(this, item.id)}></i>
          </div>
        </li>
    );
  }
}

export default MenuItem;
