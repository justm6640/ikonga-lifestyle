
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'premium-gradient';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-ikonga-primary text-white hover:bg-ikonga-primaryDark focus:ring-ikonga-primary",
            secondary: "bg-white text-ikonga-primary border border-ikonga-primary hover:bg-gray-50 focus:ring-ikonga-primary",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400",
            'premium-gradient': "bg-gradient-to-r from-[#FF9966] to-[#FF5E62] rounded-[50px] text-white font-bold tracking-wide hover:shadow-lg hover:shadow-[#FF5E62]/30 hover:scale-[1.02] transition-all duration-300 active:scale-95"
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${className}`}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };
