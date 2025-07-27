import { useState, useEffect } from 'react';
import ResizableCodePanel from './ResizableCodePanel';

// Custom form hook
const useForm = (initialValues: any) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setValues((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setValues((prev: any) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [name]: '' }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, reset, setErrors };
};

// Controlled input component
const ControlledInput = ({ name, value, onChange, error, ...props }: any) => (
  <div>
    <input
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '0.75rem',
        border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
      }}
      {...props}
    />
    {error && (
      <p
        style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}
      >
        {error}
      </p>
    )}
  </div>
);

const Forms = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    country: '',
    interests: [] as string[],
    newsletter: false,
    bio: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        option => option.value
      );
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (
      formData.age &&
      (Number(formData.age) < 0 || Number(formData.age) > 120)
    ) {
      newErrors.age = 'Age must be between 0 and 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      alert(
        'Form submitted successfully!\n' + JSON.stringify(formData, null, 2)
      );
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      country: '',
      interests: [],
      newsletter: false,
      bio: '',
    });
    setErrors({});
  };

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  // Custom form hook usage
  const customForm = useForm({
    username: '',
    email: '',
    password: '',
  });

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = e => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Real-time validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  // Dynamic form fields
  const [dynamicFields, setDynamicFields] = useState([{ id: 1, value: '' }]);

  const addField = () => {
    setDynamicFields(prev => [...prev, { id: Date.now(), value: '' }]);
  };

  const removeField = (id: number) => {
    setDynamicFields(prev => prev.filter(field => field.id !== id));
  };

  const updateField = (id: number, value: string) => {
    setDynamicFields(prev =>
      prev.map(field => (field.id === id ? { ...field, value } : field))
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <h1 className="heading-primary">Forms & Validation in React</h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}
        >
          Learn how to handle forms, validation, and user input in React
          components.
        </p>

        {/* Important Form Concepts */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">🎯 Important Form Concepts</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
            }}
          >
            {/* Controlled vs Uncontrolled */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '12px',
                border: '2px solid #3b82f6',
              }}
            >
              <h3
                style={{
                  color: '#1e40af',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                📝 Controlled vs Uncontrolled
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <p
                  style={{
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: '#1e40af',
                  }}
                >
                  Controlled Components:
                </p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <li>React state drives the form</li>
                  <li>Single source of truth</li>
                  <li>Better validation control</li>
                  <li>Real-time updates</li>
                </ul>
                <p
                  style={{
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: '#059669',
                  }}
                >
                  Uncontrolled Components:
                </p>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>DOM manages form state</li>
                  <li>Use refs to access values</li>
                  <li>Better performance for large forms</li>
                  <li>Less React overhead</li>
                </ul>
              </div>
            </div>

            {/* Form Validation */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                borderRadius: '12px',
                border: '2px solid #ef4444',
              }}
            >
              <h3
                style={{
                  color: '#dc2626',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                ✅ Form Validation Best Practices
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Client-side validation:</strong> Immediate feedback
                  </li>
                  <li>
                    <strong>Server-side validation:</strong> Security and data
                    integrity
                  </li>
                  <li>
                    <strong>Real-time validation:</strong> Debounced to avoid
                    performance issues
                  </li>
                  <li>
                    <strong>Error messages:</strong> Clear, actionable feedback
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Screen reader friendly
                  </li>
                  <li>
                    <strong>Visual indicators:</strong> Color-coded error states
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Optimization */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
                borderRadius: '12px',
                border: '2px solid #f59e0b',
              }}
            >
              <h3
                style={{
                  color: '#92400e',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                ⚡ Performance Tips
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Debounce validation:</strong> Avoid excessive
                    re-renders
                  </li>
                  <li>
                    <strong>Memoize callbacks:</strong> Use useCallback for
                    handlers
                  </li>
                  <li>
                    <strong>Lazy validation:</strong> Validate only changed
                    fields
                  </li>
                  <li>
                    <strong>Batch updates:</strong> Group state updates
                  </li>
                  <li>
                    <strong>Virtual scrolling:</strong> For large form lists
                  </li>
                  <li>
                    <strong>Code splitting:</strong> Load form libraries on
                    demand
                  </li>
                </ul>
              </div>
            </div>

            {/* Security Considerations */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                borderRadius: '12px',
                border: '2px solid #8b5cf6',
              }}
            >
              <h3
                style={{
                  color: '#7c3aed',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                🔒 Security & Accessibility
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <p
                  style={{
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: '#7c3aed',
                  }}
                >
                  Security:
                </p>
                <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                  <li>Always validate on server-side</li>
                  <li>Sanitize user inputs</li>
                  <li>Use HTTPS for form submission</li>
                  <li>Implement CSRF protection</li>
                </ul>
                <p
                  style={{
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: '#059669',
                  }}
                >
                  Accessibility:
                </p>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>Proper label associations</li>
                  <li>ARIA attributes for errors</li>
                  <li>Keyboard navigation support</li>
                  <li>Screen reader compatibility</li>
                </ul>
              </div>
            </div>

            {/* Common Patterns */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                borderRadius: '12px',
                border: '2px solid #10b981',
              }}
            >
              <h3
                style={{
                  color: '#047857',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                🔄 Common Form Patterns
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Custom hooks:</strong> Reusable form logic
                  </li>
                  <li>
                    <strong>Form libraries:</strong> React Hook Form, Formik
                  </li>
                  <li>
                    <strong>Validation schemas:</strong> Yup, Zod, Joi
                  </li>
                  <li>
                    <strong>Multi-step forms:</strong> Wizard pattern
                  </li>
                  <li>
                    <strong>Dynamic forms:</strong> Conditional fields
                  </li>
                  <li>
                    <strong>File uploads:</strong> Drag & drop, progress
                  </li>
                </ul>
              </div>
            </div>

            {/* Error Handling */}
            <div
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                borderRadius: '12px',
                border: '2px solid #ef4444',
              }}
            >
              <h3
                style={{
                  color: '#dc2626',
                  marginBottom: '1rem',
                  fontSize: '1.125rem',
                }}
              >
                🚨 Error Handling
              </h3>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li>
                    <strong>Network errors:</strong> Handle API failures
                  </li>
                  <li>
                    <strong>Validation errors:</strong> Field-level and
                    form-level
                  </li>
                  <li>
                    <strong>User feedback:</strong> Toast notifications
                  </li>
                  <li>
                    <strong>Error boundaries:</strong> Catch JavaScript errors
                  </li>
                  <li>
                    <strong>Retry mechanisms:</strong> Auto-retry failed
                    submissions
                  </li>
                  <li>
                    <strong>Error logging:</strong> Track and monitor errors
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form Methods Overview */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Form Methods Overview</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#eff6ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                📝 Controlled Forms
              </h4>
              <p style={{ fontSize: '0.875rem' }}>React manages form state</p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🔄 Uncontrolled Forms
              </h4>
              <p style={{ fontSize: '0.875rem' }}>DOM manages form state</p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fef2f2',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
                ✅ Validation
              </h4>
              <p style={{ fontSize: '0.875rem' }}>
                Real-time and submit validation
              </p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#fffbeb',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                📁 File Uploads
              </h4>
              <p style={{ fontSize: '0.875rem' }}>File handling and preview</p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#f3e8ff',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>
                🔧 Custom Hooks
              </h4>
              <p style={{ fontSize: '0.875rem' }}>Reusable form logic</p>
            </div>
            <div
              style={{
                padding: '1rem',
                background: '#ecfdf5',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ color: '#047857', marginBottom: '0.5rem' }}>
                ⚡ Dynamic Fields
              </h4>
              <p style={{ fontSize: '0.875rem' }}>Add/remove form fields</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 className="heading-secondary">Registration Form</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.name
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.email
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.password
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: errors.age
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
                placeholder="Enter your age"
              />
              {errors.age && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {errors.age}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                }}
              >
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="in">India</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical',
                }}
                placeholder="Tell us about yourself"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <span>Subscribe to newsletter</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* File Upload Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#92400e' }}>
            📁 File Upload Demo
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates file upload handling with preview functionality.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Upload File:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>

          {file && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>File Details:</h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Name: {file.name}
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Type: {file.type}
              </p>
              {filePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Preview:</h4>
                  <img
                    src={filePreview}
                    alt="File preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Form Hook Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#7c3aed' }}>
            🔧 Custom Form Hook Demo
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates reusable form logic with custom hooks.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Username:
              </label>
              <ControlledInput
                name="username"
                value={customForm.values.username}
                onChange={customForm.handleChange}
                error={customForm.errors.username}
                placeholder="Enter username"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Email:
              </label>
              <ControlledInput
                name="email"
                value={customForm.values.email}
                onChange={customForm.handleChange}
                error={customForm.errors.email}
                placeholder="Enter email"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                }}
              >
                Password:
              </label>
              <ControlledInput
                name="password"
                type="password"
                value={customForm.values.password}
                onChange={customForm.handleChange}
                error={customForm.errors.password}
                placeholder="Enter password"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  const newErrors: Record<string, string> = {};
                  if (!customForm.values.username)
                    newErrors.username = 'Username required';
                  if (!customForm.values.email)
                    newErrors.email = 'Email required';
                  if (!customForm.values.password)
                    newErrors.password = 'Password required';
                  customForm.setErrors(newErrors);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Validate
              </button>
              <button
                onClick={customForm.reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Form Fields Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#047857' }}>
            ⚡ Dynamic Form Fields Demo
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates adding and removing form fields dynamically.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={addField}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                marginBottom: '1rem',
              }}
            >
              Add Field
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {dynamicFields.map(field => (
              <div
                key={field.id}
                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
              >
                <input
                  type="text"
                  value={field.value}
                  onChange={e => updateField(field.id, e.target.value)}
                  placeholder={`Field ${field.id}`}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
                <button
                  onClick={() => removeField(field.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ marginBottom: '0.5rem' }}>Current Fields:</h4>
            <pre style={{ margin: 0, fontSize: '0.875rem' }}>
              {JSON.stringify(dynamicFields, null, 2)}
            </pre>
          </div>
        </div>

        {/* Real-time Validation Demo */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#dc2626' }}>
            ✅ Real-time Validation Demo
          </h3>
          <p
            style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}
          >
            Demonstrates validation that occurs as the user types.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
              }}
            >
              Email (with real-time validation):
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.email
                  ? '1px solid #ef4444'
                  : '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
              placeholder="Type an invalid email to see validation"
            />
            {errors.email && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.email}
              </p>
            )}
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              Validation occurs 500ms after you stop typing
            </p>
          </div>
        </div>

        {/* Quick Reference - Best Practices */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e40af' }}>
            📚 Quick Reference - Best Practices
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Controlled Form Pattern */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.75rem' }}>
                🎯 Controlled Form Pattern
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Best Practice
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

// ❌ Avoid
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};`}
              </pre>
            </div>

            {/* Validation Pattern */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#dc2626', marginBottom: '0.75rem' }}>
                ✅ Validation Pattern
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Debounced Validation
useEffect(() => {
  const timer = setTimeout(() => {
    if (email && !isValidEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email' }));
    }
  }, 500);
  
  return () => clearTimeout(timer);
}, [email]);

// ❌ Avoid
onChange={(e) => {
  if (!isValidEmail(e.target.value)) {
    setErrors({ email: 'Invalid email' });
  }
}}`}
              </pre>
            </div>

            {/* Custom Hook Pattern */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginBottom: '0.75rem' }}>
                🔧 Custom Hook Pattern
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Reusable Form Hook
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  return { values, errors, handleChange, setErrors };
};`}
              </pre>
            </div>

            {/* Error Handling Pattern */}
            <div
              style={{
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ color: '#ef4444', marginBottom: '0.75rem' }}>
                🚨 Error Handling Pattern
              </h4>
              <pre
                style={{
                  fontSize: '0.75rem',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                }}
              >
                {`// ✅ Comprehensive Error Handling
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    const response = await submitForm(formData);
    setSuccess('Form submitted successfully!');
  } catch (error) {
    setError(error.message);
  } finally {
    setSubmitting(false);
  }
};`}
              </pre>
            </div>
          </div>
        </div>

        {/* Interview Tips */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#059669' }}>
            💡 Interview Tips & Common Questions
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
              }}
            >
              <h4 style={{ color: '#059669', marginBottom: '0.5rem' }}>
                🤔 Common Questions
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>How do you handle form validation?</li>
                <li>
                  What's the difference between controlled and uncontrolled
                  components?
                </li>
                <li>How do you prevent unnecessary re-renders in forms?</li>
                <li>What are the best practices for form accessibility?</li>
                <li>How do you handle file uploads in React?</li>
                <li>What form libraries do you prefer and why?</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fde68a',
              }}
            >
              <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                🎯 Key Points to Remember
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Always use controlled components for complex forms</li>
                <li>Implement both client and server-side validation</li>
                <li>Use debouncing for real-time validation</li>
                <li>Provide clear error messages</li>
                <li>Consider accessibility from the start</li>
                <li>Handle loading and error states</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                background: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #93c5fd',
              }}
            >
              <h4 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>
                🚀 Advanced Topics
              </h4>
              <ul style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                <li>Form state management with Redux/Zustand</li>
                <li>Multi-step form wizards</li>
                <li>Dynamic form generation</li>
                <li>Form testing strategies</li>
                <li>Performance optimization techniques</li>
                <li>Integration with form libraries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Resizable Code Example */}
      <ResizableCodePanel>
        <h3 style={{ color: '#569cd6', marginBottom: '1rem' }}>
          Forms & Validation Examples
        </h3>
        <pre style={{ margin: 0 }}>
          {`// 1. Basic Form with State
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

