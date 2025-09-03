import { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import educationIcon from "../../assets/info/education.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import uploadIcon from "../../assets/buttons/upload.png";
import externalLinkIcon from "../../assets/info/external-link.png";
import twitterIcon from "../../assets/info/twitter.png";
import instagramIcon from "../../assets/info/instagram.png";
import youtubeIcon from "../../assets/info/youtube.png";
import PopupModal from "../PopupModal";
import {
  uploadEducationImage,
  deleteEducationImage,
} from "../../services/educationService";
import Pagination from "./Pagination";
import { parseEscapedCommaList } from "../../utils/stringUtils";
import { calculateShortPeriod } from "../../utils/periodUtils";

const AdminEducation = () => {
  const { data, updateData, addItem, removeItem } = useData();
  const { education } = data;
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    shortDescription: "",
    longDescription: "",
    image: "",
    gpa: "",
    subjects: "",
    websiteUrl: "",
    department: "",
    imageFileName: "",
    socialMedia: [],
  });
  const [tempFile, setTempFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const fileInputRef = useRef(null);
  const originalDataRef = useRef({});

  const icon = (
    <img
      src={educationIcon}
      alt="Education Settings"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  const handleEdit = (edu) => {
    setEditingId(edu.id);
    const isPresent = !edu.endDate || edu.endDate === "";
    setFormData({
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: isPresent ? "" : edu.endDate || "",
      isPresent: isPresent,
      shortDescription: edu.shortDescription || "",
      longDescription: edu.longDescription || "",
      image: edu.image || "",
      gpa: edu.gpa || "",
      subjects: (edu.subjects || []).join(", "),
      imageFileName: edu.imageFileName || "",
      websiteUrl: edu.websiteUrl || "",
      department: edu.department || "",
      socialMedia: edu.socialMedia || [],
    });
    originalDataRef.current = {
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: isPresent ? "" : edu.endDate || "",
      isPresent: isPresent,
      shortDescription: edu.shortDescription || "",
      longDescription: edu.longDescription || "",
      image: edu.image || "",
      gpa: edu.gpa || "",
      subjects: (edu.subjects || []).join(", "),
      imageFileName: edu.imageFileName || "",
      websiteUrl: edu.websiteUrl || "",
      department: edu.department || "",
      socialMedia: edu.socialMedia || [],
    };
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      gpa: "",
      subjects: "",
      imageFileName: "",
      websiteUrl: "",
      department: "",
      socialMedia: [],
    });
    originalDataRef.current = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      gpa: "",
      subjects: "",
      imageFileName: "",
      websiteUrl: "",
      department: "",
      socialMedia: [],
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
    // If we're editing an existing education and it has an image, delete it from storage
    if (editingId && formData.imageFileName) {
      try {
        await deleteEducationImage(formData.imageFileName);
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

        const result = await uploadEducationImage(tempFile, oldImageFileName);
        imageUrl = result.downloadURL;
        imageFileName = result.fileName;
      } catch (uploadError) {
        alert("Error uploading image. Please try again.");
        return;
      }
    }

    const newEducation = {
      ...formData,
      image: imageUrl,
      imageFileName: imageFileName,
      subjects: parseEscapedCommaList(formData.subjects || ""),
    };

    try {
      if (editingId) {
        await updateData("education", newEducation, editingId);
      } else {
        await addItem("education", newEducation);
      }
      setTempFile(null);
      setTempPreview(null);
      handleCancel();
    } catch (error) {
      console.error("Error saving education:", error);
      alert("Error saving education. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      try {
        // Find the education to get its imageFileName
        const educationToDelete = education.find((edu) => edu.id === id);

        // Delete the image from storage if it exists
        if (educationToDelete?.imageFileName) {
          try {
            await deleteEducationImage(educationToDelete.imageFileName);
          } catch (error) {
            console.error(
              "Error deleting education image from storage:",
              error
            );
            // Continue with education deletion even if image deletion fails
          }
        }

        // Delete the education from the database
        await removeItem("education", id);
      } catch (error) {
        console.error("Error deleting education:", error);
        alert("Error deleting education. Please try again.");
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
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      gpa: "",
      subjects: "",
      imageFileName: "",
      websiteUrl: "",
      department: "",
      socialMedia: [],
    });
    originalDataRef.current = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      gpa: "",
      subjects: "",
      imageFileName: "",
      websiteUrl: "",
      department: "",
      socialMedia: [],
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

  const formatDateRange = (startDate, endDate) => {
    if (!startDate) return "";

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";

    return `${start} - ${end}`;
  };

  // Pagination logic
  const totalPages = Math.ceil(education.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEducation = education.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const addSocialMedia = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "twitter", url: "" }],
    }));
  };

  const removeSocialMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  const updateSocialMedia = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      ),
    }));
  };

  return (
    <AdminSectionWrapper
      id="admin-education"
      title="Manage Education"
      icon={icon}
      description="Add, edit, or remove education entries."
    >
      <div className="space-y-6">
        {/* Add New Education Button */}
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
            <span>Add Education</span>
          </button>
        </div>

        {/* Add/Edit Form in PopupModal */}
        {isAdding || editingId ? (
          <PopupModal
            isOpen={isAdding || editingId}
            onClose={handleCancel}
            title={editingId ? "Edit Education" : "Add New Education"}
          >
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Institution Logo / Diploma Image
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
                        alt="Education Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Education Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Bachelor of Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., University of Technology"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., School of Engineering, Faculty of Science"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Avg Grade
                  </label>
                  <input
                    type="text"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., 3.8/4.0, 85%, A-"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.isPresent}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200"
                  />
                </div>
              </div>

              {/* Computed Period Display */}
              {(formData.startDate || formData.endDate) && (
                <div className="bg-cosmic-purple/10 border border-cosmic-purple/20 rounded-lg p-3">
                  <p className="text-nebula-mint/80 text-sm font-medium mb-1">
                    Computed Period:
                  </p>
                  <p className="text-stellar-blue text-sm">
                    {calculateShortPeriod(
                      formData.startDate,
                      formData.isPresent ? "Present" : formData.endDate
                    )}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPresent"
                  name="isPresent"
                  checked={formData.isPresent}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      isPresent: e.target.checked,
                      endDate: e.target.checked ? "" : prev.endDate,
                    }));
                  }}
                  className="w-4 h-4 text-stellar-blue bg-cosmic-purple/20 border-cosmic-purple/30 rounded focus:ring-stellar-blue focus:ring-2"
                />
                <label htmlFor="isPresent" className="text-nebula-mint text-sm">
                  Currently studying here
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="Brief description of your educational achievements"
                />
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Long Description
                </label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="Describe your educational achievements, focus areas, honors, thesis, relevant coursework..."
                />
              </div>

              {/* Subjects */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Preferred Subjects (comma-separated)
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., Algorithms, Databases, AI"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., https://www.university.edu"
                />
              </div>

              {/* Social Media Links */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-nebula-mint text-sm font-medium">
                    Social Media Links
                  </label>
                  <button
                    type="button"
                    onClick={addSocialMedia}
                    className="btn-secondary text-xs px-2 py-1 flex items-center space-x-1"
                  >
                    <img
                      src={plusIcon}
                      alt="Add"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    <span>Add Social Media</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.socialMedia.map((social, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={social.platform}
                        onChange={(e) =>
                          updateSocialMedia(index, "platform", e.target.value)
                        }
                        className="px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                      >
                        <option
                          value="twitter"
                          className="bg-deep-space text-nebula-mint"
                        >
                          Twitter
                        </option>
                        <option
                          value="instagram"
                          className="bg-deep-space text-nebula-mint"
                        >
                          Instagram
                        </option>
                        <option
                          value="youtube"
                          className="bg-deep-space text-nebula-mint"
                        >
                          YouTube
                        </option>
                      </select>
                      <input
                        type="url"
                        value={social.url}
                        onChange={(e) =>
                          updateSocialMedia(index, "url", e.target.value)
                        }
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialMedia(index)}
                        className="btn-secondary text-xs px-2 py-1 flex items-center space-x-1 text-red-400 hover:text-red-300"
                      >
                        <img
                          src={deleteIcon}
                          alt="Remove"
                          className="h-3 w-3 object-contain logo-nebula-mint"
                        />
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                  {formData.socialMedia.length === 0 && (
                    <p className="text-nebula-mint/40 text-sm">
                      No social media links added. Click "Add Social Media" to
                      add one.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-nebula-mint/60 text-xs mb-1">Preview:</p>
                <div className="flex flex-wrap gap-2">
                  {parseEscapedCommaList(formData.subjects || "").map(
                    (subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-xs"
                      >
                        {subject}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={handleSave} className="btn-primary">
                  {editingId ? "Update" : "Add"} Education
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

        {/* Education List */}
        <div className="space-y-4">
          {education.length === 0 && (
            <div className="text-nebula-mint/60 text-center py-8">
              No Education found
            </div>
          )}
          {currentEducation.map((edu) => (
            <div key={edu.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Show image if present */}
                  {edu.image && (
                    <img
                      src={edu.image}
                      alt="Education"
                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-purple/30 mb-2"
                    />
                  )}
                  <h3 className="text-xl font-bold text-nebula-mint">
                    {edu.degree}
                  </h3>
                  <p className="text-stellar-blue text-lg">{edu.institution}</p>
                  {edu.department && (
                    <p className="text-nebula-mint/60 text-sm">
                      {edu.department}
                    </p>
                  )}
                  {edu.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      {edu.location}
                    </p>
                  )}
                  <p className="text-nebula-mint/60">
                    {formatDateRange(edu.startDate, edu.endDate)} •{" "}
                    {calculateShortPeriod(edu.startDate, edu.endDate)}
                  </p>
                  {edu.gpa && (
                    <p className="text-nebula-mint/60 text-sm">
                      Avg Grade: {edu.gpa}
                    </p>
                  )}
                  <pre className="text-nebula-mint/80 mt-2 whitespace-pre-wrap font-sans">
                    {edu.shortDescription}
                  </pre>
                  {edu.longDescription && (
                    <div className="text-nebula-mint/80 mt-1">
                      <span className="font-semibold text-stellar-blue">
                        Long:
                      </span>{" "}
                      <pre className="whitespace-pre-wrap font-sans inline">
                        {edu.longDescription}
                      </pre>
                    </div>
                  )}
                  {edu.subjects && edu.subjects.length > 0 && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-2">
                        Relevant Subjects:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(edu.subjects)
                          ? edu.subjects
                          : parseEscapedCommaList(edu.subjects || "")
                        ).map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {edu.websiteUrl && (
                    <div className="mt-2">
                      <a
                        href={edu.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center space-x-1"
                      >
                        <img
                          src={externalLinkIcon}
                          alt="External Link"
                          className="h-3 w-3 object-contain logo-nebula-mint"
                        />
                        <span>Institution Website</span>
                      </a>
                    </div>
                  )}
                  {(edu.socialMedia || []).length > 0 && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-1">
                        Social Media:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {edu.socialMedia.map((social, index) => {
                          const getSocialIcon = (platform) => {
                            switch (platform) {
                              case "twitter":
                                return twitterIcon;
                              case "instagram":
                                return instagramIcon;
                              case "youtube":
                                return youtubeIcon;
                              default:
                                return externalLinkIcon;
                            }
                          };

                          const getSocialLabel = (platform) => {
                            switch (platform) {
                              case "twitter":
                                return "Twitter";
                              case "instagram":
                                return "Instagram";
                              case "youtube":
                                return "YouTube";
                              default:
                                return (
                                  platform.charAt(0).toUpperCase() +
                                  platform.slice(1)
                                );
                            }
                          };

                          return (
                            <a
                              key={index}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stellar-blue hover:text-nebula-mint text-xs flex items-center space-x-1"
                            >
                              <img
                                src={getSocialIcon(social.platform)}
                                alt={getSocialLabel(social.platform)}
                                className="h-3 w-3 object-contain logo-nebula-mint"
                              />
                              <span>{getSocialLabel(social.platform)}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button onClick={() => handleEdit(edu)} className="btn-edit">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
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

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={education.length}
        />
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminEducation;
