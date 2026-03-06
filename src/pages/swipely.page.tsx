import React from 'react';
import { Grid3X3, Heart, Folder } from 'lucide-react';
import { useStore } from '../stores/swipely.store';
import { BrowseTab } from '../components/BrowseTab';
import { LikedTab } from '../components/LikedTab';
import { FoldersTab } from '../components/FoldersTab';

export default function SwipelyPage() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <div
      className="antialiased"
      style={{
        width: '100%',
        height: '100dvh',
        minHeight: '100vh',
        background: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Helvetica Neue', 'Arial', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {/* Page content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {activeTab === 'browse' && <BrowseTab />}
        {activeTab === 'liked' && <LikedTab />}
        {activeTab === 'folders' && <FoldersTab />}
      </div>

      {/* Bottom tab bar */}
      <div
        style={{
          display: 'flex',
          height: 60,
          borderTop: '1px solid #E8E8E8',
          background: '#FFFFFF',
          flexShrink: 0,
          position: 'relative',
          zIndex: 50,
        }}
      >
        <TabButton
          label="浏览"
          isActive={activeTab === 'browse'}
          onClick={() => setActiveTab('browse')}
          icon={<Grid3X3 size={20} strokeWidth={1.5} />}
        />
        <TabButton
          label="喜欢"
          isActive={activeTab === 'liked'}
          onClick={() => setActiveTab('liked')}
          icon={<Heart size={20} strokeWidth={1.5} />}
        />
        <TabButton
          label="文件夹"
          isActive={activeTab === 'folders'}
          onClick={() => setActiveTab('folders')}
          icon={<Folder size={20} strokeWidth={1.5} />}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

function TabButton({ label, isActive, onClick, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: isActive ? '#0A0A0A' : '#BDBDBD',
        position: 'relative',
        padding: '6px 0',
        transition: 'color 0.1s',
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 32,
            height: 2,
            background: '#0A0A0A',
          }}
        />
      )}
      <div style={{ color: isActive ? '#0A0A0A' : '#BDBDBD' }}>
        {icon}
      </div>
      <span
        style={{
          fontFamily: "'Helvetica Neue', 'Arial', system-ui, sans-serif",
          fontSize: 15,
          fontWeight: isActive ? 700 : 500,
          letterSpacing: '0.04em',
          color: isActive ? '#0A0A0A' : '#BDBDBD',
        }}
      >
        {label}
      </span>
    </button>
  );
}
