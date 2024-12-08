import React from "react"
import { Sidebar } from "@/components/sidebar"

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="size-full flex">
            <Sidebar />
            <main className="size-full overflow-auto">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout