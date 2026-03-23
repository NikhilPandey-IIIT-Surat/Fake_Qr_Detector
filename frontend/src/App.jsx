import { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

function App() {
  const webcamRef = useRef(null);

  const [mode, setMode] = useState(null);  
  const [file, setFile] = useState(null);
  const [expected, setExpected] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file || !expected) {
      alert("Provide file and expected value");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expected", expected);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/scan",
        formData
      );
      setResult(res.data);
    } catch (err) {
      console.log(err.response);
      alert("Upload error");
    }
  };

  const handleCapture = async () => {
    if (!expected) {
      alert("Enter expected value");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], "capture.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expected", expected);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/scan",
        formData
      );
      setResult(res.data);
    } catch (err) {
      console.log(err.response);
      alert("Webcam error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-3xl font-bold mb-6">
        Fake QR Detector
      </h1>

      {}
      {!mode && (
        <div className="space-x-4">
          <button
            onClick={() => setMode("upload")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload QR
          </button>

          <button
            onClick={() => setMode("webcam")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Use Webcam
          </button>
        </div>
      )}

      {}
      {mode === "upload" && (
        <div className="bg-white p-6 rounded shadow mt-4">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <input
            type="text"
            placeholder="Enter expected data"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            className="border p-2 mb-4 w-full"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Scan Upload
          </button>
        </div>
      )}

      {}
      {mode === "webcam" && (
        <div className="bg-white p-6 rounded shadow mt-4">

          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="mb-4 rounded"
          />

          <input
            type="text"
            placeholder="Enter expected data"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            className="border p-2 mb-4 w-full"
          />

          <button
            onClick={handleCapture}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Capture & Scan
          </button>
        </div>
      )}

      {}
      {result && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <p className="font-bold">Status: {result.status}</p>
          <p>Decoded: {result.decoded}</p>
          {result.reason && <p>Reason: {result.reason}</p>}
        </div>
      )}

    </div>
  );
}

export default App;