import React, { Component } from 'react';
import { Row, Col } from 'antd';

import './Orders.css';
import EditableTable from '../Shared/EditableTable';

const REMOVE_TEXT = "移除";
const SAVE_TEXT = "儲存";
const SEND_TEXT = "送出";

const COLUMNS = [
    {
        title: "名稱",
        dataIndex: "liquorName",
        width: "60%"
    },
    {
        title: "金額",
        dataIndex: "price",
        width: "20%"
    },
    {
        title: "數量",
        dataIndex: "quantity",
        width: "20%",
        editable: true
    }
];

class OrderEditable extends Component {

    onSelectedChange = selectedRowKeys => {
        const { cellarerId, onSelectedChange } = this.props;

        if (cellarerId) {
            onSelectedChange(cellarerId, selectedRowKeys);
        } else {
            onSelectedChange(selectedRowKeys);
        }
    }

    onSaveItem = (row, error) => {
        const { cellarerId, onSaveItem } = this.props;

        if (cellarerId) {
            onSaveItem(cellarerId, row, error);
        } else {
            onSaveItem(row, error);
        }
    }

    onRemove = e => {
        const { cellarerId, onBatchDelete, selectedRowKeys } = this.props;

        if (cellarerId) {
            onBatchDelete(cellarerId, selectedRowKeys);
        } else {
            onBatchDelete(selectedRowKeys);
        }
    }

    getRowKey = () => {
        return this.props.rowKey ? this.props.rowKey : "key";
    }

    saveOrder = () => {
        const { cellarerId, items, onSave } = this.props;

        onSave(cellarerId, items);
    }

    sendOrder = () => {
        const { cellarerId, items, onSend } = this.props;

        onSend(cellarerId, items);
    }

    render() {
        const { items, selectedRowKeys, isShowPagination } = this.props;

        return (
            <div className="box">
                <Row>
                    <EditableTable checkable={true} isShowPagination={isShowPagination}
                        columns={COLUMNS} data={items} rowKey={this.getRowKey()}
                        onSelectedChange={this.onSelectedChange}
                        onSave={this.onSaveItem}
                        selectedRowKeys={selectedRowKeys} />
                </Row>
                <Row className="row-operation">
                    {
                        (selectedRowKeys && selectedRowKeys.length > 0)
                        &&
                        <Col span={4} offset={12} >
                            <button type="button" className="btn btn-danger btn-confirm" onClick={this.onRemove} >{REMOVE_TEXT}</button>
                        </Col>
                    }
                    <Col span={4} offset={(selectedRowKeys && selectedRowKeys.length > 0) ? 0 : 16} >
                        <button type="button" className="btn btn-success btn-confirm" onClick={this.saveOrder} >{SAVE_TEXT}</button>
                    </Col>
                    <Col span={4}>
                        <button type="button" className="btn btn-primary btn-confirm" onClick={this.sendOrder} >{SEND_TEXT}</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default OrderEditable;