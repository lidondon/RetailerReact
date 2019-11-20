import React, { Component } from 'react';
import { Row, Col, Modal } from 'antd';
import moment from 'moment';

import './Orders.css';
import Loading from '../Shared/Loading';
import StartEndDate from '../Shared/StartEndDate';
import FewCellarers from '../Shared/Cellarer/FewCellarers';
import OrderList from './OrderList';
import { isEmptyObject } from '../../utilities/util';

const DATE_STRING_FORMAT = "YYYY-MM-DD";
const RANGE = "起迄日期：";
const CELLARER = "酒商：";

class SearchOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateRange: [moment().subtract(1, "months"), moment().add(1, "days")]
        };
    }

    componentWillMount() {
        const { searchOrdersActions } = this.props;
        const { dateRange } = this.state;
        const startDate = dateRange[0].format(DATE_STRING_FORMAT);
        const endDate = dateRange[1].format(DATE_STRING_FORMAT);

        searchOrdersActions.getOrders(startDate, endDate);
        searchOrdersActions.getCellarers();
    }

    componentWillUpdate(nextProps, nextState) {
        const { searchOrdersActions } = this.props;
        

        if (this.state.dateRange != nextState.dateRange) {
            searchOrdersActions.getOrders();
        }

        
    }

    isChanged = () => {
        const { changes, errorRowSet } = this.props.searchOrdersR; 
        const { itemsToUpdate, itemsidToDelete } = changes;
        
        return (!isEmptyObject(changes) &&
            ((itemsToUpdate && itemsToUpdate.length > 0) || (itemsidToDelete && itemsidToDelete.size > 0))) ||
            errorRowSet.size > 0;
    }

    
    render() {
        const { searchOrdersR, searchOrdersActions, menuR, menuActions } = this.props;
        const { isLoading, cellarers, orders } = searchOrdersR;
        const { dateRange } = this.state;

        return (
            <div className="box">
                {isLoading && <Loading />}
                <Filter dateRange={dateRange} cellarers={cellarers} />
                <Row className="row-orders">
                    <Col span={16}>
                        <OrderList orders={orders} isChanged={this.isChanged()}
                            searchOrdersR={searchOrdersR} searchOrdersActions={searchOrdersActions}
                            menuR={menuR} menuActions={menuActions} />
                    </Col>
                </Row>
            </div>
        );
    }
}

const Filter = props => {
    const { cellarers, dateRange } = props;
    let items = cellarers ? cellarers.map(c => ({value: c.id, text: c.name})) : [];

    return (
        <div>
            <Row className="filter">
                <span>{RANGE}</span><StartEndDate startDate={dateRange[0]} endDate={dateRange[1]} />
            </Row>
            <Row className="filter">
                <span>{CELLARER}</span><FewCellarers items={items} />
            </Row>
        </div>
    );
}

export default SearchOrders;