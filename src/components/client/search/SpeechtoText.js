import React, { useState, useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechToText = ({ speechText, isModalOpen, onCloseModal }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(false);

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
          handleCloseModal();
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

  const handleCloseModal = () => {
    if (isRecording) {
      stopRecordingWebSpeech(); // Dừng ghi âm khi đóng modal
    }
    if (onCloseModal) {
      onCloseModal(); // Gọi hàm onCloseModal khi modal đóng
    }
    setTranscript(""); // Reset transcript khi đóng modal
  };

  return (
    <div>
      {/* Modal ghi âm */}
      {isModalOpen && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg rounded-4">
              <div className="w-100 text-end">
                <button
                  type="button"
                  className="btn-close mt-3 me-3"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true"></span>
                </button>
              </div>
              <div className="modal-body">
                <div className="w-100 text-center">
      <strong className="fs-24 ">         {isRecording ? "Hãy nói gì đó" : "Tìm kiếm bằng giọng nói"}</strong>
                </div>
                <div
                  className="mb-3 d-flex justify-content-center"
                  style={{ height: "100px" }}
                >
                  <div className="mt-6 waveform-container d-flex justify-content-center">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className={`waveform-bar ${
                          isRecording ? "animate-waveform" : ""
                        }`}
                        style={
                          isRecording ? { animationDelay: `${i * 0.1}s` } : {}
                        }
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Kết quả nhận dạng */}
                {transcript && (
                  <div className="alert alert-secondary" role="alert">
                    <h5 className="alert-heading">Kết quả:</h5>
                    <p className="mb-0">{transcript}</p>
                  </div>
                )}
                {/* Nút ghi âm */}
                <div className="text-center">
                  <button
                    className={`btn btn-primary w-100 shadow-sm mb-3 ${
                      isRecording ? "btn-danger" : ""
                    }`}
                    onClick={handleRecordButton}
                  >
                    {isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-secondary w-100 shadow-sm"
                    onClick={handleCloseModal}
                  >
                    Đóng
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
  @keyframes waveform {
    0%, 100% {
      height: 4px;
    }
    50% {
      height: 30px;
    }
  }
  .waveform-container {
    display: flex;
    gap: 5px;
  }
  .waveform-bar {
    width: 4px;
    background-color: #717fe0; /* Màu tím */
    border-radius: 4px;
    height: 4px; /* Mặc định chiều cao */
    /* Không có animation khi chưa record */
  }
  .waveform-bar.animate-waveform {
    animation: waveform 1s ease-in-out infinite; /* Chỉ chạy khi có lớp này */
  }
`}</style>
    </div>
  );
};

export default SpeechToText;
