const VideoBanner = ({imageUrl, videoUrl, clickHandler}) => {
    const playHandler = (event) => {
      event.target.play()
    }
  
    const pauseHandler = (event) => {
      event.target.pause()
    }
  
    return (
      <video
        onMouseOver={playHandler}
        onMouseOut={pauseHandler}
        onClick={clickHandler}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          display: 'block',
          cursor: 'pointer',
        }}
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4"/>
      </video>
    )
  }

  export default VideoBanner;