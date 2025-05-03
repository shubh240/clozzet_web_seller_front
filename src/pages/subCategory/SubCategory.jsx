import React, { useState, useEffect } from "react";
import "./subCategory.css";
import { CgAdd } from "react-icons/cg";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { HiPencil } from "react-icons/hi2";
import SizeChartInput from "../sizeChartInput/SizeChartInput";
import {
  Switch,
  Button,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  selectSubCategories,
  selectSubCategoryToEdit,
} from "../../redux/selectors";
import { selectCategories, selectCategoryToEdit } from "../../redux/selectors";
import {
  setSubCategoryToEdit,
  clearSubCategoryToEdit,
  deleteSubCategory,
} from "../../redux/subCategorySlice";
import axios from "axios";
import toast from "react-hot-toast";
import useGetSubCategories from "../../hooks/useGetSubCategories";
import useGetCategories from "../../hooks/useGetCategories";

function SubCategory() {
 const [imageFile, setImageFile] = useState(null);
 const [sizeChartFile, setSizeChartFile] = useState(null);
 const [searchQuery, setSearchQuery] = useState("");

 const [sizeChart, setSizeChart] = useState([]);
 const [categoryType, setCategoryType] = useState("upper");
 const [gender, setGender] = useState("Men");

 const dispatch = useDispatch();
 const handleEdit = (subCategory) => {
   dispatch(setSubCategoryToEdit(subCategory));
 };
 const subCategoryToEdit = useSelector(selectSubCategoryToEdit);

 const [newSubCategory, setNewSubCategory] = useState({
   subCategoryId: "",
   subCategoryName: "",
   subCategoryStatus: false,
   image: [],
   sizeChartImage: [],
   mainCategoryName: "",
   gender: "Men",
   categoryType: "upper",
   sizeChart: [],
 });

 useEffect(() => {
   if (subCategoryToEdit) {
     setNewSubCategory({
       subCategoryId: subCategoryToEdit?.subCategoryId || "",
       subCategoryName: subCategoryToEdit?.subCategoryName || "",
       subCategoryStatus: subCategoryToEdit?.subCategoryStatus || false,
       image: subCategoryToEdit?.image || [],
       sizeChartImage: subCategoryToEdit?.sizeChart || [],
       mainCategoryName: subCategoryToEdit?.mainCategoryName || "",
       gender: subCategoryToEdit?.gender || "Men",
       categoryType: subCategoryToEdit?.categoryType || "upper",
       sizeChart: subCategoryToEdit?.sizeChart || [],
     });

     setSizeChart(subCategoryToEdit?.sizeChart || []);
     setGender(subCategoryToEdit?.gender || "Men");
     setCategoryType(subCategoryToEdit?.categoryType || "upper");
   }
 }, [subCategoryToEdit]);

 const handleAddOrUpdate = async (e) => {
   e.preventDefault();

   try {
     const formData = new FormData();

     formData.append("subCategoryId", newSubCategory.subCategoryId);
     formData.append("subCategoryName", newSubCategory.subCategoryName);
     formData.append("subCategoryStatus", newSubCategory.subCategoryStatus);
     formData.append("mainCategoryName", newSubCategory.mainCategoryName);
     formData.append("gender", gender);
     formData.append("categoryType", categoryType);
    const structuredChart = sizeChart.map(({ size, ...measurements }) => ({
      size,
      measurements: Object.fromEntries(
        Object.entries(measurements).map(([k, v]) => [k, parseFloat(v)])
      ),
    }));
    formData.append("subCategorySizeChart", JSON.stringify(structuredChart));


     if (imageFile) {
       formData.append("image", imageFile);
     }
     if (sizeChartFile) {
       formData.append("sizeChart", sizeChartFile);
     }

     console.log("FormData being submitted:");
     for (let pair of formData.entries()) {
       if (pair[1] instanceof File) {
         console.log(`${pair[0]}:`, pair[1].name); // Log file names
       } else {
         try {
           console.log(`${pair[0]} (parsed):`, JSON.parse(pair[1]));
         } catch (err) {
           console.log(`${pair[0]}:`, pair[1]);
         }
       }
     }

     let res;
     if (subCategoryToEdit?._id) {
       res = await axios.put(
         `${process.env.REACT_APP_API_URL}/api/v1/subCategory/edit/${subCategoryToEdit._id}`,
         formData,
         {
           headers: { "Content-Type": "multipart/form-data" },
           withCredentials: true,
         }
       );
     } else {
       res = await axios.post(
         `${process.env.REACT_APP_API_URL}/api/v1/subCategory/add`,
         formData,
         {
           headers: { "Content-Type": "multipart/form-data" },
           withCredentials: true,
         }
       );
     }

     if (res.data.success) {
       toast.success(res.data.message);
     }
   } catch (error) {
     toast.error(error?.response?.data?.message || "Something went wrong!");
     console.error("Error during submission:", error);
   }

   // ✅ Reset all
   setNewSubCategory({
     subCategoryId: "",
     subCategoryName: "",
     subCategoryStatus: false,
     image: [],
     sizeChart: [],
     mainCategoryName: "",
     gender: "Men",
     categoryType: "upper",
   });
   setImageFile(null);
   setSizeChartFile(null);
   setSizeChart([]);
   setGender("Men");
   setCategoryType("upper");
   dispatch(clearSubCategoryToEdit());
 };


  const handleToggleSubCategoryStatus = async (subCategoryId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/subCategory/toggle-status/${subCategoryId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("SubCategory status updated");
        // Optionally refresh data
      }
    } catch (error) {
      toast.error("Failed to toggle status");
      console.log(error);
    }
  };

  // const { refetchSubCategories } = useGetSubCategories();
  // const subCategories = useSelector(selectSubCategories);
  // useEffect(() => {
  //   // Re-fetch categories when a category is added/updated
  //   refetchSubCategories();
  // }, [handleAddOrUpdate]);

  useGetSubCategories();
  const subCategories = useSelector(selectSubCategories);
  console.log("subCategories:", subCategories);

  // const { refetchCategories } = useGetCategories();
  // const categories = useSelector(selectCategories);
  // useEffect(() => {
  //   // Re-fetch categories when a category is added/updated
  //   refetchCategories();
  // }, [handleAddOrUpdate]);

  useGetCategories();
  const categories = useSelector(selectCategories);
  console.log("Categories to select:", categories);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/subCategory/delete/${id}`
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
      }
      console.log(res);
      // Update category list after deletion
      dispatch(deleteSubCategory(id));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleReset = async () => {
    setNewSubCategory({
      subCategoryId: "",
      subCategoryName: "",
      subCategoryStatus: false,
      image: [],
      sizeChart: [],
      mainCategoryName: "",
    });
  };

  return (
    <>
      <div className="coupon-section">
        <div className="coupon-header">
          <div className="coupon-top">
            <div className="coupon-heading">
              <div className="c-add-icon">
                <CgAdd />
              </div>{" "}
              <h2>Add New Category</h2>
            </div>
          </div>
          <div className="coupon-form-section">
            <form
              action=""
              encType="multipart/form-data"
              onSubmit={(e) => handleAddOrUpdate(e)}
            >
              <div className="coupon-form">
                <div className="default-top">
                  <div className="default-heading">
                    <div className="d-1">
                      <h3>Default</h3>
                    </div>
                    <div className="e-1">
                      <h3>English</h3>
                    </div>
                  </div>
                </div>

                <div className="title-box2">
                  <div className="wrap-part">
                    <div className="t-box-1">
                      <div className="type-heading">
                        <h3>Category</h3>
                      </div>
                      <div className="title-c-select">
                        <div className="select-menu">
                          <FormControl className="f-bg" fullWidth>
                            <InputLabel className="s-bg">
                              All Category
                            </InputLabel>
                            <Select
                              value={newSubCategory.mainCategoryName}
                              onChange={(e) =>
                                setNewSubCategory({
                                  ...newSubCategory,
                                  mainCategoryName: e.target.value,
                                })
                              }
                            >
                              {categories.map((category, index) => (
                                <MenuItem
                                  key={index}
                                  value={category?.categoryName || ""}
                                >
                                  {category?.categoryName || "Unnamed"}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                    <div className="t-box-1">
                      <div className="type-heading">
                        <h3>Sub Category Name</h3>
                      </div>
                      <div className="title-c-select">
                        <input
                          type="text"
                          placeholder=""
                          value={newSubCategory.subCategoryName}
                          onChange={(e) =>
                            setNewSubCategory({
                              ...newSubCategory,
                              subCategoryName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="t-box-1">
                      <div className="type-heading">
                        <h3>Sub Category and Size Chart Image</h3>
                      </div>
                      <div className="title-c-select">
                        <input
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files[0])}
                        />

                        <input
                          className="ml-4"
                          name="sizeChart"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSizeChartFile(e.target.files[0])}
                        />
                      </div>
                    </div>
                    {/* Gender Selection */}
                    <div className="t-box-1">
                      <div className="type-heading">
                        <h3>Gender</h3>
                      </div>
                      <div className="title-c-select">
                        <FormControl className="f-bg" fullWidth>
                          <InputLabel className="s-bg">
                            Select Gender
                          </InputLabel>
                          <Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <MenuItem value="Women">Women</MenuItem>
                            <MenuItem value="Men">Men</MenuItem>
                            <MenuItem value="Children">Children</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    {/* Clothing Type Selection */}
                    <div className="t-box-1">
                      <div className="type-heading">
                        <h3>Clothing Type</h3>
                      </div>
                      <div className="title-c-select">
                        <FormControl className="f-bg" fullWidth>
                          <InputLabel className="s-bg">
                            Select Clothing Type
                          </InputLabel>
                          <Select
                            value={categoryType}
                            onChange={(e) => setCategoryType(e.target.value)}
                          >
                            <MenuItem value="upper">
                              Upper Wear (Tops, Shirts)
                            </MenuItem>
                            <MenuItem value="lower">
                              Lower Wear (Jeans, Skirts)
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    {/* <div className="t-box-1">
                      <div className="type-heading">
                        <h3>Size Chart Image</h3>
                      </div>
                      <div className="title-c-select"></div>
                    </div> */}

                    <SizeChartInput
                      gender={gender}
                      categoryType={categoryType}
                      onChange={(data) => setSizeChart(data)} // Update sizeChart state
                    />
                  </div>
                </div>
                <div className="title-box4">
                  <div className="title-btn-box">
                    <Button className="rst-btn" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button className="subt-btn" type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="coupon-table">
            <div className="c-table-header">
              <div className="c-table-top">
                <div className="c-table-heading">
                  <h2>Sub Category List</h2>
                  <span>{subCategories.length}</span>
                </div>
                <div className="search-title-code">
                  <div className="s-input">
                    <input
                      type="text"
                      placeholder="Search By Refrence or Name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="icon-s">
                      <IoSearchSharp />
                    </div>
                  </div>
                </div>
              </div>
              <div className="main-coupon-box">
                <table width="100%">
                  <thead>
                    <tr>
                      <th>SI</th>
                      <th>Main Category</th>
                      <th>Sub Category ID</th>
                      <th>Sub Category Image</th>
                      <th>Size Chart Image</th>
                      <th>Sub Category Name</th>
                      <th>Status</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories?.length > 0 ? (
                      subCategories
                        .filter((subCategory) =>
                          subCategory.subCategoryName
                            ?.toLowerCase()
                            .includes(searchQuery.trim().toLowerCase())
                        )
                        .map((subCategory, index) => (
                          <tr align="center" key={subCategory._id || index}>
                            <td>{index + 1}</td>
                            <td>{subCategory.mainCategoryId?.categoryName}</td>
                            <td>{subCategory.subCategoryId}</td>
                            <td>
                              {subCategory.subCategoryImageUrl ? (
                                <img
                                  src={subCategory.subCategoryImageUrl}
                                  alt={subCategory.subCategoryName}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "3px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <span className="no-image">No Image</span>
                              )}
                            </td>
                            <td>
                              {subCategory.subCategorySizeChartUrl ? (
                                <img
                                  src={subCategory.subCategorySizeChartUrl}
                                  alt={subCategory.subCategoryName}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "3px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <span className="no-image">No Image</span>
                              )}
                            </td>
                            <td>{subCategory.subCategoryName}</td>
                            <td>
                              <label>
                                <Switch
                                  checked={subCategory.subCategoryStatus}
                                  onChange={() =>
                                    handleToggleSubCategoryStatus(
                                      subCategory._id
                                    )
                                  }
                                />
                              </label>
                            </td>

                            <td className="ac-box">
                              <Button
                                className="hipen"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit(subCategory);
                                }}
                              >
                                <HiPencil />
                              </Button>

                              <Button
                                onClick={(e) =>
                                  handleDelete(e, subCategory._id)
                                }
                              >
                                <AiOutlineDelete />
                              </Button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="12" align="center">
                          No subcategories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubCategory;
