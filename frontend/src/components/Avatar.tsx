import { useRef } from 'react';
import { useAuthStore } from '../store/authStore';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

const cameraSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
};

const Avatar = ({ size = 'md', editable = false, className = '' }: AvatarProps) => {
  const { user, avatarUrl, setAvatarUrl } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setAvatarUrl(base64);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${user?.firstName} ${user?.lastName}`}
          className={`${sizeMap[size]} rounded-xl object-cover ring-2 ring-white dark:ring-slate-700`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-slate-700`}
        >
          {initials}
        </div>
      )}

      {editable && (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-full flex items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-600 transition-all shadow-md group"
            style={{ width: size === 'xl' ? 28 : size === 'lg' ? 24 : 20, height: size === 'xl' ? 28 : size === 'lg' ? 24 : 20 }}
            title="Upload profile photo"
          >
            <svg
              className={`${cameraSizeMap[size === 'xl' ? 'sm' : size === 'lg' ? 'sm' : 'sm']} text-slate-500 dark:text-slate-300 group-hover:text-blue-600 transition-colors`}
              style={{ width: size === 'xl' ? 14 : 12, height: size === 'xl' ? 14 : 12 }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default Avatar;
