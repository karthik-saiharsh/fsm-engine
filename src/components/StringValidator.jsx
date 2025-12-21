import { useState } from "react";
import { validateString } from "../lib/special_functions";
import PopupWindow from "./PopupWindow";

const StringValidator = () => {
	return (
		<PopupWindow
			classNames="w-90 h-fit"
			title="String Validator"
			is_visible="string_validator"
		>
			<Body />
		</PopupWindow>
	);
};

function Body() {
	const [str, setStr] = useState("");
	const [instDesc, setInstDesc] = useState(null);

	function HandleValidate() {
		setInstDesc(validateString(str));
	}

	return (
		<div className="w-full h-fit flex flex-col items-center py-3 px-5 mb-5 gap-3 select-none">
			<p className="font-github text-center text-white">Enter a String</p>
			<span className="flex justify-center items-center gap-3">
				<input
					value={str}
					onChange={(e) => setStr(e.target.value)}
					className="px-1 py-2 text-sm font-medium text-white font-github rounded-lg border border-border-bg outline-none hover:border-white/30 focus:border-blue-500 transition-all ease-in-out"
					type="text"
					placeholder="Enter String..."
				/>

				<button
					onClick={HandleValidate}
					type="button"
					className="font-github text-sm hover:scale-110 active:scale-100 transition-all ease-in-out text-white bg-blue-500 px-8 py-2 rounded-lg border border-border-bg flex gap-2"
				>
					Go
				</button>
			</span>

			{instDesc?.at(-1) ? (
				<p className="text-balance font-github font-bold text-green-300">
					String Is Accepted
				</p>
			) : (
				<p className="text-balance font-github font-bold text-red-300">
					String is Rejected
				</p>
			)}

			{instDesc?.map(
				(item, idx) =>
					idx !== instDesc.length - 1 && (
						<p
							className="font-github text-white font-bold text-balance text-center tracking-widest"
							key={idx}
						>
							= ({item[0]}, {item[1].length ? item[1] : "λ"})
						</p>
					),
			)}
		</div>
	);
}

export default StringValidator;
