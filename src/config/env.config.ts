const generateDBUri = (user: string, password: string, cluster: string): string => {
  return `mongodb+srv://${ user }:${ password }@${ cluster }/?retryWrites=true&w=majority`;
}

export default () => ({
  // MONGODB
  mongoConnection: generateDBUri(process.env.MONGO_DB_USER, process.env.MONGO_DB_PASSWORD, process.env.MONGO_DB_CLUSTER),
  mongoDatabase: process.env.MONGO_DB_NAME,
  // GENERAL
  environment: process.env.NODE_ENV || 'dev',
  defaultLimit: process.env.DEFAULT_LIMIT || 5,
  port: process.env.PORT || 3000,
})