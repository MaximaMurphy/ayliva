import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string;
  message: string;
  status: string;
  created_at: string;
}

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      let { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Ensure data is not null before setting state
      setAppointments(data || []);
      console.log('Fetched appointments:', data); // Debug log
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh appointments after update
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Randevu Yönetimi</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Randevu Tarihi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturulma Tarihi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Henüz randevu bulunmuyor
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <React.Fragment key={appointment.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(appointment.id)}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                          <div className="text-sm text-gray-500">{appointment.email}</div>
                          {appointment.phone && (
                            <div className="text-sm text-gray-500">{appointment.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(appointment.appointment_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(appointment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status === 'pending' && 'Beklemede'}
                            {appointment.status === 'approved' && 'Onaylandı'}
                            {appointment.status === 'rejected' && 'Reddedildi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateAppointmentStatus(appointment.id, 'approved');
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                  title="Onayla"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateAppointmentStatus(appointment.id, 'rejected');
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reddet"
                                >
                                  <X size={20} />
                                </button>
                              </>
                            )}
                            {expandedId === appointment.id ? (
                              <ChevronUp size={20} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedId === appointment.id && appointment.message && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">Mesaj:</span>
                              <p className="mt-1 whitespace-pre-wrap">{appointment.message}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}