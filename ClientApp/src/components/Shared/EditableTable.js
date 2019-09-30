import React from 'react';
import { Table, Input, Icon, Popconfirm, Form, Tag, Row, Col } from 'antd';

import { isEmptyObject } from '../../utilities/util';
import './EditableTable.css'

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            change: {}
        };
    }

    processColumnsDelete(columns) {
        columns = columns.map(c => !(c.isImage) ? c : 
            {
                render: (text, record) => <img src="https://ibb.co/vDBbzCn" alt="image" crossOrigin="anonymous"/>
            }
        );

        if (this.props.canDelete) {
            columns.push({
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleSingleDelete(record.key)}>
                            <Icon type="delete" theme="twoTone" className="icon-delete" />
                        </Popconfirm>
                    ) : null
            });
        }

        return columns;
    }

    getColumns(columns) {
        let result = this.processColumnsDelete([...columns]);
        
        return result.map(col => {
            return (!col.editable) ? col :
                {
                    ...col,
                    onCell: record => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave: this.props.onSave
                    })
                };
        });
    }

    handleSingleDelete = key => {
        const dataSource = [...this.state.dataSource];

        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };

        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    onSelectedChange = selectedRowKeys => {
        this.props.onSelectedChange(selectedRowKeys);
    }

    render() {
        const { columns, data, selectedRowKeys, checkable, isShowPagination, rowKey } = this.props;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            }
        };
        const rowSelection = checkable ? { selectedRowKeys, onChange: this.onSelectedChange } : null;
        
        return (
            <div>
                <Table components={components} bordered pagination={isShowPagination}
                    rowSelection={rowSelection}
                    rowClassName={() => 'editable-row'}
                    dataSource={data}
                    rowKey={rowKey ? rowKey : "key"}
                    columns={this.getColumns(columns)} />
            </div>
        );
    }
}

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;

        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;

        this.form.validateFields((error, values) => {
            handleSave({ ...record, ...values }, error);
            if (error && error[e.currentTarget.id]) return;
            this.toggleEdit();
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record } = this.props;
        const { editing } = this.state;

        return (editing || !children[2]) ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: "required",
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input autoFocus={true} className="input" ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
            ) 
            : 
            (
                <div className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit} >
                    {children}
                </div>
            );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
            </td>
        );
    }
}



export default EditableTable;
          