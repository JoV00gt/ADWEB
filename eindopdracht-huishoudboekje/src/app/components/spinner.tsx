export function Spinner() {
    return (
        <div aria-label="loading" className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
    )
}