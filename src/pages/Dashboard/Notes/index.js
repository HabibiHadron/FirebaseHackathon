import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Add from './Add'
import All from './All'
import Edit from './Edit'

export default function Todos() {
    return (
        <Routes>
            <Route path='add' element={<Add />} />
            <Route path='all' element={<All />} />
            <Route path='edit/:id' element={<Edit />} />
        </Routes>
    )
}
