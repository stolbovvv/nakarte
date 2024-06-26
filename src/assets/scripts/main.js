/* global SlimSelect Parallax gsap */

class Menu {
	constructor(element, { activeClass } = {}) {
		this.menuRoot = typeof element === 'string' ? document.querySelector(element) : element;

		if (this.menuRoot) {
			this.menuWrapper = this.menuRoot.querySelector('.js-menu-wrapper');
			this.menuTrigger = this.menuRoot.querySelector('.js-menu-trigger');
			this.linkTrigger = this.menuTrigger.querySelectorAll('.js-menu-trigger a');

			this.options = {
				activeClass: activeClass || 'is-active',
			};

			this.init();
		}
	}

	show() {
		this.menuWrapper.classList.add(this.options.activeClass);
		this.menuTrigger.classList.add(this.options.activeClass);

		document.body.style['overflow'] = 'hidden';
	}

	hide() {
		this.menuWrapper.classList.remove(this.options.activeClass);
		this.menuTrigger.classList.remove(this.options.activeClass);

		document.body.style.removeProperty('overflow');
	}

	toggle() {
		if (this.menuTrigger.classList.contains(this.options.activeClass)) {
			this.hide();
		} else {
			this.show();
		}
	}

	init() {
		this.menuTrigger.addEventListener('click', () => this.toggle());
		this.linkTrigger.forEach((link) => {
			link.addEventListener('click', () => this.toggle());
		});

		window.addEventListener('resize', () => {
			this.hide();
		});
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const heroParallax = document.querySelector('#hero-parallax');
	const customInputs = document.querySelectorAll('.js-input');
	const customSelects = document.querySelectorAll('.select');
	const customQuote = document.querySelectorAll('.quote');
	const animCard = document.querySelectorAll('.anim-card');
	const animButton = document.querySelectorAll('.anim-button');
	const svgMapBody = document.querySelectorAll('.anim-map');

	if (heroParallax) new Parallax(heroParallax, { pointerEvents: true });

	customSelects.forEach((select) => {
		new SlimSelect({
			select: select.querySelector('.select__field'),
			settings: {
				showSearch: false,
			},
		});
	});

	customInputs.forEach((item) => {
		const field = item.querySelector('input');
		const textarea = item.querySelector('textarea');

		if (field) {
			field.addEventListener('input', ({ target }) => {
				if (target.value.length !== 0 && !item.matches('.not-empty')) item.classList.add('not-empty');
				if (target.value.length === 0) {
					item.classList.remove('not-empty');
				}
			});
		}

		if (textarea) {
			textarea.addEventListener('input', ({ target }) => {
				if (target.value.length !== 0 && !item.matches('.not-empty')) item.classList.add('not-empty');
				if (target.value.length === 0) {
					item.classList.remove('not-empty');
				}
			});
		}
	});

	customQuote.forEach((item) => {
		const moreBody = item.querySelector('.quote__more');
		const hideTrigger = item.querySelector('.quote-hide-trigger');
		const showTrigger = item.querySelector('.quote-show-trigger');

		showTrigger.addEventListener('click', () => {
			moreBody.classList.add('is-active');
			showTrigger.classList.add('is-hide');
			hideTrigger.classList.remove('is-hide');
		});

		hideTrigger.addEventListener('click', () => {
			moreBody.classList.remove('is-active');
			showTrigger.classList.remove('is-hide');
			hideTrigger.classList.add('is-hide');
		});
	});

	new Menu('.js-menu');

	animCard.forEach((card) => {
		const animation = gsap.to(card, {
			'--width': '0%',
			ease: 'none',
			duration: 0.5,
			paused: true,
		});

		card.addEventListener('mouseenter', () => animation.play());
		card.addEventListener('mouseleave', () => animation.reverse());
	});

	gsap.to('.anim-card_turn-01', {
		'--turn': '1.1turn',
		ease: 'none',
		duration: 20,
		repeat: -1,
	});

	gsap.to('.anim-card_turn-03', {
		'--turn': '1.3turn',
		ease: 'none',
		duration: 19.5,
		repeat: -1,
	});

	gsap.to('.anim-card_turn-05', {
		'--turn': '1.5turn',
		ease: 'none',
		duration: 19,
		repeat: -1,
	});

	gsap.to('.anim-card_turn-07', {
		'--turn': '1.7turn',
		ease: 'none',
		duration: 18.5,
		repeat: -1,
	});

	animButton.forEach((button) => {
		const animation = gsap.to(button, {
			'--width': '100%',
			ease: 'none',
			duration: 0.2,
			paused: true,
		});

		button.addEventListener('mouseenter', () => animation.play());
		button.addEventListener('mouseleave', () => animation.reverse());
	});

	svgMapBody.forEach((map) => {
		const svgMapPath = document.querySelectorAll('.anim-map path');
		const autoAnim = document.querySelectorAll('.anim-map path[data-map-anim]');

		const autoAnimArr = [];
		const autoAnumDuration = 1.5;

		svgMapPath.forEach((svgPath) => {
			const mapAnimataion = gsap.to(svgPath, {
				filter: 'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.2))',
				duration: 0.2,
				paused: true,
			});

			svgPath.addEventListener('mouseenter', () => {
				map.append(svgPath);
				mapAnimataion.play();
			});

			svgPath.addEventListener('mouseleave', () => {
				mapAnimataion.reverse();
			});
		});

		autoAnim.forEach((item, index, arr) => {
			autoAnimArr[index] = gsap.to(item, {
				keyframes: {
					filter: [
						'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.0))',
						'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.2))',
						'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.2))',
						'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.2))',
						'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.0))',
					],
				},
				duration: autoAnumDuration,
				repeat: -1,
				repeatDelay: arr.length * autoAnumDuration,
				delay: index * autoAnumDuration,
				onStart: () => map.append(item),
				onRepeat: () => map.append(item),
			});
		});
	});

	// gsap.to('[data-map-anim]', {
	// 	keyframes: {
	// 		filter: [
	// 			'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.0))',
	// 			'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.2))',
	// 			'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.2))',
	// 			'drop-shadow(0px 4px 20px rgba(0, 255, 209, 0.0))',
	// 		],
	// 	},
	// 	duration: 3,
	// 	stagger: 3,
	// 	repeat: -1,
	// 	delay: 0,
	// 	onRepeat() {
	// 		console.log(this);
	// 	},
	// });
});
