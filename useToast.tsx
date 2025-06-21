import { useCallback } from 'react';
import { toast, ToastOptions } from './toastify';

const useToast = () => useCallback((options: ToastOptions) => toast(options), []);

export default useToast;