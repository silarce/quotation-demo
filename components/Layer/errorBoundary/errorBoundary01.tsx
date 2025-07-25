import React, { ErrorInfo } from 'react';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

interface State {
  hasError: boolean;
  componentStack: string;
}

interface Props {
  children: React.ReactNode;
  pathname?: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      componentStack: '',
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      componentStack: errorInfo.componentStack ?? '',
    });
  }

  componentWillUnmount() {
    this.setState({
      hasError: false,
      componentStack: '',
    });
  }

  componentDidUpdate(prevProps: Props) {
    // 檢查 pathname 是否改變
    if (prevProps.pathname !== this.props.pathname) {
      this.setState({
        hasError: false,
        componentStack: '',
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5">
          <h2>程式發生非預期錯誤</h2>
          {/* <SquareBtn>發送錯誤紀錄</SquareBtn> */}
          <br />
          <br />
          <br />
          <span className="whitespace-pre">{this.state.componentStack}</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
