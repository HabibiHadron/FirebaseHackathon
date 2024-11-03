import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Todos from './Notes'
import Settings from './Settings'

export default function Index() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="todos/*" element={<Todos />} />
            <Route path="settings/*" element={<Settings />} />
        </Routes>
    )
}
