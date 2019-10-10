import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';

//import './Order.css';
import OrderEditable from './OrderEditable';
import Menu from '../Shared/Menu/Menu';

const NOT_COMPLETED_ORDER = "尚未填妥必填欄位！";

class OrderDetailEditable extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         selectedRowKeys: []
    //     }
    // }

    

    updateOrder = () => {
        const { changes, errorRowSet } = this.props.searchOrdersR;
        const { updateOrder } = this.props.searchOrdersActions;
        const { id } = this.props;

        if (errorRowSet.size === 0) {
            updateOrder(id, changes);
        } else {
            Modal.warning({
                title: NOT_COMPLETED_ORDER
            });
        }
    }

    render() {
        const { id, menuR, menuActions, searchOrdersR, searchOrdersActions
            , selectedRowKeys, onSelectedChange, onBatchDelete } = this.props;
        const { orderItems, menuId } = searchOrdersR;
        const { addItems, saveItem } = searchOrdersActions;

        return (
            <Row>
                <Col span={10}>
                    <OrderEditable items={orderItems} isShowPagination={false} onSaveItem={saveItem} 
                        onSave={this.updateOrder} selectedRowKeys={selectedRowKeys} 
                        onSelectedChange={onSelectedChange} onBatchDelete={onBatchDelete} />
                </Col>
                <Col span={14}>
                    <Menu id={menuId} menuR={menuR} menuActions={menuActions} onOk={addItems} />
                </Col>
            </Row>
        );
    }
}

export default OrderDetailEditable;