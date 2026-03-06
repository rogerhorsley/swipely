import React, { useState } from 'react';
import { Folder, Plus, X } from 'lucide-react';
import { useStore } from '../stores/swipely.store';

const VSCO_SANS = "'Helvetica Neue', 'Arial', system-ui, sans-serif";

export function FoldersTab() {
  const { folders, photos, createFolder } = useStore();
  const [showInput, setShowInput] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleCreate = () => {
    if (inputVal.trim()) {
      createFolder(inputVal.trim());
      setInputVal('');
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') {
      setShowInput(false);
      setInputVal('');
    }
  };

  const getPhotos = (photoIds: string[]) =>
    photoIds
      .map((id) => photos.find((p) => p.id === id))
      .filter(Boolean) as typeof photos;

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span
            style={{
              fontFamily: VSCO_SANS,
              fontWeight: 800,
              fontSize: 30,
              color: '#0A0A0A',
              letterSpacing: '0.02em',
            }}
          >
            文件夹
          </span>
          <span
            style={{
              fontFamily: VSCO_SANS,
              fontSize: 15,
              color: '#6B6B6B',
              fontWeight: 500,
            }}
          >
            {folders.length}
          </span>
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#0A0A0A',
            border: 'none',
            padding: '6px 12px',
            cursor: 'pointer',
            borderRadius: 6,
            color: '#FFFFFF',
            fontFamily: VSCO_SANS,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          <Plus size={14} color="#FFFFFF" strokeWidth={2} />
          新建文件夹
        </button>
      </div>

      {/* New folder input */}
      {showInput && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #E8E8E8',
            background: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <input
            autoFocus
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="文件夹名称..."
            style={{
              flex: 1,
              background: '#F5F5F5',
              border: '1px solid #E8E8E8',
              color: '#0A0A0A',
              fontFamily: VSCO_SANS,
              fontSize: 17,
              padding: '8px 12px',
              outline: 'none',
              borderRadius: 8,
            }}
          />
          <button
            onClick={handleCreate}
            style={{
              background: '#0A0A0A',
              border: 'none',
              padding: '8px 14px',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontFamily: VSCO_SANS,
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 6,
            }}
          >
            确认
          </button>
          <button
            onClick={() => { setShowInput(false); setInputVal(''); }}
            style={{
              background: '#F5F5F5',
              border: '1px solid #E8E8E8',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 6,
            }}
          >
            <X size={14} color="#6B6B6B" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Folder list */}
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {folders.length === 0 && !showInput && (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              fontFamily: VSCO_SANS,
              fontSize: 17,
              fontWeight: 400,
              color: '#BDBDBD',
            }}
          >
            暂无文件夹
          </div>
        )}
        {folders.map((folder) => {
          const folderPhotos = getPhotos(folder.photoIds);
          const thumbPhotos = folderPhotos.slice(0, 3);
          return (
            <div
              key={folder.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E8E8',
                borderRadius: 12,
                padding: '14px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Folder size={18} color="#0A0A0A" strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: VSCO_SANS,
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#0A0A0A',
                    flex: 1,
                    letterSpacing: '0.01em',
                  }}
                >
                  {folder.name}
                </span>
                <span
                  style={{
                    fontFamily: VSCO_SANS,
                    fontSize: 15,
                    fontWeight: 400,
                    color: '#6B6B6B',
                  }}
                >
                  {folderPhotos.length} 张
                </span>
              </div>

              {/* Thumbnail strip */}
              {thumbPhotos.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    height: 72,
                    overflow: 'hidden',
                    borderRadius: 8,
                  }}
                >
                  {thumbPhotos.map((p) => (
                    <img
                      key={p.id}
                      src={p.url}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ))}
                  {thumbPhotos.length < 3 &&
                    Array.from({ length: 3 - thumbPhotos.length }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#F5F5F5',
                          border: '1px solid #E8E8E8',
                        }}
                      />
                    ))}
                </div>
              ) : (
                <div
                  style={{
                    height: 72,
                    background: '#F5F5F5',
                    border: '1px solid #E8E8E8',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: VSCO_SANS,
                      fontSize: 15,
                      color: '#BDBDBD',
                    }}
                  >
                    空文件夹
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
