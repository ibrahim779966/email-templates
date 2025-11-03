/**
 * Environment-specific configurations
 */

const environments = {
  development: {
    apiBaseUrl: "http://localhost:3000/api/v1",
    cloudinaryCloudName: "dhlex64es",
    cloudinaryUploadPreset: "newsletter",
    enableLogging: true,
    enableMockData: false,
  },
  staging: {
    apiBaseUrl: "https://staging-api.yourdomain.com/api/v1",
    cloudinaryCloudName: "dhlex64es",
    cloudinaryUploadPreset: "newsletter",
    enableLogging: true,
    enableMockData: false,
  },
  production: {
    apiBaseUrl: "https://api.yourdomain.com/api/v1",
    cloudinaryCloudName: "dhlex64es",
    cloudinaryUploadPreset: "newsletter",
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
