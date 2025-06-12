import React, { useState, useEffect, useCallback, memo } from 'react';
import { PenSquare, Trash2, Plus, X, Search } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  category: string;
  published: boolean;
  created_at: string;
  meta_description: string;
  meta_keywords: string;
  slug: string;
}

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  category: string;
  meta_description: string;
  meta_keywords: string;
  slug: string;
}

const initialFormData: FormData = {
  title: '',
  content: '',
  excerpt: '',
  image_url: '',
  author: '',
  category: '',
  meta_description: '',
  meta_keywords: '',
  slug: ''
};

const FormInput = memo(({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  ...props 
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  [key: string]: any;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-sm"
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-sm"
        {...props}
      />
    )}
  </div>
));

FormInput.displayName = 'FormInput';

const BlogForm = memo(({ 
  formData, 
  onUpdateFormData, 
  onSubmit, 
  isEdit = false,
  onClose 
}: { 
  formData: FormData;
  onUpdateFormData: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isEdit?: boolean;
  onClose: () => void;
}) => {
  const handleTitleChange = useCallback((value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    onUpdateFormData('title', value);
    onUpdateFormData('slug', slug);
  }, [onUpdateFormData]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Başlık"
          value={formData.title}
          onChange={handleTitleChange}
          required
        />

        <FormInput
          label="URL Slug"
          value={formData.slug}
          onChange={(value) => onUpdateFormData('slug', value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          İçerik <span className="text-red-600">*</span>
        </label>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={(content) => onUpdateFormData('content', content)}
          modules={modules}
          formats={formats}
          className="h-[300px] mb-12"
        />
      </div>

      <FormInput
        label="Özet"
        value={formData.excerpt}
        onChange={(value) => onUpdateFormData('excerpt', value)}
        type="textarea"
        rows={3}
        required
      />

      <FormInput
        label="Meta Açıklama (SEO)"
        value={formData.meta_description}
        onChange={(value) => onUpdateFormData('meta_description', value)}
        type="textarea"
        rows={2}
        maxLength={160}
        placeholder="Sayfanın Google sonuçlarında görünecek açıklaması (max 160 karakter)"
        required
      />
      <p className="mt-1 text-sm text-gray-500">
        {formData.meta_description.length}/160 karakter
      </p>

      <FormInput
        label="Anahtar Kelimeler (SEO)"
        value={formData.meta_keywords}
        onChange={(value) => onUpdateFormData('meta_keywords', value)}
        placeholder="Virgülle ayırarak yazın: örnek, anahtar, kelimeler"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Görsel URL"
          value={formData.image_url}
          onChange={(value) => onUpdateFormData('image_url', value)}
          type="url"
          required
        />

        <FormInput
          label="Yazar"
          value={formData.author}
          onChange={(value) => onUpdateFormData('author', value)}
          required
        />
      </div>

      <FormInput
        label="Kategori"
        value={formData.category}
        onChange={(value) => onUpdateFormData('category', value)}
        required
      />

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          İptal
        </button>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors duration-300"
        >
          {isEdit ? 'Güncelle' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
});

BlogForm.displayName = 'BlogForm';

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([{ ...formData, published: false }]);

      if (error) throw error;

      setShowAddModal(false);
      setFormData(initialFormData);
      fetchPosts();
      alert('Blog yazısı başarıyla eklendi.');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Blog yazısı eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleEdit = useCallback((post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      author: post.author,
      category: post.category || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || '',
      slug: post.slug || ''
    });
    setShowEditModal(true);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(formData)
        .eq('id', currentPost.id);

      if (error) throw error;

      setShowEditModal(false);
      setCurrentPost(null);
      setFormData(initialFormData);
      fetchPosts();
      alert('Blog yazısı başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Blog yazısı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        alert('Blog yazısı silinirken bir hata oluştu. Lütfen tekrar deneyin.');
        return;
      }

      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      alert('Blog yazısı başarıyla silindi.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Blog yazısı silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Blog yazısı durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif">Blog Yönetimi</h1>
          <p className="text-gray-600">Toplam {posts.length} yazı</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setShowAddModal(true);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-sm flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
          >
            <Plus size={20} className="mr-2" />
            Yeni Yazı Ekle
          </button>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-xs text-gray-500">{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.published ? 'Yayında' : 'Taslak'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="Düzenle"
                      >
                        <PenSquare size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif">Yeni Blog Yazısı Ekle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <BlogForm
              formData={formData}
              onUpdateFormData={handleUpdateFormData}
              onSubmit={handleSubmit}
              onClose={() => {
                setShowAddModal(false);
                setFormData(initialFormData);
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif">Blog Yazısını Düzenle</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <BlogForm
              formData={formData}
              onUpdateFormData={handleUpdateFormData}
              onSubmit={handleUpdate}
              isEdit={true}
              onClose={() => {
                setShowEditModal(false);
                setFormData(initialFormData);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};