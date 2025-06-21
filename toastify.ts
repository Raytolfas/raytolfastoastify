type ToastType = 'success' | 'error' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type ToastTheme = 'light' | 'dark';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  theme?: ToastTheme;
}

const icons: Record<ToastType, string> = {
  success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
  error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
};

const styles = `
  .ray-toast-container {
    position: fixed;
    z-index: 9999;
    padding: 1rem;
    pointer-events: none;
  }
  .ray-toast-container.top-right { top: 1rem; right: 1rem; }
  .ray-toast-container.top-left { top: 1rem; left: 1rem; }
  .ray-toast-container.bottom-right { bottom: 1rem; right: 1rem; }
  .ray-toast-container.bottom-left { bottom: 1rem; left: 1rem; }

  .ray-toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--toast-bg, #fff);
    color: var(--toast-color, #333);
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.375rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: ray-slide-in 0.3s ease-out;
    pointer-events: auto;
    max-width: 320px;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease;
  }
  .ray-toast:hover {
    transform: scale(1.02);
  }
  .ray-toast.closing {
    animation: ray-slide-out 0.3s ease-in forwards;
  }

  .ray-toast-success { --toast-bg: #10b981; --toast-color: #fff; }
  .ray-toast-error { --toast-bg: #ef4444; --toast-color: #fff; }
  .ray-toast-info { --toast-bg: #3b82f6; --toast-color: #fff; }

  .ray-toast[data-theme="dark"] {
    --toast-bg: #1f2937;
    --toast-color: #f3f4f6;
  }
  .ray-toast[data-theme="dark"].ray-toast-success { --toast-bg: #065f46; }
  .ray-toast[data-theme="dark"].ray-toast-error { --toast-bg: #b91c1c; }
  .ray-toast[data-theme="dark"].ray-toast-info { --toast-bg: #1e40af; }

  .ray-toast-icon { display: flex; align-items: center; }
  .ray-toast-message { flex: 1; font-size: 0.875rem; }
  .ray-toast-close {
    background: none;
    border: none;
    color: var(--toast-color);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0 0.5rem;
    line-height: 1;
  }
  .ray-toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: var(--toast-color);
    opacity: 0.5;
    animation: ray-progress var(--duration) linear forwards;
  }

  @keyframes ray-slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes ray-slide-out {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  @keyframes ray-progress {
    from { width: 100%; }
    to { width: 0; }
  }
`;

let styleElement: HTMLStyleElement | null = null;

const injectStyles = () => {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
};

const createToastContainer = (position: ToastPosition = 'top-right'): HTMLElement => {
  let container = document.querySelector(`.ray-toast-container.${position}`) as HTMLElement;
  if (!container) {
    container = document.createElement('div');
    container.className = `ray-toast-container ${position}`;
    document.body.appendChild(container);
  }
  return container;
};

const toast = ({ message, type = 'info', duration = 3000, position = 'top-right', theme = 'light' }: ToastOptions) => {
  injectStyles();
  const container = createToastContainer(position);
  const toastEl = document.createElement('div');
  toastEl.className = `ray-toast ray-toast-${type}`;
  toastEl.dataset.theme = theme;
  toastEl.style.setProperty('--duration', `${duration}ms`);
  toastEl.innerHTML = `
    <span class="ray-toast-icon">${icons[type]}</span>
    <span class="ray-toast-message">${message}</span>
    <button class="ray-toast-close">×</button>
    <div class="ray-toast-progress"></div>
  `;

  container.appendChild(toastEl);

  const timeout = setTimeout(() => {
    toastEl.classList.add('closing');
    setTimeout(() => toastEl.remove(), 300);
  }, duration);

  toastEl.querySelector('.ray-toast-close')?.addEventListener('click', () => {
    clearTimeout(timeout);
    toastEl.classList.add('closing');
    setTimeout(() => toastEl.remove(), 300);
  });
};

export { toast, ToastOptions };