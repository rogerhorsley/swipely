// design-template code, don't change this file.
import '../global.css';

interface AppInterface {
  store: any;
  theme: any;
  initPage(): void;
  transitionTo(targetPageId: string, runtimeParams?: Record<string, any>): void;
  goBack(): void;
  renderCurrentPage(): void;
  renderError(error: Error): void;
}

const isLowercasePageId = (value: string) => /^[a-z0-9_-]+$/.test(value);

export const App: AppInterface = {
  store: null,
  theme: null,

  initPage() {
    if (App.store && App.theme) {
      App.renderCurrentPage();
      // @ts-ignore
      if (typeof lucide !== 'undefined') {
        // @ts-ignore
        lucide.createIcons();
      }
      return;
    }

    const loadData = () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.__INLINE_DATA__) {
        // @ts-ignore
        const inlineData = window.__INLINE_DATA__;
        return Promise.resolve([inlineData.store || {}, inlineData.theme || {}]);
      }

      // @ts-ignore - compile-time constant from rspack.
      if (typeof __INLINE_DATA_AVAILABLE__ !== 'undefined' && __INLINE_DATA_AVAILABLE__) {
        return Promise.resolve([{}, {}]);
      }

      return Promise.all([
        fetch('./data/store.json')
          .then((r) => r.json())
          .catch(() => ({})),
        fetch('./data/theme.json')
          .then((r) => r.json())
          .catch(() => ({})),
      ]);
    };

    loadData()
      .then(([store, theme]) => {
        App.store = store || {};
        App.theme = theme || {};
        App.renderCurrentPage();
        // @ts-ignore
        if (typeof lucide !== 'undefined') {
          // @ts-ignore
          lucide.createIcons();
        }
      })
      .catch((error) => {
        console.error('Failed to load app data', error);
        App.renderError(error);
      });
  },

  transitionTo(targetPageId: string, runtimeParams?: Record<string, any>) {
    if (!targetPageId || !isLowercasePageId(targetPageId)) {
      console.error(
        `Invalid target page "${targetPageId}". Expected lowercase page id matching src/pages filename.`
      );
      return;
    }

    window.parent.postMessage(
      {
        type: 'navigate',
        name: 'navigate',
        data: {
          targetPageId,
          params: runtimeParams || {},
        },
      },
      '*'
    );
  },

  goBack() {
    window.parent.postMessage(
      {
        type: 'goBack',
        name: 'navigate',
      },
      '*'
    );
  },

  renderCurrentPage() {
    console.warn('renderCurrentPage() not implemented for this page');
  },

  renderError(error: Error) {
    const app = document.getElementById('root');
    if (app) {
      app.innerHTML = `
        <div class="p-8 text-center">
          <div class="text-red-500 font-bold mb-2">Error</div>
          <div class="text-gray-600">${error.message}</div>
        </div>
      `;
    }
  },
};

declare global {
  interface Window {
    App: typeof App;
    __INLINE_DATA__?: {
      store?: any;
      theme?: any;
    };
  }
  const __INLINE_DATA_AVAILABLE__: boolean | undefined;
}

if (typeof window !== 'undefined') {
  window.App = App;
  if (window.__INLINE_DATA__) {
    window.App.store = window.__INLINE_DATA__.store || {};
    window.App.theme = window.__INLINE_DATA__.theme || {};
  }
}
