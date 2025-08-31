import React, { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import {
  uploadAboutMePhoto,
  deleteAboutMePhoto,
} from "../../services/aboutMeService";
import AdminSectionWrapper from "./AdminSectionWrapper";
import informationIcon from "../../assets/info/information.png";
import editIcon from "../../assets/buttons/edit.png";
import uploadIcon from "../../assets/buttons/upload.png";

const AdminPersonal = () => {
  const { data, updateData, isLoading } = useData();
  const personal = data.personal || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    preferredName: personal.preferredName || "",
    fullName: personal.fullName || "",
    photo: personal.photo || "",
    photoFileName: personal.photoFileName || "",
    languages: (personal.languages || []).join(", "),
    skills: (personal.skills || []).join(", "),
    location: personal.location || "",
    role: personal.role || "",
    description: personal.description || "",
    welcomeMessage: personal.welcomeMessage || "",
    codeSample: personal.codeSample || "",
    repositoryPath: personal.repositoryPath || "",
  });
  // Add state for temporary file upload
  const [tempFile, setTempFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const [deletePhoto, setDeletePhoto] = useState(false);
  const fileInputRef = useRef(null);

  const icon = (
    <img
      src={informationIcon}
      alt="Personal Settings"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  React.useEffect(() => {
    // Sync formData with context data when not editing
    if (!isEditing && personal) {
      setFormData({
        preferredName: personal.preferredName || "",
        fullName: personal.fullName || "",
        photo: personal.photo || "",
        photoFileName: personal.photoFileName || "",
        languages: (personal.languages || []).join(", "),
        skills: (personal.skills || []).join(", "),
        location: personal.location || "",
        role: personal.role || "",
        description: personal.description || "",
        welcomeMessage: personal.welcomeMessage || "",
        codeSample: personal.codeSample || "",
        repositoryPath: personal.repositoryPath || "",
      });
      setDeletePhoto(false);
    }
    // eslint-disable-next-line
  }, [personal, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
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
        photo: previewURL,
        photoFileName: `New file: ${file.name} (will be renamed on save)`,
      }));
      setDeletePhoto(false);
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
            photo: previewURL,
            photoFileName: `New file: ${file.name} (will be renamed on save)`,
          }));
          setDeletePhoto(false);
          break;
        }
      }
    }
  };

  const handleDeletePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: "",
      photoFileName: "",
    }));
    setTempFile(null);
    setTempPreview(null);
    setDeletePhoto(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalPhotoURL = formData.photo;
      let finalPhotoFileName = formData.photoFileName;
      if (deletePhoto && personal.photoFileName) {
        try {
          await deleteAboutMePhoto(personal.photoFileName);
        } catch (deleteError) {
          console.error("Error deleting photo:", deleteError);
          // Don't block save on delete error
        }
        finalPhotoURL = "";
        finalPhotoFileName = "";
      } else if (tempFile) {
        try {
          const oldPhotoFileName = personal.photoFileName;
          const { downloadURL, fileName } = await uploadAboutMePhoto(
            tempFile,
            oldPhotoFileName
          );
          finalPhotoURL = downloadURL;
          finalPhotoFileName = fileName;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          alert("Error uploading image. Please try again.");
          setIsSaving(false);
          return;
        }
      }
      const dataToSave = {
        preferredName: formData.preferredName,
        fullName: formData.fullName,
        photo: finalPhotoURL,
        photoFileName: finalPhotoFileName,
        languages: formData.languages
          .split(",")
          .map((lang) => lang.trim())
          .filter((lang) => lang),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        location: formData.location,
        role: formData.role,
        description: formData.description,
        welcomeMessage: formData.welcomeMessage,
        codeSample: formData.codeSample,
        repositoryPath: formData.repositoryPath,
        contact: personal.contact || { title: "", subtitle: "", methods: [] },
      };
      await updateData("personal", dataToSave);
      setTempFile(null);
      setTempPreview(null);
      setDeletePhoto(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (tempPreview) {
      URL.revokeObjectURL(tempPreview);
    }
    setTempFile(null);
    setTempPreview(null);
    setFormData({
      preferredName: personal.preferredName || "",
      fullName: personal.fullName || "",
      photo: personal.photo || "",
      photoFileName: personal.photoFileName || "",
      languages: (personal.languages || []).join(", "),
      skills: (personal.skills || []).join(", "),
      location: personal.location || "",
      role: personal.role || "",
      description: personal.description || "",
      welcomeMessage: personal.welcomeMessage || "",
      codeSample: personal.codeSample || "",
      repositoryPath: personal.repositoryPath || "",
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <AdminSectionWrapper
        id="admin-personal"
        title="Manage About Me"
        icon={icon}
        description="Edit your personal information and introduction."
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-nebula-mint">Loading...</div>
        </div>
      </AdminSectionWrapper>
    );
  }

  return (
    <AdminSectionWrapper
      id="admin-personal"
      title="Manage About Me"
      icon={icon}
      description="Edit your personal information and introduction."
    >
      <div className="space-y-6">
        {/* Edit Button */}
        <div className="flex justify-end">
          {!isEditing && (
            <button onClick={handleEdit} className="btn-edit">
              <img
                src={editIcon}
                alt="Edit"
                className="h-4 w-4 object-contain logo-nebula-mint"
              />
              <span>Edit About Me</span>
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="card">
            <h3 className="text-xl font-bold text-nebula-mint mb-4">
              Edit Personal Information
            </h3>
            <div className="space-y-4">
              {/* Profile Photo Section */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Profile Photo
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-nebula-mint text-sm font-medium mb-2">
                      Photo URL
                    </label>
                    <input
                      type="text"
                      name="photoFileName"
                      value={formData.photoFileName || formData.photo}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          photoFileName: value,
                          photo: value.startsWith("http") ? value : prev.photo,
                        }));
                        setDeletePhoto(false);
                      }}
                      className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                      placeholder="e.g., about-me/profile-photo_1703123456789_my-photo.jpg"
                    />
                  </div>
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
                          photo: previewURL,
                          photoFileName: `New file: ${file.name} (will be renamed on save)`,
                        }));
                        setDeletePhoto(false);
                      }
                    }}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-nebula-mint/60 text-sm">OR</span>
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
                      {formData.photo && (
                        <button
                          type="button"
                          className="btn-secondary text-xs px-2 py-1"
                          onClick={handleDeletePhoto}
                          disabled={isSaving}
                        >
                          Delete Photo
                        </button>
                      )}
                    </div>
                    <p className="text-nebula-mint/40 text-xs text-center mt-2">
                      Max 5MB
                    </p>
                  </div>
                  {formData.photo && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-2">
                        Preview:
                      </p>
                      <img
                        src={formData.photo}
                        alt="Profile preview"
                        className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <p
                        className="text-red-400 text-sm mt-1"
                        style={{ display: "none" }}
                      >
                        Unable to load image. Please check the URL.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information - Grouped Small Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Mario"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Mohamad-Mario Sakka"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              {/* Welcome Message */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Welcome Message
                </label>
                <input
                  type="text"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., // Welcome to my portfolio"
                />
              </div>

              {/* Repository Path */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  GitHub Repository Path
                </label>
                <input
                  type="text"
                  name="repositoryPath"
                  value={formData.repositoryPath}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., mmswflow-upb/portfolio"
                />
                <p className="text-nebula-mint/60 text-xs mt-1">
                  Format: owner/repository-name (e.g., username/project-name)
                </p>
              </div>

              {/* Description - Converted to Textarea */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="Describe yourself and your expertise..."
                />
              </div>

              {/* Code Sample */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Code Sample (JSON format)
                </label>
                <textarea
                  name="codeSample"
                  value={formData.codeSample}
                  onChange={handleInputChange}
                  rows={12}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue font-mono text-sm"
                  placeholder="Enter your JSON code sample..."
                />
              </div>

              {/* Skills and Languages - Moved to Bottom */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., English, Arabic, French"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., React, Node.js, Firebase"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={isSaving}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {!isEditing && (
          <div className="card">
            <h3 className="text-xl font-bold text-nebula-mint mb-4">
              Current Information
            </h3>
            <div className="space-y-4">
              {/* Profile Photo */}
              <div>
                <p className="text-nebula-mint/60 text-sm">Profile Photo</p>
                {personal.photo ? (
                  <div className="mt-2">
                    <img
                      src={personal.photo}
                      alt="Profile"
                      className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <p
                      className="text-red-400 text-sm mt-1"
                      style={{ display: "none" }}
                    >
                      Unable to load image
                    </p>
                    <p className="text-nebula-mint/60 text-sm mt-1 break-all">
                      {personal.photoFileName || personal.photo}
                    </p>
                  </div>
                ) : (
                  <p className="text-nebula-mint/60 mt-1">No photo set</p>
                )}
              </div>

              {/* Personal Information - Grouped Small Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-nebula-mint/60 text-sm">Preferred Name</p>
                  <p className="text-nebula-mint font-semibold">
                    {personal.preferredName || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-nebula-mint/60 text-sm">Full Name</p>
                  <p className="text-nebula-mint font-semibold">
                    {personal.fullName || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-nebula-mint/60 text-sm">Role</p>
                  <p className="text-nebula-mint font-semibold">
                    {personal.role || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-nebula-mint/60 text-sm">Location</p>
                  <p className="text-nebula-mint font-semibold">
                    {personal.location || "Not set"}
                  </p>
                </div>
              </div>

              {/* Welcome Message */}
              <div>
                <p className="text-nebula-mint/60 text-sm">Welcome Message</p>
                <pre className="text-nebula-mint/80 mt-1 whitespace-pre-wrap font-sans">
                  {personal.welcomeMessage || "Not set"}
                </pre>
              </div>

              {/* Repository Path */}
              <div>
                <p className="text-nebula-mint/60 text-sm">
                  GitHub Repository Path
                </p>
                <p className="text-nebula-mint/80 mt-1">
                  {personal.repositoryPath || "Not set"}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-nebula-mint/60 text-sm">Description</p>
                <pre className="text-nebula-mint/80 mt-1 whitespace-pre-wrap font-sans">
                  {personal.description || "Not set"}
                </pre>
              </div>

              {/* Code Sample */}
              <div>
                <p className="text-nebula-mint/60 text-sm">Code Sample</p>
                <pre className="bg-cosmic-purple/10 rounded-lg p-4 text-nebula-mint font-mono text-xs overflow-x-auto">
                  {personal.codeSample || "Not set"}
                </pre>
              </div>

              {/* Skills and Languages */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-nebula-mint/60 text-sm">Languages</p>
                  <p className="text-nebula-mint/80 mt-1">
                    {(personal.languages || []).join(", ") || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-nebula-mint/60 text-sm">Skills</p>
                  <p className="text-nebula-mint/80 mt-1">
                    {(personal.skills || []).join(", ") || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminPersonal;
