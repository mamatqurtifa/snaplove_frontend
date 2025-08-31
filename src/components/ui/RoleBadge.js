'use client';

export default function RoleBadge({ role }) {
  if (!role || role === 'basic') return null;
  
  const getRoleConfig = (role) => {
    // Normalize role names - remove suffixes like _basic, _premium
    const normalizedRole = role.toLowerCase().replace(/_basic$|_premium$/, '');
    const isPremium = role.toLowerCase().includes('_premium');
    
    switch (normalizedRole) {
      case 'verified':
        if (isPremium) {
          return {
            label: 'Premium',
            showText: true,
            icon: (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ),
            bgColor: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
            textColor: 'text-white',
            hoverColor: 'hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600',
            shadowColor: 'shadow-xl shadow-yellow-500/50',
            ringColor: 'ring-2 ring-yellow-400/40',
            description: '⭐ Premium verified account'
          };
        }
        return {
          showText: false,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          ),
          bgColor: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
          textColor: 'text-white',
          hoverColor: 'hover:from-blue-600 hover:via-blue-700 hover:to-indigo-800',
          shadowColor: 'shadow-xl shadow-blue-500/40',
          ringColor: 'ring-2 ring-blue-400/30',
          description: '✓ Verified account'
        };
      case 'official':
        return {
          label: 'Official',
          showText: true,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
            </svg>
          ),
          bgColor: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500',
          textColor: 'text-white',
          hoverColor: 'hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600',
          shadowColor: 'shadow-xl shadow-yellow-500/50',
          ringColor: 'ring-2 ring-yellow-400/40',
          description: '⭐ Premium verified account'
        };
      case 'official':
        return {
          label: 'Official',
          showText: true,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
            </svg>
          ),
          bgColor: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
          textColor: 'text-white',
          hoverColor: 'hover:from-emerald-600 hover:via-green-700 hover:to-teal-800',
          shadowColor: 'shadow-xl shadow-emerald-500/40',
          ringColor: 'ring-2 ring-emerald-400/30',
          description: '🏛️ Official account'
        };
      case 'developer':
        return {
          label: 'Developer',
          showText: true,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
          ),
          bgColor: 'bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800',
          textColor: 'text-white',
          hoverColor: 'hover:from-purple-700 hover:via-violet-800 hover:to-indigo-900',
          shadowColor: 'shadow-xl shadow-purple-500/40',
          ringColor: 'ring-2 ring-purple-400/30',
          description: '💻 Developer account'
        };
      case 'admin':
        return {
          label: 'Admin',
          showText: true,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          ),
          bgColor: 'bg-gradient-to-br from-red-600 via-rose-700 to-pink-800',
          textColor: 'text-white',
          hoverColor: 'hover:from-red-700 hover:via-rose-800 hover:to-pink-900',
          shadowColor: 'shadow-xl shadow-red-500/50',
          ringColor: 'ring-2 ring-red-400/40',
          description: '👑 Administrator'
        };
      default:
        return {
          label: role.charAt(0).toUpperCase() + role.slice(1),
          showText: true,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
            </svg>
          ),
          bgColor: 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700',
          textColor: 'text-white',
          hoverColor: 'hover:from-slate-600 hover:via-slate-700 hover:to-slate-800',
          shadowColor: 'shadow-lg shadow-slate-500/30',
          ringColor: 'ring-1 ring-slate-400/20',
          description: `✨ ${role} role`
        };
    }
  };
  
  const config = getRoleConfig(role);
  
  return (
    <span 
      className={`
        relative inline-flex items-center justify-center gap-2 
        px-4 py-2 rounded-full text-xs font-bold 
        ${config.bgColor} ${config.textColor} ${config.hoverColor} 
        transition-all duration-300 ${config.shadowColor} ${config.ringColor}
        cursor-help transform hover:scale-105 
        border border-white/20 backdrop-blur-sm
        before:absolute before:inset-0 before:rounded-full 
        before:bg-gradient-to-r before:from-white/10 before:to-transparent 
        before:opacity-50
      `}
      title={config.description}
    >
      <span className="relative z-10 drop-shadow-sm">
        {config.icon}
      </span>
      {config.showText && (
        <span className="relative z-10 tracking-wide drop-shadow-sm font-bold">
          {config.label}
        </span>
      )}
      
      {/* Premium shine effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform hover:animate-pulse"></div>
    </span>
  );
}