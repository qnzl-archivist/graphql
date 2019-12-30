const { ApolloServer } = require('apollo-server-express')
const getResolvers = require('./resolvers')
const getSchema = require('./schemas')
const express = require('express')
const https = require(`https`)
const http = require(`http`)
const fs = require(`fs`)

const typeDefs = getSchema()
const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const authorization = req.headers.authorization || ''

    return {
      authorization
    }
  },
  playground: true,
  introspection: true
})

const app = express()

server.applyMiddleware({ app })

const port = process.env.PORT || 4000

if ('production' === process.env.ENV) {
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/graph.maddie.today/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/graph.maddie.today/cert.pem')
  }, app).listen(port, () => {
    console.log(`Express server listening on port ${port}, ENV=production`)
  })
} else {
  http.createServer(app).listen(port, () => {
    console.log(`Express server listening on port ${port}, ENV=staging`)
  })
}