import React, { Component } from 'react';
import { Row, Col, Collapse, Icon, Modal } from 'antd';

import './NewOrders.css';
import Loading from '../Shared/Loading';
import FewCellarers from '../Shared/Cellarer/FewCellarers';
import Menu from '../Shared/Menu/Menu';
import OrderEditable from '../Orders/OrderEditable';
import { getObjKeysLength, compareArray } from '../../utilities/util';

const CELLARER = "酒商：";
const SAVE_ORDER_SUCCESS = "訂單儲存成功！";
const panelStyle = {
    background: '#eeeeee',
    borderRadius: 6,
    marginBottom: 16,
    border: 0
};

const { Panel } = Collapse;

const SAVE_ORDER_ERROR = name => `[${name}]尚未填妥必填欄位`;

class NewOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: {},
            openedPanel: []
        };
    }

    componentWillMount() {
        this.props.newOrdersActions.getCellarers();
    }

    componentWillUpdate(nextProps, nextState) {
        const { successCellarerName, cellarers } = nextProps.newOrdersR;
        const newOrderCellarerIds = this.getOrderCellarerIds(nextProps.newOrdersR.orders);
        
        if (!compareArray(this.state.openedPanel, newOrderCellarerIds)) {
            this.setState({ openedPanel: newOrderCellarerIds });
        }

        if (this.props.newOrdersR.cellarers != cellarers && cellarers.length > 0) {
            this.props.newOrdersActions.getMenuInfo(cellarers[0].id);
        }

        if (this.props.newOrdersR.successCellarerName != successCellarerName && successCellarerName) {
            Modal.success({ title: successCellarerName + SAVE_ORDER_SUCCESS });
        }
    }

    

    onCellarerSelected = e => {
        this.props.newOrdersActions.getMenuInfo(e.target.value);
    }

    onSelectedOrderItemsChange = (cellarerId, keys) => {
        let selectedRowKeys = { ...this.state.selectedRowKeys };

        if (keys.length > 0) {
            selectedRowKeys[cellarerId] = keys;
        } else {
            delete selectedRowKeys[cellarerId];
        }
        this.setState({ selectedRowKeys });
    }

    onSaveItem = (cellarerId, row, error) => {
        this.props.newOrdersActions.saveItem(cellarerId, row, error);
    }

    onBatchDelete = (cellarerId, selectedRowKeys) => {
        let allSelectedRowKeys = { ...this.state.selectedRowKeys };

        this.props.newOrdersActions.batchDelete(cellarerId, selectedRowKeys);
        delete allSelectedRowKeys[cellarerId];
        this.setState({ selectedRowKeys: allSelectedRowKeys });
    }

    getCellarerById = id => {
        return this.props.newOrdersR.cellarers.find(c => c.id === id);
    }

    onSave = (cellarerId, items) => {
        this.saveOrder(cellarerId, items, false);
    }

    onSend = (cellarerId, items) => {
        this.saveOrder(cellarerId, items, true);
    }

    saveOrder = (cellarerId, items, isSubmit) => {
        const { errorRowSet } = this.props.newOrdersR;

        if (!errorRowSet[cellarerId] || errorRowSet[cellarerId].size === 0) {
            this.props.newOrdersActions.saveOrder(cellarerId, items, isSubmit);
        } else {
            let cellarer = this.getCellarerById(cellarerId);

            this.showSaveOrderErrorWarning(cellarer.name);
        }
    }

    showSaveOrderErrorWarning = name => {
        Modal.warning({
            title: SAVE_ORDER_ERROR(name)
        });
    }

    getPanels = () => {
        const { cellarers, orders } = this.props.newOrdersR;
        const { selectedRowKeys } = this.state;
        let result = [];

        for (let k in orders) {
            let cellarer = cellarers.find(c => c.id === k);

            if (cellarer) result.push(
                <Panel header={cellarer.name} key={cellarer.id} style={panelStyle} >
                    <OrderEditable cellarerId={cellarer.id} items={orders[k]} selectedRowKeys={selectedRowKeys[k]}
                        isShowPagination={false} onSaveItem={this.onSaveItem} rowKey="liquorId"
                        onSelectedChange={this.onSelectedOrderItemsChange}
                        onBatchDelete={this.onBatchDelete}
                        onSave={this.onSave} onSend={this.onSend}/>
                </Panel>
            );
        }

        return result;
    }

    getOrderCellarerIds = orders => {
        let result = [];
         
        for (let k in orders) result.push(k);

        return result;
    }

    render() {
        const { menuR, menuActions, newOrdersR, newOrdersActions } = this.props;
        const { isLoading, cellarers, currentCellarer } = newOrdersR;
        const { addItems } = newOrdersActions;
        const { openedPanel } = this.state; //don't know why Collapse's defaultActiveKey doesn't work
        
        return (
            <div>
                {isLoading && <Loading />}
                <span>{CELLARER}</span><Cellarers className="cellarers" cellarers={cellarers} onChange={this.onCellarerSelected}/>
                <Row className="menu-order">
                    <Col span={14}>
                        <Menu id={currentCellarer.menuId} menuR={menuR} menuActions={menuActions} onOk={addItems} />
                    </Col>
                    <Col span={9} className="col-orders">
                        <Collapse
                            className="order-collapse"
                            bordered={false}
                            defaultActiveKey={openedPanel}
                            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />} >
                            {this.getPanels()}
                        </Collapse>
                    </Col>
                </Row>
            </div>
        );
    }
}

const Cellarers = props => {
    const { cellarers, onChange } = props;
    let items = cellarers.map(c => ({value: c.id, text: c.name}));
    
    return (items.length > 5) ? "coming soon" : <FewCellarers items={items} onChange={onChange} hasDefault={true} />
}

export default NewOrders;