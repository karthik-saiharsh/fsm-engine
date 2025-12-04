// This is a general template for a PopUp Window

import { useState } from "react";
import { X, Maximize, Minimize, Target } from "lucide-react";
import { show_string_validator } from "../lib/stores";
import { useSetAtom } from "jotai";

const PopupWindow = (props) => {
	const { title, children, classNames, is_visible } = props;

	// Jotai Atoms
	const setIsVisibleStringVal = useSetAtom(show_string_validator);

	const [windowState, setWindowState] = useState({
		left: 50,
		top: 50,
		isDragging: false,
		offsetX: 0,
		offsetY: 0,
		minimized: false,
	});

	function handleMouseDown(e) {
		setWindowState((old) => ({
			...old,
			isDragging: true,
			offsetX: e.clientX - old.left,
			offsetY: e.clientY - old.top,
		}));
	}

	function handleMouseMove(e) {
		if (windowState.isDragging) {
			setWindowState((old) => ({
				...old,
				left: e.clientX - old.offsetX,
				top: e.clientY - old.offsetY,
			}));
		}
	}

	function handleMouseUp() {
		setWindowState((old) => ({ ...old, isDragging: false }));
	}

	function HandleClose() {
		if (is_visible == "string_validator") {
			setIsVisibleStringVal(false);
		}
	}

	return (
		<div
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onPointerLeave={handleMouseUp}
			className={`absolute border border-border-bg bg-primary-bg rounded-lg shadow-[0px_0px_50px_0px_#000000]/50 overflow-hidden ${classNames}`}
			style={{ left: windowState.left, top: windowState.top }}
		>
			{/* TitleBar */}
			<div className="h-9 flex items-center justify-between px-5 bg-secondary-bg border-b border-border-bg">
				{/* Window Title and Icon */}
				<span className="flex gap-3 items-center justify-center select-none">
					<Target size={15} color="#ffffff" />
					<p className="font-github text-secondary-fg text-center font-bold text-sm">
						{title}
					</p>
				</span>

				{/* Close and Minimise Buttons */}
				<span className="flex gap-3 items-center justify-center">
					<button
						onClick={() =>
							setWindowState((old) => ({ ...old, minimized: !old.minimized }))
						}
						className="hover:bg-border-bg p-1 rounded-sm"
					>
						{windowState.minimized ? (
							<Maximize size={15} color="#ffffff" />
						) : (
							<Minimize size={15} color="#ffffff" />
						)}
					</button>

					<button
						onClick={HandleClose}
						className="hover:bg-red-500/55 p-1 rounded-sm"
					>
						<X size={15} color="#ffffff" />
					</button>
				</span>
			</div>

			{/* Body of the Window */}
			<div
				className={`${windowState.minimized && "hidden"} max-h-100 overflow-scroll`}
			>
				{children}
			</div>
		</div>
	);
};

export default PopupWindow;