<form onSubmit={handleSubmit}>
  <input
    name="name"
    value={formData.name}
    onChange={handleChange}
  />
</form>

// 2. Form Validation
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// 3. Controlled Components
const ControlledInput = ({ name, value, onChange, error }) => (
  <div>
    <input
      name={name}
      value={value}
      onChange={onChange}
      style={{ border: error ? '1px solid red' : '1px solid #ccc' }}
    />
    {error && <span style={{ color: 'red' }}>{error}</span>}
  </div>
);

// 4. Form Submission
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (validateForm()) {
    // Submit form data
    console.log('Form submitted:', formData);
  }
};

// 5. Different Input Types
<input type="text" name="name" />
<input type="email" name="email" />
<input type="password" name="password" />
<input type="number" name="age" />
<input type="checkbox" name="newsletter" />
<textarea name="bio" />

/**
 * 🎯 FORMS AND VALIDATION EXPLANATION
 * 
 * React forms can be controlled (React manages state) or uncontrolled (DOM manages state).
 * Controlled forms provide better validation, real-time updates, and form state management.
 * 
 * Key concepts:
 * - 📊 Controlled components: React state drives the form
 * - 🎯 Uncontrolled components: DOM manages form state
 * - ✅ Form validation: Client-side and server-side validation
 * - 📤 Form submission: Handling form data and preventing default behavior
 */

