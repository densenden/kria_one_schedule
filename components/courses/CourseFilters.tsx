'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface CourseFiltersProps {
  onFilterChange: (filters: {
    search: string
    type: string
    priceRange: [number, number]
    instructor: string
  }) => void
}

const courseTypes = [
  { value: '', label: 'All Types' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'functional_training', label: 'Functional Training' },
  { value: 'animal_movement', label: 'Animal Movement' },
  { value: 'conditioning', label: 'Conditioning' },
  { value: 'fitness', label: 'Fitness' }
]

export function CourseFilters({ onFilterChange }: CourseFiltersProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [instructor, setInstructor] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = () => {
    onFilterChange({
      search,
      type,
      priceRange,
      instructor
    })
  }

  const clearFilters = () => {
    setSearch('')
    setType('')
    setPriceRange([0, 100])
    setInstructor('')
    onFilterChange({
      search: '',
      type: '',
      priceRange: [0, 100],
      instructor: ''
    })
  }

  const hasActiveFilters = search || type || priceRange[0] > 0 || priceRange[1] < 100 || instructor

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setTimeout(handleFilterChange, 300)
            }}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-500"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value)
                  setTimeout(handleFilterChange, 100)
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                {courseTypes.map((courseType) => (
                  <option key={courseType.value} value={courseType.value}>
                    {courseType.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (€{priceRange[0]} - €{priceRange[1]})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newRange: [number, number] = [parseInt(e.target.value), priceRange[1]]
                    setPriceRange(newRange)
                    setTimeout(handleFilterChange, 100)
                  }}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newRange: [number, number] = [priceRange[0], parseInt(e.target.value)]
                    setPriceRange(newRange)
                    setTimeout(handleFilterChange, 100)
                  }}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor
              </label>
              <Input
                type="text"
                placeholder="Search instructor..."
                value={instructor}
                onChange={(e) => {
                  setInstructor(e.target.value)
                  setTimeout(handleFilterChange, 300)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}