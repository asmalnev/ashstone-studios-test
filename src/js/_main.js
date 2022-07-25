window.addEventListener('scroll', () => {
  const
    $menu = document.querySelector('.menu'),
    menuTop = $menu.getBoundingClientRect().top,
    headerHeight = document.querySelector('header').clientHeight,
    scrollSize = 200,
    className = 'slide-up'

  if (menuTop <= 0 && window.scrollY >= headerHeight + scrollSize) {
    $menu.classList.add(className)
  } else {
    $menu.classList.remove(className)
  }
})

const
  $mobileMenu = document.querySelector('.mobile-menu'),
  $burger = document.querySelector('.header-container__burger')

document.querySelector('.header-container__burger').addEventListener('click', () => {
  $mobileMenu.classList.add('active')
})

document.querySelector('.mobile-menu__close').addEventListener('click', () => {
  $mobileMenu.classList.remove('active')
})

document.addEventListener('click', (event) => {
  const
    isInside = $mobileMenu.contains(event.target),
    isBurger = $burger.contains(event.target)


  if (!isInside && !isBurger) {
    $mobileMenu.classList.remove('active')
  }
})

