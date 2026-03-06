import React, { useState } from 'react';
import { Folder, Plus, X } from 'lucide-react';
import { useStore } from '../stores/swipely.store';

const VSCO_SANS = "'Helvetica Neue', 'Arial', system-ui, sans-serif";

export function ArchiveSheet() {
  const {
    folders,
    photos,
    currentIndex,
    deletedIds,
    closeArchiveSheet,
    archivePhotoToFolder,
    advanceToNext,
    createFolder,
  } = useStore();

  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState('');

  const activePhotos = photos.filter((p) => !deletedIds.includes(p.id));
  const currentPhoto = activePhotos.find((p) => p.id === photos[currentIndex]?.id) ?? activePhotos[0];

  const handleSelectFolder = (folderId: string) => {
    if (currentPhoto) {
      archivePhotoToFolder(currentPhoto.id, folderId);
    }
    closeArchiveSheet();
    advanceToNext();
  };

  const handleCreateAndArchive = () => {
    if (!newName.trim()) return;
    createFolder(newName.trim());
    const { folders: updatedFolders } = useStore.getState();
    const newest = updatedFolders[updatedFolders.length - 1];
    if (newest && currentPhoto) {
      archivePhotoToFolder(currentPhoto.id, newest.id);
    }
    setNewName('');
    setShowInput(false);
    closeArchiveSheet();
    advanceToNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateAndArchive();
    if (e.key === 'Escape') {
      setShowInput(false);
      setNewName('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeArchiveSheet}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 30,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid #E8E8E8',
          zIndex: 40,
          animation: 'sheetUp 0.25s ease-out forwards',
          maxHeight: '75%',
          overflowY: 'auto',
        }}
      >
        {/* Sheet header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 16px 12px',
            borderBottom: '1px solid #E8E8E8',
          }}
        >
          <span
            style={{
              fontFamily: VSCO_SANS,
              fontWeight: 800,
              fontSize: 26,
              color: '#0A0A0A',
              letterSpacing: '0.01em',
            }}
          >
            归档到文件夹
          </span>
          <button
            onClick={closeArchiveSheet}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} color="#6B6B6B" strokeWidth={1.5} />
          </button>
        </div>

        {/* New folder row */}
        <div
          style={{
            borderBottom: '1px solid #E8E8E8',
          }}
        >
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: '#F5F5F5',
                  border: '1px dashed #BDBDBD',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={16} color="#0A0A0A" strokeWidth={2} />
              </div>
              <span
                style={{
                  fontFamily: VSCO_SANS,
                  fontSize: 17,
                  color: '#0A0A0A',
                  fontWeight: 700,
                }}
              >
                新建文件夹
              </span>
            </button>
          ) : (
            <div
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
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
                onClick={handleCreateAndArchive}
                style={{
                  background: '#0A0A0A',
                  border: 'none',
                  padding: '8px 12px',
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
                onClick={() => { setShowInput(false); setNewName(''); }}
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
        </div>

        {/* Folder list */}
        {folders.map((folder) => {
          const count = folder.photoIds.length;
          const thumb = folder.photoIds[0]
            ? photos.find((p) => p.id === folder.photoIds[0])
            : null;
          return (
            <button
              key={folder.id}
              onClick={() => handleSelectFolder(folder.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid #F0F0F0',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  overflow: 'hidden',
                  border: '1px solid #E8E8E8',
                  borderRadius: 6,
                  flexShrink: 0,
                }}
              >
                {thumb ? (
                  <img
                    src={thumb.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#F5F5F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Folder size={16} color="#BDBDBD" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: VSCO_SANS,
                    fontWeight: 700,
                    fontSize: 17,
                    color: '#0A0A0A',
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {folder.name}
                </div>
                <div
                  style={{
                    fontFamily: VSCO_SANS,
                    fontSize: 15,
                    fontWeight: 400,
                    color: '#6B6B6B',
                  }}
                >
                  {count} 张照片
                </div>
              </div>
              <Plus size={16} color="#6B6B6B" strokeWidth={1.5} />
            </button>
          );
        })}

        {/* Bottom padding */}
        <div style={{ height: 16 }} />
      </div>

      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
