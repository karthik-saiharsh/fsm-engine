<script>
    // @ts-ignore
    import { MousePointer2, CirclePlus, CircleMinus } from '@lucide/svelte';

    const hoverScale = '130';
    const yTransDist = '10';
</script>

<div class="absolute bottom-2 z-10 flex h-20 w-full items-center justify-center">

	<div class="h-15 w-100 rounded-2xl border border-fourth bg-secondary flex justify-center items-center gap-5 shadow-[0px_0px_50px_0px_rgba(0,0,0,0.3)]">


        <p class={`bg-fourth p-2 rounded-full cursor-pointer hover:scale-${hoverScale} hover:mb-${yTransDist} active:scale-100 transition-all ease-in-out duration-300`}>
            <MousePointer2 size={25}  color="#ffffff"/>
        </p>

        <p class={`bg-fourth p-2 rounded-full cursor-pointer hover:scale-${hoverScale} hover:mb-${yTransDist} active:scale-100 transition-all ease-in-out duration-300`}>
            <CirclePlus size={25}  color="#ffffff"/>
        </p>

        <p class={`bg-fourth p-2 rounded-full cursor-pointer hover:scale-${hoverScale} hover:mb-${yTransDist} active:scale-100 transition-all ease-in-out duration-300`}>
            <CircleMinus size={25}  color="#ffffff"/>
        </p>

    </div>
</div>