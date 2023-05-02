import AliceCarousel from 'react-alice-carousel';
const handleDragStart = (e) => e.preventDefault();
const items = [
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,
    <div className='col-xl-12'><img className='rounded' src="https://img3.goodfon.ru/wallpaper/nbig/2/bf/auto-cars-lamborghini-1633.jpg" onDragStart={handleDragStart} role="presentation" width="100%" /></div>,

];
const BussinessProfiles = () => {
    return (
        <>
            <div className="col-xl-12 my-3 px-0 alert">
                <label className='rounded-pill bg-light px-3 mb-3' style={{ fontSize: "18px" }}>Бизнес профили</label>
                <AliceCarousel
                    mouseTracking items={items}
                    ArrowLeft={true}
                    ArrowRight={true}
                    disableDotsControls
                    // renderPrevButton={() => {
                    //     return <div className='bg-dark rounded-circle arrowLeft' >
                    //         <i className="fa-solid fa-circle-left text-white fa-2x"></i></div>
                    //   }}
                    //   renderNextButton={() => {
                    //     return <div className="position-absolute top-0 end-0">Next Item</div>
                    //   }}
                    responsive={{
                        0: {
                            items: 1,
                        },
                        1024: {
                            items: 3
                        },
                        1280: {
                            items: 5
                        },
                        1920: {
                            items: 8
                        }
                    }}
                />
            </div>
        </>

    )
}
export default BussinessProfiles;