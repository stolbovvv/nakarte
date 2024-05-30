/* global SlimSelect Parallax */

class Menu {
	constructor(element, { activeClass } = {}) {
		this.menuRoot = typeof element === 'string' ? document.querySelector(element) : element;

		if (this.menuRoot) {
			this.menuWrapper = this.menuRoot.querySelector('.js-menu-wrapper');
			this.menuTrigger = this.menuRoot.querySelector('.js-menu-trigger');

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
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const heroParallax = document.querySelector('#hero-parallax');
	const customInputs = document.querySelectorAll('.js-input');
	const customSelects = document.querySelectorAll('.select');
	const customQuote = document.querySelectorAll('.quote');

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
});
