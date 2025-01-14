function Spinner() {
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="w-6 h-6 rounded-full border-t-2 border-b-2 border-gray-200"></div>
                    <div
                        className="absolute top-0 left-0 rounded-full w-6 h-6 border-t-2 border-b-2 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
            <p>Uploading ...</p>
        </>
    )
}

export default Spinner