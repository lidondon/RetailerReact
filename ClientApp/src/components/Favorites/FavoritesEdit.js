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
        const { getLiquorCategories, getFavorites } = this.props.favoritesActions;

        getLiquorCategories();
        getFavorites();
    }

    componentWillUpdate(nextProps, nextState) {
        const { categories, refreshCategory } = nextProps.favoritesR;
        const { getFavorites } = nextProps.favoritesActions;

        if (this.state.hasLoadCategories.size == 0 && categories.length > 0) {
            this.props.favoritesActions.getLiquors(categories[0].id);
            this.setState({ 
                hasLoadCategories: this.state.hasLoadCategories.add(categories[0].id)
            });
        }

        if (this.props.favoritesR.refreshCategory !== refreshCategory && refreshCategory) getFavorites();
    }

    onCategorySelect = key => {
        const { hasLoadCategories } = this.state;

        if (!hasLoadCategories.has(key)) {
            this.props.favoritesActions.getLiquors(key);
            this.setState({ hasLoadCategories: hasLoadCategories.add(key) });
        }
    }

    getOnCheckedChange = record => {
        const { isLoading } = this.props.favoritesR;
        const { addFavorite, removeFavorite } = this.props.favoritesActions;

        return checked => {
            if (!isLoading) {
                if (checked) {
                    addFavorite(record);
                } else {
                    removeFavorite(record);
                }
            }
        }
    }

    getColumns = () => {
        return COLUMNS.map(c => {
            return !c.favoriteCheck ? c : {
                render: (text, record, index) => <HeartCheckbox key={index} onChange={this.getOnCheckedChange(record)}
                    isChecked={!!record.favoriteId} />
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