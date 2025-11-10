interface Tab {
  label: string
  isActive?: boolean
}

interface InterfaceWindowProps {
  tabs: Tab[]
  children: React.ReactNode
  contentPadding?: number
}

export function InterfaceWindow({ tabs, children, contentPadding = 30 }: InterfaceWindowProps) {
  return (
    <div className="interface-window">
      <div className="interface-header">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`interface-tab ${tab.isActive ? 'active' : ''}`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="interface-content" style={{ padding: contentPadding }}>
        {children}
      </div>
    </div>
  )
}
