import { useState } from 'react'

type ItemProps = {
  id: number
  title: string
}

type SelectProps = {
  data: ItemProps[]
}

function Select({ data, ...props }: SelectProps) {
  const [selectedTodo, setSelectedTodo] = useState<ItemProps | null>(null)

  window.parent.postMessage({ name: 'Select option', data: selectedTodo }, '*')

  return (
    <>
      <input
        placeholder="Digite aqui"
        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {...props}
      />

      <div className="flex gap-2 flex-wrap justify-end mt-4">
        {data.map((item) => (
          <div
            className="p-2 bg-blue-500 text-white rounded-lg hover:cursor-pointer hover:bg-blue-600"
            key={item.id}
            onClick={() => setSelectedTodo(item)}
          >
            {item.title}
          </div>
        ))}
      </div>
    </>
  )
}

export default Select
