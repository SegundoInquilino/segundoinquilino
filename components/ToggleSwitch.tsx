interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      className={`
        relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full 
        cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none 
        ${enabled ? 'bg-purple-600' : 'bg-gray-200'}
      `}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform 
          ring-0 transition ease-in-out duration-200
          ${enabled ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
} 