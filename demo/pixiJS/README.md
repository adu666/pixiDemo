# pixiJS h5 demo 一镜到底示例

--------------------------------------
#### 前言
网易四字魔咒：http://news.163.com/special/fdh5_tolerance/（手机扫描以下二维码查看）
偶然机会看到网易的四字魔咒，觉得so cool！一开始以为只是简单的CSS3动画，后来一研究，确实不简单。CSS3动画有一定的局限性，实现不了这么流畅的一镜到底的效果。那就入坑吧，来研究一波如何实现一镜到底。
![](https://imgconvert.csdnimg.cn/aHR0cDovL3d3dy5jaHVubGluZy5vbmxpbmUvdXBsb2FkLzE1NjYzNTU0NzE1NzMuanBlZw?x-oss-process=image/format,png)

--------------------------------------
#### 一、项目介绍
一个由“[PixiJS](https://www.pixijs.com/ "PixiJS")+[TweenMax](https://www.tweenmax.com.cn/api/tweenmax/ "TweenMax")+[TimelineMax](https://www.tweenmax.com.cn/api/timelinemax/ "TimelineMax")+[AlloyTouch](https://github.com/AlloyTeam/AlloyTouch "AlloyTouch")”组合拳实现的一镜到底demo，主要为了解析一镜到底的基本套路，适合初级入坑者。项目采用gulp-liverload和liverload chrome实现热更新。
项目启动：
1. `npm install` 安装依赖包
2. `node app.js` 或 `npm start` 运行项目于localhost:8080
3. `gulp watch` 开启热更新,开启liverload chrome 插件
4. `gulp dist` 打包代码

更多内容转战以下博客地址：
https://blog.csdn.net/qq_30604453/article/details/86544553 
OR
http://www.chunling.online/#/article/5d4cdf740c9a1118e22eb674

本项目只是简单的demo，具体的案例实现可以看：https://gitee.com/wuchunling/life-amp-activity

--------------------------------------
#### 二、项目结构
```
├── public // 公共资源文件
    ├── css  // 样式
	├── imgs // 图片
	├── js
	    ├── Alloytouch.js
		├── animation.js   // 动画处理
		├── index.js
		├── Pixi.min.js
		├── resources.js   // 资源处理
		├── scene.js   // 场景处理
		├── sprites.js  // 精灵处理
		├── TimelineMax.min.js
		├── TweenMax.min.js
├── views  // 视图
    ├── index.html
├── app.js  // 项目启动的入口文件
├── gulpfile.js  // gulp的配置文件
```

-------------------
#### 三、一镜到底的套路解析
##### 组合拳分别是什么？
* PixiJS: 绘图，其中包括舞台、场景、普通精灵、动画精灵、平铺精灵、定时器等。
* TweenMax：制作过渡动画
* TimelineMax：管理整个舞台的动画播放进度
* AlloyTouch：实现滑动效果，监听用户滑动
“PixiJS+TweenMax+TimelineMax+AlloyTouch”组合拳就能实现一镜到底的套路，每个库发挥它自己应有的作用，相互配合。

##### 项目整体代码的实现逻辑
1. 创建PIXI应用，预加载图片资源，资源加载完成后将PIXI应用插入真实DOM中，进行下一步
2. 初始化场景：定义每个场景的宽高、位置等属性数据，通过new PIXI.Container()函数创建每个场景，将他们加入PIXI舞台中
3. 初始化精灵：定义每个精灵的位置等属性数据，将其加到对应的场景中
4. 进行到第三步，所有的精灵都绘制出来了，但是此时屏幕还不可以拖动，这里需要用到一个滑动的库，我用的是AlloyTouch，网易四字魔咒用的是ScrollerJS。通过AlloyTouch可以检测用户滑动的距离，在对应的滑动的change回调函数里可以改变舞台的位置app.stage.position.x来实现舞台的拖动效果。这样用户就可以通过滑动查看了。
5. 进行到第四步，一切的效果都是静态的，我们的元素还没有动起来。要实现随着用户的滑动播放对应的动画效果，这里需要用到一个库TimelineMax。这是管理动画播放进度条的库。直接new 一个主时间轴timeline。
6. 给精灵加上动画，这里用到一个库TweenMax，可以用来创建补间动画。我们只需定义精灵的起始状态，最终状态，它能轻松帮助我们进行状态的过渡。用TweenMax创建完动画，将动画加到时间轴timeline对应的位置。delay:0.1表示在动画长度的百分十处开始播放。
7. 在第三步的时候，用户滑动的回调函数加上 timeline.seek(progress)就可以实现滑动到某个位置播放对应的动画。

##### 最终demo效果如下
![](https://img-blog.csdnimg.cn/2019090801394392.gif)
![](https://img-blog.csdnimg.cn/20190908013958794.gif)

----------------
#### 四、PixiJS

##### pixi常见概念介绍
1）舞台/Stage：舞台只有一个，app.stage就是我们的舞台。所有要被显示的东西最终都是放到舞台里去的。

2）精灵/Sprite：精灵就是舞台里的每一个元素，例如一只鸟、一张背景图、一段文本等。可以通过操作精灵的某些属性达到我们想要的动画效果。同时，精灵也分很多种类，普通精灵Sprite、平铺精灵TilingSprite，动画精灵AnimatedSprite。平铺精灵一般用于小图片需要平铺成背景，动画精灵一般用于制作帧动画。

3）容器/Container：容器，可以用来放置精灵，舞台的本质也是一个容器，所以容器有的属性舞台也有，舞台继承自容器。当我们舞台里的精灵元素太多太杂，可以通过设置多个容器，把精灵放到对应的容器里，再把容器放到舞台里，这样就方便管理了。这也就是一镜到底会用到的多场景切换。每个场景其实就是一个容器，每个场景有自己的精灵。舞台只有一个（舞台继承自容器），但容器可以有多个。

4）加载器/Loader：因为要用到大量的图片，图片的加载比较费时间，所以需要进行一次性的预加载，这也就是在网易四字魔咒开头看到的进度条的由来，利用Loader可以预加载图片，同时跟踪进度。

##### 创建pixi应用
项目的一开始，需要创建一个pixi应用，直接通过一个语句 new PIXI.Application()，这样我们的PIXI应用就创建完成了。
```
    const app = new PIXI.Application({
      width:1334,
      height:750
    });
```
一般把舞台的宽高设置成跟设备屏幕宽高等同。注意舞台的背景色是0x写法。例如十六进制色值#000555；在这里写成 0x000555
```
	// 创建PIXI应用
	const w = document.body.clientWidth,
	  h = document.body.clientHeight;
	let app = new PIXI.Application({
	  width: w,
	  height: h
	});
```

##### 预加载资源
loader.add可以链式调用，将全部的资源进行预加载。
progress回调函数帮助我们监听加载的进度；complete回调函数表示资源全部加载完成，这时候就可以把PIXI应用插入到真实DOM中了。
定义好加载器的所有东西，loader.load()就开始加载资源了。加载好的资源可以通过loader.resources调用。
```
// 创建资源加载器，进行资源预加载
const loader = new PIXI.loaders.Loader();
loader.add('bg1', './imgs/bg1.png')
  .add('tv', './imgs/tv.png')
  .add('curtain', './imgs/curtain.png')
  .add('tree', './imgs/tree.png')
  .add('bg2', './imgs/bg2.jpg')
  .add('mother', './imgs/mother.png')
  .add('mother_body', './imgs/mother_body.png')
  .add('mother_left', './imgs/mother_left.png')
  .add('mother_right', './imgs/mother_right.png')
  .add('boy', './imgs/boy.png')
  .add('child', './imgs/child.png')
  .add('desk', './imgs/desk.png')
loader.on("progress", function (target, resource) {  // 加载进度
  document.getElementById('percent').innerText = parseInt(target.progress) + "%";
});
loader.once('complete', function (target, resource) {  // 加载完成
  document.getElementById('loading').style.display = 'none';
  document.body.appendChild(app.view);
  initScenes(); // 初始化场景
  initSprites();  // 初始化精灵
  initAnimation(); // 初始化动画
  app.stage.scale.set(scale, scale);  // 根据屏幕实际宽高放大舞台
  if (w < h) {   // 根据横屏竖屏效果旋转舞台
    app.stage.rotation = 1.57;
    app.stage.pivot.set(0.5);
    app.stage.x = w;
    initTouch(true, 'y');
  } else {
    initTouch(false, 'x');
  }
});
loader.load();  // 加载资源
```

##### 初始化场景
根据设计图，得出每个场景的长宽与位置。新建场景容器，等建完场景，才可以进行下一步的操作，将精灵放进场景里。
建场景的操作比较简单，定义每个场景的数据，新建Container对象并加入舞台中。这里的实现主要有三个东西：
1)场景数据 scenesOptions：定义每个场景的数据
2)对象集合 scenes：PIXI.Container对象，在初始化精灵的时候需要用到，所以需要将每个场景对象进行存储
3)循环函数 initScenes：初始化场景并加入舞台里
```
const scenesOptions = [ // 场景数据：定义每个场景的宽高,x/y距离
  {
    name: "scene1",
    x: 0, y: 0,
    width: 3247, height: 750
  },
  {
    name: "scene2",
    x: 1620, y: 0,
    width: 3351, height: 750
  }
];
const scenes = {};  // 场景集合 - pixi对象

function initScenes() { // 初始化场景
  for (let i = scenesOptions.length - 1; i >= 0; i--) {
    scenes[scenesOptions[i].name] = new PIXI.Container({
      width: scenesOptions[i].width,
      height: scenesOptions[i].height
    });
    scenes[scenesOptions[i].name].x = scenesOptions[i].x;
    app.stage.addChild(scenes[scenesOptions[i].name]);
  }
}

```

##### 初始化精灵
这一步的操作与上一步操作一致：数据集，对象集，循环函数。
只是在这里我把精灵的初始化拆分成两个函数，一个是循环精灵数组，一个是循环每一个精灵的属性。再加了一个特殊属性的函数。根据需要，可以对某些精灵进行特殊的操作，都统一放在initSpecialProp函数里。
```
const spritesOptions = [ // 精灵数据：定义每个精灵的坐标
  { // 第一个场景的精灵
    tv: { // 电视
      position: { x: 800, y: 0 }
    },
    curtain: { // 窗帘
      position: { x: 1220, y: 36 }
    },
    child: {  // 儿童
      position: { x: 1090, y: 400 }
    },
	// ......
  },
  { // 第二个场景的精灵
    bg2: {
      position: { x: 0, y: 0 }
    },
    desk: {
      position: { x: 0, y: 592 }
    },
	// ......
    }
  }
];
const sprites = {}; // 精灵集合 - pixi对象

function initSprites() {  // new出所有精灵对象，并交给函数initSprite分别赋值
  for (let i = 0; i < spritesOptions.length; i++) {
    let obj = spritesOptions[i];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        sprites[key] = PIXI.Sprite.fromImage(key);
        initSprite(sprites[key], obj[key], i + 1);
      }
    }
  }
  initSpecialProp();
}
function initSprite(sprite, prop, i) {  // 初始化单个精灵的属性并加入对应的场景中
  for (let key in prop) {
    if (prop.hasOwnProperty(key)) {
      sprite[key] = prop[key];
    }
  }
  scenes['scene' + i].addChild(sprite);
}
function initSpecialProp() {  // 特殊属性
  sprites.mother_left.pivot.set(0, 51);
  sprites.mother_right.pivot.set(95, 50)
}

```

-------------------
#### 五、AlloyTouch
进行到上面那一步，舞台场景精灵一应俱全，可以看到绘制出来的效果，但是此时页面还不可以拖动，还需要一个滑动的库来配合。
new AlloyTouch({ ... })：
1) touch定义触摸的DOM对象，在这里我们就直接是body了；
2) vertical定义触摸的方向（横向滑动，还是竖向滑动。这里涉及设备是横屏还是竖屏，所以通过值vertical传进来。横屏则为false，竖屏则为true）；
3) 可滚动的最大距离max跟最小距离min。因为我们都是往左滑，往上滑，所以为负距离，所以最大值max为0。最小值为舞台的整体宽度再减去一整屏的宽度，然后再取负值；
4) 关键点在于change函数，他可以返回实时滚动的距离。通过计算可以得到当前滚动的距离占全部距离的百分比，这个百分比就是我们当前的进度。拿到这个百分比。（默认总进度为1）就可以通过timeline.seek函数就可以随时改变播放的进度。这就是为什么往回滑动动画会往回撤的原因。想一下我们平时看视频，我们滚动进度条的行为就是用户滑动页面的行为，所以这就是实现的关键点。

