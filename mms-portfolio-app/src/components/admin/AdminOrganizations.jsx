import { useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import organizationIcon from "../../assets/info/organization.png";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import uploadIcon from "../../assets/buttons/upload.png";
import externalLinkIcon from "../../assets/info/external-link.png";
import twitterIcon from "../../assets/info/twitter.png";
import instagramIcon from "../../assets/info/instagram.png";
import youtubeIcon from "../../assets/info/youtube.png";
import personIcon from "../../assets/info/person.png";
import briefcaseIcon from "../../assets/info/briefcase.png";
import locationIcon from "../../assets/info/information.png";
import calendarIcon from "../../assets/info/dashboard.png";
import descriptionIcon from "../../assets/info/edit-code.png";
import websiteIcon from "../../assets/info/browser.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import PopupModal from "../PopupModal";
import Pagination from "./Pagination";
import {
  uploadOrganizationImage,
  deleteOrganizationImage,
} from "../../services/organizationsService";

const AdminOrganizations = () => {
  const { data, updateData, addItem, removeItem } = useData();
  const { organizations } = data;
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    shortDescription: "",
    longDescription: "",
    image: "",
    websiteUrl: "",
    imageFileName: "",
    socialMedia: [],
  });
  const [tempFile, setTempFile] = useState(null);
  const [tempPreview, setTempPreview] = useState(null);
  const fileInputRef = useRef(null);
  const originalDataRef = useRef({});

  const icon = (
    <img
      src={organizationIcon}
      alt="Organizations"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  const handleEdit = (org) => {
    setEditingId(org.id);
    const isPresent = !org.endDate || org.endDate === "";
    setFormData({
      name: org.name || "",
      role: org.role || "",
      location: org.location || "",
      startDate: org.startDate || "",
      endDate: isPresent ? "" : org.endDate || "",
      isPresent: isPresent,
      shortDescription: org.shortDescription || "",
      longDescription: org.longDescription || "",
      image: org.image || "",
      websiteUrl: org.websiteUrl || "",
      imageFileName: org.imageFileName || "",
      socialMedia: org.socialMedia || [],
    });
    originalDataRef.current = {
      name: org.name || "",
      role: org.role || "",
      location: org.location || "",
      startDate: org.startDate || "",
      endDate: isPresent ? "" : org.endDate || "",
      isPresent: isPresent,
      shortDescription: org.shortDescription || "",
      longDescription: org.longDescription || "",
      image: org.image || "",
      websiteUrl: org.websiteUrl || "",
      imageFileName: org.imageFileName || "",
      socialMedia: org.socialMedia || [],
    };
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      websiteUrl: "",
      imageFileName: "",
      socialMedia: [],
    });
    originalDataRef.current = {
      name: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      websiteUrl: "",
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
    // If we're editing an existing organization and it has an image, delete it from storage
    if (editingId && formData.imageFileName) {
      try {
        await deleteOrganizationImage(formData.imageFileName);
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

        const result = await uploadOrganizationImage(
          tempFile,
          oldImageFileName
        );
        imageUrl = result.downloadURL;
        imageFileName = result.fileName;
      } catch (uploadError) {
        alert("Error uploading image. Please try again.");
        return;
      }
    }

    const newOrganization = {
      ...formData,
      image: imageUrl,
      imageFileName: imageFileName,
    };

    try {
      if (editingId) {
        await updateData("organizations", newOrganization, editingId);
      } else {
        await addItem("organizations", newOrganization);
      }
      setTempFile(null);
      setTempPreview(null);
      handleCancel();
    } catch (error) {
      console.error("Error saving organization:", error);
      alert("Error saving organization. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        // Find the organization to get its imageFileName
        const organizationToDelete = organizations.find((org) => org.id === id);

        // Delete the image from storage if it exists
        if (organizationToDelete?.imageFileName) {
          try {
            await deleteOrganizationImage(organizationToDelete.imageFileName);
          } catch (error) {
            console.error(
              "Error deleting organization image from storage:",
              error
            );
            // Continue with organization deletion even if image deletion fails
          }
        }

        // Delete the organization from the database
        await removeItem("organizations", id);
      } catch (error) {
        console.error("Error deleting organization:", error);
        alert("Error deleting organization. Please try again.");
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
      name: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      websiteUrl: "",
      imageFileName: "",
      socialMedia: [],
    });
    originalDataRef.current = {
      name: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      isPresent: false,
      shortDescription: "",
      longDescription: "",
      image: "",
      websiteUrl: "",
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
  const totalPages = Math.ceil(organizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrganizations = organizations.slice(startIndex, endIndex);

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
      id="admin-organizations"
      title="Manage Organizations"
      icon={icon}
      description="Add, edit, or remove organizations."
    >
      <div className="space-y-6">
        {/* Add New Organization Button */}
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
            <span>Add Organization</span>
          </button>
        </div>

        {/* Add/Edit Form in PopupModal */}
        {isAdding || editingId ? (
          <PopupModal
            isOpen={isAdding || editingId}
            onClose={handleCancel}
            title={editingId ? "Edit Organization" : "Add New Organization"}
          >
            <div className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Organization Logo / Image
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
                        alt="Organization Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-cosmic-purple/30"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Open Source Initiative"
                  />
                </div>
                <div>
                  <label className="block text-nebula-mint text-sm font-medium mb-2">
                    Role/Position
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                    placeholder="e.g., Contributor, Board Member"
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
                  I currently work here
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
                  placeholder="Brief description of your involvement"
                />
              </div>
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
                  placeholder="Detailed description of your involvement, achievements, and impact..."
                />
              </div>

              {/* URLs */}
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
                  placeholder="e.g., https://organization.com"
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
                  {editingId ? "Update" : "Add"} Organization
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

        {/* Organizations List */}
        <div className="space-y-4">
          {organizations.length === 0 && (
            <div className="text-nebula-mint/60 text-center py-8">
              No Organizations found
            </div>
          )}
          {currentOrganizations.map((org) => (
            <div key={org.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  {/* Show image if present */}
                  {org.image && (
                    <img
                      src={org.image}
                      alt="Organization"
                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-purple/30 mb-2"
                    />
                  )}
                  <h3 className="text-xl font-bold text-nebula-mint">
                    {org.name}
                  </h3>
                  <p className="text-stellar-blue text-lg">{org.role}</p>
                  {org.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      {org.location}
                    </p>
                  )}
                  <p className="text-nebula-mint/60">
                    {formatDateRange(org.startDate, org.endDate)}
                  </p>
                  {org.shortDescription && (
                    <p className="text-nebula-mint/80 mt-2">
                      <span className="font-semibold text-stellar-blue">
                        Short:
                      </span>{" "}
                      {org.shortDescription}
                    </p>
                  )}
                  {org.longDescription && (
                    <p className="text-nebula-mint/80 mt-1">
                      <span className="font-semibold text-stellar-blue">
                        Long:
                      </span>{" "}
                      {org.longDescription}
                    </p>
                  )}
                  {org.websiteUrl && (
                    <div className="flex gap-2 mt-2">
                      {org.websiteUrl && (
                        <a
                          href={org.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center space-x-1"
                        >
                          <img
                            src={externalLinkIcon}
                            alt="Website"
                            className="h-3 w-3 object-contain logo-nebula-mint"
                          />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  )}
                  {(org.socialMedia || []).length > 0 && (
                    <div className="mt-2">
                      <p className="text-nebula-mint/60 text-sm mb-1">
                        Social Media:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {org.socialMedia.map((social, index) => {
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
                  <button onClick={() => handleEdit(org)} className="btn-edit">
                    <img
                      src={editIcon}
                      alt="Edit"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
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
          totalItems={organizations.length}
        />
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminOrganizations;
