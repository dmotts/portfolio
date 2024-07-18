<template>
  <div class="questionnaire">
    <h2>Business A.I. Insights Questionnaire</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Your Name:</label>
        <input type="text" v-model="form.name" required />
      </div>
      <div>
        <label for="email">Your Email:</label>
        <input type="email" v-model="form.email" required />
      </div>
      <div>
        <label for="company">Company Name:</label>
        <input type="text" v-model="form.company" required />
      </div>
      <div>
        <label for="industry">Business Industry:</label>
        <input type="text" v-model="form.industry" required />
      </div>
      <div>
        <label for="size">Business Size:</label>
        <select v-model="form.size">
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
        </select>
      </div>
      <div>
        <label for="challenge">Primary Business Challenge:</label>
        <input type="text" v-model="form.challenge" required />
      </div>
      <div>
        <label for="technology">Current Use of Technology:</label>
        <input type="text" v-model="form.technology" required />
      </div>
      <div>
        <label for="goals">Goals:</label>
        <input type="text" v-model="form.goals" required />
      </div>
      <div>
        <label for="details">Additional Details:</label>
        <textarea v-model="form.details"></textarea>
      </div>
      <button type="submit">Submit</button>
      <div v-if="message" class="message">{{ message }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        company: '',
        industry: '',
        size: 'Small',
        challenge: '',
        technology: '',
        goals: '',
        details: ''
      },
      message: ''
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://localhost:5000/generate-insights', this.form);
        const pdfPath = response.data.pdf_path;
        window.open(`http://localhost:5000/download-pdf?pdf_path=${pdfPath}`, '_blank');
      } catch (error) {
        this.message = 'You will receive your Business A.I. Insights report shortly. Take a deep breath. Our team is processing your request.';
      }
    }
  }
}
</script>

<style scoped>
.questionnaire {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 1rem;
  color: #28a745;
}
</style>
