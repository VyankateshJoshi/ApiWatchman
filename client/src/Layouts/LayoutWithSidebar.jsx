import React from 'react'
import MiniDrawer from '../components/Sidebar/Sidebar'

function LayoutWithSidebar({ children }) {
    return (
        <div style={{ display: 'flex' }}>
            <MiniDrawer />
            <div style={{ padding: '65px 0px',width:"100%" }}>
                {children}
            </div>
        </div>
    )
}

export default LayoutWithSidebar
