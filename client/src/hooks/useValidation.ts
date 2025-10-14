import { useState, useCallback } from 'react';
import { validateRegisterData, hasValidationErrors, type RegisterData, type ValidationError } from '../utils/validation';

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  
  const validate = useCallback((data: RegisterData): boolean => {
    const validationErrors = validateRegisterData(data);
    setErrors(validationErrors);
    return !hasValidationErrors(validationErrors);
  }, []);


  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

 
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    const fieldError = errors.find(error => error.field === fieldName);
    return fieldError?.message;
  }, [errors]);


  const hasErrors = useCallback((): boolean => {
    return errors.length > 0;
  }, [errors]);

  return {
    errors,
    validate,
    clearErrors,
    getFieldError,
    hasErrors
  };
};
