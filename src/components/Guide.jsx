import { useAtom } from "jotai";
import { ArrowLeft, ArrowRight, ExternalLink, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { editor_state } from "../lib/stores";

const Guide = () => {
	// Jotai Stores
	const [editorState, setEditorState] = useAtom(editor_state);

	const slides = [<Page1 />, <Page2 />, <Page3 />, <Page4 />];
	const [i, setI] = useState(0);

	return (
		<div
			className={`absolute top-0 left-0 w-screen h-screen z-20 flex justify-center items-center bg-secondary-bg/30 overflow-hidden ${
				editorState != "Guide" && "hidden"
			}`}
		>
			<div className="flex flex-col gap-5 justify-center items-center px-5 py-5 w-[60%] h-[80%] bg-primary-bg border border-border-bg rounded-3xl shadow-[0px_0px_50px_0px_#000000]/70 select-none">
				{slides[i]}
				<span className="flex gap-5">
					<button
						onClick={() => setI(i - 1)}
						disabled={i == 0}
						className="flex items-center gap-2 bg-blue-500 border border-border-bg font-github text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:scale-110 active:scale-100 transition-all ease-in-out disabled:bg-gray-600 disabled:pointer-events-none"
					>
						<ArrowLeft size={20} color="#ffffff" />
						Back
					</button>
					<button
						onClick={() => setI(i + 1)}
						disabled={i == slides.length - 1}
						className="flex items-center gap-2 bg-blue-500 border border-border-bg font-github text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:scale-110 active:scale-100 transition-all ease-in-out disabled:bg-gray-600 disabled:pointer-events-none"
					>
						Next
						<ArrowRight size={20} color="#ffffff" />
					</button>
				</span>

				<button
					onClick={() => {
						setEditorState(null);
						setI(0);
					}}
					className="flex items-center gap-2 bg-secondary-fg border border-border-bg font-github text-black px-4 py-2 rounded-lg font-semibold cursor-pointer"
				>
					<Target size={20} color="#000000" />
					Go to the Editor
				</button>
			</div>
		</div>
	);
};

export default Guide;

/////// Sub Components ///////
function Page1() {
	return (
		<>
			<h1 className="font-github text-white font-bold text-3xl text-center">
				FSM Engine
			</h1>
			<img width={250} height={250} src="fsm-engine.svg" alt="FSM Engine" />
			<p className="font-github text-white text-balance text-center w-150">
				Welcome to FSM Engine! A Web Based Editor to Draw Finite State Machines.
				The Following tutorial will help you familiarize yourself with the
				editor.
			</p>
		</>
	);
}

function Page2() {
	return (
		<>
			<h1 className="font-github text-white font-bold text-3xl text-center">
				Video Tutorial
			</h1>

			<iframe
				width="540"
				height="295"
				src="https://www.youtube.com/embed/gG0ARadlD9Q?si=ZZDvM6EVcJ25pWUB"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>

			<p className="font-github text-white text-balance text-center w-150">
				The above video explains the core functions of FSM Engine and how to use
				it.
			</p>
		</>
	);
}

function Page3() {
	return (
		<>
			<h1 className="font-github text-white font-bold text-3xl text-center">
				Support FSM Engine
			</h1>

			<img
				src="https://avatars.githubusercontent.com/karthik-saiharsh"
				alt="Karthik Saiharsh"
				className="rounded-full w-35 h-35 border-2 border-blue-500"
			/>

			<p className="font-github text-white w-150 text-center text-sm">
				Hey there! I'm Karthik, the <b>creator</b> of <b>FSM Engine</b> — thank
				you so much for checking it out!
			</p>

			<p className="font-github text-white w-150 text-center text-sm">
				{" "}
				If you like what you see, consider leaving a ⭐ on the repo and help
				spread the word by sharing FSM Engine with your friends!
			</p>

			<p className="font-github text-white w-150 text-center text-sm">
				Found a bug or something that doesn't feel right? Feel free to open an
				issue on GitHub — I'll do my best to look into it.
			</p>

			<p className="font-github text-white w-150 text-center text-sm">
				Interested in contributing? I'd love that! Open a pull request and let's
				make FSM Engine even better together.
			</p>

			<a
				href="https://github.com/karthik-saiharsh/fsm-engine"
				target="_blank"
				className="flex items-center gap-1 bg-secondary-fg border border-border-bg font-github text-sm text-black px-1 py-1 rounded-md font-semibold cursor-pointer hover:scale-110 active:scale-100 transition-all ease-in-out"
				rel="noopener"
			>
				<ExternalLink size={15} color="#000000" strokeWidth={2.5} />
				View Source Repository
			</a>
		</>
	);
}

function Page4() {
	const [contributors, setContributors] = useState(null);

	useEffect(() => {
		async function getContributors() {
			let res = await fetch(
				"https://api.github.com/repos/karthik-saiharsh/fsm-engine/contributors",
			);

			res = await res.json();
			setContributors(res);
		}
		getContributors();
	}, []);
	return (
		<>
			<h1 className="font-github text-white font-bold text-3xl text-center">
				Thank you Contributors!
			</h1>

			<div className="flex justify-center items-center gap-5 w-full">
				{contributors &&
					contributors.map(
						(item, idx) =>
							idx != 0 && (
								<a key={idx} href={item.html_url}>
									<img
										src={item.avatar_url}
										alt={item.login}
										className="rounded-full w-20 h-20 border border-blue-500"
									/>
								</a>
							),
					)}
			</div>
			<p className="font-github text-white font-semibold text-base w-[90%] text-center">
				Pro Tip: Use the Keyboard Shortcuts 1,2,3,4,5,6,7 to switch between the
				7 modes!
			</p>
		</>
	);
}
