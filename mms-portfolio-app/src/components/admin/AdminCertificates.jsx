import { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import certificateIcon from "../../assets/info/certificate.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import uploadIcon from "../../assets/buttons/upload.png";
import PopupModal from "../PopupModal";
import {
  uploadCertificateImage,
  deleteCertificateImage,
} from "../../services/certificatesService";

const AdminCertificates = () => {
  const { data, updateData, addItem, removeItem } = useData();
  const { certificates } = data;
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    description: "",
    image: "",
    credentialId: "",
    credentialUrl: "",
    imageFileName: "",
  });
  const [tempFile, setTempFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const fileInputRef = useRef(null);
  const originalDataRef = useRef({});

  const icon = (
    <img
      src={certificateIcon}
      alt="Certificates Settings"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title || "",
      issuer: cert.issuer || "",
      description: cert.description || "",
      image: cert.image || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      imageFileName: cert.imageFileName || "",
    });
    originalDataRef.current = {
      title: cert.title || "",
      issuer: cert.issuer || "",
      description: cert.description || "",
      image: cert.image || "",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      imageFileName: cert.imageFileName || "",
    };
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      issuer: "",
      description: "",
      image: "",
      credentialId: "",
      credentialUrl: "",
      imageFileName: "",
    });
    originalDataRef.current = {
      title: "",
      issuer: "",
      description: "",
      image: "",
      credentialId: "",
      credentialUrl: "",
      imageFileName: "",
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, GIF, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setTempFile(file);
      const previewURL = URL.createObjectURL(file);
      setTempPreview(previewURL);
      setFormData((prev) => ({
        ...prev,
        image: previewURL,
      }));
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
          }
          setTempFile(file);
          const previewURL = URL.createObjectURL(file);
          setTempPreview(previewURL);
          setFormData((prev) => ({
            ...prev,
            image: previewURL,
          }));
          break;
        }
      }
    }
  };

  const handleDeleteImage = async () => {
    // If we're editing an existing certificate and it has an image, delete it from storage
    if (editingId && formData.imageFileName) {
      try {
        await deleteCertificateImage(formData.imageFileName);
      } catch (error) {
        console.error("Error deleting image from storage:", error);
        // Continue with the deletion even if storage deletion fails
      }
    }

    setFormData((prev) => ({
      ...prev,
      image: "",
      imageFileName: "",
    }));
    setTempFile(null);
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview);
    }
    setTempPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    let imageUrl = formData.image;
    let imageFileName = formData.imageFileName;

    if (tempFile) {
      try {
        const oldImageFileName = editingId ? formData.imageFileName : null;

        const result = await uploadCertificateImage(tempFile, oldImageFileName);
        imageUrl = result.downloadURL;
        imageFileName = result.fileName;
      } catch (uploadError) {
        alert("Error uploading image. Please try again.");
        return;
      }
    }

    const newCertificate = {
      ...formData,
      image: imageUrl,
      imageFileName: imageFileName,
    };

    try {
      if (editingId) {
        await updateData("certificates", newCertificate, editingId);
      } else {
        await addItem("certificates", newCertificate);
      }
      setTempFile(null);
      setTempPreview(null);
      handleCancel();
    } catch (error) {
      console.error("Error saving certificate:", error);
      alert("Error saving certificate. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      try {
        // Find the certificate to get its imageFileName
        const certificateToDelete = certificates.find((cert) => cert.id === id);

        // Delete the image from storage if it exists
        if (certificateToDelete?.imageFileName) {
          try {
            await deleteCertificateImage(certificateToDelete.imageFileName);
          } catch (error) {
            console.error(
              "Error deleting certificate image from storage:",
              error
            );
            // Continue with certificate deletion even if image deletion fails
          }
        }

        // Delete the certificate from the database
        await removeItem("certificates", id);
      } catch (error) {
        console.error("Error deleting certificate:", error);
        alert("Error deleting certificate. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview);
    }
    setTempFile(null);
    setTempPreview(null);
    setFormData({
      title: "",
      issuer: "",
      description: "",
      image: "",
      credentialId: "",
      credentialUrl: "",
      imageFileName: "",
    });
    originalDataRef.current = {
      title: "",
      issuer: "",
      description: "",
      image: "",
      credentialId: "",
      credentialUrl: "",
      imageFileName: "",
    };
    setIsAdding(false);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUndo = () => {
    setFormData({ ...originalDataRef.current });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminSectionWrapper
      id="admin-certificates"
      title="Manage Certificates"
      icon={icon}
      description="Add, edit, or remove professional certificates."
    >
      <div className="space-y-6">
        {/* Add New Certificate Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <img
              src={plusIcon}
              alt="Add"
              className="h-4 w-4 object-contain logo-nebula-mint"
            />
            <span>Add Certificate</span>
          </button>
        </div>

        {/* Add/Edit Form in PopupModal */}
        {isAdding || editingId ? (
          <PopupModal
            isOpen={isAdding || editingId}
            onClose={handleCancel}
            title={editingId ? "Edit Certificate" : "Add New Certificate"}
          >
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Certificate Image / Badge
                </label>
                <div className="space-y-3">
                  <div
                    className="border-2 border-dashed border-cosmic-purple/30 rounded-lg p-4 hover:border-stellar-blue/50 transition-colors"
                    onPaste={handlePaste}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        const file = files[0];
                        if (!file.type.startsWith("image/")) {
                          alert(
                            "Please select an image file (JPEG, PNG, GIF, etc.)"
                          );
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          alert("File size must be less than 5MB");
                          return;
                        }
                        setTempFile(file);
                        const previewURL = URL.createObjectURL(file);
                        setTempPreview(previewURL);
                        setFormData((prev) => ({
                          ...prev,
                          image: previewURL,
                        }));
                      }
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                        <img
                          src={uploadIcon}
                          alt="Upload"
                          className="h-4 w-4 object-contain logo-nebula-mint"
                        />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          ref={fileInputRef}
                        />
                      </label>
                      <span className="text-nebula-mint/60 text-sm">or</span>
                      <span className="text-nebula-mint/40 text-sm">
                        Paste (Ctrl+V) / Drag & Drop
                      </span>
                      {formData.image && (
                        <button
                          type="button"
                          className="btn-secondary text-xs px-2 py-1"
                          onClick={handleDeleteImage}
                        >
                          Delete Image
                        </button>
                      )}
                    </div>
                    <p className="text-nebula-mint/40 text-xs text-center mt-2">
                      Max 5MB
                    </p>
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-2">
                        Preview:
                      </p>
                      <img
                        src={tempPreview || formData.image}
                        alt="Certificate Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Certificate Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    value={formData.credentialId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., AWS-123456789"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Verification URL
                  </label>
                  <input
                    type="url"
                    name="credentialUrl"
                    value={formData.credentialUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., https://aws.amazon.com/verification"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="Describe the certificate, level, skills covered, validity period, achievements..."
                />
              </div>

              <div className="flex space-x-3">
                <button onClick={handleSave} className="btn-primary">
                  {editingId ? "Update" : "Add"} Certificate
                </button>
                <button onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleUndo} className="btn-secondary">
                  Undo
                </button>
              </div>
            </div>
          </PopupModal>
        ) : null}

        {/* Certificates List */}
        <div className="space-y-4">
          {certificates.length === 0 && (
            <div className="text-nebula-mint/60 text-center py-8">
              No Certificates found
            </div>
          )}
          {certificates.map((cert) => (
            <div key={cert.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Show image if present */}
                  {cert.image && (
                    <img
                      src={cert.image}
                      alt="Certificate"
                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-purple/30 mb-2"
                    />
                  )}
                  <h3 className="text-xl font-bold text-nebula-mint">
                    {cert.title}
                  </h3>
                  <p className="text-stellar-blue text-lg">{cert.issuer}</p>
                  {cert.credentialId && (
                    <p className="text-nebula-mint/60 text-sm">
                      ID: {cert.credentialId}
                    </p>
                  )}
                  <p className="text-nebula-mint/80 mt-2">{cert.description}</p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stellar-blue hover:text-nebula-mint text-sm mt-2 inline-block"
                    >
                      Verify Certificate
                    </a>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button onClick={() => handleEdit(cert)} className="btn-edit">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="btn-secondary text-xs bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 px-2 py-1 flex items-center space-x-1"
                  >
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminCertificates;
