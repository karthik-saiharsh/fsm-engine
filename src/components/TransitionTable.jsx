import { useAtom, useAtomValue } from "jotai";
import { editor_state, engine_mode, node_list, transition_list, stage_ref, show_transition_table } from "../lib/stores";
import { X, Download, Minus, Maximize2, GripHorizontal } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getTransitionPoints } from "../lib/editor";

const TransitionTable = () => {
    const [EditorState, setEditorState] = useAtom(editor_state);
    const EngineMode = useAtomValue(engine_mode);
    const [NodeList, setNodeList] = useAtom(node_list);
    const [TransitionList, setTransitionList] = useAtom(transition_list);
    const StageRef = useAtomValue(stage_ref);
    const [ShowTable, setShowTable] = useAtom(show_transition_table);

    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Floating Window State
    const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 100 });
    const [size, setSize] = useState({ width: 'auto', height: 'auto' });

    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const [isResizing, setIsResizing] = useState(false);
    const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0, direction: '' });
    const containerRef = useRef(null);

    useEffect(() => {
        setIsVisible(ShowTable);
    }, [ShowTable]);

    const handleClose = () => {
        setShowTable(false);
    };

    // Drag Logic
    const handleMouseDown = (e) => {
        if (e.target.closest('.resize-handle')) return;
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    // Resize Logic
    const handleResizeMouseDown = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        const rect = containerRef.current.getBoundingClientRect();

        // Lock size if auto
        let currentWidth = size.width === 'auto' ? rect.width : size.width;
        let currentHeight = size.height === 'auto' ? rect.height : size.height;
        if (size.width === 'auto' || size.height === 'auto') {
            setSize({ width: currentWidth, height: currentHeight });
        }

        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: currentWidth,
            height: currentHeight,
            left: position.x,
            top: position.y,
            direction
        };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            } else if (isResizing) {
                const deltaX = e.clientX - resizeStart.current.x;
                const deltaY = e.clientY - resizeStart.current.y;
                const { width, height, left, top, direction } = resizeStart.current;

                let newWidth = width;
                let newHeight = height;
                let newLeft = left;
                let newTop = top;

                if (direction.includes('e')) {
                    newWidth = Math.max(300, width + deltaX);
                }
                if (direction.includes('s')) {
                    newHeight = Math.max(200, height + deltaY);
                }
                if (direction.includes('w')) {
                    newWidth = Math.max(300, width - deltaX);
                    // Only update position if width actually changed (didn't hit min)
                    if (newWidth !== 300 || width > 300) {
                        newLeft = left + (width - newWidth);
                    }
                }
                if (direction.includes('n')) {
                    newHeight = Math.max(200, height - deltaY);
                    if (newHeight !== 200 || height > 200) {
                        newTop = top + (height - newHeight);
                    }
                }

                setSize({ width: newWidth, height: newHeight });
                setPosition({ x: newLeft, y: newTop });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);


    const handleCellChange = (fromId, alphabet, newToId) => {
        const fromNode = NodeList[fromId];
        let existingTr = null;
        let existingTrIndex = -1;

        for (let tr of fromNode.transitions) {
            const trObj = TransitionList[tr.tr_name];
            if (trObj && trObj.name.includes(alphabet)) {
                existingTr = trObj;
                existingTrIndex = tr.tr_name;
                break;
            }
        }

        const newToIdInt = parseInt(newToId);
        const isTrap = isNaN(newToIdInt);

        if (existingTr && existingTr.to === newToIdInt) return;
        if (!existingTr && isTrap) return;

        const newTransitionList = [...TransitionList];
        const newNodeList = [...NodeList];

        if (existingTr) {
            const newName = existingTr.name.filter(a => a !== alphabet);

            if (newName.length === 0) {
                newTransitionList[existingTrIndex] = undefined;
                newNodeList[existingTr.from].transitions = newNodeList[existingTr.from].transitions.filter(t => t.tr_name !== existingTrIndex);
                if (existingTr.from !== existingTr.to) {
                    newNodeList[existingTr.to].transitions = newNodeList[existingTr.to].transitions.filter(t => t.tr_name !== existingTrIndex);
                }
                const trShape = StageRef.findOne(`#transition_${existingTrIndex}`);
                if (trShape) trShape.destroy();
                const trLabel = StageRef.findOne(`#tr_label${existingTrIndex}`);
                if (trLabel) trLabel.destroy();
            } else {
                newTransitionList[existingTrIndex] = { ...existingTr, name: newName };
                const trLabel = StageRef.findOne(`#tr_label${existingTrIndex}`);
                if (trLabel) trLabel.text(newName.toString());
            }
        }

        if (!isTrap) {
            let targetTrIndex = -1;
            for (let tr of newNodeList[fromId].transitions) {
                const trObj = newTransitionList[tr.tr_name];
                if (trObj && trObj.to === newToIdInt) {
                    targetTrIndex = tr.tr_name;
                    break;
                }
            }

            if (targetTrIndex !== -1) {
                const targetTr = newTransitionList[targetTrIndex];
                if (!targetTr.name.includes(alphabet)) {
                    const newName = [...targetTr.name, alphabet].sort();
                    newTransitionList[targetTrIndex] = { ...targetTr, name: newName };
                    const trLabel = StageRef.findOne(`#tr_label${targetTrIndex}`);
                    if (trLabel) trLabel.text(newName.toString());
                }
            } else {
                const newTrId = newTransitionList.length;
                const points = getTransitionPoints(fromId, newToIdInt, newTrId);

                const newTransition = {
                    id: newTrId,
                    stroke: "#ffffffdd",
                    strokeWidth: 2,
                    fill: "#ffffffdd",
                    points: points,
                    tension: fromId === newToIdInt ? 1 : 0.5,
                    name: [alphabet],
                    fontSize: 20,
                    fontStyle: "bold",
                    name_fill: "#ffffff",
                    name_align: "center",
                    from: fromId,
                    to: newToIdInt,
                };

                newTransitionList[newTrId] = newTransition;

                const trRef = {
                    from: fromId,
                    to: newToIdInt,
                    tr_name: newTrId
                };

                newNodeList[fromId].transitions.push(trRef);
                if (fromId !== newToIdInt) {
                    newNodeList[newToIdInt].transitions.push(trRef);
                }
            }
        }

        setTransitionList(newTransitionList);
        setNodeList(newNodeList);
    };

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            style={{
                left: position.x,
                top: position.y,
                width: isMinimized ? '300px' : size.width,
                height: isMinimized ? 'auto' : size.height,
                maxHeight: '80vh',
                maxWidth: '80vw'
            }}
            className="fixed z-50 bg-[#1e1e1e] border border-[#333] shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-lg flex flex-col overflow-hidden font-sans"
        >
            {/* Header Bar */}
            <div
                onMouseDown={handleMouseDown}
                className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#333] cursor-move select-none flex-shrink-0"
            >
                <div className="flex items-center gap-2 text-gray-300">
                    <GripHorizontal size={16} className="text-gray-500" />
                    <span className="font-semibold text-sm">Transition Table</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-[#333] rounded transition-colors text-gray-400 hover:text-white"
                    >
                        {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-[#c42b1c] rounded transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isMinimized && (
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Toolbar */}
                    <div className="p-2 border-b border-[#333] bg-[#1e1e1e] flex-shrink-0">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-xs font-medium transition-colors w-fit">
                            <Download size={14} />
                            Export CSV
                        </button>
                    </div>

                    {/* Table Container */}
                    <div className="flex-1 overflow-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead className="sticky top-0 z-20 bg-[#252526] shadow-sm">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-[#252526] p-2 border-b border-[#333] font-semibold text-gray-300 w-24">
                                        State
                                    </th>
                                    {EngineMode.alphabets.map((alpha, idx) => (
                                        <th key={idx} className="p-2 border-b border-[#333] font-semibold text-gray-300 min-w-[80px]">
                                            {alpha}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {NodeList.map((node, nodeIdx) => (
                                    <tr key={nodeIdx} className="border-b border-[#333] hover:bg-[#2a2d2e] transition-colors">
                                        <td className="sticky left-0 z-10 bg-[#1e1e1e] p-2 border-r border-[#333] font-medium">
                                            <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-200 text-xs border border-blue-800">
                                                {node.name}
                                            </div>
                                        </td>
                                        {EngineMode.alphabets.map((alpha, alphaIdx) => {
                                            let targetId = -1;
                                            for (let tr of node.transitions) {
                                                const trObj = TransitionList[tr.tr_name];
                                                if (trObj && trObj.from === nodeIdx && trObj.name.includes(alpha)) {
                                                    targetId = trObj.to;
                                                    break;
                                                }
                                            }

                                            return (
                                                <td key={alphaIdx} className="p-2 border-r border-[#333]/50">
                                                    <select
                                                        value={targetId === -1 ? "trap" : targetId}
                                                        onChange={(e) => handleCellChange(nodeIdx, alpha, e.target.value)}
                                                        className="w-full bg-transparent text-gray-300 outline-none cursor-pointer hover:text-white appearance-none py-0.5 text-center"
                                                        style={{ textAlignLast: 'center' }}
                                                    >
                                                        <option value="trap" className="bg-[#252526] text-gray-500">ø</option>
                                                        {NodeList.map((n, i) => (
                                                            <option key={i} value={i} className="bg-[#252526]">
                                                                {n.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resize Handles */}
                    {/* SE */}
                    <div
                        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
                        className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
                    />
                    {/* SW */}
                    <div
                        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
                        className="resize-handle absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50"
                    />
                    {/* NE */}
                    <div
                        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
                        className="resize-handle absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50"
                    />
                    {/* NW */}
                    <div
                        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
                        className="resize-handle absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50"
                    />
                </div>
            )}
        </div>
    );
};

export default TransitionTable;
