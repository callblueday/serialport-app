import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import MenuItem from './menu-item';
import './style.scss';

const {
    closeMenu
} = require('../../../reducers/code');

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [
        {
          "name": "项目1",
          "id": 1
        },
        {
          "name": "项目2",
          "id": 2
        },
        {
          "name": "项目3",
          "id": 3
        },
        {
          "name": "项目4",
          "id": 4
        },
        {
          "name": "项目5",
          "id": 5
        },
        {
          "name": "项目6",
          "id": 6
        }
      ]
    };
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  close () {
    this.props.closeMenu();
  }

  loadProject () {

  }

  render() {
    let projectList = this.state.projectList;
    return (
      <ReactModal
         isOpen={this.props.menuVisible}
         contentLabel="onRequestClose Example"
         className="Modal"
         overlayClassName="Overlay"
      >
        <div className="dialogHeader">
            <span>项目列表</span>
            <div className="headerRight">
                <i className="fa fa-times icon-close" onTouchStart={this.close.bind(this)}></i>
            </div>
        </div>
        <ul className="project-list">
          {
            projectList.map((item, idx) => {
              if(item) {
                return <MenuItem projectData={item} key={item.id} />
              }
            })
          }
        </ul>
      </ReactModal>
    );
  }
}

const mapStateToProps = state => ({
  menuVisible: state.code.menuVisible
});


const mapDispatchToProps = (dispatch) => ({
  closeMenu: (e) => {
    e && e.preventDefault();
    dispatch(closeMenu())
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);

