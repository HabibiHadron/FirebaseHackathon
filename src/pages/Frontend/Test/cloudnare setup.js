import React, { useState } from "react";
import { Upload } from "lucide-react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "first-Time"); // Replace with your upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dtesdhvro/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        console.log(data.secure_url);
        setFile(null);
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      setError("Failed to upload file. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md p-4 space-y-4">
      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <Upload className="w-8 h-8 text-gray-500 mb-2" />
          <p className="text-sm text-gray-500">
            {file ? file.name : "Click or drag file to upload"}
          </p>
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {uploadedUrl && (
        <p className="text-green-500">File uploaded successfully</p>
      )}
    </div>
  );
};

export default FileUpload;
