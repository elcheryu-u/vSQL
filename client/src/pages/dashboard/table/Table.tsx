import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

export default function Table() {
    const params = useParams();

    return (
        <div>{params.table}</div>
    )
}
