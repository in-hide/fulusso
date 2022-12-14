import React, { Fragment } from 'react';
import { Form, Input, Button, Tooltip, Icon } from 'antd';
import BaseView from 'core/BaseView';
import model from 'core/Decorator';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ThirdPartyLoginView from 'components/ThirdPartyLoginView';
import SendSmsButton from 'components/SendSmsButton';
import SuccessNav from 'components/SuccessNav';
import ArrowRight from 'components/ArrowRight';
import validatePassWord from '../../utils/validate';
import encryptPassword from '../../utils/encrypt';
import './index.less';

@model('register')
class Register extends BaseView {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSendSms = this.onSendSms.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        const { form: { validateFields }, register } = this.props;
        if (register.loading) {
            return;
        }
        validateFields((errors, { phone, password, code }) => {
            if (!errors) {
                this.dispatch({
                    type: 'register',
                    payload: {
                        phone,
                        password: encryptPassword(password),
                        code,
                    },
                });
            }
        });
    }
    onSendSms({ ticket, randstr }) {
        const { form: { validateFields } } = this.props;
        return new Promise((resolve) => {
            validateFields(['phone'], (errors, { phone }) => {
                if (!errors) {
                    this.dispatch({
                        type: 'sendSmsCode',
                        payload: {
                            phone,
                            ticket,
                            randstr,
                            type: 1,
                        },
                    })
                    .then(resolve)
                    .catch(resolve);
                } else {
                    resolve(false);
                }
            });
        });
    }
    onNavLogin() {
        window.location.href = './login.html';
    }
    renderForm() {
        const { register, form } = this.props;
        const { loading } = register;
        const { getFieldDecorator } = form;
        return (
            <Fragment>
                <div className="form-header">??????</div>
                <div className="f-l l-area">
                    <Form onSubmit={this.onSubmit}>
                        <Form.Item>
                            {getFieldDecorator('phone', {
                                rules: [{
                                    required: true,
                                    message: '????????????????????????',
                                }, {
                                    pattern: /^1\d{10}$/,
                                    message: '?????????????????????',
                                }],
                            })(<Input placeholder="????????????????????????" />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('code', {
                                rules: [{
                                    required: true,
                                    message: '????????????????????????',
                                }, {
                                    pattern: /^\d{6}$/,
                                    message: '????????????6?????????',
                                }],
                            })(<Input placeholder="????????????????????????" className="inpt-code" />)}
                            <SendSmsButton
                                className="btn-send-code"
                                onSendSms={this.onSendSms}
                            >
                                ???????????????
                            </SendSmsButton>
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{
                                    validator: validatePassWord,
                                }],
                            })(<Input placeholder="???????????????" type="password" />)}
                            <Tooltip title="?????????6-20???????????????????????????????????????????????????">
                                <Icon
                                    type="question-circle"
                                    theme="filled"
                                    className="password-tips"
                                />
                            </Tooltip>
                        </Form.Item>
                        {/* <Form.Item className="register-rules-item">
                            {getFieldDecorator('isAgree')(
                                <Checkbox className="agree-rules">
                                    ?????????????????????
                                </Checkbox>
                            )}
                            <a className="link-rules">
                                ??????????????????????????????????????????
                            </a>
                        </Form.Item> */}
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                            style={{
                                marginTop: '25px',
                            }}
                            // disabled={!getFieldValue('isAgree')}
                            className="btn-form btn-register"
                            loading={loading}
                        >
                            ????????????
                        </Button>
                    </Form>
                </div>
                <div className="f-l or-area">
                    <span className="or">or</span>
                </div>
                <div className="f-l other-area">
                    <div className="help-link">
                        <p>????????????:</p>
                        <a href="./login.html">
                            <span>????????????</span>
                           <ArrowRight />
                        </a>
                    </div>
                    <ThirdPartyLoginView />
                </div>
            </Fragment>
        );
    }
    _render() {
        const { register } = this.props;
        const { registerSuccess } = register;
        return (
            <>
                <main className="main-box register">
                    <Header />
                    <div className="wrap-box">
                        <div className={`content-box ${ registerSuccess ? 'writing-mode-middle' : ''}`}>
                            {
                                registerSuccess ? <SuccessNav /> : this.renderForm()
                            }
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }
}

export default Form.create()(Register);