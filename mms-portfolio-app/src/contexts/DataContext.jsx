import { createContext, useContext, useState, useEffect } from "react";
import { getAboutMe, updateAboutMe } from "../services/aboutMeService";
import { getJobs, addJob, updateJob, deleteJob } from "../services/jobsService";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../services/projectsService";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../services/educationService";
import {
  getCertificates,
  addCertificate,
  updateCertificate,
  deleteCertificate,
} from "../services/certificatesService";
import {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
} from "../services/organizationsService";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    personal: null,
    experience: [],
    projects: [],
    education: [],
    certificates: [],
    organizations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load all data from Firebase on mount
  useEffect(() => {
    const loadAllData = async () => {
      if (isInitialized) return; // Prevent duplicate loading

      setIsLoading(true);
      try {
        const [
          personalData,
          experienceData,
          projectsData,
          educationData,
          certificatesData,
          organizationsData,
        ] = await Promise.all([
          getAboutMe(),
          getJobs(),
          getProjects(),
          getEducation(),
          getCertificates(),
          getOrganizations(),
        ]);

        setData({
          personal: personalData || {},
          experience: experienceData || [],
          projects: projectsData || [],
          education: educationData || [],
          certificates: certificatesData || [],
          organizations: organizationsData || [],
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadAllData();
  }, [isInitialized]);

  // CRUD operations for each section
  const updateData = async (section, newData, id) => {
    try {
      switch (section) {
        case "personal":
          await updateAboutMe(newData);
          setData((prev) => ({ ...prev, personal: newData }));
          break;
        case "experience":
          await updateJob(id, newData);
          setData((prev) => ({
            ...prev,
            experience: prev.experience.map((item) =>
              item.id === id ? { ...item, ...newData } : item
            ),
          }));
          break;
        case "projects":
          await updateProject(id, newData);
          setData((prev) => ({
            ...prev,
            projects: prev.projects.map((item) =>
              item.id === id ? { ...item, ...newData } : item
            ),
          }));
          break;
        case "education":
          await updateEducation(id, newData);
          setData((prev) => ({
            ...prev,
            education: prev.education.map((item) =>
              item.id === id ? { ...item, ...newData } : item
            ),
          }));
          break;
        case "certificates":
          await updateCertificate(id, newData);
          setData((prev) => ({
            ...prev,
            certificates: prev.certificates.map((item) =>
              item.id === id ? { ...item, ...newData } : item
            ),
          }));
          break;
        case "organizations":
          await updateOrganization(id, newData);
          setData((prev) => ({
            ...prev,
            organizations: prev.organizations.map((item) =>
              item.id === id ? { ...item, ...newData } : item
            ),
          }));
          break;
        default:
          console.warn(`Unknown section: ${section}`);
          return;
      }
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      throw error;
    }
  };

  const addItem = async (section, item) => {
    let newItem = null;
    switch (section) {
      case "experience":
        newItem = await addJob(item);
        break;
      case "projects":
        newItem = await addProject(item);
        break;
      case "education":
        newItem = await addEducation(item);
        break;
      case "certificates":
        newItem = await addCertificate(item);
        break;
      case "organizations":
        newItem = await addOrganization(item);
        break;
      default:
        return;
    }
    // Refetch all data for consistency
    const [
      personalData,
      experienceData,
      projectsData,
      educationData,
      certificatesData,
      organizationsData,
    ] = await Promise.all([
      getAboutMe(),
      getJobs(),
      getProjects(),
      getEducation(),
      getCertificates(),
      getOrganizations(),
    ]);
    setData({
      personal: personalData || {},
      experience: experienceData || [],
      projects: projectsData || [],
      education: educationData || [],
      certificates: certificatesData || [],
      organizations: organizationsData || [],
    });
  };

  const removeItem = async (section, id) => {
    switch (section) {
      case "experience":
        await deleteJob(id);
        break;
      case "projects":
        await deleteProject(id);
        break;
      case "education":
        await deleteEducation(id);
        break;
      case "certificates":
        await deleteCertificate(id);
        break;
      case "organizations":
        await deleteOrganization(id);
        break;
      default:
        return;
    }
    // Refetch all data for consistency
    const [
      personalData,
      experienceData,
      projectsData,
      educationData,
      certificatesData,
      organizationsData,
    ] = await Promise.all([
      getAboutMe(),
      getJobs(),
      getProjects(),
      getEducation(),
      getCertificates(),
      getOrganizations(),
    ]);
    setData({
      personal: personalData || {},
      experience: experienceData || [],
      projects: projectsData || [],
      education: educationData || [],
      certificates: certificatesData || [],
      organizations: organizationsData || [],
    });
  };

  const value = {
    data,
    isLoading,
    updateData,
    addItem,
    removeItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
