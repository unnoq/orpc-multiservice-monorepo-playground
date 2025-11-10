interface WarningMessageProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function WarningMessage({ children, className = '', style }: WarningMessageProps) {
  return (
    <div className={`message message-warning ${className}`} style={style}>
      {children}
    </div>
  )
}
