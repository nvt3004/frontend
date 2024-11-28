import React from "react";

const AddReviewModal = ({
  show,
  onClose,
  comment,
  setComment,
  photos,
  setPhotos,
  rating,
  setRating,
  handleSubmit,
  error
}) => {
  const handleRating = (value) => {
    setRating(value);
  };

  const handlePhotoUpload = (event) => {
    setPhotos([...event.target.files]);
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add a Review</h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <p className="stext-102 cl6">
                Your email address will not be published. Required fields are
                marked *
              </p>

              {error && <p className="text-danger">{error}</p>}

              <div className="flex-w flex-m p-t-50 p-b-23">
                <span className="stext-102 cl3 m-r-16">Your Rating</span>
                <span className="wrap-rating fs-18 cl11 pointer">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`item-rating pointer zmdi ${
                        index < rating ? "zmdi-star" : "zmdi-star-outline"
                      }`}
                      onClick={() => handleRating(index + 1)}
                    ></i>
                  ))}
                  <strong className="fs-5">
                    ({rating})
                  </strong>
                </span>

              </div>

              <div className="row p-b-25">
                <div className="col-12 p-b-5">
                  <label className="stext-102 cl3" htmlFor="review">
                    Your review *
                  </label>
                  <textarea
                    className="size-110 bor8 stext-102 cl2 p-lr-20 p-tb-10"
                    id="review"
                    name="review"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="col-12 p-b-5">
                  <label className="stext-102 cl3" htmlFor="photos">
                    Upload Photos (optional)
                  </label>
                  <input
                    type="file"
                    id="photos"
                    multiple
                    onChange={handlePhotoUpload}
                    className="form-control"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex-c-m stext-101 cl0 size-112 bg7 bor11 hov-btn3 p-lr-15 trans-04 m-b-10"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
