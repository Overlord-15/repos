class MyCustomSlider {
	constructor(elem, props) {
		this.elem = elem
		this.props = props
		this.init()
	}

	init() {
		this.viewport = this.elem.querySelector('.viewport')
		this.slidesWrapper = this.elem.querySelector('.slides-wrapper')
		this.items = this.elem.querySelectorAll('.slides-wrapper .item')
		this.btnLeft = this.elem.querySelector('.btn-left')
		this.btnRight = this.elem.querySelector('.btn-right')

		this.defaultParams = {}

		for(let key in this.props) {
			if(Number.isInteger(this.props[key])) {
				this[key] = this.props[key]
				this.defaultParams[key] = this.props[key]
  			
			}
		}
		console.log(this)
	
		this.adaptive = this.props.adaptive
		if(this.adaptive) {
			this.adaptive.sort(function(a, b){
		        return a.breakpoint - b.breakpoint
		    })
		    this.adaptive.reverse()
		}

		
		

		this.slideNow = 0

		for(let i = this.items.length - 1; i >= 0; i--) {
			let temp = this.items[i].cloneNode(true)
			temp.classList.add('left')
			this.slidesWrapper.prepend(temp)
		}

		for(let i = 0; i < this.items.length; i++) {
			let temp = this.items[i].cloneNode(true)
			temp.classList.add('right')
			this.slidesWrapper.append(temp)
		}
		this.allItems = this.elem.querySelectorAll('.slides-wrapper .item')

		this.update()

		this.slidesWrapper.style.transform = 'translateX(' + this.translateDefault + 'px)'
		this.slidesWrapper.style.transition = this.duration / 1000 + 's'

		this.bindPrevSlide = this.prevSlide.bind(this)
		this.bindNextSlide = this.nextSlide.bind(this)

		this.btnLeft.addEventListener('click', this.bindPrevSlide)
		this.btnRight.addEventListener('click', this.bindNextSlide)

		window.addEventListener('resize', () => {
			this.update()
		});


	}

	update() {

		if(this.adaptive) {
			let match = false
			for(let i = 0; i < this.adaptive.length; i++) {
				if(window.matchMedia("(max-width:" + this.adaptive[i].breakpoint + "px)").matches) {
					for(let key in this.adaptive[i].settings) {
						this[key] = this.adaptive[i].settings[key]
					}
					match = true
				}	
			}

			if(!match) {
				for(let key in this.defaultParams) {
					this[key] = this.defaultParams[key]

				}
			}
		}
		
		this.itemWidth = parseInt(this.viewport.offsetWidth) / this.slidesToShow
		this.slidesWrapperWidth = this.items.length * this.itemWidth * 3
		this.slidesWrapper.style.width = this.slidesWrapperWidth + 'px'
		this.translateDefault = parseInt(-this.items.length * this.itemWidth)

		for(let i = 0; i < this.allItems.length; i++) {
			this.allItems[i].style.width = this.itemWidth + 'px'
		}

		this.slidesWrapper.style.transform = 'translateX(' + (this.slideNow + this.items.length) * -this.itemWidth + 'px)'
		console.log((this.slideNow + this.items.length) * -this.itemWidth)
	}


	nextSlide() {
		this.slidesWrapper.style.transform = 'translateX(' + parseInt((this.slideNow + this.slidesToScroll) * -this.itemWidth + this.translateDefault) + 'px)'
	
		this.slideNow += this.slidesToScroll
		if (this.slideNow + this.slidesToScroll + this.slidesToShow - 1 > this.items.length * 2 - 1) {

			this.btnLeft.removeEventListener('click', this.bindPrevSlide)
			this.btnRight.removeEventListener('click', this.bindNextSlide)
			setTimeout(() => {
				this.slidesWrapper.style.transition = 'none'
				this.slidesWrapper.style.transform = 'translateX(' + (-(this.slideNow) * this.itemWidth) + 'px)'
				console.log(this.slideNow)
				console.log(this.items.length)
				this.slideNow -= this.items.length
				
				setTimeout(() => {
					this.slidesWrapper.style.transition = this.duration / 1000 + 's'
					this.btnLeft.addEventListener('click', this.bindPrevSlide)
					this.btnRight.addEventListener('click', this.bindNextSlide)
				}, 30)
				
			}, this.duration)	
		}
		
	}

	prevSlide() {
		this.slidesWrapper.style.transform = 'translateX(' + parseInt((this.slideNow - this.slidesToScroll) * -this.itemWidth + this.translateDefault) + 'px)'
		this.slideNow -= this.slidesToScroll
		if(this.slideNow - this.slidesToScroll < -this.items.length) {
			this.btnLeft.removeEventListener('click', this.bindPrevSlide)
			this.btnRight.removeEventListener('click', this.bindNextSlide)
			setTimeout(() => {
				this.slidesWrapper.style.transition = 'none'
				this.slidesWrapper.style.transform = 'translateX(' + parseInt(-(this.slideNow + this.items.length * 2) * this.itemWidth) + 'px)'
				this.slideNow += this.items.length
				setTimeout(() => {
					this.slidesWrapper.style.transition = this.duration / 1000 + 's'
					this.btnLeft.addEventListener('click', this.bindPrevSlide)
					this.btnRight.addEventListener('click', this.bindNextSlide)
				}, 30)
				
			}, this.duration)	
			
		}
	}
}


document.addEventListener("DOMContentLoaded", (event) => {
	let s = document.querySelector('.slider')
	let slider = new MyCustomSlider(s, {
		slidesToShow: 3,
		slidesToScroll: 2,
		duration: 500,
	})

	let s2 = document.querySelector('.slider2')
	let slider2 = new MyCustomSlider(s2, {
		slidesToShow: 5,
		slidesToScroll: 2,
		duration: 500,
		adaptive: [{
			breakpoint: 768,
              	settings: {
	                slidesToShow: 3,
	                slidesToScroll: 1
              	}
		},
		{
			breakpoint: 900,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 2
				}
		}
		]
	})

	
	
})
