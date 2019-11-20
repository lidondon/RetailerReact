import React, { Component } from 'react';
import { Table, Tag, Modal } from 'antd';

import './Orders.css';
import OrderDetailEditable from './OrderDetailEditable';
import OrderDetail from './OrderDetail';

const PURCHASE_TEXT = "訂購";
const CATEGORY = "分類：";
const OK = "確定" ;
const CANCEL = "取消";
const NOT_SAVE_YET = "尚未儲存，確定要離開？";
const UPDATE_ORDER_SUCCESS = "更新訂單成功";
const SAVE = "SAVE";
const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const { confirm } = Modal;
const COLUMNS = [
    {
        title: "單號",
        dataIndex: "formNumber",
        width: "40%"
    },
    {
        title: "酒吧",
        dataIndex: "merchantName",
        width: "40%"
    },
    {
        title: "狀態",
        dataIndex: "orderStatus",
        width: "20%",
        render: (text, record) => <Tag color="green">{text}</Tag>
    }
];

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            row: {},
            showModal: false,
            selectedRowKeys: [],
            showModalMenu: false,
            isShowMenu: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.searchOrdersR.updateOrderStatus === LOADING && nextProps.searchOrdersR.updateOrderStatus === SUCCESS) {
            this.showUpdateOrderSuccess();
        }
    }

    showUpdateOrderSuccess = () => {
        Modal.success({
            title: UPDATE_ORDER_SUCCESS
        });
        this.setState({ showModal: false, isShowMenu: false });
    }

    onRowClick = record => {
        const { getOrderItems, getMenuInfo } = this.props.searchOrdersActions;

        this.setState({ row: record, showModal: true });
        getMenuInfo(parseInt(record.merchantId));
        getOrderItems(parseInt(record.id));
    }

    onRow = record => {
        return {
            onClick: e => this.onRowClick(record)
        };
    }

    onCancelModal = () => {
        if (this.props.isChanged) {
            this.confirmCacelModel();
        } else {
            this.reallyCancelModal();
        }
    }

    reallyCancelModal = () => {
        this.props.searchOrdersActions.clearOrderInfo();
        this.setState({ showModal: false, selectedRowKeys: [], isShowMenu: false });
    }

    confirmCacelModel = () => {
        confirm({
            title: NOT_SAVE_YET,
            okText: OK,
            okType: "danger",
            cancelText: CANCEL,
            onOk: this.reallyCancelModal
        });
    }

    isEditable = statusId => {
        return (statusId === "1") ? true : false;
    }

    onSelectedChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    }

    onBatchDelete = selectedRowKeys => {
        this.props.searchOrdersActions.batchDelete(selectedRowKeys);
        this.setState({ selectedRowKeys: [] });
    }

    showMenu = () => {
        this.setState({ isShowMenu: true });
    }

    getModalContent = () => {
        const { searchOrdersR, searchOrdersActions, menuR, menuActions } = this.props;
        const { row, selectedRowKeys, isShowMenu } = this.state;

        if (row.orderStatus === SAVE) {
            return (
                <OrderDetailEditable id={row.id} menuR={menuR} menuActions={menuActions} 
                    selectedRowKeys={selectedRowKeys} onSelectedChange={this.onSelectedChange}
                    searchOrdersR={searchOrdersR} searchOrdersActions={searchOrdersActions}
                    onBatchDelete={this.onBatchDelete} name={row.merchantName}
                    isShowMenu={isShowMenu} showMenu={this.showMenu} />
            );
        } else {
            return <OrderDetail items={searchOrdersR.orderItems} />
        }
    }

    getModalWidth = () => {
        return this.state.isShowMenu ? "80%" : "33%";
    }
    
    render() {
        const { orders, searchOrdersR, searchOrdersActions } = this.props;
        const { showModal } = this.state;

        return (
            <div>
                <Table showHeader={false} columns={COLUMNS} className="orderList"
                    dataSource={orders} rowKey="id" pagination={false} onRow={this.onRow} /> 
                <Modal width={this.getModalWidth()} visible={showModal} onCancel={this.onCancelModal} footer={null}>
                    {this.getModalContent()}
                </Modal>
            </div>
        );
    }
}

export default OrderList;