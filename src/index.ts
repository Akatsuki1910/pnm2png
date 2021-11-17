import * as PIXI from 'pixi.js'

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: 1,
  antialias: true,
})

;(document.getElementById('canvas') as HTMLDivElement).appendChild(
  renderer.view,
)

function animation() {
  renderer.render(stage)

  requestAnimationFrame(this.animation)
}

animation()
