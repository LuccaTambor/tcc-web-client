const prod = {
  url: {
   API_URL: 'https://tcc-web-api.azurewebsites.net',
  }
 };

 const dev = {
  url: {
   API_URL: ''
  }
 }

 export const config = process.env.NODE_ENV === 'development' ? dev : prod;