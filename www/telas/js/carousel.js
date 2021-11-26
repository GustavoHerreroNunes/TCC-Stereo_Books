new Splide('.splide',{
    easing: 'ease-in-out',
    fixedWidth: '300px',
    gap: '80px',
    focus: 'center',
    pagination: false,
	  perPage  : 2,
    start: 1,
	  trimSpace: false,
    type: 'loop',
    classes: {
      arrows: 'splide__arrows custom-arrows',
    }
  }).mount();