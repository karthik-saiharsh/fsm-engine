import { alert } from "../lib/backend";
import { useAtomValue } from "jotai";
import clsx from "clsx";

const Alert = (props: { message: string }) => {
	const alertMsg = useAtomValue(alert);

	return (
		<div
			className={clsx(
				"select-none w-full h-20 absolute z-50 mx-auto flex justify-center items-center transition-all ease-in-out duration-300",
				{
					"-top-50": alertMsg == "nil",
					"top-0": alertMsg != "nil",
				},
			)}
		>
			<span className="text-center leading-13 w-fit px-5 h-13 bg-primary-bg border border-border-bg rounded-2xl shadow-[0px_0px_100px_0px_#000000] transition-all ease-in-out duration-300">
				<p className="text-white font-github text-balance font-medium">
					{props.message}
				</p>
			</span>
		</div>
	);
};

export default Alert;
