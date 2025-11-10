interface InfoMessageProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function InfoMessage({ children, className = '', style }: InfoMessageProps) {
  return (
    <div className={`message message-info ${className}`} style={style}>
      {children}
    </div>
  )
}
