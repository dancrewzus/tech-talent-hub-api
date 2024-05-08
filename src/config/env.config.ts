const generateDBUri = (user: string, password: string, cluster: string, database: string): string => {
  return `mongodb+srv://${ user }:${ password }@${ cluster }/${ database }?retryWrites=true&w=majority`;
}

export default () => ({
  // MONGODB
  mongoConnection: generateDBUri(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD, process.env.MONGODB_CLUSTER, ''),
  mongoConnectionTest: generateDBUri(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD, process.env.MONGODB_CLUSTER, process.env.MONGODB_NAME_TEST),
  mongoConnectionProd: generateDBUri(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD, process.env.MONGODB_CLUSTER, process.env.MONGODB_NAME_PROD),
  mongoConnectionBackup: generateDBUri(process.env.MONGODB_USER, process.env.MONGODB_PASSWORD, process.env.MONGODB_CLUSTER, process.env.MONGODB_NAME_BACKUP),
  mongoDatabase: process.env.STAGE === 'dev' ? process.env.MONGODB_NAME_TEST : process.env.MONGODB_NAME_PROD,
  mongoDatabaseTest: process.env.MONGODB_NAME_TEST,
  mongoDatabaseProd: process.env.MONGODB_NAME_PROD,
  mongoDatabaseBackup: process.env.MONGODB_NAME_BACKUP,
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRES_IN,
  // CLOUDINARY
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  // GENERAL
  environment: process.env.STAGE || 'dev',
  defaultLimit: process.env.DEFAULT_LIMIT || 10,
  port: process.env.PORT || 3001,
})