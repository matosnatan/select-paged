import { useEffect, useState } from 'react'
import Select from './components/select'

export type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_start=0&_limit=10')
      .then((response) => response.json())
      .then((json) => setTodos(json))
  }, [])

  return (
    <div className="w-[400px]">
      <Select data={todos} />
    </div>
  )
}

export default App
