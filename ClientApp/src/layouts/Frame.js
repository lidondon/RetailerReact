import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Row, Col } from 'antd';

import Logo from '../static_files/logo.png';
import './Frame.css';

const { SubMenu, Item } = Menu;

class Frame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: "createOrder"
        };
    }

    onClick = e => {
        this.setState({ current: e.key });
    };

    render () {
        // return (
        //     <nav className="navbar navbar-expand-sm navbar-toggleable-sm half-transparent ">
        //         <div className="container">
        //             <Link className="navbar-brand" to="/">
        //                 <img src={Logo} style={{width: 120, height: 50}} alt="liquorder" />
        //             </Link>
        //             <div className="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
        //                 <ul className="navbar-nav flex-grow-1">
        //                     <li className="nav-item">
        //                         <Link className="nav-link text-dark" to="/orders/new">建立訂單</Link>
        //                     </li>
        //                 </ul>
        //             </div>
        //         </div>
        //     </nav>
        // );

        return (
            <div className="half-transparent">
                <div className="container">
                    <Row>
                        <Col span={3}>
                            <Link  to="/">
                                <img src={Logo} style={{height: 50}} alt="liquorder" />
                            </Link>
                        </Col>
                        <Col span={21}>
                            <Menu className="menu" theme="dark" onClick={this.onClick} selectedKeys={[this.state.current]} mode="horizontal">
                                <SubMenu
                                    title={
                                        <span className="submenu-title-wrapper">
                                            <i class="fab fa-wpforms icon" />
                                            訂單
                                        </span>
                                    }>
                                    <Item key="creatOrder">
                                        <a href="/#/orders/new">建立訂單</a>
                                    </Item>
                                    <Item key="mail">
                                        <a href="/#/orders">查詢訂單</a>
                                    </Item>
                                </SubMenu>
                            </Menu>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Frame;