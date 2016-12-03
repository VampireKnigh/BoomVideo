# BoomVideo
###use-description
A video can burst into many min-square when you click it

###realize-description

1. 首先，使用一个id为"videoCopy"的canvas复制整个video,至于为什么要复制，因为直接从视频中直接使用drawImage而不先复制一个canvas的话会使页面点击特别卡顿（至于原理，猜测是因为从DrawInamge函数从视频中获取性能劣于从图片和canvas）然后还会出现图片锯齿现象，然后使copy的canvas设置"display:none;"去呈现整个的showcanvas

2. 对于canvas的save()和restore()方法
  save方法是把当前的状态保存下来（方法把当前状态的一份拷贝压入到一个保存canvas状态的栈中。），接下来可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。
  restore 返回之前保存过的路径状态和属性（方法从栈中弹出存储的图形状态并恢复 CanvasRenderingContext2D 对象的属性、剪切路径和变换矩阵的值。），这样画的属性不会因为save之后执行的平移或者旋转影响下一帧的绘画。
  save和restore要配对使用（restore可以比save少，但不能多），如果restore调用次数比save多，会引发Error。
  
 3.设置300个Tile小方块和位置参数
 
 4.dropBomb方法为点击事件的触发，explode方法修改Tile的各项参数，从而改变方块的轨迹
 
 5.force参数为鼠标点击周围每个图片获得的力量值，从而决定每个Tile飞得多远，并在每一帧刷新减弱force，直到force值小于0.0001才让图片飞回来，在force值偏小的时候，还显示在原地暂停的假象，其实是图片在原地以几毫米缓慢移动。
 
 