// 6. Select Element - Dropdown Handling
/**
 * 📋 Select Element Explanation:
 * 
 * Purpose: Create dropdown/select menus
 * Controlled approach: value prop controlled by React state
 * onChange: Updates state when selection changes
 * 
 * Benefits of controlled select:
 * - Easy to set default values
 * - Simple validation
 * - Consistent with other form elements
 */
<select name="country" value={formData.country} onChange={handleChange}>
  <option value="">Select country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</select>

// 7. Checkbox Handling - Boolean Values
/**
 * ☑️ Checkbox Handling Explanation:
 * 
 * Purpose: Handle boolean form inputs (checkboxes)
 * Key difference: Uses 'checked' property instead of 'value'
 * Type checking: Different handling for checkbox vs text inputs
 * 
 * Checkbox properties:
 * - checked: Boolean indicating if checkbox is selected
 * - value: The value attribute (usually not used for state)
 * - name: Used to identify the checkbox in form data
 */
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;
  
  if (type === 'checkbox') {
    // For checkboxes, use 'checked' property
    setFormData(prev => ({ ...prev, [name]: checked }));
  } else {
    // For text inputs, use 'value' property
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

// 8. Form Reset - Clearing Form State
/**
 * 🔄 Form Reset Explanation:
 * 
 * Purpose: Clear all form data and errors
 * Use cases: After successful submission, user cancellation
 * Best practice: Reset both form data and validation errors
 * 
 * Reset strategies:
 * - Set all fields to initial values
 * - Clear all validation errors
 * - Reset form submission state
 */
const handleReset = () => {
  setFormData({
    name: '',
    email: '',
    password: ''
  });
  setErrors({}); // Clear all validation errors
};

// 9. Real-time Validation - Immediate Feedback
/**
 * ⚡ Real-time Validation Explanation:
 * 
 * Purpose: Provide immediate feedback as user types
 * Benefits: Better UX, catch errors early
 * Implementation: Validate on every change, clear errors on input
 * 
 * Validation timing:
 * - On change: Clear errors when user starts typing
 * - On blur: Validate when user leaves field
 * - On submit: Final validation before submission
 */
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Clear error when user starts typing (real-time feedback)
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

// 10. Custom Hook for Forms - Reusable Form Logic
/**
 * 🔧 Custom Form Hook Explanation:
 * 
 * Purpose: Extract reusable form logic into custom hook
 * Benefits: Code reusability, consistent form behavior
 * Pattern: Return form state and handlers from hook
 * 
 * Hook features:
 * - State management for form values
 * - Error handling and validation
 * - Change handlers for different input types
 * - Reset functionality
 */
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setErrors, handleChange, reset };
};

