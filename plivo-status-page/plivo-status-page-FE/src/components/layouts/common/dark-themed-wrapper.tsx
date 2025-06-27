const DarkThemedWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-screen items-center justify-center gap-4 bg-neutral-800">
            {children}
        </div>
    )
}

export default DarkThemedWrapper;