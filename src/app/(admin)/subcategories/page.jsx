import { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_ADMIN, API_URL_SELLER } from '../../../context/constants'
import { useAuthContext } from '../../../context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import ComponentContainerCard from '@/components/ComponentContainerCard'
// import { Grid } from 'gridjs-react'
import { Grid, _ } from 'gridjs-react'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'

export default function Home() {
  
  const { categoryId, id } = useParams();

  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const didFetch = useRef(false)

  const [subcategories, setSubCategories] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)

  const [sellerSubCategories, setSellerCategories] = useState([])

  const fetchCategories = async () => {
    try {
      axios
        .get(`${API_URL_ADMIN}subCategory/list-sub-category?category=${categoryId}`)
        .then((res) => {
          const options = res.data.data.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }))
          setSubCategories(options)
        })
        .catch((err) => {
          console.error('Failed to fetch subcategories', err)
          showNotification({
            title: 'Error',
            message: 'Failed to fetch subcategories',
            variant: 'danger',
          })
        })
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch seller subcategories',
        variant: 'danger',
      })
    }
  }

  const fetchSellerCategories = async () => {
    try {
      const res = await axios.get(`${API_URL_SELLER}subCategory/list-subCategory?sellerId=${user?._id}&sellerCategoryId=${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      setSellerCategories(res.data.data)
    } catch (err) {
      showNotification({
        title: 'Error',
        message: 'Failed to fetch seller subcategories',
        variant: 'danger',
      })
    }
  }

  // Fetch subcategories
  useEffect(() => {
    if (didFetch.current) return
    fetchCategories()
    fetchSellerCategories()

    didFetch.current = true
  }, [])

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedSubCategory) {
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
        categoryId: categoryId,
        sellerCategoryId: id,
        subCategoryId: selectedSubCategory?.value,
      }

      const response = await axios.post(
        `${API_URL_SELLER}subCategory/add-subCategory`,
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

      fetchSellerCategories()

      setSelectedSubCategory(null)
    } catch (error) {
      console.error('Error adding category:', error?.response?.data?.message)
      showNotification({
        message: error?.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'danger',
      })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This sub category will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL_SELLER}subCategory/delete-subCategory/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })

        showNotification({
          message: 'The sub category has been deleted.',
          variant: 'success',
        })
        fetchSellerCategories()
      } catch (error) {
        showNotification({
          message: error?.response?.data?.message || 'Something went wrong.',
          variant: 'danger',
        })
      }
    }
  }

  return (
    <>
      <PageMetaData title="Sub Category" />
      <ComponentContainerCard id="category" title="Sub Category List">
        <div style={{ maxWidth: '400px' }} className='mt-2'>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Select Sub Category
            </label>
            <Select id="category" options={subcategories} value={selectedSubCategory} onChange={setSelectedSubCategory} placeholder="Choose a category..." />
          </div>

          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
        </div>
      </ComponentContainerCard>
      <ComponentContainerCard id="category" title="Sub Category List">
        {sellerSubCategories.length === 0 ? (
          <p className="text-muted">No subcategories assigned yet.</p>
        ) : (
          <Grid
            data={sellerSubCategories.map((item, index) => [index + 1, item?.subCategory?.name || 'N/A', item._id])}
            columns={[
              'No',
              'Sub Category',
              {
                name: 'Action',
                sort: false,
                formatter: (cell, row) => {// _id is the 3rd item in the row
                  const id = row.cells[2].data
                  return _(
                    <button className="rounded-pill btn btn-sm btn-outline-danger" onClick={() => handleDelete(id)}>
                      Delete
                    </button>,
                  )
                },
              },
            ]}
            search={true}
            pagination={{
              enabled: true,
              limit: 10,
            }}
            sort={true}
          />
        )}
      </ComponentContainerCard>
    </>
  )
}
