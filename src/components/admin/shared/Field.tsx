export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
      />
    </label>
  )
}
