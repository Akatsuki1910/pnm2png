import * as PIXI from 'pixi.js'

const stage = new PIXI.Container()
const renderer = PIXI.autoDetectRenderer({
  width: 0,
  height: 0,
  resolution: 1,
  antialias: true,
  backgroundColor: 0xffffff,
  preserveDrawingBuffer: true,
})

;(document.getElementById('canvas') as HTMLDivElement).appendChild(
  renderer.view,
)

function createRect(x: number, y: number, color: number) {
  const square = new PIXI.Graphics()

  square.beginFill(color)
  square.drawRect(x, y, 1, 1)
  square.endFill()

  return square
}

let p, w, h, c
function pnm(arr: string[]) {
  p = arr[0]
  ;[w, h] = arr[1].split(' ').map(Number)
  renderer.resize(w * 2, h * 2)
  arr.splice(0, 2)

  if (p !== 'P1') {
    c = Number(arr[0])
    arr.splice(0, 1)
  }

  const dArr = arr.map((a: string) => a.trim().split(/\s+/).map(Number)).flat()

  switch (p) {
    case 'P1':
      pbm(dArr)
      break
    case 'P2':
      pgm(dArr)
      break
    case 'P3':
      ppm(dArr)
      break
    default:
      console.log('not supported')
  }
}

function pbm(dArr: number[]) {
  for (let i = 0; i < h; i++) {
    for (let l = 0; l < w; l++) {
      const color = dArr[i * w + l]
      stage.addChild(
        createRect(l, i, PIXI.utils.rgb2hex([color, color, color])),
      )
    }
  }
  renderer.render(stage)
}

function pgm(dArr: number[]) {
  for (let i = 0; i < h; i++) {
    for (let l = 0; l < w; l++) {
      const color = dArr[i * w + l] / c
      stage.addChild(
        createRect(l, i, PIXI.utils.rgb2hex([color, color, color])),
      )
    }
  }
  renderer.render(stage)
}

function ppm(dArr: number[]) {
  for (let i = 0; i < h; i++) {
    for (let l = 0; l < w; l++) {
      const r = dArr[i * w * 3 + l * 3] / c
      const g = dArr[i * w * 3 + l * 3 + 1] / c
      const b = dArr[i * w * 3 + l * 3 + 2] / c

      stage.addChild(createRect(l, i, PIXI.utils.rgb2hex([r, g, b])))
    }
  }
  renderer.render(stage)
}

;(document.getElementById('file') as HTMLInputElement).addEventListener(
  'change',
  (evt: Event) => {
    const file = (evt.target as HTMLInputElement).files[0]
    const fileReader = new FileReader()
    fileReader.onload = () => {
      stage.removeChildren()
      pnm((fileReader.result as string).split('\n'))

      const imgUrl = renderer.view.toDataURL('image/png')

      const img = document.getElementById('img') as HTMLImageElement
      const a = document.getElementById('a') as HTMLAnchorElement
      img.src = imgUrl
      a.href = imgUrl

      console.log('complite')
    }
    fileReader.readAsText(file)
  },
)

// function animation() {
//   renderer.render(stage)

//   requestAnimationFrame(animation)
// }

// animation()
