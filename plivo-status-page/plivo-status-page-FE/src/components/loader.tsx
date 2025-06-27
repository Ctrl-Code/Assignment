import { PulseLoader } from "react-spinners"

export const Loader = ({ loading=true }: { loading: boolean }) => (
    <div className="flex justify-center items-center h-full w-full">
        <PulseLoader
            color="#000"
            loading={loading}
            size={18}
        />
    </div>
)