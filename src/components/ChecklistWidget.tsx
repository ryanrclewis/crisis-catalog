import { useState, useEffect, useRef } from 'preact/hooks';
import '../styles/checklist.css';

interface Item {
  id: string;
  label: string;
  category: string;
  priority: string;
  estimatedCost: number;
  recommendation: string;
  purchaseUrl: string;
  notes?: string;
}

interface Checklist {
  id: string;
  title: string;
  description?: string;
  items: Item[];
}

interface ChecklistState {
  [itemId: string]: boolean;
}

const PRIORITY_ORDER = { high: 0, med: 1, low: 2 };
const CATEGORY_ORDER = ['water', 'food', 'meds', 'docs', 'tools', 'spiritual'];

const CHECKLIST_EMOJIS: Record<string, string> = {
  'home.md': '🏠',
  'gobag.md': '🎒',
  'car.md': '🚗',
};

const CHECKLIST_DESCRIPTIONS: Record<string, string> = {
  'home.md': 'Long-term shelter-in-place supplies for your household.',
  'gobag.md': '72-hour portable kit for evacuation or relocation.',
  'car.md': 'Roadside emergency and stranded situation supplies.',
};

export default function ChecklistWidget({ data }: { data: any }) {
  const { checklists, version } = data;
  const [selectedChecklist, setSelectedChecklist] = useState(0);
  const [state, setState] = useState<ChecklistState>({});
  const [sortBy, setSortBy] = useState<'category' | 'priority-high' | 'priority-low' | 'price-low' | 'price-high'>('category');
  const [showModal, setShowModal] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<Item | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const storageKey = `checklist:v1:${version}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        setState({});
      }
    }
  }, [version]);

  // Persist state to localStorage on change
  useEffect(() => {
    const storageKey = `checklist:v1:${version}`;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, version]);

  const handleCheck = (itemId: string, checked: boolean) => {
    setState(prev => ({ ...prev, [itemId]: checked }));
  };

  const handleReset = () => {
    if (confirm('Clear all checks for this checklist?')) {
      setState({});
    }
  };

  const openModal = (item: Item) => {
    setSelectedItemForModal(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItemForModal(null);
  };

  // Focus trap for modal
  useEffect(() => {
    if (showModal && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstEl = focusableElements[0] as HTMLElement;
      const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      };

      firstEl?.focus();
      modalRef.current.addEventListener('keydown', handleKeyDown);
      return () => modalRef.current?.removeEventListener('keydown', handleKeyDown);
    }
  }, [showModal]);

  const currentChecklist = checklists[selectedChecklist] as Checklist;
  
  const sortedItems = [...currentChecklist.items].sort((a, b) => {
    if (sortBy === 'priority-high') {
      const priorityDiff = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] -
                           PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER];
      if (priorityDiff !== 0) return priorityDiff;
      return a.estimatedCost - b.estimatedCost;
    }
    
    if (sortBy === 'priority-low') {
      const priorityDiff = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] -
                           PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER];
      if (priorityDiff !== 0) return priorityDiff;
      return a.estimatedCost - b.estimatedCost;
    }
    
    if (sortBy === 'price-low') {
      return a.estimatedCost - b.estimatedCost;
    }
    
    if (sortBy === 'price-high') {
      return b.estimatedCost - a.estimatedCost;
    }
    
    // Default: category then priority
    const catA = CATEGORY_ORDER.indexOf(a.category);
    const catB = CATEGORY_ORDER.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] -
           PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER];
  });

  const checked = Object.values(state).filter(Boolean).length;
  const totalCost = currentChecklist.items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const checkedCost = currentChecklist.items
    .filter(item => state[item.id])
    .reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <div className="checklist-widget">
      {/* Intro Cards - Clickable Selectors */}
      <div className="guidance-cards">
        {checklists.map((cl: Checklist, idx: number) => (
          <button
            key={cl.id}
            className={`card card-selector ${idx === selectedChecklist ? 'active' : ''}`}
            onClick={() => setSelectedChecklist(idx)}
            aria-pressed={idx === selectedChecklist}
            title={`Select ${cl.title}`}
          >
            <h3>{CHECKLIST_EMOJIS[cl.id] || '📋'} {cl.title}</h3>
            <p>{CHECKLIST_DESCRIPTIONS[cl.id] || cl.description || ''}</p>
          </button>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <label className="sort-label">Sort by:</label>
        <div className="sort-buttons">
          <button
            className={`sort-button ${sortBy === 'category' ? 'active' : ''}`}
            onClick={() => setSortBy('category')}
            aria-pressed={sortBy === 'category'}
          >
            Category
          </button>
          <button
            className={`sort-button ${sortBy === 'priority-high' ? 'active' : ''}`}
            onClick={() => setSortBy('priority-high')}
            aria-pressed={sortBy === 'priority-high'}
          >
            Priority ↓
          </button>
          <button
            className={`sort-button ${sortBy === 'priority-low' ? 'active' : ''}`}
            onClick={() => setSortBy('priority-low')}
            aria-pressed={sortBy === 'priority-low'}
          >
            Priority ↑
          </button>
          <button
            className={`sort-button ${sortBy === 'price-low' ? 'active' : ''}`}
            onClick={() => setSortBy('price-low')}
            aria-pressed={sortBy === 'price-low'}
          >
            Price ↑
          </button>
          <button
            className={`sort-button ${sortBy === 'price-high' ? 'active' : ''}`}
            onClick={() => setSortBy('price-high')}
            aria-pressed={sortBy === 'price-high'}
          >
            Price ↓
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="checklist-header">
        <h2>{currentChecklist.title}</h2>
        {currentChecklist.description && <p className="description">{currentChecklist.description}</p>}
      </div>

      {/* Stats */}
      <div className="checklist-stats">
        <div className="stat">
          <span className="stat-label">Progress</span>
          <span className="stat-value">
            {checked} / {currentChecklist.items.length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Estimated Cost</span>
          <span className="stat-value">
            ${checkedCost.toFixed(2)} / ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="checklist-items">
        {sortedItems.map(item => (
          <div key={item.id} className="item">
            <div className="item-header">
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={state[item.id] || false}
                  onChange={(e) => handleCheck(item.id, (e.target as HTMLInputElement).checked)}
                  aria-label={item.label}
                />
                <span className="item-label">{item.label}</span>
              </label>
              <span className={`priority priority-${item.priority}`}>
                {item.priority}
              </span>
            </div>

            <div className="item-details">
              <span className="cost">${item.estimatedCost.toFixed(2)}</span>
              <span className="category">{item.category}</span>
              <button
                className="details-btn"
                onClick={() => openModal(item)}
                aria-label={`Details for ${item.label}`}
                title="View recommendations and purchase link"
              >
                DETAILS →
              </button>
            </div>

            {item.notes && <p className="item-notes">{item.notes}</p>}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <div className="checklist-actions">
        <button className="reset-btn" onClick={handleReset}>
          Clear Checks
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedItemForModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            ref={modalRef}
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="modal-title">{selectedItemForModal.label}</h3>
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Recommendation</h4>
                <p>{selectedItemForModal.recommendation}</p>
              </div>

              <div className="modal-section">
                <h4>Details</h4>
                <ul>
                  <li><strong>Category:</strong> {selectedItemForModal.category}</li>
                  <li><strong>Priority:</strong> {selectedItemForModal.priority}</li>
                  <li><strong>Estimated Cost:</strong> ${selectedItemForModal.estimatedCost.toFixed(2)}</li>
                  {selectedItemForModal.notes && <li><strong>Notes:</strong> {selectedItemForModal.notes}</li>}
                </ul>
              </div>

              <div className="modal-section">
                <a
                  href={selectedItemForModal.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="purchase-link"
                >
                  Purchase Item (opens in new tab)
                </a>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
