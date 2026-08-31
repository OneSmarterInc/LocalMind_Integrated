import { Platform } from "react-native";
import Constants from "expo-constants";

const getBaseUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:8000";
  }
  // Try to read hostUri to support physical devices debugging on local networks.
  // In pure web mode or production fallback, use localhost:8000.
  const debuggerHost = Constants.expoConfig?.hostUri;
  const ip = debuggerHost ? debuggerHost.split(":")[0] : "127.0.0.1";
  return `http://${ip}:8000`;
};

export const API_BASE_URL = getBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;

