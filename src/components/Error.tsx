const Error = () => {
	return (
		<div className="z-100 flex flex-col justify-center items-center w-screen h-screen absolute top-0 bg-white lg:hidden">
			<p className="text-center text-black text-5xl font-github font-bold">
				Welp! 😭
			</p>
			<br className="my-2" />
			<p className="text-center text-black text-3xl font-github font-bold">
				This site only works on a Laptop or Desktop
			</p>
		</div>
	);
};

export default Error;
