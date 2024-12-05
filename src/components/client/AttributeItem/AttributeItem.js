import { memo } from "react";
import { GoAlert } from "react-icons/go";

const style = {
  pointer_events: "none",
  opacity: 0.7,
};

const AttributeItem = ({ pd, onClick, clickSave = () => {}, message }) => {
  return (
    <>
      <div className="modal-body">
        {pd.map((a, index) => {
          return (
            <div className="mb-3">
              <div className="mb-1 text-start px-2">
                <p className="fs-6 text-capitalize">{a.key}</p>
              </div>

              <div className="row px-3">
                {a.values &&
                  a.values.map((v, j) => {
                    let ban = v.disible ? "not-allowed" : "pointer";
                    let disible = ban === "pointer" ? {} : { ...style };

                    return (
                      <div
                        onClick={() => {
                          if (ban === "not-allowed") {
                            return;
                          }

                          onClick({
                            key: a.key,
                            value: v.val,
                            rowCel: [index, j],
                          });
                        }}
                        style={{
                          maxWidth: "60px",
                          minHeight: "45px",
                          cursor: ban,
                          ...disible,
                        }}
                        className={`${v.active ? "bg-dark text-white" : ""} ${
                          !v.disible ? "" : `bg-secondary opacity-25`
                        } btn btn-outline-dark  col d-flex p-2 justify-content-center align-items-center border me-3 rounded-0`}
                      >
                        {v.val}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        <span className="text-danger px-1 d-flex align-items-center">
          {message && <GoAlert className="me-2" />} {message}
        </span>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn stext-101 cl0  bg2 bor14 text-black hov1 trans-04 pointer rounded-0"
          data-bs-dismiss="modal"
        >
          Hủy
        </button>
        <button
          type="button"
          className="btn stext-101 cl0  bg3 bor14 hov-btn3 trans-04 pointer rounded-0"
          onClick={() => {
            clickSave(pd);
          }}
        >
          Ok
        </button>
      </div>
    </>
  );
};

export default memo(AttributeItem);
