import { z } from 'zod';

// Schema for user registration validation
export const registerUserSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    userName: z.string().trim().min(5, 'Username must be at least 5 characters long').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid format').min(1, 'Email is required').toLowerCase(),
    role: z.enum(['applicant', 'employer'], { message: 'Role is required' }).default('applicant'),
    phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    password: z.string().min(8, 'Password must be at least 8 characters long').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export type RegisterUserData = z.infer<typeof registerUserSchema>;

export const registerUserWithConfirmSchema = registerUserSchema.extend({
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
})
.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterUserWithConfirmData = z.infer<typeof registerUserWithConfirmSchema>;

// Schema for user login validation
export const loginUserSchema = z.object({
    email: z.string().min(1, 'Email is required').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

export type LoginUserData = z.infer<typeof loginUserSchema>;

// Schema for password reset validation
export const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required').toLowerCase(),
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;