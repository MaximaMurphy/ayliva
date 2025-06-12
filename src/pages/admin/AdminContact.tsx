import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  working_hours: {
    monday_friday: string;
    saturday: string;
    sunday: string;
  };
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export const AdminContact: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactInfo>({
    id: '',
    address: '',
    phone: '',
    email: '',
    working_hours: {
      monday_friday: '',
      saturday: '',
      sunday: ''
    },
    social_media: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setError('İletişim bilgileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('contact_info')
        .upsert({
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('İletişim bilgileri başarıyla güncellendi.');
    } catch (error) {
      console.error('Error saving contact info:', error);
      setError('İletişim bilgileri kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif">İletişim Bilgileri Yönetimi</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-sm"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-sm"
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Çalışma Saatleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pazartesi - Cuma
                </label>
                <input
                  type="text"
                  value={formData.working_hours.monday_friday}
                  onChange={(e) => setFormData({
                    ...formData,
                    working_hours: {
                      ...formData.working_hours,
                      monday_friday: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="09:00 - 20:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cumartesi
                </label>
                <input
                  type="text"
                  value={formData.working_hours.saturday}
                  onChange={(e) => setFormData({
                    ...formData,
                    working_hours: {
                      ...formData.working_hours,
                      saturday: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="09:00 - 18:00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pazar
                </label>
                <input
                  type="text"
                  value={formData.working_hours.sunday}
                  onChange={(e) => setFormData({
                    ...formData,
                    working_hours: {
                      ...formData.working_hours,
                      sunday: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="10:00 - 16:00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Sosyal Medya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.social_media.facebook}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: {
                      ...formData.social_media,
                      facebook: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="https://facebook.com/aylivasalon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.social_media.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: {
                      ...formData.social_media,
                      instagram: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="https://instagram.com/aylivasalon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.social_media.twitter}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: {
                      ...formData.social_media,
                      twitter: e.target.value
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-sm"
                  placeholder="https://twitter.com/aylivasalon"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 text-white px-6 py-2 rounded-sm hover:bg-purple-700 transition-colors duration-300 flex items-center"
            >
              <Save size={20} className="mr-2" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};