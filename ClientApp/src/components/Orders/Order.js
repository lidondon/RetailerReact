import React, { Component } from 'react';
import { Table } from 'antd';

import './Orders.css';

const COLUMNS = [
    {
        title: "名稱",
        dataIndex: "liquorName",
        width: "30%"
    },
    {
        title: "容量",
        dataIndex: "liquorCapacity",
        width: "20%"
    },
    {
        title: "包裝",
        dataIndex: "liquorBottling",
        width: "20%"
    },
    {
        title: "金額",
        dataIndex: "price",
        width: "15%"
    },
    {
        title: "數量",
        dataIndex: "quantity",
        width: "15%"
    }
];

class Order extends Component {

    render() {
        const { items, onChange } = this.props;

        return (
            <Table showHeader={false} columns={COLUMNS} className="orderList"
                    dataSource={items} rowKey="id" pagination={false}/> 
        );
    }
}

export default Order;