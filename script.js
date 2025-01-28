const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './imagesfighters/background3.jpg'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  // imageSrc: './imagesfighters/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 100,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './imagesfighters/fighter2/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './imagesfighters/fighter2/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './imagesfighters/fighter2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './imagesfighters/fighter2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './imagesfighters/fighter2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './imagesfighters/fighter2/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './imagesfighters/fighter2/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './imagesfighters/fighter2/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './imagesfighters/fighter1/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './imagesfighters/fighter1/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './imagesfighters/fighter1/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './imagesfighters/fighter1/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './imagesfighters/fighter1/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './imagesfighters/fighter1/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './imagesfighters/fighter1/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './imagesfighters/fighter1/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }
  
  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
  }
  
  let timer = 60
  let timerId
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000)
      timer--
      document.querySelector('#timer').innerHTML = timer
    }
  
    if (timer === 0) {
      
      determineWinner({ player, enemy, timerId })
      setTimeout(()=>{
        window.location.reload()
      },7000)
     
    }
  }
console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp:{
    pressed:false
  },
  w: {
    pressed:false
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0
  

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    if(player.position.x+player.width>50)
    player.velocity.x = -5

    player.switchSprite('run')
  }
   else if (keys.d.pressed && player.lastKey === 'd'  ) {
    if(player.position.x + player.width <canvas.width-30 )
 player.velocity.x = 5
  
 player.switchSprite('run')
}
  
  else if (keys.w.pressed && player.lastKey ==='w' && player.position.y + player.height + player.velocity.y >= canvas.height-96)
  {
      player.velocity.y=-18;
  }
  else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    if(enemy.position.x+enemy.width>50)
    enemy.velocity.x = -5

    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    if(enemy.position.x + enemy.width < canvas.width-30 )
    enemy.velocity.x = 5

    enemy.switchSprite('run')
  } 
  else if(keys.ArrowUp.pressed && enemy.lastKey==='ArrowUp' && enemy.position.y + enemy.height + enemy.velocity.y >= canvas.height-96){
    enemy.velocity.y=-18;
  }
  else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
    setTimeout(()=>{
      window.location.reload()
    },7000)
   
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        keys.w.pressed=true;
        player.lastKey=  'w'
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        keys.ArrowUp.pressed=true
        enemy.lastKey= 'ArrowUp'
        break
      case 'ArrowDown':
        enemy.attack();
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break;
    case 'a':
      keys.a.pressed = false
      break;
    case 'w':
      keys.w.pressed=  false
      break;
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed= false  
    break;
  }
})


