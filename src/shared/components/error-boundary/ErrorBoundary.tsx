/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment } from "react";

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };

    // This binding is necessary to make `this` work in the callback
    this.handleReload = this.handleReload.bind(this);
  }

  handleReload() {
    window.location.reload();
  }

  // Catch errors in any components below and re-render with error message
  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <Fragment>
          <div className="uk-section uk-section-small">
            <div className="uk-container uk-container-xlarge">
              <div className="error-boundary uk-alert-danger" data-uk-alert>
                <a className="uk-alert-close" data-uk-close></a>
                <p className="title">Something went wrong.</p>
                <button className="btn-text" onClick={this.handleReload}>
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    // Normally, just render children
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default ErrorBoundary;
