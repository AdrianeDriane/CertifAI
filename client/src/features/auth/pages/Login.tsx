import React, { useState } from 'react';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import Form from '../components/Form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type LoginForm = {
  email: string;
  password: string;
};

export default function Login(): JSX.Element {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Hook from react-router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login logic
    setTimeout(() => {
      console.log('Logged in with:', formData);
      setIsSubmitting(false);
      navigate('/home'); // ✅ Route to Home
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-md space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Welcome back to <span className="text-blue-600">Certifai</span>
          </h1>
          <p className="text-sm text-gray-500">Please log in to continue.</p>
        </header>

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
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up here
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
