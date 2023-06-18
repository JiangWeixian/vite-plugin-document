import './App.css'

import React from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'

import routes from '~react-pages'

const RouterViewer = () => {
  const element = useRoutes(routes)
  return element
}

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>loading...</div>}>
        <RouterViewer />
      </React.Suspense>
    </BrowserRouter>
  )
}

export default App
