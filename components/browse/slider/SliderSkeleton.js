import { useState, useEffect } from "react";
import axios from "axios";

import SliderControls from "@/components/browse/slider/Controls";
import SliderItem from "@/components/browse/slider/SliderItem";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const Slider = (props) => {
  const { inView, apiUrl, sliderTitle } = props;
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [delayed, setDelayed] = useState(null);

  // Slider
  const [sliderHasMoved, setSliderHasMoved] = useState(false);
  const [sliderMoveDirection, setSliderMoveDirection] = useState(null);
  const [isAnimating, setisAnimating] = useState(false);
  const [movePercentage, setMovePercentage] = useState(0);
  const [lowestVisibleIndex, setLowestVisibleIndex] = useState(0);
  const [itemsInRow, setItemsInRow] = useState(6);

  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [totalMediaItems, setTotalMediaItems] = useState(null);

  /**
   * Get the movies from TMDB
   */
  const fetchData = async () => {
    setLoading(true);

    const request = await axios.get(`https://api.themoviedb.org/3${apiUrl}`);
    const requestData = request.data;
    if (request.status === 200) {
      await sleep(1000);
      setLoading(false);
      setMedia(requestData.results);
      setTotalMediaItems(requestData.results?.length);

      console.log(requestData.results);
    }
  };

  useEffect(() => {
    if (!inView) return false;
    fetchData();
    handleWindowResize(window);
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [inView]);

  // handle window resize and sets items in row
  const handleWindowResize = (e) => {
    if (window.innerWidth > 1440) {
      setItemsInRow(6);
    } else if (window.innerWidth >= 1000) {
      setItemsInRow(5);
    } else if (window.innerWidth < 1000) {
      setItemsInRow(4);
    }
  };

  if (!totalMediaItems) return null;

  return (
    <>
      <h2 className="text-2xl text-white font-bold text-left my-4">
        {sliderTitle}
      </h2>
      <div className="group relative w-full">
        <div className="w-full whitespace-nowrap">
          <ul className="whitespace-nowrap">
            <li
              className="slider-item group inline-block relative cursor-pointer align-top"
              style={{ width: `${100 / itemsInRow}%` }}
            >
              <div className="slider-image w-full h-0 relative overflow-hidden aspect-w-2 aspect-h-3 rounded-md">
                <div className="aspect-ratio-box-inside bg-gray-800 animate-pulse"></div>
              </div>
            </li>
            <li
              className="slider-item group inline-block relative cursor-pointer align-top"
              style={{ width: `${100 / itemsInRow}%` }}
            >
              <div className="slider-image w-full h-0 relative overflow-hidden aspect-w-2 aspect-h-3 rounded-md">
                <div className="aspect-ratio-box-inside bg-gray-800 animate-pulse"></div>
              </div>
            </li>
            <li
              className="slider-item group inline-block relative cursor-pointer align-top"
              style={{ width: `${100 / itemsInRow}%` }}
            >
              <div className="slider-image w-full h-0 relative overflow-hidden aspect-w-2 aspect-h-3 rounded-md">
                <div className="aspect-ratio-box-inside bg-gray-800 animate-pulse"></div>
              </div>
            </li>
            <li
              className="slider-item group inline-block relative cursor-pointer align-top"
              style={{ width: `${100 / itemsInRow}%` }}
            >
              <div className="slider-image w-full h-0 relative overflow-hidden aspect-w-2 aspect-h-3 rounded-md">
                <div className="aspect-ratio-box-inside bg-gray-800 animate-pulse"></div>
              </div>
            </li>
            <li
              className="slider-item group inline-block relative cursor-pointer align-top"
              style={{ width: `${100 / itemsInRow}%` }}
            >
              <div className="slider-image w-full h-0 relative overflow-hidden aspect-w-2 aspect-h-3 rounded-md">
                <div className="aspect-ratio-box-inside bg-gray-800 animate-pulse"></div>
              </div>
            </li>
            <li
              className="slider-item group inline-block relative cursor-pointer align-top"
              style={{ width: `${100 / itemsInRow}%` }}
            >
              <div className="slider-image w-full h-0 relative overflow-hidden aspect-w-2 aspect-h-3 rounded-md">
                <div className="aspect-ratio-box-inside bg-gray-800 animate-pulse"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Slider;
