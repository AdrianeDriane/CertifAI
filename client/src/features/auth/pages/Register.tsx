import React, { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../../../components/InputField';
import { Button } from '../../../components/Button';
import Form from '../components/Form';

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  middlename?: string;
};

export default function Register(): JSX.Element {
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    middlename: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Certifai Register Form submitted:', formData);

    // Simulate submission
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-lg space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Create your <span className="text-blue-600">Certifai</span> account
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Secure. Verifiable. Blockchain-backed.
          </p>
        </header>

        {/* Form */}
        <Form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Juan"
              required
            />
            <InputField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Dela Cruz"
              required
            />
          </div>

          <InputField
            label="Middle Name (optional)"
            name="middlename"
            value={formData.middlename || ''}
            onChange={handleChange}
            placeholder="Rizal"
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
            showArrow={!isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Sign Up Securely'}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in here
            </Link>
          </p>
        </Form>

        {/* Footer */}
        <footer className="text-center text-xs sm:text-sm text-gray-400 mt-10 px-2">
          By signing up, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
