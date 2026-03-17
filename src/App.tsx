import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { GalleryPage } from './pages/GalleryPage'
import { ProductPage } from './pages/ProductPage'
import { ProductsProvider } from './state/products'
import { FeedbackProvider } from './state/feedback'

function App() {
  return (
    <ProductsProvider>
      <FeedbackProvider>
        <div className="app">
          <header className="topbar">
            <div className="topbar__inner">
              <div className="brand">
                <div className="brand__mark" aria-hidden="true" />
                <div className="brand__text">
                  <div className="brand__title">Product Pro</div>
                  <div className="brand__subtitle">Minimal gallery & feedback</div>
                </div>
              </div>
            </div>
          </header>

          <main className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/gallery" replace />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="*" element={<Navigate to="/gallery" replace />} />
            </Routes>
          </main>
        </div>
      </FeedbackProvider>
    </ProductsProvider>
  )
}

export default App
