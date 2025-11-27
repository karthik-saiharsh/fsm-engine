import { useAtomValue, useAtom } from "jotai"
import { engine_mode, editor_state, node_list, transition_list } from "../lib/stores"
import { X } from "lucide-react";
import { getTransitionDetails } from "../lib/special_functions";

const TransitionTable = () => {
    const [EngineMode, x_] = useAtom(engine_mode);
    const [EditorState, setEditorState] = useAtom(editor_state);
    const [NodeList, x__] = useAtom(node_list);

    return (
        <div className={`${EditorState !== "Transition Table" && "hidden pointer-events-none"} absolute top-0 left-0 w-screen h-screen z-20 flex justify-center items-center bg-secondary-bg/30 overflow-hidden`}>
            <div className="flex flex-col gap-5 items-center px-5 py-5 w-[60%] h-[80%] bg-primary-bg border border-border-bg rounded-3xl shadow-[0px_0px_50px_0px_#000000]/70 select-none">
                <span className="w-full flex items-center">
                    <p className="font-github text-2xl font-bold text-white mx-auto">Transition Table</p>
                    <button onClick={() => setEditorState("")} className="px-2 py-2 bg-secondary-fg rounded-lg hover:scale-110 active:scale-100 transition-all ease-in-out cursor-pointer">
                        <X size={18} color="#000000" />
                    </button>
                </span>

                <div className='w-full h-fit'>
                    <table className='table-auto w-full h-fit'>
                        <thead><tr className="py-2">
                            <th className='text-white font-github font-bold py-2 text-xl'>State</th>
                            {
                                EngineMode.alphabets.map((item, idx) => <th key={idx} className='text-white font-github font-bold text-xl'>{item}</th>)
                            }
                        </tr></thead>
                        <tbody>
                            {
                                NodeList.map((node, idx) => <tr key={idx} className="py-2">
                                    <td className='text-white font-github text-center py-2'>{node.name}</td>
                                    {getTransitionDetails(node.transitions, node.id).map((item, id) => <td key={id} className='text-white font-github text-center py-2'>{item.toString().trim() == "" ? "-" : item.toString()}</td>)}
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TransitionTable
