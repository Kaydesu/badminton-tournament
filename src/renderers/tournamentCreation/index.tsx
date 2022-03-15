import React from 'react';
import ReactDOM from 'react-dom';
import View from './view';
import "../index.css";
import 'antd/dist/antd.css';
import ToastProvider from '@components/Toast';

ReactDOM.render(
    <ToastProvider>
        <View />
    </ToastProvider>
    ,
    document.getElementById('root')
)