import { useAtom } from "jotai";
import { confirm_dialog_atom } from "../lib/stores";
import { CircleCheck, CircleX, AlertTriangle } from "lucide-react";

const ConfirmDialog = () => {
	const [dialogState, setDialogState] = useAtom(confirm_dialog_atom);

	if (!dialogState.isOpen) return null;

	const handleConfirm = () => {
		if (dialogState.onConfirm) dialogState.onConfirm();
		setDialogState({ ...dialogState, isOpen: false });
	};

	const handleCancel = () => {
		if (dialogState.onCancel) dialogState.onCancel();
		setDialogState({ ...dialogState, isOpen: false });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 flex flex-col gap-4">
				<div className="flex items-center gap-3 text-amber-500">
					<AlertTriangle size={24} />
					<h3 className="text-lg font-semibold text-white">
						Confirmation Required
					</h3>
				</div>

				<p className="text-gray-300 text-sm leading-relaxed">
					{dialogState.message}
				</p>

				<div className="flex justify-end gap-3 mt-2">
					<button
						onClick={handleCancel}
						className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d2d2d] hover:scale-110 border border-border-bg active:scale-100 text-gray-300 transition-all ease-in-out text-sm font-medium"
					>
						<CircleX size={16} />
						Cancel
					</button>
					<button
						onClick={handleConfirm}
						className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:scale-110 border border-border-bg active:scale-100 text-white transition-all ease-in-out text-sm font-medium"
					>
						<CircleCheck size={16} />
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
