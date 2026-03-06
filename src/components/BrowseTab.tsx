import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Heart, Trash2, FolderPlus } from 'lucide-react';
import { useStore } from '../stores/swipely.store';
import { ArchiveSheet } from './ArchiveSheet';

const VSCO = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  whiteGlass: 'rgba(255,255,255,0.9)',
  borderGlass: 'rgba(0,0,0,0.12)',
  textSecondary: '#6B6B6B',
  borderTrack: '#E8E8E8',
  sans: "'Helvetica Neue', 'Arial', system-ui, sans-serif",
  mono: "'Helvetica Neue', 'Arial', system-ui, sans-serif",
};

export function BrowseTab() {
  const {
    photos,
    currentIndex,
    likedIds,
    deletedIds,
    isArchiveSheetOpen,
    animState,
    heartAnimPhotoId,
    isGlitching,
    transitionDirection,
    likePhoto,
    deletePhoto,
    openArchiveSheet,
    setAnimState,
    setHeartAnimPhotoId,
    setIsGlitching,
    setCurrentIndex,
    setTransitionDirection,
    advanceToNext,
  } = useStore();

  const activePhotos = photos.filter((p) => !deletedIds.includes(p.id));
  const currentActiveIdx = activePhotos.findIndex((p) => p.id === photos[currentIndex]?.id);
  const currentPhoto = activePhotos[currentActiveIdx < 0 ? 0 : currentActiveIdx];

  const [deleteConfirmPending, setDeleteConfirmPending] = useState(false);
  const deleteConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const touchStartY = useRef(0);
  const isAnimating = useRef(false);

  const navigateTo = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating.current || !currentPhoto) return;
      const idx = activePhotos.findIndex((p) => p.id === currentPhoto.id);
      if (direction === 'next' && idx < activePhotos.length - 1) {
        isAnimating.current = true;
        setTransitionDirection('up');
        setIsGlitching(true);
        setTimeout(() => {
          const nextPhoto = activePhotos[idx + 1];
          const realIdx = photos.findIndex((p) => p.id === nextPhoto.id);
          setCurrentIndex(realIdx);
          setIsGlitching(false);
          isAnimating.current = false;
        }, 150);
      } else if (direction === 'prev' && idx > 0) {
        isAnimating.current = true;
        setTransitionDirection('down');
        setIsGlitching(true);
        setTimeout(() => {
          const prevPhoto = activePhotos[idx - 1];
          const realIdx = photos.findIndex((p) => p.id === prevPhoto.id);
          setCurrentIndex(realIdx);
          setIsGlitching(false);
          isAnimating.current = false;
        }, 150);
      }
    },
    [activePhotos, currentPhoto, photos, setCurrentIndex, setIsGlitching, setTransitionDirection]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) navigateTo('next');
      else if (e.deltaY < -30) navigateTo('prev');
    },
    [navigateTo]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 40) navigateTo('next');
    else if (delta < -40) navigateTo('prev');
  };

  useEffect(() => {
    if (deleteConfirmTimer.current) clearTimeout(deleteConfirmTimer.current);
    setDeleteConfirmPending(false);
  }, [currentPhoto?.id]);

  const handleLike = () => {
    if (!currentPhoto || animState !== 'idle') return;
    if (deleteConfirmTimer.current) clearTimeout(deleteConfirmTimer.current);
    setDeleteConfirmPending(false);
    setAnimState('like');
    setHeartAnimPhotoId(currentPhoto.id);
    likePhoto(currentPhoto.id);
    setTimeout(() => {
      setAnimState('idle');
      setHeartAnimPhotoId('');
      advanceToNext();
    }, 400);
  };

  const handleDelete = () => {
    if (!currentPhoto || animState !== 'idle') return;
    if (!deleteConfirmPending) {
      setDeleteConfirmPending(true);
      deleteConfirmTimer.current = setTimeout(() => {
        setDeleteConfirmPending(false);
      }, 2500);
    } else {
      if (deleteConfirmTimer.current) clearTimeout(deleteConfirmTimer.current);
      setDeleteConfirmPending(false);
      setAnimState('delete');
      setIsGlitching(true);
      setTimeout(() => {
        deletePhoto(currentPhoto.id);
        setIsGlitching(false);
        setAnimState('idle');
        advanceToNext();
      }, 300);
    }
  };

  const handleArchive = () => {
    if (!currentPhoto || animState !== 'idle') return;
    if (deleteConfirmTimer.current) clearTimeout(deleteConfirmTimer.current);
    setDeleteConfirmPending(false);
    setAnimState('archive');
    openArchiveSheet();
    setTimeout(() => setAnimState('idle'), 300);
  };

  const totalActive = activePhotos.length;
  const progressNum = currentActiveIdx + 1;
  const progressPct = totalActive > 0 ? (progressNum / totalActive) * 100 : 0;

  const glitchStyle: React.CSSProperties = isGlitching
    ? {
        filter: 'saturate(1.1) contrast(1.05)',
        transform: `translateX(${Math.random() > 0.5 ? 2 : -2}px)`,
        transition: 'none',
      }
    : {
        filter: 'none',
        transform: 'translateX(0)',
        transition: 'transform 0.15s ease-out',
      };

  const deleteShakeStyle: React.CSSProperties =
    animState === 'delete'
      ? { animation: 'deleteShake 0.3s ease-out' }
      : {};

  if (!currentPhoto && activePhotos.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 14, color: '#6B6B6B', fontFamily: VSCO.sans }}>所有照片已整理完毕</span>
        <span style={{ fontSize: 12, color: '#BDBDBD', fontFamily: VSCO.sans }}>0 / 0</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: '#F5F5F5',
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Photo fill */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...glitchStyle,
          ...deleteShakeStyle,
        }}
      >
        {currentPhoto && (
          <img
            key={currentPhoto.id}
            src={currentPhoto.url}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: animState === 'delete' ? 'brightness(0.85)' : 'none',
            }}
          />
        )}
      </div>

      {/* Light top gradient — photo hero treatment */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Light bottom gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, transparent 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px 8px',
        }}
      >
        <span
          style={{
            fontFamily: VSCO.sans,
            fontWeight: 800,
            fontSize: 19,
            color: '#0A0A0A',
            letterSpacing: '0.15em',
          }}
        >
          SWIPELY
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            fontWeight: 600,
            color: '#0A0A0A',
          }}
        >
          {progressNum}&nbsp;/&nbsp;{totalActive}
        </span>
      </div>

      {/* Right action bar */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          top: 426,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Like */}
        <ActionButton
          label="喜欢"
          onClick={handleLike}
          isActive={currentPhoto ? likedIds.includes(currentPhoto.id) : false}
          isAnimating={animState === 'like'}
          animType="like"
          icon={
            <Heart
              size={22}
              fill={currentPhoto && likedIds.includes(currentPhoto.id) ? '#FFFFFF' : 'none'}
              color={currentPhoto && likedIds.includes(currentPhoto.id) ? '#FFFFFF' : '#0A0A0A'}
              strokeWidth={2}
            />
          }
        />
        {/* Delete */}
        <ActionButton
          label="删除"
          confirmLabel="确认?"
          isConfirming={deleteConfirmPending}
          onClick={handleDelete}
          isActive={false}
          isAnimating={animState === 'delete'}
          animType="delete"
          icon={<Trash2 size={22} color={deleteConfirmPending ? '#FFFFFF' : '#0A0A0A'} strokeWidth={2} />}
        />
        {/* Archive */}
        <ActionButton
          label="归档"
          onClick={handleArchive}
          isActive={false}
          isAnimating={animState === 'archive'}
          animType="archive"
          icon={<FolderPlus size={22} color="#0A0A0A" strokeWidth={2} />}
        />
      </div>

      {/* Bottom info + progress */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '0 16px',
        }}
      >
        {currentPhoto && (
          <div
            style={{
              fontFamily: VSCO.sans,
              fontSize: 15,
              fontWeight: 500,
              color: '#0A0A0A',
              marginBottom: 8,
              letterSpacing: '0.04em',
            }}
          >
            {currentPhoto.date}&nbsp;&nbsp;{currentPhoto.location}
          </div>
        )}
        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: 2,
            background: '#E8E8E8',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: '#0A0A0A',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Heart animation overlay */}
      {animState === 'like' && heartAnimPhotoId && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div style={{ animation: 'heartPop 0.4s ease-out forwards' }}>
            <Heart size={80} fill="#0A0A0A" color="#0A0A0A" />
          </div>
        </div>
      )}

      {/* Archive Sheet */}
      {isArchiveSheetOpen && <ArchiveSheet />}

      <style>{`
        @keyframes heartPop {
          0% { transform: scale(0); opacity: 1; }
          60% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes deleteShake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        @keyframes archiveBounce {
          0% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
          70% { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }
        @keyframes heartButtonPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        @keyframes confirmPulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onClick: () => void;
  isActive: boolean;
  isAnimating: boolean;
  animType: 'like' | 'delete' | 'archive';
  icon: React.ReactNode;
}

function ActionButton({ label, confirmLabel, isConfirming, onClick, isActive, isAnimating, animType, icon }: ActionButtonProps) {
  const animStyle: React.CSSProperties = (() => {
    if (isConfirming) return { animation: 'confirmPulse 0.6s ease-in-out infinite alternate' };
    if (!isAnimating) return {};
    if (animType === 'like') return { animation: 'heartButtonPop 0.3s ease-out' };
    if (animType === 'archive') return { animation: 'archiveBounce 0.3s ease-out' };
    return {};
  })();

  const isActiveLike = isActive && animType === 'like';
  const bgColor = (isConfirming || isActiveLike) ? '#0A0A0A' : 'rgba(255,255,255,0.9)';
  const borderColor = (isConfirming || isActiveLike) ? '#0A0A0A' : 'rgba(0,0,0,0.12)';

  const displayLabel = isConfirming && confirmLabel ? confirmLabel : label;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: 52,
          height: 52,
          background: bgColor,
          border: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          ...animStyle,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontFamily: "'Helvetica Neue', 'Arial', system-ui, sans-serif",
          fontSize: 14,
          color: '#0A0A0A',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
          fontWeight: 700,
        }}
      >
        {displayLabel}
      </span>
    </div>
  );
}
