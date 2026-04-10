import { Component } from 'react'
import AppErrorPage from '../../features/system/pages/AppErrorPage.jsx'
import { reportError } from '../../lib/errors/reportError.js'

function areArraysEqual(left = [], right = []) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((value, index) => Object.is(value, right[index]))
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    reportError(error, 'render-boundary', errorInfo)

    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.state.hasError) {
      return
    }

    const prevResetKeys = Array.isArray(prevProps.resetKeys) ? prevProps.resetKeys : []
    const nextResetKeys = Array.isArray(this.props.resetKeys) ? this.props.resetKeys : []

    if (prevResetKeys.length === 0 && nextResetKeys.length === 0) {
      return
    }

    if (!areArraysEqual(prevResetKeys, nextResetKeys)) {
      this.resetBoundary()
    }
  }

  resetBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  renderFallback() {
    const { fallback } = this.props
    const { error } = this.state

    if (typeof fallback === 'function') {
      return fallback({
        error,
        reset: this.resetBoundary,
      })
    }

    if (fallback) {
      return fallback
    }

    return <AppErrorPage error={error} onRetry={this.resetBoundary} />
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback()
    }

    return this.props.children
  }
}

export default ErrorBoundary
