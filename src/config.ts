export const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID
};

export const auth0Config = {
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN
};

export const firebaseConfig = {
  apiKey: 'AIzaSyCNyoC0nvzslpPh_QVVuSwlURbKhbw9nUs',//process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: '1:888470826179:web:fc6ec2df93bb73f5578676',//process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: 'thepublisher-f228b.firebaseapp.com',//process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: '888470826179',
  projectId: 'thepublisher-f228b',
  storageBucket: 'thepublisher-f228b.appspot.com'//process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
};

export const gtmConfig = {
  containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID
};
