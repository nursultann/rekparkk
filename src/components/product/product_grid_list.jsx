import React from 'react';
import { List } from 'antd';
import ProductItem from './product_item';

const ProductGridList = ({ list }) => {
    return (
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 4,
                xxl: 3,
            }}
            dataSource={list}
            renderItem={item => (
                <List.Item><ProductItem product={item} /></List.Item>
            )}
        />);
};

export default ProductGridList;