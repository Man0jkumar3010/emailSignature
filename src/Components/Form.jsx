import { useRef, useState } from "react";
import { Preview } from "./Preview";
import AWS from "aws-sdk";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import "../style/form.css";

export const Form = () => {
  const initialFormData = {
    name: "",
    desgination: "",
    mail: "",
    phone: "",
  };

  const [inputValue, setInputValue] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageState, setImageState] = useState({
    croppedUrl: "",
    imageUrl: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const s3 = new AWS.S3({
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
    endpoint: "http://127.0.0.1:9000",
    s3ForcePathStyle: true,
    signatureVersion: "v4",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setInputValue((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setInputValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageInput = () => {
    fileRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setIsCropping(true);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async (imageSrc, cropAreaPixels) => {
    const image = new Image();
    console.log("Image ===>",image);
    
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropAreaPixels.width;
        canvas.height = cropAreaPixels.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          cropAreaPixels.x,
          cropAreaPixels.y,
          cropAreaPixels.width,
          cropAreaPixels.height,
          0,
          0,
          cropAreaPixels.width,
          cropAreaPixels.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Canvas is empty");
              return;
            }
            blob.name = "cropped-image.jpeg"; 
            resolve(blob);
          },
          "image/jpeg",
          1
        );
      };
    });
  };

  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImage(previewUrl, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setImageState((prev) => ({ ...prev, croppedUrl }));
      setFile(croppedBlob);
      setIsCropping(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const params = {
      Bucket: "emailsignature",
      Key: `${Date.now()}-${file.name || "cropped-image.jpeg"}`, 
      Body: file,
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    try {
      const response = await s3.upload(params).promise();
      setImageState((prev) => ({
        ...prev,
        croppedUrl: response.Location,
      }));
      setPreviewUrl(""); 
      console.log("Image Uploaded Successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed!");
    }
  };

  const hasFormData =
    Object.values(inputValue).some((value) => value !== "") ||
    imageState.croppedUrl;

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setIsCropping(true);
    }
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={(e) => e.preventDefault()} className="form">
          <div className="form-label">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={inputValue.name}
              onChange={handleInput}
              placeholder="Enter name"
            />
          </div>
          <div className="form-label">
            <label>Designation</label>
            <input
              type="text"
              name="desgination"
              value={inputValue.desgination}
              onChange={handleInput}
              placeholder="e.g. Frontend Developer, Associate"
            />
          </div>
          <div className="form-label">
            <label>Email</label>
            <input
              type="text"
              name="mail"
              value={inputValue.mail}
              onChange={handleInput}
              placeholder="Email address"
            />
          </div>
          <div className="form-label">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={inputValue.phone}
              onChange={handleInput}
              placeholder="Enter phone number"
            />
          </div>

          <div
            className="image-wrapper"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className="img-container"
              style={{
                backgroundColor: isDragging ? "#e0e0e0" : "#f9f9f9",
                position: "relative",
              }}
              onClick={handleImageInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imageState.croppedUrl ? (
                <img src={imageState.croppedUrl} alt="Cropped" />
              ) : (
                <p style={{ textAlign: "center" }}>
                  Click or drag an image here
                </p>
              )}
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            {isCropping && (
              <div
                className="cropper-container"
                style={{
                  position: "relative",
                  height: "200px",
                  width: "200px",
                  margin: "0px auto",
                }}
              >
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />

                <div>
                  <Slider
                    size="small"
                    color="warning"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, zoom) => setZoom(zoom)}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                    }}
                  />
                </div>

                <button
                  onClick={handleCrop}
                  style={{
                    position: "absolute",
                    bottom: -60,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "10px 20px",
                    backgroundColor: "rgba(84, 70, 219, 0.98)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          <div>
            <button type="button" onClick={handleUpload} className="upload-btn">
              Upload Image
            </button>
          </div>
        </form>
      </div>

      {hasFormData && (
        <Preview
          {...inputValue}
          phone={inputValue.phone && `+91 ${inputValue.phone}`}
          imageUrl={imageState.croppedUrl || ""}
        />
      )}
    </>
  );
};
