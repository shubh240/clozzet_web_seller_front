import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_SELLER } from '../../../../context/constants'
import { useAuthContext } from '../../../../context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { Grid, _ } from 'gridjs-react'
import Swal from 'sweetalert2'
import { Card, CardBody } from 'react-bootstrap'
import Spinner from '@/components/Spinner'

export default function Home() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const didFetch = useRef(false)

  const [replyingReviewId, setReplyingReviewId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL_SELLER}review/list-review?productId=${productId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      setData(res?.data?.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      showNotification({ message: 'Failed to fetch Data', variant: 'danger' })
    }
  }

  useEffect(() => {
    if (!didFetch.current) {
      fetchData()
      didFetch.current = true
    }
  }, [])

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      return showNotification({ message: 'Reply cannot be empty', variant: 'danger' })
    }

    try {
      setLoading(true)
      await axios.put(
        `${API_URL_SELLER}review/reply-review/${replyingReviewId}`,
        { reply: replyText },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      setReplyingReviewId(null)
      setReplyText('')
      fetchData()
      showNotification({ message: 'Reply submitted successfully', variant: 'success' })
      setLoading(false)
      setShowModal(false)
    } catch (error) {
      setLoading(false)
      showNotification({
        message: error?.response?.data?.message || 'Failed to submit reply',
        variant: 'danger',
      })
    }
  }

  if (loading) return <Spinner size="sm" color="primary" />

  return (
    <>
      <PageMetaData />
      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="mb-0">Product Review List</h4>
          </div>

          {data.length === 0 ? (
            <p className="text-muted">No data found.</p>
          ) : (
            <Grid
              data={data.map((item, index) => [
                index + 1,
                _(
                  <img
                    src={item?.customerId?.image}
                    alt={item?.customerId?.fullName}
                    width="40"
                    height="40"
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                  />,
                ),
                item?.customerId?.fullName,
                _(<p>{item?.rating} / 5</p>),
                item?.review,
                item?.reviewReply,
                _(
                  <>
                    <button
                      className="rounded-pill btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setReplyingReviewId(item._id)
                        setReplyText(item?.reviewReply || '')
                        setShowModal(true)
                      }}>
                      Reply
                    </button>
                  </>,
                ),
              ])}
              columns={['No', 'Customer Image', 'Customer Name', 'Rating', 'Review', 'Reply', 'Action']}
              search={true}
              pagination={{ enabled: true, limit: 10 }}
              sort={true}
            />
          )}

          {/* Reply Modal */}
          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Reply to Review</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowModal(false)
                        setReplyingReviewId(null)
                        setReplyText('')
                      }}></button>
                  </div>
                  <div className="modal-body">
                    <textarea
                      className="form-control"
                      rows="4"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false)
                        setReplyingReviewId(null)
                        setReplyText('')
                      }}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleReplySubmit}>
                      Submit Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  )
}
