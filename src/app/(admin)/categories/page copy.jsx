import { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_ADMIN, API_URL_SELLER } from '../../../context/constants'
import { useAuthContext } from '../../../context/useAuthContext'
import { toast } from 'react-toastify'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function Home() {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()


  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${API_URL_ADMIN}category/list-category`)
      .then((res) => {
        const options = res.data.data.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }))
        setCategories(options)
      })
      .catch((err) => {
        console.error('Failed to fetch categories', err)
      })
  }, [])

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCategory) {
      toast.error('Please select a category') // Show error toast
      return
    }

    try {
      const payload = {
        sellerId: user?._id,
        categoryId: selectedCategory.value,
      }

      const response = await axios.post(`${API_URL_SELLER}category/add-category`, payload)

      if (response.data.success) {
        toast.success('Category assigned successfully!') // Show success toast
      } else {
        toast.error('Failed to assign category') // Show error toast
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Something went wrong. Check console for details.') // Show error toast
    }
  }

  return (
    <>
      <PageMetaData title="Category" />

      <div className="card" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Select Category
              </label>
              <Select id="category" options={categories} value={selectedCategory} onChange={setSelectedCategory} placeholder="Choose a category..." />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
