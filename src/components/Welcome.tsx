//@ts-nocheck
import {
	ArrowUpRight,
	ChevronRight,
	ChevronLeft,
	MoveRight,
} from "lucide-react";
import { editorState } from "../lib/backend";
import { useAtom } from "jotai";
import clsx from "clsx";
import TutorialContent from "../lib/content";
import { useState } from "react";

export default function Welcome() {
	const [currentEditorState, setCurrentEditorState] = useAtom(editorState);

	const [displayIndex, setDisplayIndex] = useState(0);
	const [showAuthor, setShowAuthor] = useState(false);

	function nextItem() {
		if (displayIndex + 1 < TutorialContent.length)
			setDisplayIndex(displayIndex + 1);
		else setShowAuthor(true);
	}

	function prevItem() {
		console.log("working!", displayIndex);
		if (displayIndex - 1 >= 0 && !showAuthor) setDisplayIndex(displayIndex - 1);
		else if (showAuthor) setShowAuthor(false);
	}

	return (
		<div
			className={clsx(
				"absolute top-0 left-0 z-20 w-screen h-screen bg-[#1e1e1ebb] flex justify-center items-center transition-all ease-in-out duration-500 max-lg:hidden",
				{
					"hidden pointer-events-none opacity-0":
						currentEditorState != "welcome",
				},
			)}
		>
			{/* Settings Window */}
			<div
				className={clsx(
					"flex flex-col justify-center items-center py-8 px-5 gap-5 w-150 h-170 bg-primary-bg border border-border-bg rounded-4xl shadow-[0px_0px_100px_0px_#00000080] transition-all ease-in-out duration-500",
					{
						"hidden pointer-events-none opacity-0 scale-0":
							currentEditorState != "welcome",
					},
				)}
			>
				<Tutorial index={displayIndex} show={showAuthor} />
				<Intro show={showAuthor} />

				<div className="flex gap-5">
					<button
						onClick={prevItem}
						className="flex text-sm gap-2 font-github font-semibold items-center rounded-xl text-black bg-gray-200 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out"
					>
						<ChevronLeft color="#000000" size={15} />
					</button>
					<button
						onClick={nextItem}
						className="flex text-sm gap-2 font-github font-semibold items-center rounded-xl text-black bg-gray-200 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out"
					>
						<ChevronRight color="#000000" size={15} />
					</button>
				</div>
				<button
					onClick={() => {
						setCurrentEditorState("nil");
						setDisplayIndex(0);
					}}
					className="flex text-sm gap-2 font-github font-semibold items-center rounded-xl text-white bg-blue-500 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out"
				>
					Go to FSM-Engine
					<MoveRight color="#ffffff" size={15} />
				</button>
			</div>
		</div>
	);
}

// Pages for the Welcom Popup
function Intro(props: { show: boolean }) {
	const profileImg = "https://avatars.githubusercontent.com/karthik-saiharsh";
	return (
		<div
			className={clsx(
				"w-full flex flex-col justify-center items-center select-none",
				{
					hidden: !props.show,
				},
			)}
		>
			<img
				src={profileImg}
				alt="Karthik Saiharsh"
				className="rounded-full w-45 h-45 border-2 border-blue-500"
			/>
			<p className="font-github text-white font-semibold text-center my-5">
				Karthik Saiharsh
			</p>
			<p className="font-github text-white font-normal text-center w-full">
				Hey! I'm Karthik, the creator of FSM Engine. I'm super glad you took
				time to check this out :-)
				<br className="my-1" />
				If you like what I have done, leave a start on my repo! Spread the word!
				Tell your friends about FSM Engine!
				<br className="my-1" />
				If you feel something isn't right, open an issue on github and I'll try
				my best to work on it.
				<br className="my-1" />
				If you are interested to contribute, and help the project grow, feel
				free to open a pull request. Would love to see the project grow!
			</p>
			<a href="https://github.com/karthik-saiharsh/fsm-engine" target="_blank">
				<button className="flex text-sm gap-2 font-github font-semibold mt-5 items-center rounded-xl text-white bg-blue-500 px-5 py-2 hover:scale-110 transition-all cursor-pointer active:scale-100 ease-in-out">
					View Github Repo
					<ArrowUpRight color="#ffffff" size={24} />
				</button>
			</a>
		</div>
	);
}

// Tutorial Pages
// PS: I know I don't have to use 6 functions to display the tutorials, i'll change it later

function Tutorial(props: { index: number; show: boolean }) {
	return (
		<div
			className={clsx(
				"w-full flex flex-col justify-center items-center select-none",
				{
					hidden: props.show,
				},
			)}
		>
			<h1 className="font-github text-white text-2xl font-semibold text-center mb-2">
				{TutorialContent[props.index].title}
			</h1>
			{TutorialContent[props.index].type == "vid" ? (
				<iframe
					width="560"
					height="315"
					src={TutorialContent[props.index].src}
					title="Tutorial"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			) : (
				<img src={TutorialContent[props.index].src} width={250} height={250} />
			)}
			<p className="font-github text-base text-white mt-2 text-center">
				{TutorialContent[props.index].content}
			</p>
			{props.index > 0 && (
				<p className="font-github text-base text-blue-500 mt-2 text-center">
					Watch the above video for better clarity
				</p>
			)}
		</div>
	);
}