----------------
#### 六、TimelineMax
TimelineMax是GSAP动画库中的动画组织、排序、管理工具，可创建时间轴（timeline）作为动画或其他时间轴的容器，这使得整个动画控制和精确管理时间变得简单。与AlloyTouch合在一起使用。
```
let timeline = new TimelineMax({
  paused: true
});
let alloyTouch;
let max = (w > h) ? w : h;
function initTouch(vertical, val) {
  let scrollDis = app.stage.width - max
  alloyTouch = new AlloyTouch({
    touch: "body", // 反馈触摸的dom
    vertical: vertical, // 不必需，默认是true代表监听竖直方向touch
    min: -scrollDis, // 不必需,运动属性的最小值
    maxSpeed: 1,
    max: 0, // 不必需,滚动属性的最大值
    bindSelf: false,
    initialValue: 0,
    change: function (value) {
      app.stage.position[val] = value;
      let progress = -value / scrollDis;
      progress = progress < 0 ? 0 : progress;
      progress = progress > 1 ? 1 : progress;
      timeline.seek(progress);
    }
  })
}

```

--------------
#### 七、重头戏——动画实现
时间轴准备好了。就可以定义动画，将动画加到时间轴上了，表示在时间轴的哪个位置开始播放动画。动画这里用到的是TweenMax库，当然，也可以用别的库，只要能实现补间动画即可。TweenMax常用的三个函数如下：

