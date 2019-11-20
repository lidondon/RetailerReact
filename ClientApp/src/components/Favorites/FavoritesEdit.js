import React, { Component } from 'react';
import { Row, Table, Tabs } from 'antd';

import './FavoritesEdit.css';
import Loading from '../Shared/Loading';
import HeartCheckbox from '../Shared/HeartCheckbox';

const { TabPane } = Tabs;

const NONE = "無";
const WARNING = "請勾選常用品項加入我的最愛";

const COLUMNS = [
    {
        title: "名稱",
        dataIndex: "name",
        width: "40%"
    },
    {
        title: "容量",
        dataIndex: "capacity",
        width: "30%"
    },
    {
        title: "包裝",
        dataIndex: "bottling",
        width: "30%"
    },
    {
        favoriteCheck: true,
        dataIndex: "id"
    }
];

class FavoritesEdite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasLoadCategories: new Set()
        }
    }

    componentWillMount() {
        this.props.favoritesActions.getLiquorCategories();
    }

    componentWillUpdate(nextProps, nextState) {
        const categories = nextProps.favoritesR.categories;

        if (this.state.hasLoadCategories.size == 0 && categories.length > 0) {
            this.props.favoritesActions.getLiquors(categories[0].id);
            this.setState({ 
                hasLoadCategories: this.state.hasLoadCategories.add(categories[0].id)
            });
        }
    }

    onCategorySelect = key => {
        const { hasLoadCategories } = this.state;

        if (!hasLoadCategories.has(key)) {
            this.props.favoritesActions.getLiquors(key);
            this.setState({ hasLoadCategories: hasLoadCategories.add(key) });
        }
    }

    getOnCheckedChange = id => {
        return checked => {
            console.log(checked, id);
        }
    }

    getColumns = () => {
        return COLUMNS.map(c => {
            return !c.favoriteCheck ? c : {
                render: (text, record, index) => <HeartCheckbox key={index} onChange={this.getOnCheckedChange(record.id)} />
            };
        });
    }

    getTabPanes = (categories, liquors) => {
        let result = (
            <TabPane tab={NONE} key={-1}>
                <Table dataSource={[]} className="liquors-table" />
            </TabPane>
        );

        if (categories.length > 0) {
            result = categories.map(c => {
                return (
                    <TabPane tab={c.name} key={c.id}>
                        <Table bordered columns={this.getColumns()} dataSource={liquors[c.id]} 
                            rowKey="id" className="liquors-table" /> 
                    </TabPane>
                );
            });
        }

        return result;
    }
    
    render() {
        const { isLoading, categories, liquors } = this.props.favoritesR;

        return (
            <div>
                {isLoading && <Loading />}
                <Row className="remind">
                    <i className="fas fa-bell"/>{WARNING}
                </Row>
                <Row style={{marginTop: 10}}>
                    <Tabs type="card" onChange={this.onCategorySelect}>
                        {this.getTabPanes(categories, liquors)}
                    </Tabs>
                </Row>
            </div>
        );
    }
}

export default FavoritesEdite;