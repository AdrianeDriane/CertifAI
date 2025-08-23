import React from "react";
import type { LucideIcon } from "lucide-react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  iconSize?: number;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  iconSize = 18,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon size={iconSize} className="text-gray-400" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            LeftIcon ? "pl-10" : "pl-3"
          } ${RightIcon ? "pr-10" : "pr-3"} py-2`}
        />
        {RightIcon && (
          <div
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              onRightIconClick
                ? "cursor-pointer hover:text-gray-600"
                : "pointer-events-none"
            }`}
            onClick={onRightIconClick}
          >
            <RightIcon size={iconSize} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
