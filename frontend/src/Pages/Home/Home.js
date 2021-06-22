import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import b32 from '../../lib/b32';

import 'react-toastify/dist/ReactToastify.css';

import '../../App.scss';
import NetworkContext from '../../contexts/NetworkContext';
import logoImage from '../../assets/rizon_symbol.svg';
import arrowImage from '../../assets/arrow.svg';
import successIcon from '../../assets/success_icon.svg';
import failIcon from '../../assets/fail_icon.svg';

const bech32Validate = (param) => {
  try {
    b32.decode(param);
  } catch (error) {
    return error.message;
  }
};

const sendSchema = Yup.object().shape({
  address: Yup.string().required('Required'),
});

const DENUMS_TO_TOKEN = {
  uatolo: 'Atolo',
};

const REQUEST_LIMIT_SECS = 30;

class HomeComponent extends React.Component {
  static contextType = NetworkContext;
  recaptchaRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      captcha: false,
      verified: false,
      response: '',
    };
  }
  
  handleCaptcha = (response) => {
    this.setState({
      response: response,
      captcha: true,
    });
  };

  enableButton = (value) => {
    this.setState({
      verified: value,
    });
  };

  validateAddress = (param) => {
    try {
      bech32Validate(param);
      if (typeof param === 'undefined' || param === null || param === '') {
        this.enableButton(false);
      } else {
        this.enableButton(true);
      }
    } catch (error) {
      return error.message;
    }
  };

  handleSubmit = (values, { resetForm }) => {
    //const network = this.context.network;
    //const item = networks.filter((n) => n.key === network)[0];
    // same shape as initial values
    this.setState({
      sending: true,
      captcha: false,
      verified: false,
    });

    this.recaptchaRef.current.reset();

    setTimeout(() => {
      this.setState({ sending: false });
    }, REQUEST_LIMIT_SECS * 1000);

    axios.post('http://3.37.20.108:5000/faucets', {
        address: values.address,
        captchaResponse: this.state.response,
      })
      .then((response) => {
        const { txHash } = response.data;
        toast.success(
          `Faucet Success`
        );

        resetForm();
      })
      .catch((err) => {
        let errText;

        if (typeof err.response == 'undefined' || err.response == null) {
          errText = 'Unknown status';
        } else {
          switch (err.response.status) {
            case 400:
              errText = 'Invalid request';
              break;
            case 403:
              errText = 'Too many requests';
              break;
            case 404:
              errText = 'Cannot connect to server';
              break;
            case 502:
            case 503:
              errText = 'Faucet service temporary unavailable';
              break;
            default:
              errText = err.response.data || err.message;
              break;
          }
        }
        errText = 'Faucet Fail';
        toast.error(`${errText}`);
      });
  };

  render() {
    return (
      <div className="contents">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          pauseOnHover
        />
        <section>
          <img className="contentsLogo" src={logoImage}/>
          <br/>
          <span className="contentsText2">Rizon Testnet Faucet</span>
          <div className="recaptcha" >
            <ReCAPTCHA
              ref={this.recaptchaRef}
              theme="dark"
              sitekey="6LfbIyQbAAAAADuQNUImrKD-cRY6GxiBfce4ncBt"
              onChange={this.handleCaptcha}
            />
          </div>
          <Formik
            initialValues={{
              address: '',
            }}
            validationSchema={sendSchema}
            onSubmit={this.handleSubmit}>
            {({ errors, touched }) => (
              <Form className="inputContainer">
                <div className="input">
                  <Field
                    name="address"
                    placeholder="RIZON Testnet address"
                    validate={this.validateAddress}/>
                  {errors.address && touched.address ? (
                    <div className="fieldError">{errors.address}</div>
                  ) : null}
                </div>

                <div className="buttonContainer">
                  <button
                    disabled={!this.state.verified || this.state.sending || !this.state.captcha }
                    type="submit">
                    {this.state.sending
                      ? <span>Waiting for next tap</span>
                      : <span>Send me tokens</span>}
                    {this.state.sending
                      ? null
                      : <img className="arrowImg" src={arrowImage}/>
                    }
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </div>
    );
  }
}

export default HomeComponent;
