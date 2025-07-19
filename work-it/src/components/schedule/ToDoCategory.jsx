import React, { useState, useRef } from 'react';

const ToDoCategory = ({ selectedCategory, onSelectCategory, categories = ['Work'], onAddCategory, onRemoveCategory }) => {
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [removingCategory, setRemovingCategory] = useState(null);
  const inputRef = useRef(null);

  // Handle click outside to cancel
  React.useEffect(() => {
    if (!adding) return;
    function handleClick(e) {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setAdding(false);
        setNewCat('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [adding]);

  const handleAdd = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      onAddCategory(newCat.trim());
    }
    setAdding(false);
    setNewCat('');
  };

  const handleRemoveCategory = (category) => {
    setRemovingCategory(category);
  };

  const confirmRemove = () => {
    if (removingCategory) {
      onRemoveCategory(removingCategory);
      setRemovingCategory(null);
    }
  };

  const cancelRemove = () => {
    setRemovingCategory(null);
  };

  return (
    <div style={{ margin: '24px 0 12px 0', marginBottom: adding ? '60px' : '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>Categories</div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', position: 'relative' }}>
        {/* Special Overall tab */}
        <div
          key="Overall"
          style={{
            border: selectedCategory === 'Overall' ? '3px solid #1976d2' : '2px solid #1976d2',
            borderRadius: '10px',
            padding: '18px 32px',
            minWidth: '100px',
            textAlign: 'center',
            background: selectedCategory === 'Overall' ? '#e3f0ff' : '#f5faff',
            fontWeight: '500',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onClick={() => onSelectCategory('Overall')}
        >
          Overall
        </div>
        {/* User categories */}
        {categories.map((cat) => (
          <div
            key={cat}
            style={{
              border: selectedCategory === cat ? '3px solid #43a047' : '2px solid #43a047',
              borderRadius: '10px',
              padding: '18px 32px',
              minWidth: '100px',
              textAlign: 'center',
              background: selectedCategory === cat ? '#d8ffe2' : '#f6fff7',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(67, 160, 71, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onClick={() => onSelectCategory(cat)}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('.remove-icon').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('.remove-icon').style.opacity = '0';
            }}
          >
            {cat}
            <button
              className="remove-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCategory(cat);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: 'none',
                background: '#dc3545',
                color: 'white',
                cursor: 'pointer',
                opacity: 0,
                transition: 'opacity 0.2s',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
              }}
              title={`Remove ${cat} category`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                delete
              </span>
            </button>
          </div>
        ))}
        {/* Plus icon */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={() => setAdding(true)}
            style={{
              marginLeft: '10px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'background 0.2s',
              fontSize: '24px',
              padding: 0
            }}
            title="Add Category"
            tabIndex={0}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#fff"/>
              <path d="M12 7v10M7 12h10" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {adding && (
            <div
              ref={inputRef}
              style={{
                position: 'absolute',
                top: '50px',
                marginTop: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff',
                border: '1px solid #1976d2',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                padding: '10px',
                zIndex: 10,
                minWidth: '160px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') { setAdding(false); setNewCat(''); }
                }}
                autoFocus
                placeholder="New category"
                style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button
                onClick={handleAdd}
                style={{
                  background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontWeight: 500
                }}
                disabled={!newCat.trim() || categories.includes(newCat.trim())}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      {removingCategory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={cancelRemove}
        >
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '400px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
              Remove Category
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#666' }}>
              Are you sure you want to remove the "{removingCategory}" category? 
              Tasks in this category will be moved to "N/A" but won't be deleted.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={cancelRemove}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  background: '#dc3545',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoCategory; 