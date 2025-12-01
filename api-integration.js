// api-integration.js - UPDATED VERSION
// Use localhost since your server runs there, ngrok will forward to it
const API_BASE_URL = `${window.location.origin}/api`;
console.log('🌐 API URL:', API_BASE_URL);

// API Helper Functions
const API = {
  // Create or get participant
  async getParticipant(email) {
    console.log("getParticipant called with:", email);
    try {
      const response = await fetch(`${API_BASE_URL}/participant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      console.log("participant response status:", response.status);
      const data = await response.json();
      console.log("participant response json:", data);
      return data.success ? data.participant : null;
    } catch (error) {
      console.error('Error getting participant:', error);
      return null;
    }
  },

  // Save learning session
  async saveSession(participantId, day, trials) {
    console.log('Saving session data:', { participantId, day, trials });
    try {
      const response = await fetch(`${API_BASE_URL}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, day, trials })
      });
      console.log('Session save response status:', response.status);
      const result = await response.json();
      console.log('Session save response:', result);
      return result;
    } catch (error) {
      console.error('Error saving session:', error);
      return { success: false };
    }
  },

  // Save baseline test
  async saveBaseline(participantId, answers, score) {
    const payload = { participantId, answers, score };
    console.log('Client Sending Baseline Payload:', payload);
    try {
      const response = await fetch(`${API_BASE_URL}/baseline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving baseline:', error);
      return { success: false };
    }
  },

  // Save memory test
  async saveTest(participantId, testDay, answers, score) {
    try {
      const response = await fetch(`${API_BASE_URL}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, testDay, answers, score })
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving test:', error);
      return { success: false };
    }
  }
};

// Event listeners for data sending
window.addEventListener('baselineComplete', async (event) => {
  const { participantId, answers, score } = event.detail;
  const result = await API.saveBaseline(participantId, answers, score);
  console.log('✅ Baseline data sent to server:', result);
});

window.addEventListener('sessionComplete', async (event) => {
  const { participantId, day, trials } = event.detail;
  const result = await API.saveSession(participantId, day, trials);
  console.log(`✅ Day ${day} session data sent to server:`, result);
});

window.addEventListener('testComplete', async (event) => {
  const { participantId, testDay, answers, score } = event.detail;
  const result = await API.saveTest(participantId, testDay, answers, score);
  console.log(`✅ Day ${testDay} test data sent to server:`, result);
});