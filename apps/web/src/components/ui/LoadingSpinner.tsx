interface LoadingSpinnerProps {
  text?: string
  minHeight?: string
}

export function LoadingSpinner({ text = 'Loading...', minHeight = '400px' }: LoadingSpinnerProps) {
  return (
    <div className="loading-container" style={{ minHeight }}>
      <div className="loading-spinner" />
      <p className="loading-text">{text}</p>
    </div>
  )
}
