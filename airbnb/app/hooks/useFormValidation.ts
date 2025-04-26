"use client";

import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

interface FormErrors {
  [key: string]: string[];
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback((name: string, value: any) => {
    if (!rules[name]) return [];

    const fieldErrors: string[] = [];
    for (const rule of rules[name]) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        fieldErrors.push(rule.message);
      }
      if (rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(rule.message);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(rule.message);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(rule.message);
      }
      if (rule.custom && !rule.custom(value)) {
        fieldErrors.push(rule.message);
      }
    }
    return fieldErrors;
  }, [rules]);

  const validateForm = useCallback((values: { [key: string]: any }) => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, values[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateFieldOnChange = useCallback((name: string, value: any) => {
    if (touchedFields.has(name)) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors,
      }));
    }
  }, [touchedFields, validateField]);

  const setFieldTouched = useCallback((name: string) => {
    setTouchedFields(prev => new Set(prev).add(name));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouchedFields(new Set());
  }, []);

  return {
    errors,
    validateForm,
    validateFieldOnChange,
    setFieldTouched,
    clearErrors,
  };
};

// Common validation rules
export const commonValidationRules = {
  email: [
    {
      required: true,
      message: 'Email is required',
    },
    {
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
    },
    {
      minLength: 8,
      message: 'Password must be at least 8 characters',
    },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  ],
};
