import { createContext } from 'react';
import type { AuthContextType } from '@/features/auth/types/AuthContext';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