// 11. Form with useRef (Uncontrolled) - DOM-based Forms
/**
 * 🎯 Uncontrolled Form Explanation:
 * 
 * Purpose: Let DOM manage form state instead of React
 * Use cases: Simple forms, file uploads, third-party integrations
 * Benefits: Less React overhead, direct DOM access
 * 
 * Uncontrolled vs Controlled:
 * - Uncontrolled: DOM manages state, use refs to access values
 * - Controlled: React manages state, use state and onChange
 * - FormData: Browser API for collecting form data
 */
const UncontrolledForm = () => {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    // FormData collects all form inputs automatically
    const formData = new FormData(formRef.current);
    console.log(Object.fromEntries(formData)); // Convert to object
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" />
      <button type="submit">Submit</button>
    </form>
  );
};

// 12. Form with File Upload - File Handling
/**
 * 📁 File Upload Explanation:
 * 
 * Purpose: Handle file uploads in forms
 * File API: Access to file information and content
 * Validation: Check file type, size, and format
 * 
 * File input properties:
 * - files: FileList containing selected files
 * - accept: MIME types to accept
 * - multiple: Allow multiple file selection
 * - onChange: Fires when files are selected
 */
const [file, setFile] = useState(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0]; // Get first selected file
  setFile(selectedFile);
  
  // Optional: Validate file
  if (selectedFile) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      alert('File too large');
      return;
    }
  }
};

