import React, { Component } from 'react';
import { Row, Col } from 'antd';

//import './Order.css';
import Order from './Order';

const SELECT_CELLARER = "請選擇店家";

class Order extends Component {

    render() {
        const { items, onChange } = this.props;

        return (
            <Row>
                <Col span={16}>
                    <Order items={items} />
                </Col>
                <Col span={8}>
                </Col>
            </Row>
        );
    }
}

export default Order;