import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import PageMetaData from '@/components/PageTitle'
import { API_URL_ADMIN, API_URL_SELLER } from '../../../context/constants'
import { useAuthContext } from '../../../context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardBody } from 'react-bootstrap'
import Select from 'react-select'
import { useDropzone } from 'react-dropzone'
import Spinner from '@/components/Spinner'

export default function Home() {
  const { productId, id } = useParams()

  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  if (loading) {
    return <Spinner size="sm" color="primary" />
  }

  return (
    <>
      <PageMetaData />

      <Card>
        <CardBody>
        </CardBody>
      </Card>

    </>
  )
}
