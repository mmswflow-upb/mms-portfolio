import { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import educationIcon from "../../assets/info/education.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import uploadIcon from "../../assets/buttons/upload.png";
import PopupModal from "../PopupModal";
import {
  uploadEducationImage,
  deleteEducationImage,
} from "../../services/educationService";

const AdminEducation = () => {
  const { data, updateData, addItem, removeItem } = useData();
  const { education } = data;
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    description: "",
    image: "",
    gpa: "",
    fieldOfStudy: "",
    subjects: "",
    imageFileName: "",
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
      description: edu.description || "",
      image: edu.image || "",
      gpa: edu.gpa || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      subjects: (edu.subjects || []).join(", "),
      imageFileName: edu.imageFileName || "",
    });
    originalDataRef.current = {
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: isPresent ? "" : edu.endDate || "",
      isPresent: isPresent,
      description: edu.description || "",
      image: edu.image || "",
      gpa: edu.gpa || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      subjects: (edu.subjects || []).join(", "),
      imageFileName: edu.imageFileName || "",
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
      description: "",
      image: "",
      gpa: "",
      fieldOfStudy: "",
      subjects: "",
      imageFileName: "",
    });
    originalDataRef.current = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      image: "",
      gpa: "",
      fieldOfStudy: "",
      subjects: "",
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
      subjects: formData.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter((subject) => subject),
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
      description: "",
      image: "",
      gpa: "",
      fieldOfStudy: "",
      subjects: "",
      imageFileName: "",
    });
    originalDataRef.current = {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      image: "",
      gpa: "",
      fieldOfStudy: "",
      subjects: "",
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
                    Field of Study
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Computer Science, Software Engineering"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    GPA
                  </label>
                  <input
                    type="text"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., 3.8/4.0"
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
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
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
          {education.map((edu) => (
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
                  {edu.fieldOfStudy && (
                    <p className="text-nebula-mint/60 text-sm">
                      {edu.fieldOfStudy}
                    </p>
                  )}
                  {edu.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      {edu.location}
                    </p>
                  )}
                  <p className="text-nebula-mint/60">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </p>
                  {edu.gpa && (
                    <p className="text-nebula-mint/60 text-sm">
                      GPA: {edu.gpa}
                    </p>
                  )}
                  <p className="text-nebula-mint/80 mt-2">{edu.description}</p>
                  {(edu.subjects || []).length > 0 && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-2">
                        Relevant Subjects:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {edu.subjects.map((subject, index) => (
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
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminEducation;
