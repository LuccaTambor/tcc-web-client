const prod = {
  url: {
   API_URL: 'https://gpmaa-web-api.azurewebsites.net',
  }
 };

 const dev = {
  url: {
   API_URL: ''
  }
 }

 export const config = process.env.NODE_ENV === 'development' ? dev : prod;