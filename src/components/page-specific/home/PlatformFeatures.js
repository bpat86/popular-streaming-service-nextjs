const PlatformFeatures = () => {
  return (
    <div className="min-h-screen-3/4 w-full bg-black">
      <div className="relative overflow-hidden">
        {/* Enjoy on your TV. */}
        <div className="relative border-t-8 border-gray-800 py-8">
          <div className="items-center px-6 text-center lg:mx-auto lg:grid lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 lg:text-left">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
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
                <picture className="flex">
                  <img
                    className="z-20 mt-4 h-auto w-full"
                    src="/images/footer/tv.png"
                    alt=""
                  />
                </picture>
                <video
                  className="absolute top-0 bottom-0 left-0 right-0 z-0 m-auto"
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
          <div className="items-center px-6 text-center lg:mx-auto lg:grid lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-8 lg:px-8 lg:text-left">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:order-last lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
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
              <div className="relative flex items-center justify-center lg:h-full">
                <picture className="flex">
                  <img
                    className="z-20 mt-4 h-96 w-auto"
                    src="/images/footer/mobile-stranger-things.jpg"
                    alt=""
                  />
                </picture>
                <div className="absolute top-2/3 z-20 m-auto rounded-lg border-2 border-gray-600 bg-black p-3">
                  <div className="flex w-80 items-center space-x-6">
                    <div>
                      <picture className="flex">
                        <img
                          src="/images/footer/boxshot.png"
                          alt="Box shot of Stranger Things on Netflix"
                          className="h-20"
                        />
                      </picture>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="font-bold text-white">
                        Stranger Things
                      </div>
                      <div className="text-blue-500">Downloading...</div>
                    </div>
                    <div>
                      <picture className="flex">
                        <img
                          src="/images/footer/download-icon.gif"
                          alt="Box shot of Stranger Things on Netflix"
                          className="h-12"
                        />
                      </picture>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Download your shows to watch offline. */}
        <div className="relative border-t-8 border-gray-800 py-8">
          <div className="items-center px-6 text-center lg:mx-auto lg:grid lg:max-w-6xl lg:grid-flow-col-dense  lg:grid-cols-2 lg:gap-24 lg:px-8 lg:text-left">
            {/* Text */}
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
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
                <picture className="flex">
                  <img
                    className="z-20 mt-4 h-auto w-full"
                    src="/images/footer/devices.png"
                    alt=""
                  />
                </picture>
                <video
                  className="absolute top-0 bottom-0 left-0 right-0 z-0 m-auto h-full w-full"
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
          <div className="items-center px-6 text-center lg:mx-auto lg:grid lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 lg:text-left">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:order-last lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
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
                <picture className="flex">
                  <img
                    className="z-20 mt-4 h-auto w-full"
                    src="/images/footer/profiles-for-kids.png"
                    alt=""
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformFeatures;
