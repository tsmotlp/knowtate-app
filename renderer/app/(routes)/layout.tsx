import { Sidebar } from "@/components/sidebar"

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full w-full flex">
            <Sidebar />
            <main className="h-full w-full overflow-auto">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout