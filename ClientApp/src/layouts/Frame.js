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

    getOrderSuBmenu = () => {
        return (
            <SubMenu
                title={
                    <span className="submenu-title-wrapper">
                        <i className="fab fa-wpforms icon" />
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
        );
    }

    render () {
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
                                {this.getOrderSuBmenu()}
                                <Item key="mail">
                                    <a href="/#/favorites">偏好品項</a>
                                </Item>
                            </Menu>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Frame;