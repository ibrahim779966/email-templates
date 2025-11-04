/**
 * Environment-specific configurations - UPDATED FOR AZURE
 * 
 * REPLACE YOUR EXISTING environment.js WITH THIS FILE
 */

const environments = {
  development: {
    apiBaseUrl: "http://localhost:3000/api/v1",
    // REMOVED: Cloudinary configuration
    // ADDED: Azure configuration
    azureStorageAccount: import.meta.env.REACT_APP_AZURE_STORAGE_ACCOUNT || "",
    azureContainerName: import.meta.env.REACT_APP_AZURE_CONTAINER_NAME || "templates",
    enableLogging: true,
    enableMockData: false,
  },
  staging: {
    apiBaseUrl: "https://staging-api.yourdomain.com/api/v1",
    azureStorageAccount: import.meta.env.REACT_APP_AZURE_STORAGE_ACCOUNT || "",
    azureContainerName: import.meta.env.REACT_APP_AZURE_CONTAINER_NAME || "templates",
    enableLogging: true,
    enableMockData: false,
  },
  production: {
    apiBaseUrl: "https://api.yourdomain.com/api/v1",
    azureStorageAccount: import.meta.env.REACT_APP_AZURE_STORAGE_ACCOUNT || "",
    azureContainerName: import.meta.env.REACT_APP_AZURE_CONTAINER_NAME || "templates",
    enableLogging: false,
    enableMockData: false,
  },
};

const currentEnv =
  import.meta.env.REACT_APP_ENV || import.meta.env.NODE_ENV || "development";

export const getCurrentEnvironment = () => currentEnv;

export const getEnvironmentConfig = () =>
  environments[currentEnv] || environments.development;

export default environments[currentEnv] || environments.development;