①TweenMax.to(target,duration,statusObj) ——目标target从当前状态到statusObj状态过渡
②TweenMax.from(target,duration,statusObj) ——目标target从statusObj状态到当前状态过渡
③TweenMax.fromTo(target,duration,statusObjFrom,statusObjTo)——目标target从statusObjFrom状态到statusObjTo状态过渡

duration表示过渡时长。如果duration=0.1则表示过渡时长占滚动总长的10%，即占时间轴的10%。
delay跟duration的计算规则：
1) delay = 开始播放动画时的滚动距离 / 可滚动总长度
   delay是动画开始的时间
2) duration = (结束播放动画时的滚动距离 - 开始播放动画时的滚动距离) / 可滚动总长度
   duration是动画持续的时间
```
const animationsOptions = {  // 精灵动画集合
  mother: [{
    delay: 0,
    duration: 0.2,
    to: { x: 1120, ease: Power0.easeNone }
  }],
  bg1: [
    {
      prop: 'scale',
      delay: 0.36,
      duration: 0.28,
      to: { x: 3, y: 3, ease: Power0.easeNone }
    },
    {
      delay: 0.40,
      duration: 0.08,
      to: { alpha: 0, ease: Power0.easeNone }
    },
  ],
  mother_left: [
    {
      delay: 0.28,
      duration: 0.25,
      to: { rotation: -1, ease: Power0.easeNone }
    }
  ],
  mother_right: [
    {
      delay: 0.28,
      duration: 0.2,
      to: { rotation: 1, ease: Power0.easeNone }
    }
  ]
}
function initAnimation() {
  // delay = 0.1 表示滚动到10%开始播放动画
  // duration = 0.1 表示运动时间占滚动的百分比
  for (let key in animationsOptions) {
    if (animationsOptions.hasOwnProperty(key)) {
      let obj = animationsOptions[key];
      for (let i = 0; i < obj.length; i++) {
        let act;
        let target;
        if (obj[i].prop) {
          target = sprites[key][obj[i].prop];
        } else {
          target = sprites[key];
        }
        if (obj[i].from & obj[i].to) {
          act = TweenMax.fromTo(target, obj[i].duration, obj[i].from, obj[i].to);
        } else if (obj[i].from) {
          act = TweenMax.from(target, obj[i].duration, obj[i].from);
        } else if (obj[i].to) {
          act = TweenMax.to(target, obj[i].duration, obj[i].to);
        }
        let tm = new TimelineMax({ delay: obj[i].delay });
        tm.add(act, 0);
        tm.play();
        timeline.add(tm, 0);
      }
    }
  }
}

```
在这里注意一下 ease:Power0.easeNone 是缓动函数，戳链接：https://www.tweenmax.com.cn/api/tweenmax/ease
我一开始没有写缓动函数，动画出现严重的卡帧效果，真丑陋！我还以为是设备问题，是pixi问题。最后发现了这个缓动函数。给动画加上线性缓动，完美解决了卡帧的丑陋效果。
tip！！！！！（有热心网友问到我上面的prop是干什么用的）

