import * as functions from "./modules/functions.js";
import { throttle } from "./modules/throttle.js"

document.addEventListener('DOMContentLoaded', start);

function start() {
	const burger = document.querySelector('.header__burger');
	const backArrow = document.querySelector('.menu__back');
	const header = document.querySelector('.header');
	const menu = document.querySelector('.menu');
	const hero = document.querySelector('.hero');
	const woman = document.querySelector('.parallax__item--woman');
	const home = document.querySelector('.parallax__item--home');
	const platform = document.querySelector('.parallax__item--platform');
	const man = document.querySelector('.parallax__item--man');

	const forWoman = 7;
	const forHome = 5;
	const forPlatform = 4;
	const forMan = 3;

	const speed = 0.05;

	let positionX = 0, positionY = 0;
	let coordXpercent = 0, coordYpercent = 0;

	functions.isWebp();

	function setMouseParallaxStyle() {
		const distX = coordXpercent - positionX;
		const distY = coordYpercent - positionY;

		positionX = positionX + (distX * speed);
		positionY = positionY + (distY * speed);

		woman.style.cssText = `transform: translate(${positionX / forWoman}%, ${positionY / forWoman}%);`;
		home.style.cssText = `transform: translate(${positionX / forHome}%, ${positionY / forHome}%);`;
		platform.style.cssText = `transform: translate(${positionX / forPlatform}%, ${positionY / forPlatform}%);`;
		man.style.cssText = `transform: translate(${positionX / forMan}%, ${positionY / forMan}%);`;
	
		requestAnimationFrame(setMouseParallaxStyle);
	}

	setMouseParallaxStyle();
	
	burger.addEventListener('click', () => {
		let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.body.style.paddingRight = `${scrollbarWidth}px`;
		header.style.paddingRight = `${scrollbarWidth}px`;
		backArrow.style.transform = `translate(${-scrollbarWidth}px, 0px)`;
		menu.classList.add('_active');
		document.documentElement.classList.add('_lock');
	});

	backArrow.addEventListener('click', () => {
		menu.classList.remove('_active');
		document.documentElement.classList.remove('_lock');
		document.body.style.paddingRight = '0';
		header.style.paddingRight = '0';
		backArrow.style.transform = `translate(0px, 0px)`;
	});

	menu.addEventListener('click', (e) => {
		if (e.target.classList.contains('_active')) {
			menu.classList.remove('_active');
			document.documentElement.classList.remove('_lock');
			document.body.style.paddingRight = '0';
			header.style.paddingRight = '0';
			backArrow.style.transform = `translate(0px, 0px)`;
		}
	});

	function mouseMove(e) {
		const heroWidth = hero.offsetWidth;
		const heroHeight = hero.offsetHeight;

		const coordX = e.pageX - heroWidth / 2;
		const coordY = e.pageY - heroHeight / 2;

		coordXpercent = coordX / heroWidth * 100;
		coordYpercent = coordY / heroHeight * 100;
	}

	hero.addEventListener('mousemove', mouseMove);
	
	function checkWindowWidth() {
		if (window.innerWidth <= 1240) {
			hero.removeEventListener('mousemove', mouseMove);
		} else {
			hero.addEventListener('mousemove', mouseMove);
		}
	}

	checkWindowWidth();

	const optimizedWindowCheck = throttle(checkWindowWidth, 500)

	window.addEventListener('resize', optimizedWindowCheck);

	// Плавающая шапка
	let lastScroll = 0;
	
	const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;

	const checkHeader = () => {
		if (lastScroll > 20) {
			backArrow.classList.add('_shrink');
			header.classList.add('_paint');
		} else {
			backArrow.classList.remove('_shrink');
			header.classList.remove('_paint');
		}
	}

	checkHeader();
	
	window.addEventListener('scroll', () => {
		checkHeader();
		lastScroll = scrollPosition();
	});

	// Попап
	const popupLinks = document.querySelectorAll('.popup-link');
	const body = document.querySelector('body');
	const lockPadding = document.querySelectorAll('.lock-padding');
	
	let unlock = true;
	
	const timeout = 400;
	
	if (popupLinks.length > 0) {
		for (let index = 0; index < popupLinks.length; index++) {
			const popupLink = popupLinks[index];
			popupLink.addEventListener("click", function (e) {
				const popupName = popupLink.getAttribute('href').replace('#', '');
				const currentPopup = document.getElementById(popupName);
				popupOpen(currentPopup);
				e.preventDefault();
			});
		}
	}
	
	const popupCloseIcon = document.querySelectorAll('.close-popup');
	if (popupCloseIcon.length > 0) {
		for (let index = 0; index < popupCloseIcon.length; index++) {
			const el = popupCloseIcon[index];
			el.addEventListener('click', function (e) {
				popupClose(el.closest('.popup'));
				e.preventDefault();
			});
		}
	}
	function popupOpen(currentPopup) {
		if (currentPopup && unlock) {
			const popupActive = document.querySelector('.popup._open');
			if (popupActive) {
				popupClose(popupActive, false);
			} else {
				bodyLock();
			}
			currentPopup.classList.add('_open');
			currentPopup.addEventListener('click', function (e) {
				if (!e.target.closest('.popup__content')) {
					popupClose(e.target.closest('.popup'));
				}
			});
		}
	}
	function popupClose(popupActive, doUnlock = true) {
		if (unlock) {
			popupActive.classList.remove('_open');
			if (doUnlock) {
				bodyUnlock();
			}
		}
	}
	
	function bodyLock() {
		const lockPaddingValue = window.innerWidth - document.querySelector('.page').offsetWidth + 'px';
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = lockPaddingValue;
			}
		}
		body.style.paddingRight = lockPaddingValue;
		header.style.paddingRight = lockPaddingValue;
		document.documentElement.classList.add('_lock');
	
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}
	
	function bodyUnlock() {
		setTimeout(function () {
			if (lockPadding.length > 0) {
				for (let index = 0; index < lockPadding.length; index++) {
					const el = lockPadding[index];
					el.style.paddingRight = '0px';
				}
			}
			body.style.paddingRight = '0px';
			header.style.paddingRight = '0px';
			document.documentElement.classList.remove('_lock');
		}, timeout);
	
		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, timeout);
	}
	
	document.addEventListener('keydown', function (e) {
		if (e.which === 27) {
			const popupActive = document.querySelector('.popup._open');
			popupClose(popupActive);
		}
	});

	// Обработка форм
	const form = document.querySelector('.form');

	form.addEventListener('submit', sendForm);

	async function sendForm(e) {
		e.preventDefault();

		let error = validateForm();

		let formData = new FormData(form);

		if (error === 0) {
			form.querySelector('.form__alert').classList.remove('_error');
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				document.querySelector('#popup-thx').classList.add('_open')
				setTimeout(() => document.querySelector('#popup-thx').classList.remove('_open'), 3000);
				form.reset();
				form.classList.remove('_sending');
			} else {
				document.querySelector('#popup-error').classList.add('_open')
				setTimeout(() => document.querySelector('#popup-error').classList.remove('_open'), 3000);
				form.classList.remove('_sending');
			}
		} else {
			form.querySelector('.form__alert').classList.add('_error');
		}
	}

	function validateForm() {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let i = 0; i < formReq.length; i++) {
			const input = formReq[i];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}

		return error;
	}

	function formAddError(input) {
		input.classList.add('_error');
	}

	function formRemoveError(input) {
		input.classList.remove('_error');
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
}
