import { useAtomValue } from "jotai";
import { alert } from "../lib/stores";

const Alert = () => {
	const Alert = useAtomValue(alert);

	return (
		<div
			className={`absolute left-0 w-screen h-12 flex justify-center transition-all z-20 ease-in-out ${Alert.trim().length === 0 ? "-top-20 opacity-0" : "top-5"}`}
		>
			<div className="h-full w-fit px-5 bg-primary-bg rounded-xl border-1 border-border-bg shadow-[0px_0px_50px_0px_#00000080]">
				<p className="text-sm text-center leading-12 font-github text-white">
					{Alert}
				</p>
			</div>
		</div>
	);
};

export default Alert;
