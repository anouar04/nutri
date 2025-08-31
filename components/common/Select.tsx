import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, name, children, error, ...props }) => {
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  const normalClasses = 'border-gray-300 focus:border-primary focus:ring-primary';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none sm:text-sm rounded-md border ${error ? errorClasses : normalClasses}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;