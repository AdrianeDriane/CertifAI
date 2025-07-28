import React from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  children,
  disabled = false,
  className = ''
}) => {
  const baseStyles =
    'inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const enabledStyles =
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';

  const disabledStyles = 'bg-blue-600 text-white opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
