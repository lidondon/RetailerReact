import React, { Component } from 'react';
import { Radio } from 'antd';

import './Order.css';

const SELECT_CELLARER = "請選擇店家";

class Order extends Component {

    render() {
        const { items, onChange } = this.props;

        return (
            <Group className="selector" onChange={onChange}>
                {this.getItems(items)}
            </Group>
        );
    }
}

export default Order;