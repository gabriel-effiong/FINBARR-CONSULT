const API_BASE_URL = (window.FINBARR_API_BASE_URL || "").replace(/\/$/, "");

async function apiRequest(path, options = {}, authenticated = false) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = sessionStorage.getItem("finbarr-admin-token");
  if (authenticated && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const responseText = await response.text();
  let result;
  if (responseText.trim()) {
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      throw new Error(
        `The API returned an invalid response (HTTP ${response.status}). Check that the API is deployed and FINBARR_API_BASE_URL points to it.`,
      );
    }
  }
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error(
      `The API returned an empty response (HTTP ${response.status}). Check that the API is deployed and FINBARR_API_BASE_URL points to it.`,
    );
  }
  if (!response.ok || !result.success) {
    if (response.status === 401) sessionStorage.removeItem("finbarr-admin-token");
    throw new Error(result.message || "The request failed.");
  }
  return result;
}

async function submitContactForm(formData) {
  return apiRequest("/api/contact", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

async function submitConsultationForm(formData) {
  return apiRequest("/api/consultation", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

async function adminLogin(username, password) {
  const result = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  sessionStorage.setItem("finbarr-admin-token", result.token);
  return result;
}

async function fetchContacts(page = 1, limit = 20) {
  return apiRequest(`/api/contact?page=${page}&limit=${limit}`, {}, true);
}

async function fetchConsultations(page = 1, limit = 20) {
  return apiRequest(`/api/consultation?page=${page}&limit=${limit}`, {}, true);
}