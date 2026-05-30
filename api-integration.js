// ===== API CONFIGURATION =====
const supabaseUrl = "https://zbmuvcegrtdhlwthhtaa.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXV2Y2VncnRkaGx3dGhodGFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDM3MDEsImV4cCI6MjA5NTU3OTcwMX0.US3YMlrdgPh2e0Z-vY2jq8pSoOZiiIvYTW9XgVhh2R4";

const supabaseClient = supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// ===== CONTACT FORM SUBMISSION =====
async function submitContactForm(formData) {
  try {
    const { error } = await supabaseClient
      .from("contact_messages")
      .insert([formData]);

    if (error) {
      console.error(error);
      showNotification("Error submitting form", "error");
      return false;
    }

    showNotification("Message sent successfully!", "success");
    return true;

  } catch (error) {
    console.error(error);
    showNotification("submitting went wrong", "error");
    return false;
  }

    const data = await response.json();

    if (data.success) {
      showNotification('Thank you for your message! We will contact you soon.', 'success');
      document.getElementById('contactForm').reset();
      return true;
    } else {
      showNotification(data.message || 'Error submitting form. Please try again.', 'error');
      return false;
    }
  

// ===== CONSULTATION BOOKING =====
async function submitConsultationForm(formData) {
  try {
    const { data, error } = await supabaseClient
      .from("contact_messages")
      .insert([
        {
          fullName,
          email,
          company,
          phone,
          service,
          message,
        },
      ]);

    if (error) {
      console.error(error);
      showNotification("Error submitting form", "error");
    } else {
      showNotification("Message sent successfully!", "success");
      document.getElementById("contactForm").reset();
    }

    const data = await response.json();

    if (data.success) {
      showNotification('Consultation scheduled! We will contact you to confirm.', 'success');
      closeModal('consultationModal');
      document.getElementById('consultationForm').reset();
      return true;
    } else {
      showNotification(data.message || 'Error scheduling consultation. Please try again.', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Error scheduling consultation. Please try again later.', 'error');
    return false;
  }
}

// ===== ADMIN LOGIN =====
async function adminLogin(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token in localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      return data.token;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// ===== GET AUTHORIZATION HEADER =====
function getAuthHeader() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ===== FETCH CONTACTS (ADMIN) =====
async function fetchContacts(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contact?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeader(),
      }
    );

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

// ===== FETCH CONTACT STATS (ADMIN) =====
async function fetchContactStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/stats`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (data.success) {
      return data.stats;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

// ===== FETCH CONSULTATIONS (ADMIN) =====
async function fetchConsultations(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/consultation?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeader(),
      }
    );

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching consultations:', error);
    throw error;
  }
}

// ===== FETCH CONSULTATION STATS (ADMIN) =====
async function fetchConsultationStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/consultation/stats`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (data.success) {
      return data.stats;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

// ===== UPDATE CONTACT (ADMIN) =====
async function updateContact(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Contact updated successfully', 'success');
      return data.contact;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    showNotification('Error updating contact', 'error');
    throw error;
  }
}

// ===== DELETE CONTACT (ADMIN) =====
async function deleteContact(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Contact deleted successfully', 'success');
      return true;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    showNotification('Error deleting contact', 'error');
    throw error;
  }
}

// ===== UPDATE CONTACT FORM INITIALIZATION =====
// Update the initContactForm function in your main HTML to use the API

function initContactFormWithAPI() {
  const contactForm = document.getElementById('contactForm');
  const consultationForm = document.getElementById('consultationForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
      };

      await submitContactForm(formData);
    });
  }

  if (consultationForm) {
    consultationForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById('consultName').value,
        email: document.getElementById('consultEmail').value,
        company: document.getElementById('consultCompany').value,
        service: document.getElementById('consultService').value,
      };

      await submitConsultationForm(formData);
    });
  }
}

// Call this function instead of initContactForm() in DOMContentLoaded
// initContactFormWithAPI();
