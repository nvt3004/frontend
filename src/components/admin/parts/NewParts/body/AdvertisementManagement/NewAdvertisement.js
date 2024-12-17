import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../../../../services/axiosConfig";
import FullScreenSpinner from "../../../FullScreenSpinner";
import "./NewAdvertisement.css"; // External CSS for custom styles
import { useLocation } from "react-router-dom";

const NewAdvertisement = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // To store image files
  const [imageInputKey, setImageInputKey] = useState(Date.now()); // To reset input field
  const imageInputRef = React.useRef(null);
  const [removedImages, setRemovedImages] = useState([]); // Lưu ảnh cần xóa

  const location = useLocation();
  const advertisement = location.state?.advertisement;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (advertisement) {
      const transformedAdvertisement = {
        ...advertisement,
        startDate: formatDateForInput(advertisement.startDate),
        endDate: formatDateForInput(advertisement.endDate),
      };
      reset(transformedAdvertisement);

      if (advertisement.images && advertisement.images.length > 0) {
        setImages(advertisement.images);
      }
    }
  }, [advertisement, reset]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year, hour, minute] = [
      dateString.slice(0, 2),
      dateString.slice(3, 5),
      dateString.slice(6, 10),
      dateString.slice(11, 13),
      dateString.slice(14, 16),
    ];
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    const removed = images[index];
    if (removed.imageUrl) {
      setRemovedImages((prev) => [...prev, removed.imageUrl]);
    }
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("advName", data.advName);
    formData.append("advDescription", data.advDescription);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("status", data.status);

    const dbImages = images.filter((image) => image.imageUrl);
    dbImages.forEach((image) => {
      formData.append("existingImages", image.imageUrl);
    });

    const newFiles = images.filter((image) => image instanceof File);
    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (removedImages.length > 0) {
      removedImages.forEach((url) => {
        formData.append("removedImages", url);
      });
    }

    try {
      let response;
      if (advertisement?.advId) {
        response = await axiosInstance.put(
          `/staff/advertisement/update/${advertisement.advId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axiosInstance.post(
          "/staff/advertisement/add",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response?.data?.code === 1000) {
        toast.success(
          advertisement?.advId
            ? "Advertisement updated successfully!"
            : "Advertisement added successfully!"
        );
        reset();
        setImages([]);
        setRemovedImages([]);
        setImageInputKey(Date.now());
      } else {
        toast.error(response?.data?.message || "Failed to save advertisement.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the advertisement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FullScreenSpinner isLoading={loading} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-2">
          <Form.Label>Advertisement Name</Form.Label>
          <Form.Control
            {...register("advName", {
              required: "Advertisement name is required.",
            })}
            placeholder="Advertisement's name"
          />
          {errors.advName && (
            <span className="text-danger">{errors.advName.message}</span>
          )}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            {...register("advDescription", {
              required: "Description is required.",
            })}
            placeholder="Advertisement's description"
          />
          {errors.advDescription && (
            <span className="text-danger">{errors.advDescription.message}</span>
          )}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="datetime-local"
            {...register("startDate", {
              required: "Start date is required.",
            })}
          />
          {errors.startDate && (
            <span className="text-danger">{errors.startDate.message}</span>
          )}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="datetime-local"
            {...register("endDate", { required: "End date is required." })}
          />
          {errors.endDate && (
            <span className="text-danger">{errors.endDate.message}</span>
          )}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Status</Form.Label>
          <Form.Select
            {...register("status", { required: "Status is required." })}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </Form.Select>
          {errors.status && (
            <span className="text-danger">{errors.status.message}</span>
          )}
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Images</Form.Label>
          <div className="custom-file-input">
            <input
              key={imageInputKey}
              type="file"
              multiple
              onChange={handleImageChange}
              ref={imageInputRef}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-label">
              Choose Images
            </label>
          </div>

          {images.length > 0 && (
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={
                      image.imageUrl
                        ? `https://api.stepstothefuture.store/images/${image.imageUrl}`
                        : URL.createObjectURL(image)
                    }
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {advertisement?.advId ? "Update Advertisement" : "Add Advertisement"}
        </Button>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default NewAdvertisement;