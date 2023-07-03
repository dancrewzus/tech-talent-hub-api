const generateDBUri = (user: String, password: String, cluster: String): String => {
  return `mongodb+srv://${ user }:${ password }@${ cluster }/?retryWrites=true&w=majority`;
}

export default () => ({
  // MONGODB
  mongoConnection: generateDBUri(process.env.MONGO_DB_USER, process.env.MONGO_DB_PASSWORD, process.env.MONGO_DB_CLUSTER),
  mongoDatabase: process.env.MONGO_DB_NAME,
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRES_IN,
  // GENERAL
  environment: process.env.NODE_ENV || 'dev',
  defaultLimit: process.env.DEFAULT_LIMIT || 10,
  port: process.env.PORT || 3000,
})