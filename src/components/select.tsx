import { useEffect, useState, useRef } from 'react'
import Cookies from 'js-cookie'

export type Item = {
  id: number
  name: string
}

type SelectProps = {
  url: string
}

function Select({ url }: SelectProps) {
  const [todos, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const todosRef = useRef<HTMLDivElement>(null)
  const prevScrollY = useRef(0)

  const handleScroll = () => {
    if (todosRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = todosRef.current
      const isScrollingDown = scrollTop > prevScrollY.current
      prevScrollY.current = scrollTop

      if (isScrollingDown && scrollHeight - 300 < scrollTop + clientHeight) {
        setLoading(true)
      }
    }
  }

  const fetchData = async () => {
    try {
      const cookie = Cookies.get('AUTHENTICATED-USER')
      const user = cookie && JSON.parse(cookie)
      const response = await fetch(
        `${url}?offset=${start}&limit=10&sort=name`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json',
            'Organization-Unit-Id': user.organizationUnitId
          }
        }
      )
      const data = await response.json()
      const updatedItems = [...todos, ...data]
      setItems(updatedItems)
      setFilteredItems(updatedItems)
      setLoading(false)

      if (!data.length) {
        setFinished(true)
      }
    } catch {
      setLoading(false)
    }
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
    const filtered = todos.filter((todo) =>
      todo.name.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredItems(filtered)
  }

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item)
    window.parent.postMessage(
      { name: 'Select option', data: JSON.stringify({ ...item }) },
      '*'
    )
  }

  useEffect(() => {
    fetchData()
  }, [start])

  useEffect(() => {
    if (loading && !finished) {
      setStart((prevPage) => prevPage + 10)
    }
  }, [loading, finished])

  useEffect(() => {
    if (todosRef.current) {
      todosRef.current.addEventListener('scroll', handleScroll)
      return () => {
        todosRef.current?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [todosRef])

  return (
    <>
      <input
        placeholder="Buscar por item"
        className="flex h- w-full rounded-md border border-input px-2 py-4 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        value={searchTerm}
        onChange={handleSearch}
      />

      <div
        className="flex gap-2 flex-wrap items-start justify-end mt-4 max-h-[300px] overflow-y-auto"
        ref={todosRef}
      >
        {filteredItems.map((item) => (
          <div
            className={`p-2 ${
              selectedItem?.id === item.id ? 'bg-blue-600' : 'bg-blue-500'
            } text-white rounded-lg hover:cursor-pointer hover:bg-blue-600`}
            key={item.id}
            onClick={() => !selectedItem && handleSelectItem(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </>
  )
}

export default Select
