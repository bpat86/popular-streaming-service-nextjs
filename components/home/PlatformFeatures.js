const PlatformFeatures = () => {
  return (
    <div className="bg-black w-full min-h-screen-3/4">
      <div className="relative overflow-hidden">
        {/* Enjoy on your TV. */}
        <div className="relative border-t-8 border-gray-800 py-8">
          <div className="lg:mx-auto lg:max-w-6xl px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24 items-center text-center lg:text-left">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-5xl font-extrabold text-white">
                    Enjoy on your TV.
                  </h2>
                  <p className="mt-4 text-2xl text-white">
                    Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV,
                    Blu-ray players, and more.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex lg:h-full">
                <img
                  className="w-full h-auto mt-4 z-20"
                  src="/images/footer/tv.png"
                  alt=""
                />
                <video
                  className="absolute top-0 bottom-0 left-0 right-0 m-auto z-0"
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                  loop={true}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "73%",
                    maxHeight: "54%",
                    position: "absolute",
                    top: "53.5%",
                    left: "49.8%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <source
                    src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v"
                    type="video/mp4"
                  ></source>
                </video>
              </div>
            </div>
          </div>
        </div>
        {/* Download your shows to watch offline. */}
        <div className="relative border-t-8 border-gray-800 py-8">
          <div className="lg:mx-auto lg:max-w-6xl px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-8 items-center text-center lg:text-left">
            <div className="lg:order-last px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-5xl font-extrabold text-white">
                    Download your shows to watch offline.
                  </h2>
                  <p className="mt-4 text-2xl text-white">
                    Save your favorites easily and always have something to
                    watch.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative lg:right-24">
              <div className="flex items-center justify-center relative lg:h-full">
                <img
                  className="w-auto h-96 mt-4 z-20"
                  src="/images/footer/mobile-stranger-things.jpg"
                  alt=""
                />
                <div className="absolute top-2/3 m-auto bg-black border-2 border-gray-600 p-3 rounded-lg z-20">
                  <div className="flex items-center space-x-6 w-80">
                    <div>
                      <img
                        src="/images/footer/boxshot.png"
                        alt="Box shot of Stranger Things on Netflix"
                        className="h-20"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="text-white font-bold">
                        Stranger Things
                      </div>
                      <div className="text-blue-500">Downloading...</div>
                    </div>
                    <div>
                      <img
                        src="/images/footer/download-icon.gif"
                        alt="Box shot of Stranger Things on Netflix"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Download your shows to watch offline. */}
        <div className="relative border-t-8 border-gray-800 py-8">
          <div className="lg:mx-auto lg:max-w-6xl px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense  lg:gap-24 items-center text-center lg:text-left">
            {/* Text */}
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-5xl font-extrabold text-white">
                    Watch everywhere.
                  </h2>
                  <p className="mt-4 text-2xl text-white">
                    Stream unlimited movies and TV shows on your phone, tablet,
                    laptop, and TV without paying more.
                  </p>
                </div>
              </div>
            </div>
            {/* Image / video */}
            <div className="relative">
              <div className="flex lg:h-full">
                <img
                  className="w-full h-auto mt-4 z-20"
                  src="/images/footer/devices.png"
                  alt=""
                />
                <video
                  className="absolute top-0 bottom-0 left-0 right-0 m-auto w-full h-full z-0"
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                  loop={true}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "63%",
                    maxHeight: "47%",
                    position: "absolute",
                    top: "20.5%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <source
                    src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-devices.m4v"
                    type="video/mp4"
                  ></source>
                </video>
              </div>
            </div>
          </div>
        </div>
        {/* Create profiles for kids. */}
        <div className="relative border-t-8 border-gray-800 py-8">
          <div className="lg:mx-auto lg:max-w-6xl px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24 items-center text-center lg:text-left">
            <div className="lg:order-last px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-5xl font-extrabold text-white">
                    Create profiles for kids.
                  </h2>
                  <p className="mt-4 text-2xl text-white">
                    Send kids on adventures with their favorite characters in a
                    space made just for them—free with your membership.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="flex lg:h-full">
                <img
                  className="w-full h-auto mt-4 z-20"
                  src="/images/footer/profiles-for-kids.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformFeatures;
