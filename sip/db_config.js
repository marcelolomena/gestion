//module.exports allows us to use this code in other places as a node module, 
//we'll see it again when I make the database calls modular
module.exports = { 
  database: 'art_live', 
  username: 'biometria', 
  password: 'biometria123',
  host: '200.14.166.182',
  port: 1433,
  instanceName: 'SQLEXPRESS',
  dialect: 'mssql'
};