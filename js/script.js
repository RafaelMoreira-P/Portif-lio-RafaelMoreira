const root = document.documentElement
const themeToggle = document.querySelector('.theme-toggle')
const savedTheme = localStorage.getItem('rafael-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
root.dataset.theme = initialTheme

function updateThemeButton() {
  const isDark = root.dataset.theme === 'dark'
  themeToggle.setAttribute('aria-pressed', String(isDark))
  themeToggle.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro')
  themeToggle.querySelector('.sun').style.display = isDark ? 'none' : 'inline'
  themeToggle.querySelector('.moon').style.display = isDark ? 'inline' : 'none'
}

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('rafael-theme', root.dataset.theme)
  updateThemeButton()
})
updateThemeButton()

const menuToggle = document.querySelector('.menu-toggle')
const mobileNav = document.querySelector('.mobile-nav')
menuToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('is-open')
  menuToggle.classList.toggle('is-open', isOpen)
  menuToggle.setAttribute('aria-expanded', String(isOpen))
})
document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('is-open')
  menuToggle.classList.remove('is-open')
  menuToggle.setAttribute('aria-expanded', 'false')
}))

const roles = ['conecta', 'funciona', 'transforma']
const heroTitle = document.querySelector('#hero-title')
let roleIndex = 0
let charIndex = 0
let deleting = false
function typeRole() {
  if (!heroTitle) return
  const prefix = 'Código que '
  const current = roles[roleIndex]
  if (!deleting) {
    charIndex += 1
    heroTitle.innerHTML = `${prefix}<em>${current.slice(0, charIndex)}</em>.`
    if (charIndex === current.length) {
      deleting = true
      setTimeout(typeRole, 1900)
      return
    }
  } else {
    charIndex -= 1
    heroTitle.innerHTML = `${prefix}<em>${current.slice(0, charIndex)}</em>.`
    if (charIndex === 0) {
      deleting = false
      roleIndex = (roleIndex + 1) % roles.length
    }
  }
  setTimeout(typeRole, deleting ? 48 : 84)
}
setTimeout(typeRole, 1600)

const revealItems = document.querySelectorAll('.reveal')
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.12 })
revealItems.forEach(item => revealObserver.observe(item))

