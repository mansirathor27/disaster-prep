
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  

  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const sanitizedBody = { ...req.body };
    

    delete sanitizedBody.password;
    delete sanitizedBody.token;
    
    console.log('Request Body:', JSON.stringify(sanitizedBody, null, 2));
  }
  
  next();
};

const responseTimeLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode < 400 ? '✅' : '❌';
    
    console.log(`${statusEmoji} ${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = {
  requestLogger,
  responseTimeLogger,
};
