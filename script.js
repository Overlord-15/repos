class MyCustomSlider {
	constructor(elem, props) {
		this.elem = elem
		this.props = props
		this.init()
	}

	init() {
		console.log('DROP TABLE USERS')
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

		
		this.createDots()

		this.allItems = this.elem.querySelectorAll('.slides-wrapper .item')


		this.update()

		this.slidesWrapper.style.transform = 'translateX(' + this.translateDefault + 'px)'
		this.slidesWrapper.style.transition = this.duration / 1000 + 's'


		this.bindPrevSlide = this.prevSlide.bind(this)
		this.bindNextSlide = this.nextSlide.bind(this)
		this.bindGoToSlide = this.goToSlide.bind(this)


		this.autoplayReady = true

		if(this.props.autoplay) {
			setInterval(() => {
				if(this.autoplayReady) {
					this.bindNextSlide()
				}
			}, this.props.autoplayDelay || 2000)

		}

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
			this.addActiveClass()
			this.addNoActiveClass()
		}
		
		this.itemWidth = parseInt(this.viewport.offsetWidth) / this.slidesToShow
		this.slidesWrapperWidth = this.items.length * this.itemWidth * 3
		this.slidesWrapper.style.width = this.slidesWrapperWidth + 'px'
		this.translateDefault = parseInt(-this.items.length * this.itemWidth)

		for(let i = 0; i < this.allItems.length; i++) {
			this.allItems[i].style.width = this.itemWidth + 'px'
		}

		this.slidesWrapper.style.transform = 'translateX(' + (this.slideNow + this.items.length) * -this.itemWidth + 'px)'
	}


	nextSlide() {
		this.slidesWrapper.style.transform = 'translateX(' + parseInt((this.slideNow + this.slidesToScroll) * -this.itemWidth + this.translateDefault) + 'px)'
		this.slideNow += this.slidesToScroll
		this.addNoActiveClass()
		if (this.slideNow + this.slidesToScroll + this.slidesToShow - 1 > this.items.length * 2 - 1) {
			this.btnLeft.removeEventListener('click', this.bindPrevSlide)
			this.btnRight.removeEventListener('click', this.bindNextSlide)
			this.autoplayReady = false
			this.createDots()

			setTimeout(() => {
				this.slidesWrapper.style.transition = 'none'
				this.slidesWrapper.style.transform = 'translateX(' + (-(this.slideNow) * this.itemWidth) + 'px)'
				this.slideNow -= this.items.length
				
				setTimeout(() => {
					this.slidesWrapper.style.transition = this.duration / 1000 + 's'
					this.btnLeft.addEventListener('click', this.bindPrevSlide)
					this.btnRight.addEventListener('click', this.bindNextSlide)
					this.autoplayReady = true
					this.addActiveClass()
					
					
				}, 40)
				
			}, this.duration)	
			return
		}
		this.addActiveClass()
		this.createDots()
		
	}

	prevSlide() {
		this.slidesWrapper.style.transform = 'translateX(' + parseInt((this.slideNow - this.slidesToScroll) * -this.itemWidth + this.translateDefault) + 'px)'
		this.slideNow -= this.slidesToScroll
		this.addNoActiveClass()
		if(this.slideNow - this.slidesToScroll < -this.items.length) {
			this.btnLeft.removeEventListener('click', this.bindPrevSlide)
			this.btnRight.removeEventListener('click', this.bindNextSlide)
			this.autoplayReady = false
			this.createDots()
			setTimeout(() => {
				this.slidesWrapper.style.transition = 'none'
				this.slidesWrapper.style.transform = 'translateX(' + parseInt(-(this.slideNow + this.items.length * 2) * this.itemWidth) + 'px)'
				this.slideNow += this.items.length
				setTimeout(() => {
					this.slidesWrapper.style.transition = this.duration / 1000 + 's'
					this.btnLeft.addEventListener('click', this.bindPrevSlide)
					this.btnRight.addEventListener('click', this.bindNextSlide)
					this.autoplayReady = true
					this.addActiveClass()
				}, 30)
				
			}, this.duration)	
			return
			
		}
		this.addActiveClass()
		this.createDots()
		
	}

	addActiveClass() {
		if(this.props.addActiveClass) {
			for(let i = 0; i < this.allItems.length; i++) {
				this.allItems[i].classList.remove('active-slide')
			}
			for(let i = 0; i < this.slidesToShow; i++) {
				this.allItems[this.items.length + this.slideNow + i].classList.add('active-slide')
			}
		}

	}

	createDots() {
		if(!this.dotsUl) {
			this.dotsUl = document.createElement('ul')
			this.dotsLi = []
			for(let i = 0; i < this.items.length; i++) {
				let temp = document.createElement('li')
				temp.addEventListener('click', () => {
					this.bindGoToSlide(i)
				})
				this.dotsLi.push(temp)
				this.dotsUl.append(temp)
			}

			this.viewport.after(this.dotsUl)
		}

		for(let i = 0; i < this.dotsLi.length; i++) {
			this.dotsLi[i].classList.remove('active')
		}
		if(this.slideNow >= this.items.length) {
			this.dotsLi[this.slideNow - this.items.length].classList.add('active')
		} else if(this.slideNow < 0) {

			this.dotsLi[this.items.length + this.slideNow].classList.add('active')
		} else {
			this.dotsLi[this.slideNow].classList.add('active')
		}	
	}

	goToSlide(slide) {
		if(this.slideNow > this.items.length - 1) {
			this.slidesWrapper.style.transform = 'translateX(' +  ((-(slide + this.items.length - this.slideNow) * this.itemWidth) + this.slideNow * -this.itemWidth + this.translateDefault) + 'px)'
			this.slideNow += slide + this.items.length - this.slideNow
		} else if(this.slideNow < 0) {
			this.slidesWrapper.style.transform = 'translateX(' +  ((-(slide - this.items.length - this.slideNow) * this.itemWidth) + this.slideNow * -this.itemWidth + this.translateDefault) + 'px)'
			this.slideNow += slide - this.items.length - this.slideNow
		} else {
			this.slidesWrapper.style.transform = 'translateX(' +  ((-(slide - this.slideNow) * this.itemWidth) + this.slideNow * -this.itemWidth + this.translateDefault) + 'px)'
			this.slideNow += slide - this.slideNow
		}

		
		this.addNoActiveClass()
		if (this.slideNow + this.slidesToScroll + this.slidesToShow - 1 > this.items.length * 2 - 1) {
			this.btnLeft.removeEventListener('click', this.bindPrevSlide)
			this.btnRight.removeEventListener('click', this.bindNextSlide)
			this.autoplayReady = false
			this.createDots()
			this.addNoActiveClass(2)
			setTimeout(() => {
				this.slidesWrapper.style.transition = 'none'
				this.slidesWrapper.style.transform = 'translateX(' + (-(this.slideNow) * this.itemWidth) + 'px)'
				this.slideNow -= this.items.length
				
				setTimeout(() => {
					this.slidesWrapper.style.transition = this.duration / 1000 + 's'
					this.btnLeft.addEventListener('click', this.bindPrevSlide)
					this.btnRight.addEventListener('click', this.bindNextSlide)
					this.autoplayReady = true
					this.addActiveClass()
				}, 40)
				
			}, this.duration)	
			return
		} else if(this.slideNow - this.slidesToScroll < -this.items.length) {
			this.btnLeft.removeEventListener('click', this.bindPrevSlide)
			this.btnRight.removeEventListener('click', this.bindNextSlide)
			this.autoplayReady = false
			this.createDots()
			this.addNoActiveClass(1)
			setTimeout(() => {
				this.slidesWrapper.style.transition = 'none'
				this.slidesWrapper.style.transform = 'translateX(' + parseInt(-(this.slideNow + this.items.length * 2) * this.itemWidth) + 'px)'
				this.slideNow += this.items.length
				setTimeout(() => {
					this.slidesWrapper.style.transition = this.duration / 1000 + 's'
					this.btnLeft.addEventListener('click', this.bindPrevSlide)
					this.btnRight.addEventListener('click', this.bindNextSlide)
					this.autoplayReady = true
					this.addActiveClass()
					
				}, 30)
				
			}, this.duration)	
			return
			
		}

		this.addActiveClass()
		this.addNoActiveClass()
		this.createDots()
	}

	addNoActiveClass(num) {
		for(let i = 0; i < this.allItems.length; i++) {
			if(i === this.items.length + this.slideNow) {
				if(num === 2) {
					this.allItems[i - this.items.length].classList.add('active-opacity-slide')
					this.allItems[i - this.items.length].classList.remove('no-active-opacity-slide')
				}

				if(num === 1) {
					console.log(this.allItems[i + this.items.length], i, '!!!!!!!!!!!!!')
					this.allItems[i + this.items.length].classList.add('active-opacity-slide')
					this.allItems[i + this.items.length].classList.remove('no-active-opacity-slide')
				}

				this.allItems[i].classList.add('active-opacity-slide')
				this.allItems[i].classList.remove('no-active-opacity-slide')
			} else if(num === 1 || i === this.slideNow) {
				
			} else {
				console.log(this.allItems[i], i, 'num' + num)
				this.allItems[i].classList.add('no-active-opacity-slide')
				this.allItems[i].classList.remove('active-opacity-slide')
			}	

		}
		console.log("==============")
		
	}

}


document.addEventListener("DOMContentLoaded", (event) => {

	let slider = new MyCustomSlider(document.querySelector('.slider'), {
		slidesToShow: 3,
		slidesToScroll: 2,
		duration: 500,
	})

	let slider2 = new MyCustomSlider(document.querySelector('.slider2'), {
		slidesToShow: 1,
		slidesToScroll: 1,
		duration: 500,
		addActiveClass: true,
		adaptive: [{
			breakpoint: 768,
              	settings: {
	                slidesToShow: 1,
	                slidesToScroll: 1
              	}
		},
		{
			breakpoint: 900,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
		}
		]
	})

	
	
})