authorizeParallax()
function authorizeParallax() {
  const heroArt = document.querySelector('[data-parallax]')
  if (!heroArt || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  window.addEventListener('mousemove', event => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2
    const y = (event.clientY / window.innerHeight - 0.5) * 2
    heroArt.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`
  })
}

const phoneInput = document.querySelector('#phone')
phoneInput.addEventListener('input', event => {
  let value = event.target.value.replace(/\D/g, '').slice(0, 11)
  if (value.length > 10) value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
  else if (value.length > 6) value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  else if (value.length > 2) value = value.replace(/^([0-9]{2})([0-9]{0,5})/, '($1) $2')
  else if (value.length > 0) value = value.replace(/^([0-9]{0,2})/, '($1')
  event.target.value = value
})

const projects = [
  { id: 'psicologia', title: 'Psicologia & Neuropsicologia', category: 'projeto real enviado', text: 'Uma página pessoal criada para apresentar cuidado, autoridade e acolhimento em uma experiência digital clara.', link: 'mailto:rafamoreirapassos@gmail.com' },
  { id: 'nativa', title: 'Nativa Orgânicos', category: 'produto & interface', text: 'Uma loja online com ritmo editorial para tornar escolhas conscientes mais simples todos os dias.', link: 'https://github.com/' },
  { id: 'linha', title: 'Linha Arquitetura', category: 'estratégia & web', text: 'Um portfólio digital silencioso e preciso para mostrar espaços que falam por si.', link: 'https://github.com/' }
]
let currentProject = 0
const track = document.querySelector('.project-track')
const status = document.querySelector('.slider-status')
function setProject(index) {
  currentProject = (index + projects.length) % projects.length
  track.style.transform = `translateX(-${currentProject * 100}%)`
  status.textContent = `0${currentProject + 1} / 0${projects.length}`
}
document.querySelector('.slider-button.prev').addEventListener('click', () => setProject(currentProject - 1))
document.querySelector('.slider-button.next').addEventListener('click', () => setProject(currentProject + 1))

const modal = document.querySelector('#project-modal')
const modalTitle = document.querySelector('#modal-title')
const modalText = document.querySelector('#modal-text')
const modalCategory = document.querySelector('#modal-category')
const modalLink = document.querySelector('#modal-link')
function openModal(projectId) {
  const project = projects.find(item => item.id === projectId)
  if (!project) return
  modalTitle.textContent = project.title
  modalText.textContent = project.text
  modalCategory.textContent = project.category
  modalLink.href = project.link
  modalLink.style.display = 'inline-flex'
  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
}
function closeModal() {
  modal.classList.remove('is-open')
  modal.setAttribute('aria-hidden', 'true')
  document.body.classList.remove('modal-open')
}
document.querySelectorAll('.open-modal').forEach(button => button.addEventListener('click', () => openModal(button.dataset.project)))
document.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', closeModal))
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal() })

const form = document.querySelector('#contact-form')
const feedback = document.querySelector('.form-feedback')
function setError(field, hasError) { field.classList.toggle('field-error', hasError) }
form.addEventListener('submit', event => {
  event.preventDefault()
  const name = document.querySelector('#name')
  const phone = document.querySelector('#phone')
  const email = document.querySelector('#email')
  const message = document.querySelector('#message')
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneDigits = phone.value.replace(/\D/g, '')
  const invalid = [
    [name, name.value.trim().length < 2],
    [phone, phoneDigits.length < 10],
    [email, !emailPattern.test(email.value.trim())],
    [message, message.value.trim().length < 10]
  ]
  invalid.forEach(([field, hasError]) => setError(field, hasError))
  if (invalid.some(([, hasError]) => hasError)) {
    feedback.textContent = 'Revise os campos destacados antes de enviar.'
    feedback.classList.add('error')
    return
  }
  feedback.classList.remove('error')
  feedback.textContent = 'Mensagem preparada com sucesso. Obrigado pelo contato!'
  form.reset()
  openModal('psicologia')
  modalTitle.textContent = 'Obrigado pelo contato'
  modalText.textContent = 'Sua mensagem foi validada no navegador. Em uma aplicação real, ela seguiria para o canal de atendimento escolhido.'
  modalCategory.textContent = 'retorno em breve'
  modalLink.style.display = 'none'
})
form.querySelectorAll('input, textarea').forEach(field => field.addEventListener('input', () => setError(field, false)))

const disc = document.querySelector('#orbit-disc')
const discStage = document.querySelector('#disc-stage')
const readoutIndex = document.querySelector('#readout-index')
const readoutTitle = document.querySelector('#readout-title')
const readoutText = document.querySelector('#readout-text')
const controlButtons = document.querySelectorAll('.control-btn')
const flightModes = {
  interface: { index: '01 / 04', title: 'INTERFACE', text: 'Uma ideia pode mudar de órbita quando encontra a interação certa.', rotation: 0 },
  code: { index: '02 / 04', title: 'CÓDIGO', text: 'HTML, CSS e JavaScript puros para transformar intenção em movimento.', rotation: 92 },
  motion: { index: '03 / 04', title: 'MOTION', text: 'Animações que explicam, respondem e dão personalidade ao produto.', rotation: 184 },
  future: { index: '04 / 04', title: 'FUTURO', text: 'Tecnologia com curiosidade suficiente para experimentar o que ainda não existe.', rotation: 276 }
}
let discRotation = 0
let dragStartX = 0
let dragStartRotation = 0
let dragging = false
function setFlightMode(mode) {
  const selected = flightModes[mode]
  if (!selected) return
  discRotation = selected.rotation
  disc.style.transform = `rotate(${discRotation}deg)`
  readoutIndex.textContent = selected.index
  readoutTitle.textContent = selected.title
  readoutText.textContent = selected.text
  controlButtons.forEach(button => button.classList.toggle('active', button.dataset.mode === mode))
}
controlButtons.forEach(button => button.addEventListener('click', () => setFlightMode(button.dataset.mode)))
disc.addEventListener('pointerdown', event => {
  dragging = true
  dragStartX = event.clientX
  dragStartRotation = discRotation
  disc.setPointerCapture(event.pointerId)
})
disc.addEventListener('pointermove', event => {
  if (!dragging) return
  discRotation = dragStartRotation + (event.clientX - dragStartX) * 1.2
  disc.style.transform = `rotate(${discRotation}deg)`
})
disc.addEventListener('pointerup', () => { dragging = false })
disc.addEventListener('pointercancel', () => { dragging = false })
discStage.addEventListener('wheel', event => {
  event.preventDefault()
  discRotation += event.deltaY > 0 ? 28 : -28
  disc.style.transform = `rotate(${discRotation}deg)`
}, { passive: false })
const traitValue = document.querySelector('#trait-value')
const traitText = document.querySelector('#trait-text')
const traitButtons = document.querySelectorAll('.trait-button')
const traitMessages = {
  curioso: 'Eu gosto de abrir portas que ainda não existem e descobrir o que acontece do outro lado.',
  experimental: 'Eu testo o improvável até transformar uma ideia estranha em uma experiência memorável.',
  detalhista: 'Eu acredito que a personalidade mora nos pequenos detalhes que quase ninguém percebe.'
}
traitButtons.forEach(button => button.addEventListener('click', () => {
  const trait = button.dataset.trait
  traitValue.textContent = trait
  traitText.textContent = traitMessages[trait]
  traitButtons.forEach(item => item.classList.toggle('active', item === button))
}))

const consoleCommand = document.querySelector('#console-command')
const consoleTags = document.querySelectorAll('.console-tag')
const consoleMessages = {
  interface: 'build something unusual',
  code: 'ship clean experiences',
  motion: 'make the pixels move',
  future: 'open a new dimension'
}
consoleTags.forEach(button => button.addEventListener('click', () => {
  const mode = button.dataset.pilot
  const linkedButton = document.querySelector(`.control-btn[data-mode="${mode}"]`)
  if (linkedButton) linkedButton.click()
  consoleCommand.textContent = consoleMessages[mode]
  consoleTags.forEach(item => item.classList.toggle('active', item === button))
}))
