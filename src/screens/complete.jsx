import { Button, Result } from 'antd';
import React from 'react';
import Navbar from '../components/navbar';

const Complete = () => {
    return (
        <div>
            <Navbar />
            <div className='col-md-12'>
                <div className="row">
                    <div className='col-md-12 d-flex justify-content-center'>
                        <Result
                            status="success"
                            title="Платеж успешно совершен!"
                            subTitle="Ваш баланс пополнен"
                            extra={[
                                <Button onClick={()=>{window.location.href = '/profile'}} type="primary" key="console">
                                    Вернуть в профиль
                                </Button>
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Complete; 