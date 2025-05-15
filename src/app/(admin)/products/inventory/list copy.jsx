import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_SELLER } from '../../../../context/constants'
import { useAuthContext } from '../../../../context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Grid, _ } from 'gridjs-react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import Spinner from '@/components/Spinner'

export default function Home() {
  const navigate = useNavigate()

  const { productId } = useParams()

  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)

  const didFetch = useRef(false)

  const [data, setData] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${API_URL_SELLER}productSize/list-productSize?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      setData(res?.data?.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)

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

  const handleStatusToggle = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to toggle the product status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
    })

    if (result.isConfirmed) {
      try {
        setLoading(true)

        await axios.patch(
          `${API_URL_SELLER}products/status-product/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          },
        )

        // Swal.fire('Updated!', 'Product status has been changed.', 'success')

        showNotification({
          message: 'Status updated successfully!',
          variant: 'success',
        })
        // Refresh the table data
        fetchData()
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)

        showNotification({
          message: 'Failed to update status',
          variant: 'danger',
        })
      }
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      try {
        setLoading(true)

        await axios.delete(`${API_URL_SELLER}productSize/delete-productSize/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        showNotification({
          message: 'The item has been deleted.',
          variant: 'success',
        })
        fetchData()
        setLoading(false)
      } catch (error) {
        setLoading(false)

        showNotification({
          message: error?.response?.data?.message || 'Something went wrong.',
          variant: 'danger',
        })
      }
    }
  }

  if (loading) {
    return <Spinner size="sm" color="primary" />
  }
  return (
    <>
      <PageMetaData />

      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">Product Inventory List</h3>
            <Link className="btn btn-primary" to={`/products-inventory-add/${productId}`}>
              Add Inventory
            </Link>
          </div>

          {data.length === 0 ? (
            <p className="text-muted">No data found.</p>
          ) : (
            <Grid
              data={data.map((item, index) => [
                index + 1,
                item?.size,
                item?.quantity,
                item,
              ])}
              columns={[
                'No',
                'Size',
                'Quantity',
                {
                  name: 'Action',
                  sort: false,
                  formatter: (cell, row) => {
                    const id = row.cells[3].data._id

                    return _(
                      <>
                        <button className="rounded-pill btn btn-sm btn-outline-primary me-2" onClick={() => navigate(`/products-edit/${id}`)}>
                          Edit
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
