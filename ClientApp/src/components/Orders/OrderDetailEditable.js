import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';

import './Orders.css';
import OrderEditable from './OrderEditable';
import Menu from '../Shared/Menu/Menu';
import { datetimeString2DateString } from '../../utilities/util';

const NOT_COMPLETED_ORDER = "尚未填妥必填欄位！";

class OrderDetailEditable extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         selectedRowKeys: []
    //     }
    // }

    onSave = () => {
        this.updateOrder(false);
    }

    onSend = () => {
        this.updateOrder(true);
    }

    updateOrder = isSubmit => {
        const { changes, errorRowSet } = this.props.searchOrdersR;
        const { updateOrder } = this.props.searchOrdersActions;
        const { id } = this.props.row;

        if (errorRowSet.size === 0) {
            if (changes.itemsToUpdate) {
                let intId = parseInt(id);

                changes.itemsToUpdate.map(i => i.orderId = intId);
            }
            updateOrder(id, changes, isSubmit);
        } else {
            Modal.warning({
                title: NOT_COMPLETED_ORDER
            });
        }
    }

    getOrderSpan = () => {
        return this.props.isShowMenu ? 10 : 24;
    }

    render() {
        const { row, menuR, menuActions, searchOrdersR, searchOrdersActions
            , selectedRowKeys, onSelectedChange, onBatchDelete, isShowMenu, showMenu } = this.props;
        const { orderItems, menuId } = searchOrdersR;
        const { addItems, saveItem } = searchOrdersActions;

        return (
            <div>
                <Row align="bottom" justify="center">
                    <Col span={21}>
                        <span className="title">{row.merchantName}</span>
                        <span className="date">{datetimeString2DateString(row.createDateTime)}</span>
                    </Col>
                    {
                        !isShowMenu &&
                        <Col span={3}>
                            <a href="javascript: void(0)" onClick={showMenu} >
                                <i className="fas fa-edit icon-edit"></i>
                            </a>
                        </Col>
                    }
                </Row>
                <Row>
                    <Col span={this.getOrderSpan()}>
                        <OrderEditable items={orderItems} isShowPagination={false} onSaveItem={saveItem} 
                            onSave={this.onSave} selectedRowKeys={selectedRowKeys} 
                            onSend={this.onSend}
                            onSelectedChange={onSelectedChange} onBatchDelete={onBatchDelete} />
                    </Col>
                    {
                        isShowMenu && 
                        <Col span={14}>
                            <Menu id={menuId} menuR={menuR} menuActions={menuActions} orderItems={orderItems} onOk={addItems} />
                        </Col>
                    }
                </Row>
            </div>
        );
    }
}

export default OrderDetailEditable;