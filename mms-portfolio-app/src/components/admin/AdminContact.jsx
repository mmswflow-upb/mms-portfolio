import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import contactIcon from "../../assets/info/contact.png";
import emailIcon from "../../assets/info/email.png";
import linkedinIcon from "../../assets/info/linkedin.png";
import githubIcon from "../../assets/info/github.png";
import phoneIcon from "../../assets/info/phone.png";
import AdminSectionWrapper from "./AdminSectionWrapper";
import editIcon from "../../assets/buttons/edit.png";
import plusIcon from "../../assets/buttons/plus.png";
import deleteIcon from "../../assets/buttons/delete.png";
import PopupModal from "../PopupModal";

const AdminContact = () => {
  const { data, updateData, isLoading } = useData();
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    value: "",
  });
  const [headerFormData, setHeaderFormData] = useState({
    title: "",
    subtitle: "",
  });

  const icon = (
    <img
      src={contactIcon}
      alt="Contact Settings"
      className="h-8 w-8 object-contain logo-nebula-mint"
    />
  );

  const contactIcons = {
    Email: emailIcon,
    LinkedIn: linkedinIcon,
    GitHub: githubIcon,
    Phone: phoneIcon,
  };

  const handleEdit = (method) => {
    setEditingId(method.id);
    setFormData({
      type: method.type,
      value: method.value,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      type: "",
      value: "",
    });
  };

  const handleSave = async () => {
    try {
      const newMethod = {
        ...formData,
        id:
          editingId ||
          Math.max(
            ...(data.personal?.contact?.methods || []).map((m) => m.id),
            0
          ) + 1,
      };

      let updatedMethods;
      if (editingId) {
        updatedMethods = (data.personal?.contact?.methods || []).map((method) =>
          method.id === editingId ? newMethod : method
        );
      } else {
        updatedMethods = [
          ...(data.personal?.contact?.methods || []),
          newMethod,
        ];
      }

      const updatedPersonal = {
        ...data.personal,
        contact: {
          ...data.personal?.contact,
          methods: updatedMethods,
        },
      };

      await updateData("personal", updatedPersonal);
      handleCancel();
    } catch (error) {
      console.error("Error saving contact method:", error);
      alert("Error saving contact method. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this contact method?")
    ) {
      try {
        const updatedMethods = (data.personal?.contact?.methods || []).filter(
          (method) => method.id !== id
        );

        const updatedPersonal = {
          ...data.personal,
          contact: {
            ...data.personal?.contact,
            methods: updatedMethods,
          },
        };

        await updateData("personal", updatedPersonal);
      } catch (error) {
        console.error("Error deleting contact method:", error);
        alert("Error deleting contact method. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      type: "",
      value: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setHeaderFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactInfoSave = async () => {
    try {
      const updatedPersonal = {
        ...data.personal,
        contact: {
          ...data.personal?.contact,
          title: headerFormData.title,
          subtitle: headerFormData.subtitle,
        },
      };
      await updateData("personal", updatedPersonal);
      setIsEditingHeader(false);
    } catch (error) {
      console.error("Error updating contact info:", error);
      alert("Error updating contact info. Please try again.");
    }
  };

  const handleContactHeaderEdit = () => {
    setHeaderFormData({
      title: data.personal?.contact?.title || "",
      subtitle: data.personal?.contact?.subtitle || "",
    });
    setIsEditingHeader(true);
  };

  const handleContactHeaderCancel = () => {
    setHeaderFormData({
      title: data.personal?.contact?.title || "",
      subtitle: data.personal?.contact?.subtitle || "",
    });
    setIsEditingHeader(false);
  };

  if (isLoading) {
    return (
      <AdminSectionWrapper
        id="admin-contact"
        title="Manage Contact"
        icon={icon}
        description="Update your contact information and methods."
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-nebula-mint">Loading...</div>
        </div>
      </AdminSectionWrapper>
    );
  }

  const contact = data.personal?.contact || {
    title: "",
    subtitle: "",
    methods: [],
  };

  return (
    <AdminSectionWrapper
      id="admin-contact"
      title="Manage Contact"
      icon={icon}
      description="Update your contact information and methods."
    >
      <div className="space-y-8">
        {/* Contact Header Info */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-nebula-mint">
              Contact Header Information
            </h3>
            {!isEditingHeader && (
              <button onClick={handleContactHeaderEdit} className="btn-edit">
                <img
                  src={editIcon}
                  alt="Edit"
                  className="h-4 w-4 object-contain logo-nebula-mint"
                />
                <span>Edit Header</span>
              </button>
            )}
          </div>

          {!isEditingHeader ? (
            // Preview Mode
            <div className="space-y-4">
              <div>
                <p className="text-nebula-mint/60 text-sm">Title</p>
                <p className="text-nebula-mint font-semibold">
                  {contact.title || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-nebula-mint/60 text-sm">Subtitle</p>
                <p className="text-nebula-mint/80">
                  {contact.subtitle || "Not set"}
                </p>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={headerFormData.title}
                  onChange={handleContactInfoChange}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., Let's Connect"
                />
              </div>
              <div>
                <label className="block text-nebula-mint text-sm font-medium mb-2">
                  Subtitle
                </label>
                <textarea
                  name="subtitle"
                  value={headerFormData.subtitle}
                  onChange={handleContactInfoChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                  placeholder="e.g., Ready to collaborate on your next project? Let's build something amazing together."
                />
              </div>
              <div className="flex space-x-3">
                <button onClick={handleContactInfoSave} className="btn-primary">
                  Save Changes
                </button>
                <button
                  onClick={handleContactHeaderCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Methods */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-nebula-mint">
              Contact Methods
            </h3>
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
                <span>Add Contact Method</span>
              </button>
            </div>
          </div>

          {/* Add/Edit Form in PopupModal */}
          {(isAdding || editingId) && (
            <PopupModal
              isOpen={isAdding || editingId}
              onClose={handleCancel}
              title={
                editingId ? "Edit Contact Method" : "Add New Contact Method"
              }
            >
              <div className="space-y-4">
                {/* Contact Method Information - Grouped Small Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-nebula-mint text-sm font-medium mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                      style={{
                        backgroundColor: "rgba(48, 30, 103, 0.2)",
                        color: "#B6EADA",
                      }}
                    >
                      <option
                        value=""
                        style={{ backgroundColor: "#03001C", color: "#B6EADA" }}
                      >
                        Select a type
                      </option>
                      <option
                        value="Email"
                        style={{ backgroundColor: "#03001C", color: "#B6EADA" }}
                      >
                        Email
                      </option>
                      <option
                        value="LinkedIn"
                        style={{ backgroundColor: "#03001C", color: "#B6EADA" }}
                      >
                        LinkedIn
                      </option>
                      <option
                        value="GitHub"
                        style={{ backgroundColor: "#03001C", color: "#B6EADA" }}
                      >
                        GitHub
                      </option>
                      <option
                        value="Phone"
                        style={{ backgroundColor: "#03001C", color: "#B6EADA" }}
                      >
                        Phone
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-nebula-mint text-sm font-medium mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint focus:outline-none focus:border-stellar-blue"
                      placeholder="e.g., mario@developer.com"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button onClick={handleSave} className="btn-primary">
                    {editingId ? "Update" : "Add"} Contact Method
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </PopupModal>
          )}

          {/* Contact Methods List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(contact.methods || []).map((method) => (
              <div key={method.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      {contactIcons[method.type] && (
                        <img
                          src={contactIcons[method.type]}
                          alt={method.type}
                          className="h-5 w-5 object-contain logo-nebula-mint flex-shrink-0"
                        />
                      )}
                      <h3 className="text-lg font-bold text-nebula-mint truncate">
                        {method.type}
                      </h3>
                    </div>
                    <p className="text-stellar-blue break-all">
                      {method.value}
                    </p>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleEdit(method)}
                      className="btn-edit px-2 py-1 text-xs"
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="h-3 w-3 object-contain logo-nebula-mint"
                      />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
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
      </div>
    </AdminSectionWrapper>
  );
};

export default AdminContact;
