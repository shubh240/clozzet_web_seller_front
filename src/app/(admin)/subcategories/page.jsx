import {useCallback, useEffect, useRef, useState } from 'react'
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
import { useDropzone } from 'react-dropzone'

export default function Home() {
  
  const { categoryId, id } = useParams();

  const { user } = useAuthContext()
  const { showNotification } = useNotificationContext()

  const didFetch = useRef(false)

  const [subcategories, setSubCategories] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)

  const [sellerSubCategories, setSellerCategories] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);


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
          const formData = new FormData();
          formData.append('sellerId', user?._id);
          formData.append('categoryId', categoryId);
          formData.append('sellerCategoryId', id);
          formData.append('subCategoryId', selectedSubCategory?.value);
        if (primaryImage) {
            formData.append('image', primaryImage);
          }
        
          let response;
        if (editMode && editId) {
              response = await axios.put(
                `${API_URL_SELLER}subCategory/update-subCategory/${editId}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${user?.token}`,
                  },
                }
              )
        }
        else{
          response = await axios.post(
            `${API_URL_SELLER}subCategory/add-subCategory`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          )
        }

      if (response.data.success) {
        showNotification({
          message: editMode ? 'Sub Category updated successfully!' : 'Category assigned successfully!',
          variant: 'success',
        })
      fetchSellerCategories()
      resetForm()
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
const resetForm = () => {
  setSelectedSubCategory(null)
  setPrimaryImage(null)
  setEditMode(false)
  setEditId(null)
  setPrimaryImagePreview(null);
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
    const [primaryImage, setPrimaryImage] = useState(null)
    // Handle primary image (only 1)
    const onDropPrimary = useCallback((acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setPrimaryImage(file)
      }
    }, [])
    const { getRootProps: getRootPropsPrimary, getInputProps: getInputPropsPrimary } = useDropzone({
      onDrop: onDropPrimary,
      maxFiles: 1,
      accept: { 'image/*': [] },
    })

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
           <div className="mb-4">
              <label className="form-label">SubCategory Image</label>
              <div
                {...getRootPropsPrimary()}
                className="dropzone border p-4 bg-light text-center"
                style={{ cursor: 'pointer', borderStyle: 'dashed' }}>
                <input {...getInputPropsPrimary()} />
                {primaryImage ? (
                  <img src={URL.createObjectURL(primaryImage)} alt="Primary" height={100} />
                ) : primaryImagePreview ? (
                  <img src={primaryImagePreview} alt="Preview" height={100} />
                ) : (
                  <p>Drag 'n' drop or click to select a primary image</p>
                )}
              </div>
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
              data={sellerSubCategories.map((item, index) => [
                index + 1,
                item?.subCategory?.name || 'N/A',
                item?.image ? (
                  <img src={item.image} alt="Subcategory" height={40} />
                ) : (
                  'No Image'
                ),
                item._id,
              ])}
              columns={[
              'No',
              'Sub Category',
              'Sub Category Image',
              {
                name: 'Action',
                sort: false,
                formatter: (cell, row) => {
                  const id = row.cells[2].data
                  const item = sellerSubCategories.find(i => i._id === id)

                  return _(
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSelectedSubCategory({
                            value: item?.subCategory?._id,
                            label: item?.subCategory?.name,
                          })
                          setEditId(item._id)
                          setEditMode(true)
                          setPrimaryImagePreview(item?.image || null)
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(id)}>
                        Delete
                      </button>
                    </div>
                  )
                },
              }

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
