import React, { Component } from 'react';
import { Row, Col } from 'antd';

import Order from './Order';

const SELECT_CELLARER = "請選擇店家";

class OrderDetail extends Component {

    render() {
        const { items } = this.props;

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

export default OrderDetail;