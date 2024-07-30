export default {
  data() {
    return {
      questions: [
        {
          question: 'What is your primary business goal?',
          options: [
            'Increase sales',
            'Improve operational efficiency',
            'Expand to new markets',
            'Other'
          ],
          answer: ''
        },
        {
          question: 'Which area do you believe A.I. could benefit your business the most?',
          options: [
            'Customer service',
            'Sales and marketing',
            'Operations',
            'Product development'
          ],
          answer: ''
        },
        {
          question: 'What is your preferred timeframe for seeing results?',
          options: [
            '1-3 months',
            '3-6 months',
            '6-12 months',
            'More than a year'
          ],
          answer: ''
        }
      ],
      additionalInfo: '',
      apiError: false,
      apiErrorMsg: '',
      formSubmitted: false,
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('https://quiz-app-nxsw.onrender.com/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answers: this.questions.map(q => q.answer),
            additionalInfo: this.additionalInfo,
          })
        });

        console.log(`Response: ${JSON.stringify(response)}`);

        if (!response.ok) {
          throw new Error('Failed to connect to the API');
        }

        const data = await response.json();
        this.formSubmitted = true;
        const a = document.createElement('a');
        a.href = data.downloadUrl;
        a.download = 'AI_Business_Insights_Report.pdf';
        a.click();
      } catch (error) {
        this.apiError = true;
        this.apiErrorMsg = error.message;
        // Fallback to Formspree if API fails
        await fetch('https://formspree.io/f/mnnapkre', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subject: 'A.I. API is down - AI Business Insights Report',
            answers: this.questions.map(q => q.answer),
            additionalInfo: this.additionalInfo,
          })
        });
        alert('The A.I. API is down. Your request has been sent to Daley and you will receive your report shortly.');
      }
    }
  },
  template: `
    <form @submit.prevent="submitForm">
      <div v-for="(question, index) in questions" :key="index">
        <p>{{ question.question }}</p>
        <div v-for="option in question.options" :key="option">
          <input type="radio" :name="'question' + index" :value="option" v-model="question.answer" required> {{ option }}
        </div>
      </div>
      <p>Any additional information?</p>
      <textarea v-model="additionalInfo"></textarea>
      <button type="submit">Submit</button>
      <div v-if="apiError" class="error">
        <p>There was an error processing your request: {{ apiErrorMsg }}</p>
      </div>
      <div v-if="formSubmitted">
        <p>Thank you! Your report is being generated.</p>
      </div>
    </form>
  `
};
