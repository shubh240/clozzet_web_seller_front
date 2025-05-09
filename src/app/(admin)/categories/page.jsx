import { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_ADMIN, API_URL_SELLER } from '../../../context/constants'
import { useAuthContext } from '../../../context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function Home() {
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const didFetch = useRef(false)

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [sellerCategories, setSellerCategories] = useState([])

  const fetchCategories = async () => {
    try {
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
          showNotification({
            title: 'Error',
            message: 'Failed to fetch categories',
            variant: 'danger',
          })
        })
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch seller categories',
        variant: 'danger',
      })
    }
  }

  const fetchSellerCategories = async () => {
    try {
      const res = await axios.get(`${API_URL_SELLER}category/list-category?sellerId=${user?._id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      setSellerCategories(res.data.data)
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch seller categories',
        variant: 'danger',
      })
    }
  }

  // Fetch categories
  useEffect(() => {
    if (didFetch.current) return
    fetchCategories()
    fetchSellerCategories()

    didFetch.current = true
  }, [])

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCategory) {
      showNotification({
        // title: 'Validation',
        message: 'Please select a category',
        variant: 'warning',
      })
      return
    }

    try {
      const payload = {
        sellerId: user?._id,
        categoryId: selectedCategory.value,
      }

      const response = await axios.post(
        `${API_URL_SELLER}category/add-category`,
        payload,

        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )

      if (response.data.success) {
        showNotification({
          message: 'Category assigned successfully!',
          variant: 'success',
        })
      } else {
        showNotification({
          message: 'Failed to assign category',
          variant: 'danger',
        })
      }
    } catch (error) {
      console.error('Error adding category:', error?.response?.data?.message)
      showNotification({
        message: error?.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'danger',
      })
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
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
