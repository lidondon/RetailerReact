import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Row, Col } from 'antd';

import './Orders.css';

const TOTAL = "總計";
const ACCEPT = "接單";
const CANCEL = "拒接";
const SALES = "銷貨單";

class Summary extends Component {

    processItems = () => {
        let result = { items: new Map(), sum: 0 }
        
        if (this.props.items) {
            const sortedItems = this.props.items.sort((a, b) => parseInt(a.categoryName) - parseInt(b.categoryName));
            //const sortedItems = this.props.items.sort((a, b) => parseInt(a.liquorBottling) - parseInt(b.liquorBottling));
            const processedItems = new Map();
            let sum = 0;

            sortedItems.forEach(item => {
                const key = item.categoryName;

                item.amount = item.price * item.quantity;
                if (processedItems.has(key)) {
                    processedItems.get(key).push(item);
                } else {
                    processedItems.set(key, [ item ]);
                }
                sum += item.amount;
            });
            result = { items: processedItems, sum };
        }

        return result;
    }

    getAggregatedItems = items => {
        let result = [];

        items.forEach((value, key) => result.push(<CategoryItems key={key} categoryName={key} items={value} />));

        return result;
    }

    onClickSales = () => {
        this.props.history.push({
            pathname: `/sales/${this.props.id}`, 
            state: { items: this.props.items }
        });
    }


    render() {
        const itemsInfo = this.processItems(this.props.items);
        const { status } = this.props;
        
        return (
            <div>
                {this.getAggregatedItems(itemsInfo.items)}
                <hr size="20"/>
                <Row>
                    <Col offset={2} span={14} className="item-name">{TOTAL}</Col>
                    <Col span={8} className="item-amount"><i className="fas fa-dollar-sign"></i>{itemsInfo.sum}</Col>
                </Row>
                <Operation status={status} />
            </div>
        );
    }
}

const CategoryItems = props => {
    const { categoryName, items } = props;
    
    return (
        <div>
            <Row>
                <Col className="category">{categoryName}</Col>
            </Row>
            {
                items.map(item => (
                    <Row key={item.id}>
                        <Col offset={2} span={14} className="item-name">{item.liquorName}</Col>
                        <Col span={8} className="item-amount"><i className="fas fa-dollar-sign"></i>{item.amount}</Col>
                    </Row>
                ))
            }
        </div>
    );
}

const Operation = props => {
    const { accept, reject, status, onClickSales } = props;

    return (
        <Row>
        </Row>
    );
}

export default withRouter(Summary);