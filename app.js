const fastify = require('fastify')({
  logger: true
});

let resources = [];
let nextResourceId = 1;

const resourceBodySchema = {
  type: 'object',
  required: ['name', 'description'],
  properties: {
    name: { type: 'string' },
    description: { type: 'string' }
  }
};

const resourceIdParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'integer' }
  }
};

// 1. GET /api/resources (Отримати список всіх ресурсів)
fastify.get('/api/resources', async (request, reply) => {
  return resources;
});

// 2. GET /api/resources/:id (Отримати ресурс за ідентифікатором)
fastify.get('/api/resources/:id', { schema: { params: resourceIdParamSchema } }, async (request, reply) => {
  const id = parseInt(request.params.id);
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return reply.status(404).send({ error: 'Resource not found' });
  }
  return resource;
});

// 3. POST /api/resources (Створити новий ресурс)
fastify.post('/api/resources', { schema: { body: resourceBodySchema } }, async (request, reply) => {
  const newResource = {
    id: nextResourceId++,
    name: request.body.name,
    description: request.body.description
  };
  resources.push(newResource);
  return reply.status(201).send(newResource);
});

// 4. PUT /api/resources/:id (Оновити ресурс за ідентифікатором)
fastify.put('/api/resources/:id', { schema: { params: resourceIdParamSchema, body: resourceBodySchema } }, async (request, reply) => {
  const id = parseInt(request.params.id);
  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return reply.status(404).send({ error: 'Resource not found' });
  }

  const updatedResource = {
    ...resources[resourceIndex],
    name: request.body.name,
    description: request.body.description
  };
  resources[resourceIndex] = updatedResource;
  return updatedResource;
});

// 5. DELETE /api/resources/:id (Видалити ресурс за ідентифікатором)
fastify.delete('/api/resources/:id', { schema: { params: resourceIdParamSchema } }, async (request, reply) => {
  const id = parseInt(request.params.id);
  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return reply.status(404).send({ error: 'Resource not found' });
  }

  resources.splice(resourceIndex, 1);
  return reply.status(204).send();
});

const start = async () => {
  try {
    await fastify.listen({ port: 3020, host: '0.0.0.0' });
    fastify.log.info(`Fastify server listening on port ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
