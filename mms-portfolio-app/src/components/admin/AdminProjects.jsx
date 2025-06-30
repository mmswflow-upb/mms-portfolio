import { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import projectIcon from "../../assets/info/project.png";
import teamIcon from "../../assets/info/team.png";
import personIcon from "../../assets/info/person.png";
import githubIcon from "../../assets/info/github.png";
import liveIcon from "../../assets/info/pulse.png";
import twitterIcon from "../../assets/info/twitter.png";
import instagramIcon from "../../assets/info/instagram.png";
import youtubeIcon from "../../assets/info/youtube.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import uploadIcon from "../../assets/buttons/upload.png";
import PopupModal from "../PopupModal";
import {
  uploadProjectImage,
  deleteProjectImage,
} from "../../services/projectsService";
import Pagination from "./Pagination";

const AdminProjects = () => {
  const { data, updateData, addItem, removeItem } = useData();
  const { projects } = data;
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    role: "",
    teamType: "single", // "single" or "team"
    technologies: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
    category: "Web", // "Web", "Embedded", "Games", "App Dev"
    imageFileName: "",
    socialMedia: [],
  });
  const [tempFile, setTempFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const fileInputRef = useRef(null);
  const originalDataRef = useRef({});

  const icon = (
    <img
      src={projectIcon}
      alt="Projects"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title || "",
      shortDescription: project.shortDescription || "",
      longDescription: project.longDescription || "",
      role: project.role || "",
      teamType: project.teamType || "single",
      technologies: (project.technologies || []).join(", "),
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category: project.category || "Web",
      imageFileName: project.imageFileName || "",
      socialMedia: project.socialMedia || [],
    });
    originalDataRef.current = {
      title: project.title || "",
      shortDescription: project.shortDescription || "",
      longDescription: project.longDescription || "",
      role: project.role || "",
      teamType: project.teamType || "single",
      technologies: (project.technologies || []).join(", "),
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category: project.category || "Web",
      imageFileName: project.imageFileName || "",
      socialMedia: project.socialMedia || [],
    };
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      shortDescription: "",
      longDescription: "",
      role: "",
      teamType: "single",
      technologies: "",
      image: "",
      githubUrl: "",
      liveUrl: "",
      category: "Web",
      imageFileName: "",
      socialMedia: [],
    });
    originalDataRef.current = {
      title: "",
      shortDescription: "",
      longDescription: "",
      role: "",
      teamType: "single",
      technologies: "",
      image: "",
      githubUrl: "",
      liveUrl: "",
      category: "Web",
      imageFileName: "",
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
    // If we're editing an existing project and it has an image, delete it from storage
    if (editingId && formData.imageFileName) {
      try {
        await deleteProjectImage(formData.imageFileName);
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

        const result = await uploadProjectImage(tempFile, oldImageFileName);
        imageUrl = result.downloadURL;
        imageFileName = result.fileName;
      } catch (uploadError) {
        alert("Error uploading image. Please try again.");
        return;
      }
    }

    const newProject = {
      ...formData,
      image: imageUrl,
      imageFileName: imageFileName,
      technologies: formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech),
    };

    try {
      if (editingId) {
        await updateData("projects", newProject, editingId);
      } else {
        await addItem("projects", newProject);
      }
      setTempFile(null);
      setTempPreview(null);
      handleCancel();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // Find the project to get its imageFileName
        const projectToDelete = projects.find((project) => project.id === id);

        // Delete the image from storage if it exists
        if (projectToDelete?.imageFileName) {
          try {
            await deleteProjectImage(projectToDelete.imageFileName);
          } catch (error) {
            console.error("Error deleting project image from storage:", error);
            // Continue with project deletion even if image deletion fails
          }
        }

        // Delete the project from the database
        await removeItem("projects", id);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Error deleting project. Please try again.");
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
      shortDescription: "",
      longDescription: "",
      role: "",
      teamType: "single",
      technologies: "",
      image: "",
      githubUrl: "",
      liveUrl: "",
      category: "Web",
      imageFileName: "",
      socialMedia: [],
    });
    originalDataRef.current = {
      title: "",
      shortDescription: "",
      longDescription: "",
      role: "",
      teamType: "single",
      technologies: "",
      image: "",
      githubUrl: "",
      liveUrl: "",
      category: "Web",
      imageFileName: "",
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
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

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
      id="admin-projects"
      title="Manage Projects"
      icon={icon}
      description="Add, edit, or remove portfolio projects."
    >
      <div className="space-y-6">
        {/* Add New Project Button */}
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
            <span>Add Project</span>
          </button>
        </div>

        {/* Add/Edit Form in PopupModal */}
        {isAdding || editingId ? (
          <PopupModal
            isOpen={isAdding || editingId}
            onClose={handleCancel}
            title={editingId ? "Edit Project" : "Add New Project"}
          >
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Project Screenshot / Image
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
                        alt="Project Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Space Explorer"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Full Stack Developer, Frontend Lead"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200 [&>option]:bg-deep-space [&>option]:text-nebula-mint"
                >
                  <option
                    value="Web"
                    className="bg-deep-space text-nebula-mint"
                  >
                    Web
                  </option>
                  <option
                    value="Embedded"
                    className="bg-deep-space text-nebula-mint"
                  >
                    Embedded
                  </option>
                  <option
                    value="Games"
                    className="bg-deep-space text-nebula-mint"
                  >
                    Games
                  </option>
                  <option
                    value="App"
                    className="bg-deep-space text-nebula-mint"
                  >
                    App
                  </option>
                  <option
                    value="Algorithms"
                    className="bg-deep-space text-nebula-mint"
                  >
                    Algorithms
                  </option>
                </select>
              </div>

              {/* Team Type Selection */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Project Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="teamType"
                      value="single"
                      checked={formData.teamType === "single"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-stellar-blue bg-cosmic-purple/20 border-cosmic-purple/30 rounded focus:ring-stellar-blue focus:ring-2 checked:bg-stellar-blue checked:border-stellar-blue"
                    />
                    <span className="text-nebula-mint">Individual Project</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="teamType"
                      value="team"
                      checked={formData.teamType === "team"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-stellar-blue bg-cosmic-purple/20 border-cosmic-purple/30 rounded focus:ring-stellar-blue focus:ring-2 checked:bg-stellar-blue checked:border-stellar-blue"
                    />
                    <span className="text-nebula-mint">Team Project</span>
                  </label>
                </div>
              </div>

              {/* URLs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., https://github.com/username/project"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., https://project-demo.com"
                  />
                </div>
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
                  placeholder="Brief description of the project"
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
                  placeholder="Describe your project, features, challenges, and outcomes..."
                />
              </div>

              {/* Technologies */}
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
                  placeholder="e.g., React, Three.js, Node.js, MongoDB, AWS"
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

              <div className="flex space-x-3">
                <button onClick={handleSave} className="btn-primary">
                  {editingId ? "Update" : "Add"} Project
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

        {/* Projects List */}
        <div className="space-y-4">
          {projects.length === 0 && (
            <div className="text-nebula-mint/60 text-center py-8">
              No Projects found
            </div>
          )}
          {currentProjects.map((project) => (
            <div key={project.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Show image if present */}
                  {project.image && (
                    <img
                      src={project.image}
                      alt="Project"
                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-purple/30 mb-2"
                    />
                  )}
                  <h3 className="text-xl font-bold text-nebula-mint">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {project.role && (
                      <p className="text-stellar-blue text-sm font-medium">
                        {project.role}
                      </p>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        project.teamType === "team"
                          ? "bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue"
                          : "bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue"
                      }`}
                    >
                      {project.teamType === "team" ? (
                        <img
                          src={teamIcon}
                          alt="Team"
                          className="h-3 w-3 object-contain logo-nebula-mint"
                        />
                      ) : (
                        <img
                          src={personIcon}
                          alt="Individual"
                          className="h-3 w-3 object-contain logo-nebula-mint"
                        />
                      )}
                      {project.teamType === "team"
                        ? "Team Project"
                        : "Individual"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-cosmic-purple/20 border border-cosmic-purple/30 text-nebula-mint">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-nebula-mint/80 mt-2">
                    {project.shortDescription}
                  </p>
                  {project.longDescription && (
                    <p className="text-nebula-mint/80 mt-1">
                      <span className="font-semibold text-stellar-blue">
                        Long:
                      </span>{" "}
                      {project.longDescription}
                    </p>
                  )}
                  {(project.technologies || []).length > 0 && (
                    <div className="mt-2">
                      <span className="text-nebula-mint/60 text-sm font-semibold mr-2">
                        Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(project.technologies || []).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="flex gap-2 mt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center space-x-1 transition-colors duration-300"
                        >
                          <img
                            src={githubIcon}
                            alt="GitHub"
                            className="h-3 w-3 object-contain logo-nebula-mint"
                          />
                          <span>GitHub</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center space-x-1 transition-colors duration-300"
                        >
                          <img
                            src={liveIcon}
                            alt="Live Demo"
                            className="h-3 w-3 object-contain logo-nebula-mint"
                          />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  )}
                  {(project.socialMedia || []).length > 0 && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-1">
                        Social Media:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.socialMedia.map((social, index) => {
                          const getSocialIcon = (platform) => {
                            switch (platform) {
                              case "twitter":
                                return twitterIcon;
                              case "instagram":
                                return instagramIcon;
                              case "youtube":
                                return youtubeIcon;
                              default:
                                return githubIcon;
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
                  <button
                    onClick={() => handleEdit(project)}
                    className="btn-edit"
                  >
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
          totalItems={projects.length}
        />
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminProjects;