<input
  type="file"
  onChange={handleFileChange}
  accept="image/*" // Only accept image files
/>

/**
 * 🎯 FORM HANDLING BEST PRACTICES:
 * 
 * 1. 📊 CONTROLLED VS UNCONTROLLED
 *    - Use controlled for complex forms with validation
 *    - Use uncontrolled for simple forms or file uploads
 *    - Consider performance for large forms
 * 
 * 2. ✅ VALIDATION STRATEGIES
 *    - Client-side: Immediate feedback, better UX
 *    - Server-side: Security, data integrity
 *    - Real-time: Validate as user types
 *    - On submit: Final validation before submission
 * 
 * 3. 🛡️ ERROR HANDLING
 *    - Display errors clearly and accessibly
 *    - Clear errors when user starts typing
 *    - Provide helpful error messages
 *    - Handle network errors gracefully
 * 
 * 4. ⚡ PERFORMANCE
 *    - Debounce validation for real-time feedback
 *    - Use useCallback for event handlers
 *    - Avoid unnecessary re-renders
 *    - Consider form libraries for complex forms
 * 
 * 5. ♿ ACCESSIBILITY
 *    - Use proper labels and ARIA attributes
 *    - Support keyboard navigation
 *    - Provide clear error messages
 *    - Test with screen readers
 * 
 * 6. 🔒 SECURITY
 *    - Always validate on server-side
 *    - Sanitize user input
 *    - Use CSRF tokens
 *    - Handle file uploads securely
 */`}
        </pre>
      </ResizableCodePanel>
    </div>
  );
};

export default Forms;
