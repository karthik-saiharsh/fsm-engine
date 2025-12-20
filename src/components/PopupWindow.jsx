// This is a general template for a PopUp Window

import { useSetAtom } from "jotai";
import { Maximize, Minimize, Target, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { show_string_validator } from "../lib/stores";

const PopupWindow = (props) => {
	const {
		title,
		children,
		classNames,
		is_visible,
		onClose,
		initialPosition = { x: 50, y: 50 },
		resizable = false,
		minWidth = 300,
		minHeight = 200,
	} = props;

	// Jotai Atoms
	const setIsVisibleStringVal = useSetAtom(show_string_validator);
	const containerRef = useRef(null);

	const [windowState, setWindowState] = useState({
		left: initialPosition.x,
		top: initialPosition.y,
		isDragging: false,
		offsetX: 0,
		offsetY: 0,
		minimized: false,
	});

	// Resize state
	const [size, setSize] = useState({ width: "auto", height: "auto" });
	const [isResizing, setIsResizing] = useState(false);
	const resizeStart = useRef({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		left: 0,
		top: 0,
		direction: "",
	});

	function handleMouseDown(e) {
		if (e.target.closest(".resize-handle")) return;
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

	// Resize handlers
	const handleResizeMouseDown = (e, direction) => {
		if (!resizable) return;
		e.stopPropagation();
		setIsResizing(true);
		const rect = containerRef.current.getBoundingClientRect();

		// Lock size if auto
		const currentWidth = size.width === "auto" ? rect.width : size.width;
		const currentHeight = size.height === "auto" ? rect.height : size.height;
		if (size.width === "auto" || size.height === "auto") {
			setSize({ width: currentWidth, height: currentHeight });
		}

		resizeStart.current = {
			x: e.clientX,
			y: e.clientY,
			width: currentWidth,
			height: currentHeight,
			left: windowState.left,
			top: windowState.top,
			direction,
		};
	};

	// Global mouse events for resize
	useEffect(() => {
		if (!resizable) return;

		const handleGlobalMouseMove = (e) => {
			if (isResizing) {
				const deltaX = e.clientX - resizeStart.current.x;
				const deltaY = e.clientY - resizeStart.current.y;
				const { width, height, left, top, direction } = resizeStart.current;

				let newWidth = width;
				let newHeight = height;
				let newLeft = left;
				let newTop = top;

				if (direction.includes("e")) {
					newWidth = Math.max(minWidth, width + deltaX);
				}
				if (direction.includes("s")) {
					newHeight = Math.max(minHeight, height + deltaY);
				}
				if (direction.includes("w")) {
					newWidth = Math.max(minWidth, width - deltaX);
					if (newWidth !== minWidth || width > minWidth) {
						newLeft = left + (width - newWidth);
					}
				}
				if (direction.includes("n")) {
					newHeight = Math.max(minHeight, height - deltaY);
					if (newHeight !== minHeight || height > minHeight) {
						newTop = top + (height - newHeight);
					}
				}

				setSize({ width: newWidth, height: newHeight });
				setWindowState((old) => ({ ...old, left: newLeft, top: newTop }));
			}
		};

		const handleGlobalMouseUp = () => {
			setIsResizing(false);
		};

		if (isResizing) {
			window.addEventListener("mousemove", handleGlobalMouseMove);
			window.addEventListener("mouseup", handleGlobalMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", handleGlobalMouseMove);
			window.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, [isResizing, resizable, minWidth, minHeight]);

	function HandleClose() {
		// use custom onClose callback. note : if provided !!!
		if (onClose) {
			onClose();
		} else if (is_visible === "string_validator") {
			setIsVisibleStringVal(false);
		}
	}

	return (
		<button
			type="button"
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onPointerLeave={handleMouseUp}
			className={`absolute border border-border-bg bg-primary-bg rounded-lg shadow-[0px_0px_50px_0px_#000000]/50 overflow-hidden ${classNames}`}
			style={{
				left: windowState.left,
				top: windowState.top,
				width: windowState.minimized ? "auto" : size.width,
				height: windowState.minimized ? "auto" : size.height,
			}}
		>
			{/* TitleBar */}
			<div className="h-9 flex items-center justify-between px-5 bg-secondary-bg border-b border-border-bg cursor-move select-none">
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
						type="button"
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
						type="button"
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

			{/* Resize Handles - Only shown when resizable is true */}
			{resizable && !windowState.minimized && (
				<>
					{/* SE */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "se")}
						className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
						aria-label="Resize southeast"
					/>
					{/* SW */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
						className="resize-handle absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"
						aria-label="Resize southwest"
					/>
					{/* NE */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
						className="resize-handle absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50"
						aria-label="Resize northeast"
					/>
					{/* NW */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
						className="resize-handle absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50"
						aria-label="Resize northwest"
					/>
					{/* E */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "e")}
						className="resize-handle absolute top-4 bottom-4 right-0 w-2 cursor-e-resize z-50"
						aria-label="Resize east"
					/>
					{/* W */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "w")}
						className="resize-handle absolute top-4 bottom-4 left-0 w-2 cursor-w-resize z-50"
						aria-label="Resize west"
					/>
					{/* N */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "n")}
						className="resize-handle absolute top-0 left-4 right-4 h-2 cursor-n-resize z-50"
						aria-label="Resize north"
					/>
					{/* S */}
					<button
						type="button"
						onMouseDown={(e) => handleResizeMouseDown(e, "s")}
						className="resize-handle absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-50"
						aria-label="Resize south"
					/>
				</>
			)}
		</button>
	);
};

export default PopupWindow;
