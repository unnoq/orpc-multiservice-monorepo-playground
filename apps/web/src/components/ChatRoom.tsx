import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { chatServiceOrpc } from '../lib/service-chat'
import { ErrorMessage } from './ui/ErrorMessage'
import { InterfaceWindow } from './ui/InterfaceWindow'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { WarningMessage } from './ui/WarningMessage'

const DEFAULT_ROOM = 'default'

export function ChatRoom() {
  const [inputValue, setInputValue] = useState('')

  const messagesQuery = useQuery(
    chatServiceOrpc.room.subscribe.experimental_streamedOptions({
      input: { room: DEFAULT_ROOM },
      queryFnOptions: { maxChunks: 10 },
    }),
  )

  const sendMessageMutation = useMutation(
    chatServiceOrpc.room.publish.mutationOptions({
      onError(error) {
        console.error('Failed to send message:', error)
        // eslint-disable-next-line no-alert
        alert(`Failed to send message: ${error.message}`)
      },
    }),
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!inputValue.trim())
      return

    await sendMessageMutation.mutateAsync({
      room: DEFAULT_ROOM,
      message: inputValue,
    })

    setInputValue('')
  }

  return (
    <InterfaceWindow
      tabs={[
        { label: 'CHAT ROOM', isActive: true },
        { label: `#${DEFAULT_ROOM}` },
      ]}
      contentPadding={0}
    >
      <WarningMessage className="mb-20" style={{ margin: '20px', borderRadius: 0 }}>
        💬 Open multiple tabs to chat together in real-time
      </WarningMessage>

      <div className="chat-container">
        {messagesQuery.status === 'pending' && (
          <LoadingSpinner text="Joining chat..." minHeight="300px" />
        )}

        {messagesQuery.status === 'error' && (
          <div style={{ padding: '20px' }}>
            <ErrorMessage
              title="Connection Failed"
              message={String(messagesQuery.error)}
            />
          </div>
        )}

        {messagesQuery.status === 'success' && (
          <MessageList messages={messagesQuery.data} />
        )}

        <ChatForm
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={sendMessageMutation.isPending}
          isSubmitting={sendMessageMutation.isPending}
        />
      </div>
    </InterfaceWindow>
  )
}

function MessageList({ messages }: { messages: Array<{ message: string }> }) {
  return (
    <ul className="chat-messages">
      {messages.length === 0 && (
        <li
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999',
            fontStyle: 'italic',
          }}
        >
          No messages yet. Be the first to say hi!
        </li>
      )}
      {messages.map(({ message }, index) => (
        <li key={index} className="chat-message">
          {message}
        </li>
      ))}
    </ul>
  )
}

interface ChatFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled: boolean
  isSubmitting: boolean
}

function ChatForm({ value, onChange, onSubmit, disabled, isSubmitting }: ChatFormProps) {
  return (
    <form onSubmit={onSubmit} className="chat-form">
      <input
        name="message"
        type="text"
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your message..."
        className="chat-input"
        disabled={disabled}
      />
      <button type="submit" className="chat-submit" disabled={disabled}>
        {isSubmitting ? 'Sending...' : 'Send →'}
      </button>
    </form>
  )
}
