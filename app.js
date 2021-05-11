document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')
  const resultDisplay = document.querySelector('#result')
  let width = 15
  let currentPlayerIndex = 202
  let currentIstilaciIndex = 0
  let yokEdilenIstilaci = []
  let result = 0
  let direction = 1
  let istilaciId

  // istilacilari tanimlama
  const uzaylistilacilar = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
  ]
  //uzayli istilaci
  uzaylistilacilar.forEach(istilaci => squares[currentIstilaciIndex + istilaci].classList.add('istilaci'))

  //oyuncu
  squares[currentPlayerIndex].classList.add('player')

  // oyuncunun hareketleri
  function movePlayer(e) {
    squares[currentPlayerIndex].classList.remove('player')
    switch (e.keyCode) {
      case 37:
        if (currentPlayerIndex % width !== 0) currentPlayerIndex -= 1
        break
      case 39:
        if (currentPlayerIndex % width < width - 1) currentPlayerIndex += 1
        break
    }
    squares[currentPlayerIndex].classList.add('player')
  }
  document.addEventListener('keydown', movePlayer)

  //uzayli hareketleri
  function moveIstilaci() {
    const solKenar = uzaylistilacilar[0] % width === 0
    const sagKenar = uzaylistilacilar[uzaylistilacilar.length - 1] % width === width - 1

    if ((solKenar && direction === -1) || (sagKenar && direction === 1)) {
      direction = width
    }
    else if (direction === width) {
      if (solKenar) direction = 1
      else direction = -1
    }
    for (let i = 0; i <= uzaylistilacilar.length - 1; i++) {
      squares[uzaylistilacilar[i]].classList.remove('istilaci')
    }
    for (let i = 0; i <= uzaylistilacilar.length - 1; i++) {
      uzaylistilacilar[i] += direction
    }
    for (let i = 0; i <= uzaylistilacilar.length - 1; i++) {
      if (!yokEdilenIstilaci.includes(i)) {
        squares[uzaylistilacilar[i]].classList.add('istilaci')
      }
    }

    //oyunun bitmesi
    if (squares[currentPlayerIndex].classList.contains('istilaci', 'player')) {
      resultDisplay.textContent = 'GAME OVER'
      squares[currentPlayerIndex].classList.add('boom')
      clearInterval(istilaciId)
    }

    for (let i = 0; i <= uzaylistilacilar.length - 1; i++) {
      if (uzaylistilacilar[i] > (squares.length - (width - 1))) {
        resultDisplay.textContent = ' OYUN BİTTİ'
        clearInterval(istilaciId)
      }
    }

    //kazanma
    if (yokEdilenIstilaci.length === uzaylistilacilar.length) {
      resultDisplay.textContent = ' KAZANDINIZ'
      clearInterval(istilaciId)
    }
  }
  istilaciId = setInterval(moveIstilaci, 500)

  // ates etme
  function shoot(e) {
    let laserId
    let currentLaserIndex = currentPlayerIndex
    //lazerin hareketi
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser')
      currentLaserIndex -= width
      squares[currentLaserIndex].classList.add('laser')
      if (squares[currentLaserIndex].classList.contains('istilaci')) {
        squares[currentLaserIndex].classList.remove('laser')
        squares[currentLaserIndex].classList.remove('istilaci')
        squares[currentLaserIndex].classList.add('boom')

        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
        clearInterval(laserId)

        const indirilenIstilaci = uzaylistilacilar.indexOf(currentLaserIndex)
        yokEdilenIstilaci.push(indirilenIstilaci)
        result++
        resultDisplay.textContent = result
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
      }
    }

    switch (e.keyCode) {
      case 32:
        laserId = setInterval(moveLaser, 100)
        break
    }

  }
  document.addEventListener('keyup', shoot)
})