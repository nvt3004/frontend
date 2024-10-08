import React, { useState, useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechToText = ({ speechText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (SpeechRecognition) {
      setIsWebSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "vi-VN"; // Đặt ngôn ngữ mặc định là tiếng Việt

      recog.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const recognizedText = lastResult[0].transcript;
        setTranscript(recognizedText);

        // Gọi hàm speechText từ props để cập nhật state bên ngoài
        if (speechText) {
          speechText(recognizedText);
        }
      };

      recog.onerror = (event) => {
        console.error("Lỗi nhận diện giọng nói:", event.error);
        alert(
          "Có lỗi xảy ra trong quá trình nhận diện giọng nói: " + event.error
        );
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recog);
    } else {
      setIsWebSpeechSupported(false);
      alert("Trình duyệt của bạn không hỗ trợ Web Speech API.");
    }
  }, [speechText]);

  const startRecordingWebSpeech = () => {
    if (!recognition) return;

    recognition.lang = "vi-VN"; // Đặt ngôn ngữ mặc định là tiếng Việt
    recognition.start();
    setIsRecording(true);
    setTranscript("");
  };

  const stopRecordingWebSpeech = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleRecordButton = () => {
    if (isRecording) {
      stopRecordingWebSpeech();
    } else {
      startRecordingWebSpeech();
    }
  };

  // Hàm mở modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    if (isRecording) {
      handleRecordButton();
    }
    setShowModal(false);
    setTranscript("");
  };

  return (
    <div>
      <button
        className="size-113 flex-c-m fs-23 cl2 hov-cl1 trans-04 me-2"
        onClick={handleOpenModal}
      >
        <i className="zmdi zmdi-mic"></i>
      </button>

      {/* Modal ghi âm */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ghi Âm Giọng Nói</h5>
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Nút ghi âm */}
                <div className="d-grid gap-2 mb-3">
                  <button
                    className={`btn ${
                      isRecording ? "btn-danger" : "btn-primary"
                    }`}
                    onClick={handleRecordButton}
                  >
                    {isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                  </button>
                </div>

                {/* Hiển thị trạng thái ghi âm */}
                <div className="mb-3">
                  {isRecording ? (
                    <p className="text-danger">Đang ghi âm...</p>
                  ) : (
                    <p className="text-success">Ghi âm đã dừng.</p>
                  )}
                </div>

                {/* Kết quả nhận dạng */}
                {transcript && (
                  <div className="alert alert-secondary" role="alert">
                    <h5 className="alert-heading">Kết quả nhận dạng:</h5>
                    <p className="mb-0">{transcript}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
