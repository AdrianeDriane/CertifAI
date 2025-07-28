import React from 'react';

type FormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
};

const Form: React.FC<FormProps> = ({ onSubmit, children}) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;