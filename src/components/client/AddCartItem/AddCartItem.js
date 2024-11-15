import { memo } from "react";
import { GoAlert } from "react-icons/go";

const style = {
  pointer_events: "none",
  opacity: 0.7,
};

const AddCartItem = ({ pd, onClick, clickSave = () => {}, message }) => {
  
console.log(15,pd)
  const temppd = {...pd};

  return (
    <>
      <div className="modal-body p-0">
        {pd.map((a, index) => {
          return (
            <div className="mb-3">
              <div className="mb-1 text-start px-2">
                <p className="fs-6 text-capitalize">{a.key}</p>
              </div>

              <div className="row px-3">
                {a?.values &&
                  a?.values?.map((v, j) => {
                    let ban = v?.disible ? "not-allowed" : "pointer";
                    let disible = ban === "pointer" ? {} : { ...style };

                    return (
                      <div
                        onClick={() => {
                          if (ban === "not-allowed") {
                            return;
                          }

                          onClick({
                            key: a?.key,
                            value: v?.val,
                            rowCel: [index, j],
                            pdu: temppd
                          });
                        }}
                        style={{
                          maxWidth: "60px",
                          minHeight: "45px",
                          cursor: ban,
                          ...disible,
                        }}
                        className={`${v?.active ? "bg-dark text-white" : ""} ${
                          !v?.disible ? "" : `bg-secondary opacity-25`
                        } btn btn-outline-dark col d-flex p-2 justify-content-center align-items-center border me-3 rounded-0`}
                      >
                        {v?.val}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}

        <div className="mt-5">
          <button
            onClick={() => {
              clickSave(pd);
            }}
            className="flex-c-m w-75 stext-101 cl0 py-3 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail rounded-0"
          >
            Add to cart
          </button>
        </div>

        <span className="text-danger px-1 d-flex align-items-center">
          {message && <GoAlert className="me-2" />} {message}
        </span>
      </div>
    </>
  );
};

export default memo(AddCartItem);
