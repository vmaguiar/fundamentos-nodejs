import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extrac-query-params.js'


const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)
  try {

    const route = routes.find(route => {
      return route.method === method && route.url.test(url)
    })

    if (route) {
      const routeParams = req.url.match(route.url)

      req.params = { ...routeParams.groups }
      req.query = routeParams.groups.query ? extractQueryParams(routeParams.groups.query) : {}

      return route.handler(req, res)
    }

    return res.writeHead(404).end()
  }
  catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }

})

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});