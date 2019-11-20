import React, { Component } from 'react';
import { Row, Col, Table } from 'antd';

import './Menu.css';

import Dropdown from '../../Shared/Dropdown';
import Loading from '../../Shared/Loading';


const PURCHASE_TEXT = "加入訂單";
const CATEGORY = "分類：";

const COLUMNS = [
    {
        title: "名稱",
        dataIndex: "liquorName",
        width: "20%"
    },
    {
        title: "容量",
        dataIndex: "liquorCapacity",
        width: "10%"
    },
    {
        title: "包裝",
        dataIndex: "liquorBottling",
        width: "15%"
    },
    {
        title: "金額",
        dataIndex: "price",
        width: "10%"
    },
    {
        title: "描述",
        dataIndex: "itemDesc",
        width: "45%"
    }
];

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasLoadCategories: new Set(),
            selectedRowKeys: {},
            selectedCategory: null
        };
    }

    componentWillMount() {
        this.clearAll();
        if (this.props.id && this.props.menuActions) this.props.menuActions.getMenuCategories(this.props.id);
    }

    componentWillUpdate(nextProps, nextState) {
        const categories = nextProps.menuR.categories;
        const { getMenuCategories } = this.props.menuActions;

        //categories
        if (this.props.id !== nextProps.id && nextProps.id) {
            this.clearAll();
            getMenuCategories(nextProps.id);
        }

        if (this.state.hasLoadCategories.size == 0 && categories.length > 0) {
            this.props.menuActions.getMenuItems(this.props.id, categories[0].id);
            this.setState({ 
                selectedCategory: categories[0].id,
                hasLoadCategories: this.state.hasLoadCategories.add(categories[0].id)
            });
        }
    }

    clearAll = () => {
        this.props.menuActions.clear();
        this.setState({
            hasLoadCategories: new Set(),
            selectedRowKeys: {},
            selectedCategory: null
        });
    }

    getCategoryItems = (categories) => {
        return categories.map(c => ({key: c.id, text: c.name}));
    }

    onCategorySelecte = e => {
        const { hasLoadCategories } = this.state;
        const { id } = this.props;
        let state = { selectedCategory: e.key };

        if (!hasLoadCategories.has(e.key)) {
            state.hasLoadCategories = hasLoadCategories.add(e.key);
            this.props.menuActions.getMenuItems(id, e.key);
        }
        this.setState(state);
    }

    onItemSelectedChange = keys => {
        let selectedRowKeys = { ...this.state.selectedRowKeys };
        let categoryId = this.state.selectedCategory;

        if (keys.length > 0) {
            selectedRowKeys[categoryId] = keys;
        } else {
            delete selectedRowKeys[categoryId];
        }
        this.setState({ selectedRowKeys });
    }

    getRowSelection = () => {
        const { selectedRowKeys, selectedCategory } = this.state;

        return { 
            selectedRowKeys: selectedRowKeys[selectedCategory], 
            onChange: this.onItemSelectedChange
        };
    }

    getSelectedItems = () => {
        const selectedRowKeys = { ...this.state.selectedRowKeys };
        const { items } = this.props.menuR;
        let result = [];

        for (let k in selectedRowKeys) {
            result.push(...items[k].filter(i => selectedRowKeys[k].includes(i.id)));
        }
        
        return result;
    }

    onOk = e => {
        //console.log("onOK", this.getSelectedItems());
        this.props.onOk(this.getSelectedItems());
        this.setState({ selectedRowKeys: {} });
    }
    
    render() {
        const { isLoading, categories, items } = this.props.menuR;
        const { selectedCategory } = this.state;
        const { id } = this.props;

        if (!id) return <div className="background-image"/>

        return (
            <div className="box">
                {isLoading && <Loading />}
                <Row>
                    {CATEGORY}<Dropdown selectedKey={selectedCategory} items={this.getCategoryItems(categories)} onSelect={this.onCategorySelecte} /> 
                </Row>
                <Row style={{marginTop: 10}}>
                    <Table bordered columns={COLUMNS} dataSource={items[selectedCategory]} 
                        rowKey="id" rowSelection={this.getRowSelection()} /> 
                </Row>
                <Row className="row-confirm">
                    <Col span={4} offset={20}>
                        <button type="button" className="btn btn-primary btn-confirm" onClick={this.onOk}>{PURCHASE_TEXT}</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Menu;