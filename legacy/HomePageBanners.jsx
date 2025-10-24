import React, { useState, useEffect, useRef } from 'react';
import './HomePageBanners.css';

const HomePageBanners = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressBarRef = useRef(null);
  const autoPlayTimeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingTimeRef = useRef(5000); 

  const slides = [
    {
      subtitle: "Esto es Nissan Sentra Midnight Edition",
      title: "Descubre el Sentra Midnight Edition",
      image: "https://cdn.dlron.us/static/dealer-31353/homepage/carousel/item1.jpg"
    },
    {
      subtitle: "Detona tu instinto",
      title: "Esto es Nissan Kicks 2025",
      image: "https://cdn.dlron.us/static/dealer-31353/homepage/carousel/item2.jpg"
    },
    {
      subtitle: "Nissan X-Trail",
      title: "Poder para cada hoy",
      image: "https://cdn.dlron.us/static/dealer-31353/homepage/carousel/item3.jpg"
    },
    {
      subtitle: "Nissan Frontier V6 Pro 4x",
      title: "Una PRO de verdad para el OFF-ROAD",
      image: "https://cdn.dlron.us/static/dealer-31353/homepage/carousel/item4.jpg"
    },
    {
      subtitle: "El principio de la atracción",
      title: "Esto es Nissan Magnite 2025",
      image: "https://cdn.dlron.us/static/dealer-31353/homepage/carousel/item5.jpg"
    }
  ];

  const goToSlide = (index) => {
    if (index === currentSlide && progressBarRef.current) return;

    pauseAutoPlay();

    setCurrentSlide(index);

    remainingTimeRef.current = 5000;

    if (!isPaused) {
      startAutoPlay();
    }
  };

  const startAutoPlay = () => {
    if (autoPlayTimeoutRef.current) return;

    startTimeRef.current = Date.now();
    autoPlayTimeoutRef.current = setTimeout(() => {
      const nextIndex = (currentSlide + 1) % slides.length;
      goToSlide(nextIndex);
    }, remainingTimeRef.current);

    if (progressBarRef.current) {
      progressBarRef.current.style.transition = `width ${remainingTimeRef.current}ms linear`;
      progressBarRef.current.style.width = '100%';
    }
  };

  const pauseAutoPlay = () => {
    if (!autoPlayTimeoutRef.current) return;

    clearTimeout(autoPlayTimeoutRef.current);
    autoPlayTimeoutRef.current = null;

    const elapsedTime = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsedTime);

    if (progressBarRef.current) {
      const currentWidth = window.getComputedStyle(progressBarRef.current).width;
      progressBarRef.current.style.transition = 'none';
      progressBarRef.current.style.width = currentWidth;
    }
  };

  const handleTouchStart = (e) => {
    setIsPaused(true);
    pauseAutoPlay();
    return e.touches[0].clientX;
  };

  const handleTouchEnd = (startX, endX) => {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
      } else {
        const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(prevIndex);
      }
    }

    setIsPaused(false);
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []); 

  return (
    <section id="principal-carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="carousel-content">
              <h3 className="carousel-subtitle">{slide.subtitle}</h3>
              <h2 className="carousel-title">{slide.title}</h2>
              <a href="/" className="btn btn-secondary">CONOCE MÁS</a>
            </div>
          </div>
        ))}

        <div className="carousel-thumbnails">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`thumbnail-item ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <img src={slide.image} alt={`Thumbnail ${index + 1}`} />
              {index === currentSlide && (
                <div
                  className="thumbnail-progress-bar"
                  ref={progressBarRef}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageBanners;