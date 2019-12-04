import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';
import moment from 'moment';

import './Orders.css';
import { isEmptyObject } from '../../utilities/util';
import Loading from '../Shared/Loading';
import StartEndDate from '../Shared/StartEndDate';
import FewCellarers, { UNLIMITED } from '../Shared/Cellarer/FewCellarers';
import OrderList from './OrderList';
import Statuses from '../Shared/OrderStatus/Statuses';

const DATE_STRING_FORMAT = "YYYY-MM-DD";
const RANGE = "起迄日期：";
const CELLARER = "酒商：";
const STATUSES = "狀態：";

class SearchOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRange: [moment().subtract(1, "months"), moment().add(1, "days")],
            currentCellarer: null,
            currentStatus: null,
            filteredOrders: null
        };
    }

    componentWillMount() {
        this.props.searchOrdersActions.getCellarers();
        this.getOrders();
    }

    componentWillUpdate(nextProps, nextState) {
        const { orders } = nextProps.searchOrdersR;
        let filteredOrders = orders;
        let filterChanged = false;

        if (this.state.dateRange != nextState.dateRange || nextProps.searchOrdersR.refreshOrders) {
            this.getOrders();
        }

        if ((this.state.currentCellarer !== nextState.currentCellarer)
            || (this.state.currentStatus !== nextState.currentStatus)) {
            filterChanged = true;
            // if (nextState.currentCellarer) filteredOrders = filteredOrders.filter(o => o.merchantId === nextState.currentCellarer);
            // if (nextState.currentStatus) filteredOrders = filteredOrders.filter(o => o.orderStatus === nextState.currentStatus);
            filteredOrders = filteredOrders.filter(o => { 
                let result = false;

                result = nextState.currentCellarer ? o.merchantId === nextState.currentCellarer : true;
                if (result) result = nextState.currentStatus ? o.orderStatus === nextState.currentStatus : true;

                return result;
            });
        }
        
        if (filterChanged || this.props.searchOrdersR.orders !== orders) this.setState({ filteredOrders });
    }

    getOrders = () => {
        const { searchOrdersActions } = this.props;
        const { dateRange } = this.state;
        const startDate = dateRange[0].format(DATE_STRING_FORMAT);
        const endDate = dateRange[1].format(DATE_STRING_FORMAT);

        searchOrdersActions.getOrders(startDate, endDate);
    }

    isChanged = () => {
        const { changes, errorRowSet } = this.props.searchOrdersR; 
        const { itemsToUpdate, itemsidToDelete } = changes;
        
        return (!isEmptyObject(changes) &&
            ((itemsToUpdate && itemsToUpdate.length > 0) || (itemsidToDelete && itemsidToDelete.size > 0))) ||
            errorRowSet.size > 0;
    }

    cellarerOnChange = e => {
        this.setState({ currentCellarer: (e.target.value === UNLIMITED) ? null : e.target.value });
    }

    statusOnChange = e => {
        this.setState({ currentStatus: (e.target.value === UNLIMITED) ? null : e.target.value });
    }
    
    render() {
        const { searchOrdersR, searchOrdersActions, menuR, menuActions } = this.props;
        const { isLoading, cellarers } = searchOrdersR;
        const { dateRange, filteredOrders } = this.state;

        return (
            <div className="box">
                {isLoading && <Loading />}
                <Filter dateRange={dateRange} cellarers={cellarers} 
                    cellarerOnChange={this.cellarerOnChange} statusOnChange={this.statusOnChange} />
                <Row className="row-orders">
                    <Col span={20}>
                        <OrderList orders={filteredOrders} isChanged={this.isChanged()}
                            searchOrdersR={searchOrdersR} searchOrdersActions={searchOrdersActions}
                            menuR={menuR} menuActions={menuActions} />
                    </Col>
                </Row>
            </div>
        );
    }
}

const Filter = props => {
    const { cellarers, dateRange, cellarerOnChange, statusOnChange } = props;
    let items = cellarers ? cellarers.map(c => ({value: c.id, text: c.name})) : [];

    return (
        <div>
            <Row className="filter">
                <span>{RANGE}</span><StartEndDate startDate={dateRange[0]} endDate={dateRange[1]} />
            </Row>
            <Row className="filter">
                <span>{CELLARER}</span><FewCellarers haveUnlimited={true} onChange={cellarerOnChange} items={items} />
            </Row>
            <Row className="filter">
                <span>{STATUSES}</span><Statuses onChange={statusOnChange} />
            </Row>
        </div>
    );
}

export default SearchOrders;