注意一下，TweenMax.from(target,duration,statusObj)等方法只识别target的属性。举个例子，精灵sprite的width从0变到100
`TweenMax.to(sprite, 0.1, { width: 100})    // 即 sprite.width变为100`
那么问题来了，要改变属性的属性呢？例如sprite.scale.x变为2，则target应该变为sprite.scale
`TweenMax.to(sprite.scale, 0.1, { x: 2})    // 即 sprite.scale.x变为100`

为了兼容这两种情况，就需要加入prop。我可真是个小机灵鬼。

拿上面的animationsOptions.window举个例子。可以观察到animationsOptions.window其实是一个数组，数组里面的一个个对象代表一个个动画，所以组成精灵window的动画集合。我们需要对精灵window做很多动画的话，例如用时位移+缩放+变透明等等，如果是delay跟duration相同并且是window的一级属性（即window.prop），可以放在一个对象里，如果delay或者duration不同，就需要设置成不同的对象。为了兼容二级属性，即window.prop.prop，我特意加了一个参数prop，达到兼容二级属性的效果。

在下面初始化动画的函数initAnimation里，才有这一步，先判断是否是二级属性。
```
	if (obj[i].prop) {
		target = sprites[key][obj[i].prop];
	} else {
		target = sprites[key];
	}
```

----------- The End. 更多内容转战以下博客地址：
https://blog.csdn.net/qq_30604453/article/details/86544553 
OR
http://www.chunling.online/#/article/5d4cdf740c9a1118e22eb674

本项目只是简单的demo，更具体的案例实现可以看：https://gitee.com/wuchunling/life-amp-activity
