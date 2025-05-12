import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_SELLER } from '../../../context/constants'
import { useAuthContext } from '../../../context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Grid, _ } from 'gridjs-react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'

export default function Home() {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const didFetch = useRef(false)

  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL_SELLER}products/list-product`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      setData(res?.data?.data?.products)
    } catch (err) {
      showNotification({
        message: 'Failed to fetch seller categories',
        variant: 'danger',
      })
    }
  }

  // Fetch categories
  useEffect(() => {
    if (didFetch.current) return
    fetchData()

    didFetch.current = true
  }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL_SELLER}category/delete-category/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        showNotification({
          message: 'The product has been deleted.',
          variant: 'success',
        })
        fetchData()
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
      <PageMetaData />

      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">Product List</h3>
            <Link className="btn btn-primary" to={'/products-add'}>
              Add Product
            </Link>
          </div>

          {data.length === 0 ? (
            <p className="text-muted">No data found.</p>
          ) : (
            <Grid
              data={data.map((item, index) => [index + 1, item?.category?.name || 'N/A', item._id])}
              columns={[
                'No',
                'Category',
                {
                  name: 'Action',
                  formatter: (cell, row) => {
                    const id = row.cells[2].data
                    const category = data.find((sc) => sc._id === id)
                    const categoryId = category?.categoryId
                    return _(
                      <>
                        <button
                          className="rounded-pill btn btn-sm btn-outline-primary me-2"
                          onClick={() => navigate(`/categories/${categoryId}/${id}`)}>
                          Sub Category
                        </button>
                        <button className="rounded-pill btn btn-sm btn-outline-danger" onClick={() => handleDelete(id)}>
                          Delete
                        </button>
                      </>,
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
        </CardBody>
      </Card>
    </>
  )
}
