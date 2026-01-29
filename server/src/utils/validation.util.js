
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRequiredFields,
};
