import React, { Component } from 'react';
import { Row, Col } from 'antd';

import './OrderEditable.css';
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
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         items: [],
    //         selectedRowKeys: []
    //     }
    // }

    // onItemSelectedChange = keys => {
    //     let selectedRowKeys = { ...this.state.selectedRowKeys };
    //     let categoryId = this.state.selectedCategory;

    //     if (keys.length > 0) {
    //         selectedRowKeys[categoryId] = keys;
    //     } else {
    //         delete selectedRowKeys[categoryId];
    //     }
    //     this.setState({ selectedRowKeys });
    // }

    // getRowSelection = () => {
    //     const { selectedRowKeys, selectedCategory } = this.state;

    //     return { 
    //         selectedRowKeys: selectedRowKeys[selectedCategory], 
    //         onChange: this.onItemSelectedChange
    //     };
    // }

    onSelectedChange = selectedRowKeys => {
        this.props.onSelectedChange(this.props.cellarerId, selectedRowKeys);
    }

    onSaveItem = (row, error) => {
        const { cellarerId, onSaveItem } = this.props;

        onSaveItem(cellarerId, row, error);
    }

    onRemove = e => {
        const { cellarerId, onBatchDelete, selectedRowKeys } = this.props;

        onBatchDelete(cellarerId, selectedRowKeys);
    }

    onSave = e => {
        const { cellarerId, onSave } = this.props;

        onSave(cellarerId);
    }

    render() {
        const { items, selectedRowKeys, isShowPagination, onSave } = this.props;

        return (
            <div className="box">
                <Row>
                    <EditableTable checkable={true} isShowPagination={isShowPagination}
                        columns={COLUMNS} data={items} rowKey="liquorId"
                        onSelectedChange={this.onSelectedChange}
                        onSave={this.onSaveItem}
                        selectedRowKeys={selectedRowKeys} />
                </Row>
                <Row className="row-operation">
                    {
                        (selectedRowKeys && selectedRowKeys.length > 0)
                        &&
                        <Col span={4} offset={16} >
                            <button type="button" className="btn btn-danger btn-confirm" onClick={this.onRemove} >{REMOVE_TEXT}</button>
                        </Col>
                    }
                    <Col span={4} offset={(selectedRowKeys && selectedRowKeys.length > 0) ? 0 : 20} >
                        <button type="button" className="btn btn-success btn-confirm" onClick={this.onSave} >{SAVE_TEXT}</button>
                    </Col>
                    {/* <Col span={4}>
                        <button type="button" className="btn btn-primary btn-confirm" >{SEND_TEXT}</button>
                    </Col> */}
                </Row>
            </div>
        );
    }
}

export default OrderEditable;