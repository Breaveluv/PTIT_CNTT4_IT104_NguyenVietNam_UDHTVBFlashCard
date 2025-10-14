
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export interface ValidationError {
  field: string;
  message: string;
}


export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isPasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};


export const validateRegisterData = (data: RegisterData): ValidationError[] => {
  const errors: ValidationError[] = [];


  if (!data.fullName || data.fullName.trim() === '') {
    errors.push({
      field: 'fullName',
      message: 'Vui lòng nhập họ và tên!'
    });
  }

  if (!data.email || data.email.trim() === '') {
    errors.push({
      field: 'email',
      message: 'Vui lòng nhập email!'
    });
  } else if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Email phải đúng định dạng!'
    });
  }


  if (!data.password || data.password.trim() === '') {
    errors.push({
      field: 'password',
      message: 'Vui lòng nhập mật khẩu!'
    });
  } else if (!isValidPassword(data.password)) {
    errors.push({
      field: 'password',
      message: 'Mật khẩu tối thiểu 8 ký tự!'
    });
  }

 
  if (!data.confirmPassword || data.confirmPassword.trim() === '') {
    errors.push({
      field: 'confirmPassword',
      message: 'Vui lòng nhập mật khẩu xác nhận!'
    });
  } else if (!isPasswordMatch(data.password, data.confirmPassword)) {
    errors.push({
      field: 'confirmPassword',
      message: 'Mật khẩu xác nhận phải trùng khớp với Mật khẩu!'
    });
  }

  return errors;
};


export const displayValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';
  
  const errorMessages = errors.map(error => error.message);
  return errorMessages.join('\n');
};

export const hasValidationErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};
