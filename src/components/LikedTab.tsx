import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../stores/swipely.store';

const VSCO_SANS = "'Helvetica Neue', 'Arial', system-ui, sans-serif";

export function LikedTab() {
  const { photos, likedIds, deletedIds } = useStore();

  const likedPhotos = photos.filter(
    (p) => likedIds.includes(p.id) && !deletedIds.includes(p.id)
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        background: '#FFFFFF',
        padding: '0 0 8px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: VSCO_SANS,
            fontWeight: 800,
            fontSize: 30,
            color: '#0A0A0A',
            letterSpacing: '0.02em',
          }}
        >
          喜欢
        </span>
        <span
          style={{
            fontFamily: VSCO_SANS,
            fontSize: 15,
            color: '#6B6B6B',
            fontWeight: 500,
          }}
        >
          {likedPhotos.length}
        </span>
      </div>

      {likedPhotos.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 24px',
            gap: 12,
          }}
        >
          <Heart size={36} color="#0A0A0A" strokeWidth={1.5} style={{ opacity: 0.2 }} />
          <span
            style={{
              fontFamily: VSCO_SANS,
              fontSize: 17,
              fontWeight: 500,
              color: '#6B6B6B',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            还没有喜欢的照片
          </span>
          <span
            style={{
              fontFamily: VSCO_SANS,
              fontSize: 16,
              fontWeight: 400,
              color: '#BDBDBD',
              textAlign: 'center',
            }}
          >
            在浏览页点击心形按钮
          </span>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            padding: '12px',
          }}
        >
          {likedPhotos.map((photo) => (
            <div
              key={photo.id}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                borderRadius: 10,
              }}
            >
              <img
                src={photo.url}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Heart badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#0A0A0A',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                }}
              >
                <Heart size={14} fill="#fff" color="#fff" strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
