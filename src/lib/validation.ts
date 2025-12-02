/**
 * Form Validation Utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate required fields
 */
export function validateRequired(
  value: any,
  fieldName: string
): ValidationError | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      field: fieldName,
      message: `${fieldName} alanı zorunludur`,
    };
  }
  return null;
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null {
  const length = value?.length || 0;
  
  if (length < min) {
    return {
      field: fieldName,
      message: `${fieldName} en az ${min} karakter olmalıdır`,
    };
  }
  
  if (length > max) {
    return {
      field: fieldName,
      message: `${fieldName} en fazla ${max} karakter olmalıdır`,
    };
  }
  
  return null;
}

/**
 * Validate URL format
 */
export function validateUrl(value: string, fieldName: string): ValidationError | null {
  if (!value) return null; // Optional field
  
  try {
    new URL(value);
    return null;
  } catch {
    return {
      field: fieldName,
      message: `${fieldName} geçerli bir URL olmalıdır`,
    };
  }
}

/**
 * Validate slug format (URL-friendly)
 */
export function validateSlug(value: string): ValidationError | null {
  if (!value) {
    return { field: 'slug', message: 'Slug alanı zorunludur' };
  }
  
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  if (!slugRegex.test(value)) {
    return {
      field: 'slug',
      message: 'Slug sadece küçük harf, rakam ve tire içerebilir',
    };
  }
  
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(value: string): ValidationError | null {
  if (!value) {
    return { field: 'email', message: 'Email alanı zorunludur' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(value)) {
    return {
      field: 'email',
      message: 'Geçerli bir email adresi girin',
    };
  }
  
  return null;
}

/**
 * Validate array has at least one item
 */
export function validateArrayNotEmpty(
  value: any[],
  fieldName: string
): ValidationError | null {
  if (!value || value.length === 0) {
    return {
      field: fieldName,
      message: `En az bir ${fieldName} eklemelisiniz`,
    };
  }
  return null;
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Türkçe karakterleri değiştir
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Özel karakterleri temizle
    .replace(/[^a-z0-9\s-]/g, '')
    // Boşlukları tire ile değiştir
    .replace(/\s+/g, '-')
    // Birden fazla tireyi tek tire yap
    .replace(/-+/g, '-')
    // Baş ve sondaki tireleri temizle
    .replace(/^-+|-+$/g, '');
}

/**
 * Validate all project fields
 */
export function validateProjectForm(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const titleError = validateRequired(data.title, 'Başlık');
  if (titleError) errors.push(titleError);

  const slugError = validateSlug(data.slug);
  if (slugError) errors.push(slugError);

  const shortDescError = validateRequired(data.shortDesc, 'Kısa Açıklama');
  if (shortDescError) errors.push(shortDescError);

  const descriptionError = validateRequired(data.description, 'Açıklama');
  if (descriptionError) errors.push(descriptionError);

  // Length validations
  if (data.shortDesc) {
    const shortDescLength = validateLength(data.shortDesc, 10, 500, 'Kısa Açıklama');
    if (shortDescLength) errors.push(shortDescLength);
  }

  // URL validations
  if (data.demoUrl) {
    const demoUrlError = validateUrl(data.demoUrl, 'Demo URL');
    if (demoUrlError) errors.push(demoUrlError);
  }

  if (data.githubUrl) {
    const githubUrlError = validateUrl(data.githubUrl, 'GitHub URL');
    if (githubUrlError) errors.push(githubUrlError);
  }

  return errors;
}

/**
 * Validate skill form
 */
export function validateSkillForm(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequired(data.name, 'Yetenek Adı');
  if (nameError) errors.push(nameError);

  const categoryError = validateRequired(data.category, 'Kategori');
  if (categoryError) errors.push(categoryError);

  if (data.level && (data.level < 0 || data.level > 100)) {
    errors.push({
      field: 'level',
      message: 'Seviye 0-100 arasında olmalıdır',
    });
  }

  return errors;
}

/**
 * Validate experience form
 */
export function validateExperienceForm(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  const companyError = validateRequired(data.company, 'Şirket Adı');
  if (companyError) errors.push(companyError);

  const positionError = validateRequired(data.position, 'Pozisyon');
  if (positionError) errors.push(positionError);

  const startDateError = validateRequired(data.startDate, 'Başlangıç Tarihi');
  if (startDateError) errors.push(startDateError);

  const descriptionError = validateRequired(data.description, 'Açıklama');
  if (descriptionError) errors.push(descriptionError);

  return errors;
}

/**
 * Validate service form
 */
export function validateServiceForm(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateRequired(data.title, 'Başlık');
  if (titleError) errors.push(titleError);

  const descriptionError = validateRequired(data.description, 'Açıklama');
  if (descriptionError) errors.push(descriptionError);

  return errors;
}
