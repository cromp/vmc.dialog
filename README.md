# VMCDialog 弹层插件
VMCDialog 是一款 JQuery 弹层插件，兼容包括IE6在内的所有主流浏览器，帮助你提升用户操作体验。

### 选项

// 主题皮肤
theme: 'default',
// 创建时默认是否隐藏
show: true,
// 是否全屏
full: false,
// 禁用滚动条
fix: false,
// 窗口类型，text|html|dom|frame
type: 'text',
// type非FRAME时窗口显示内容,type为FRAME时窗口调用网址
body: '',
// 标题文字 false|显示文字
title: '新建窗口',
// 标题是否有关闭按钮
titleClose: true,
// 拖拽标题栏移动窗口位置
draggable: true,
// 拖拽范围限制
range: true,
// 是否使用按钮 false|[{text:(string),click:(function)},{text:(string),click:(function)}]
button: false,
// 延迟关闭(秒) 0不关闭
time: 0,
// 窗口尺寸 [宽度auto|(number), 高度auto|(number)]
size: ['auto', 'auto'],
// 内容最小尺寸，size为auto时有效 [宽度(number), 高度(number)]
minSize: [180, 30],
// 窗口位置[X轴auto|(number), Y轴auto|(number), 参考位置[1-4]] 
pos: ['auto', 'auto', 1],
// 层叠顺序
zIndex: 99999,
// 对话框背景颜色
backgroundColor: '#FFF',
// 对话框边框宽度
borderWidth: 1,
// 对话框边框颜色
borderColor: '#444',
// 是否显示阴影
shade: true,
// 阴影宽度
shadeBorder: 4,
// 阴影颜色
shadeColor: '#000',
// 阴影透明度
shadeOpacity: 0.3,
// 是否为模态行为，模态行为时有遮罩层
modal: true,
// 遮罩层颜色
overlayColor: '#000',
// 遮罩层透明度
overlayOpacity: 0.3,
// 是否点击遮罩层关闭窗口
overlayClose: true,
// 彻底关闭
closeTrue: false,
// 窗口创建完成回调函数
create: function(vui) {},
// 销毁窗口回调函数
destroy: function(vui) {},
// 关闭前回调函数，如果返回false，则取消关闭
beforeClose: function(vui) {},
// 关闭窗口后回调函数
close: function(vui) {},
// 打开窗口前回调函数
beforeOpen: function(vui) {},
// 打开窗口后回调函数
open: function(vui) {}