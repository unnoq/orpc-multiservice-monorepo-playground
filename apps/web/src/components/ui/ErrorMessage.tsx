interface ErrorMessageProps {
  title?: string
  message: string
}

export function ErrorMessage({ title = 'Error', message }: ErrorMessageProps) {
  return (
    <div className="message message-error">
      {title && (
        <strong>
          {title}
          :
          {' '}
        </strong>
      )}
      {message}
    </div>
  )
}
