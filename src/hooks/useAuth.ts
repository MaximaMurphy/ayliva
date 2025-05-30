import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      rememberMe: false,
      login: async (email: string, password: string, remember: boolean) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            console.error('Giriş hatası:', error.message);
            return false;
          }

          if (data.user) {
            set({ isAuthenticated: true, rememberMe: remember });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Beklenmeyen bir hata oluştu:', error);
          return false;
        }
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, rememberMe: false });
      },
      resetPassword: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/admin/login`
          });

          if (error) {
            return {
              success: false,
              message: 'Şifre sıfırlama e-postası gönderilemedi. Lütfen tekrar deneyin.'
            };
          }

          return {
            success: true,
            message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
          };
        } catch (error) {
          console.error('Password reset error:', error);
          return {
            success: false,
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.'
          };
        }
      },
      updatePassword: async (password: string) => {
        try {
          const { error } = await supabase.auth.updateUser({
            password: password
          });

          if (error) {
            return {
              success: false,
              message: 'Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'
            };
          }

          return {
            success: true,
            message: 'Şifreniz başarıyla güncellendi.'
          };
        } catch (error) {
          console.error('Password update error:', error);
          return {
            success: false,
            message: 'Bir hata oluştu. Lütfen tekrar deneyin.'
          };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe
      })
    }
  )
);