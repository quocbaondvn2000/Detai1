import React from 'react';
import { Layout, Breadcrumb  } from 'antd';
import ContentTodo from './content.todo';
import './style.todo.css';

const { Header, Content, Footer } = Layout;

const Todo = () => {
    return (
        <Layout className="layout">
            <Header className="header-app">
                <h1>Đồ án tốt nghiệp - Ứng dụng tạo một App TodoList</h1>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>Todo List</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <ContentTodo />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Họ và tên: ..........- Lớp: ........</Footer>
        </Layout>
    );
};

export default Todo;