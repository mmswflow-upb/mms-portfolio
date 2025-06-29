import { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import briefcaseIcon from "../../assets/info/briefcase.png";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import uploadIcon from "../../assets/buttons/upload.png";
import externalLinkIcon from "../../assets/info/external-link.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import PopupModal from "../PopupModal";
import Pagination from "./Pagination";
import { uploadJobImage, deleteJobImage } from "../../services/jobsService";

const AdminExperience = () => {
  const { data, updateData, addItem, removeItem } = useData();
  const { experience } = data;
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    description: "",
    technologies: "",
    image: "",
    websiteUrl: "",
    imageFileName: "",
  });
  const [tempFile, setTempFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const fileInputRef = useRef(null);
  // Store the original data for undo
  const originalDataRef = useRef({});

  const icon = (
    <img
      src={briefcaseIcon}
      alt="Experience"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    const isPresent = !exp.endDate || exp.endDate === "";
    setFormData({
      title: exp.title || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: isPresent ? "" : exp.endDate || "",
      isPresent: isPresent,
      description: exp.description || "",
      technologies: (exp.technologies || []).join(", "),
      image: exp.image || "",
      websiteUrl: exp.websiteUrl || "",
      imageFileName: exp.imageFileName || "",
    });
    originalDataRef.current = {
      title: exp.title || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: isPresent ? "" : exp.endDate || "",
      isPresent: isPresent,
      description: exp.description || "",
      technologies: (exp.technologies || []).join(", "),
      image: exp.image || "",
      websiteUrl: exp.websiteUrl || "",
      imageFileName: exp.imageFileName || "",
    };
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      technologies: "",
      image: "",
      websiteUrl: "",
      imageFileName: "",
    });
    originalDataRef.current = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      technologies: "",
      image: "",
      websiteUrl: "",
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
    // If we're editing an existing experience and it has an image, delete it from storage
    if (editingId && formData.imageFileName) {
      try {
        await deleteJobImage(formData.imageFileName);
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

        const result = await uploadJobImage(tempFile, oldImageFileName);
        imageUrl = result.downloadURL;
        imageFileName = result.fileName;
      } catch (uploadError) {
        alert("Error uploading image. Please try again.");
        return;
      }
    }

    // Validate and format website URL
    let websiteUrl = formData.websiteUrl;
    if (websiteUrl && websiteUrl.trim()) {
      // If URL doesn't start with http:// or https://, add https://
      if (!websiteUrl.match(/^https?:\/\//)) {
        websiteUrl = `https://${websiteUrl}`;
      }
    }

    const newExperience = {
      ...formData,
      image: imageUrl,
      imageFileName: imageFileName,
      websiteUrl: websiteUrl,
      technologies: formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech),
    };

    try {
      if (editingId) {
        // Update existing experience
        await updateData("experience", newExperience, editingId);
      } else {
        // Add new experience
        await addItem("experience", newExperience);
      }
      setTempFile(null);
      setTempPreview(null);
      handleCancel();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Error saving experience. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this experience entry?")
    ) {
      try {
        // Find the experience to get its imageFileName
        const experienceToDelete = experience.find((exp) => exp.id === id);

        // Delete the image from storage if it exists
        if (experienceToDelete?.imageFileName) {
          try {
            await deleteJobImage(experienceToDelete.imageFileName);
          } catch (error) {
            console.error(
              "Error deleting experience image from storage:",
              error
            );
            // Continue with experience deletion even if image deletion fails
          }
        }

        // Delete the experience from the database
        await removeItem("experience", id);
      } catch (error) {
        console.error("Error deleting experience:", error);
        alert("Error deleting experience. Please try again.");
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
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      technologies: "",
      image: "",
      websiteUrl: "",
      imageFileName: "",
    });
    originalDataRef.current = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      description: "",
      technologies: "",
      image: "",
      websiteUrl: "",
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
    const formatDate = (dateString) => {
      if (!dateString) return "";
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
  const totalPages = Math.ceil(experience.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperience = experience.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AdminSectionWrapper
      id="admin-experience"
      title="Manage Experience"
      icon={icon}
      description="Add, edit, or remove work experience entries."
    >
      <div className="space-y-6">
        {/* Add New Experience Button */}
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
            <span>Add Experience</span>
          </button>
        </div>

        {/* Add/Edit Form in PopupModal */}
        {isAdding || editingId ? (
          <PopupModal
            isOpen={isAdding || editingId}
            onClose={handleCancel}
            title={editingId ? "Edit Experience" : "Add New Experience"}
          >
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Company Logo / Experience Image
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
                        alt="Experience Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Basic Information - Grouped Small Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Senior Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., TechCorp Solutions"
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
                    placeholder="e.g., New York, NY"
                  />
                </div>
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
                    placeholder="e.g., https://company.com"
                  />
                  <p className="text-nebula-mint/40 text-xs mt-1">
                    Include https:// for proper linking
                  </p>
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
                  className="w-4 h-4 text-stellar-blue bg-cosmic-purple/20 border-cosmic-purple/30 rounded focus:ring-stellar-blue focus:ring-2 checked:bg-stellar-blue checked:border-stellar-blue"
                />
                <label htmlFor="isPresent" className="text-nebula-mint text-sm">
                  I currently work here
                </label>
              </div>
              {/* Description - Enhanced Textarea */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="Describe your role, responsibilities, achievements, and impact..."
                />
              </div>
              {/* Technologies - Moved to Bottom */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., React, Node.js, AWS, Docker, TypeScript, PostgreSQL"
                />
              </div>
              <div className="flex space-x-3">
                <button onClick={handleSave} className="btn-primary">
                  {editingId ? "Update" : "Add"} Experience
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

        {/* Experience List */}
        <div className="space-y-4">
          {experience.length === 0 && (
            <div className="text-nebula-mint/60 text-center py-8">
              No Experience found
            </div>
          )}
          {currentExperience.map((exp) => (
            <div key={exp.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Show image if present */}
                  {exp.image && (
                    <img
                      src={exp.image}
                      alt="Experience"
                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-purple/30 mb-2"
                    />
                  )}
                  <h3 className="text-xl font-bold text-nebula-mint">
                    {exp.title}
                  </h3>
                  <p className="text-stellar-blue text-lg">{exp.company}</p>
                  {exp.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      {exp.location}
                    </p>
                  )}
                  <p className="text-nebula-mint/60">
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </p>
                  <p className="text-nebula-mint/80 mt-2">{exp.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(exp.technologies || []).map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {exp.websiteUrl && (
                    <div className="mt-2">
                      <a
                        href={exp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center space-x-1"
                      >
                        <img
                          src={externalLinkIcon}
                          alt="External Link"
                          className="h-3 w-3 object-contain logo-nebula-mint"
                        />
                        <span>Company Website</span>
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button onClick={() => handleEdit(exp)} className="btn-edit">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
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
          totalItems={experience.length}
        />
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminExperience;
